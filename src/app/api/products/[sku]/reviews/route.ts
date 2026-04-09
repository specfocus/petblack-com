import { NextRequest, NextResponse } from 'next/server';
import { faker } from '@faker-js/faker';
import type { ProductRatingBreakdown, ProductReview, ProductReviewsResponse } from '@/types/product-reviews';

const hashStringToSeed = (value: string): number => {
    let hash = 0;
    for (let i = 0;i < value.length;i++) {
        hash = (hash << 5) - hash + value.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash) + 1;
};

const normalizeToHalfStep = (value: number): number => {
    const normalized = Math.round(value * 2) / 2;
    return Math.max(1, Math.min(5, normalized));
};

const buildRatingBreakdown = (totalRatings: number, averageRating: number): ProductRatingBreakdown => {
    const avg = Math.max(1, Math.min(5, averageRating));

    const fiveWeight = Math.max(0.12, Math.min(0.88, 0.12 + (avg - 1) * 0.16));
    const fourWeight = Math.max(0.06, Math.min(0.46, 0.16 + (avg - 2) * 0.08));
    const threeWeight = Math.max(0.04, 0.13 - Math.abs(avg - 3) * 0.03);
    const twoWeight = Math.max(0.02, 0.11 - (avg - 1) * 0.025);
    const oneWeight = Math.max(0.01, 0.16 - (avg - 1) * 0.035);

    const weights = [fiveWeight, fourWeight, threeWeight, twoWeight, oneWeight];
    const weightSum = weights.reduce((acc, value) => acc + value, 0);

    const base = weights.map(weight => Math.floor((weight / weightSum) * totalRatings));
    let assigned = base.reduce((acc, value) => acc + value, 0);

    while (assigned < totalRatings) {
        const index = faker.number.int({ min: 0, max: 4 });
        base[index] += 1;
        assigned += 1;
    }

    return {
        5: base[0],
        4: base[1],
        3: base[2],
        2: base[3],
        1: base[4],
    };
};

const buildReviewText = (productName: string): { title: string; body: string; } => {
    const title = faker.helpers.arrayElement([
        'Exactly what I needed',
        'Great quality for the price',
        'My pet loves this',
        'Solid product overall',
        'Will buy again',
        'Very happy with this purchase',
    ]);

    const sentences = [
        `${productName} arrived in good condition and matched the description.`,
        faker.commerce.productDescription(),
        faker.helpers.arrayElement([
            'The quality feels better than expected.',
            'Shipping was fast and packaging was secure.',
            'I noticed results within a few days of use.',
            'The size and materials were exactly right for us.',
            'I would recommend this to other pet parents.',
        ]),
    ];

    return {
        title,
        body: sentences.join(' '),
    };
};

const buildReviews = (count: number, averageRating: number, productName: string): ProductReview[] => {
    return Array.from({ length: count }, (_, index) => {
        const jitter = faker.number.float({ min: -1.1, max: 1.1, multipleOf: 0.5 });
        const rating = normalizeToHalfStep(averageRating + jitter);
        const date = faker.date.between({ from: '2023-01-01T00:00:00.000Z', to: new Date() });
        const text = buildReviewText(productName);

        return {
            id: `${productName}-${index + 1}`,
            author: faker.person.firstName(),
            title: text.title,
            body: text.body,
            rating,
            verifiedPurchase: faker.datatype.boolean(0.84),
            helpfulCount: faker.number.int({ min: 0, max: 380 }),
            reviewDate: date.toISOString(),
            country: 'United States',
        };
    }).sort((a, b) => Number(new Date(b.reviewDate)) - Number(new Date(a.reviewDate)));
};

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ sku: string; }>; }
): Promise<NextResponse<ProductReviewsResponse>> {
    const { sku: rawSku } = await context.params;
    const sku = decodeURIComponent(rawSku);
    const search = request.nextUrl.searchParams;

    const productName = search.get('name')?.slice(0, 120) || sku;
    const requestedAverage = Number(search.get('rating'));
    const baseAverage = Number.isFinite(requestedAverage)
        ? requestedAverage
        : faker.number.float({ min: 3.6, max: 4.9, multipleOf: 0.1 });

    faker.seed(hashStringToSeed(sku));

    const averageRating = normalizeToHalfStep(baseAverage + faker.number.float({ min: -0.2, max: 0.2, multipleOf: 0.1 }));
    const totalRatings = faker.number.int({ min: 24, max: 14876 });
    const ratingBreakdown = buildRatingBreakdown(totalRatings, averageRating);

    const highlights = faker.helpers.arrayElements([
        'quality',
        'value',
        'easy to use',
        'pet approved',
        'durability',
        'packaging',
        'ingredients',
        'fit',
        'size',
    ], { min: 2, max: 4 });

    const reviews = buildReviews(8, averageRating, productName);

    return NextResponse.json({
        sku,
        productName,
        averageRating,
        totalRatings,
        highlights,
        ratingBreakdown,
        reviews,
    }, {
        headers: {
            'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600',
            'Content-Type': 'application/json; charset=utf-8',
        },
    });
}
