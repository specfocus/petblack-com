import { NextRequest, NextResponse } from 'next/server';
import { faker } from '@faker-js/faker';
import type { LedgerEntry, LedgerSource } from '@/domain/ledger-types';

// ── catalogue pool (mirrors products.ts — kept server-side so no client bundle cost) ──

interface ProductStub {
    sku: string;
    name: string;
    price: number;
    keywords: string[];
}

const PRODUCT_POOL: ProductStub[] = [
    { sku: 'RC-MAXI-AD-15', name: 'Royal Canin Maxi Adult Dry Dog Food', price: 64.99, keywords: ['dog', 'food'] },
    { sku: 'HS-KIT-DRY-7', name: "Hill's Science Diet Kitten Dry Cat Food", price: 32.99, keywords: ['cat', 'food'] },
    { sku: 'KONG-CL-LG', name: 'KONG Classic Dog Toy – Large', price: 14.99, keywords: ['dog', 'toy'] },
    { sku: 'TET-CF-200', name: 'Tetra ColorFusion Tropical Flakes', price: 8.49, keywords: ['fish', 'food'] },
    { sku: 'FH-OBM-GRY', name: 'Furhaven Orthopedic Dog Bed – Medium', price: 39.99, keywords: ['dog', 'bed'] },
    { sku: 'CAT-FF3L-WHT', name: 'Catit Flower Fountain – 3 L', price: 29.99, keywords: ['cat', 'accessory'] },
    { sku: 'OXB-RBT-5LB', name: 'Oxbow Essential Rabbit Pellets – 5 lb', price: 18.99, keywords: ['rabbit', 'food'] },
    { sku: 'FLU-SPECV-5G', name: 'Fluval Spec V Aquarium Kit – 5 Gallon', price: 119.99, keywords: ['fish', 'accessory'] },
    { sku: 'RW-FRH-BLU-M', name: 'Ruffwear Front Range Dog Harness', price: 49.95, keywords: ['dog', 'accessory'] },
    { sku: 'WC-SP32-NAT', name: "Whisker City Sisal Scratching Post – 32\"", price: 24.99, keywords: ['cat', 'toy'] },
    { sku: 'VS-COMP-60CT', name: 'Vetri-Science Composure Pro Dog Chews', price: 27.49, keywords: ['dog', 'health'] },
    { sku: 'ZM-BS100W', name: 'Zoo Med Repti Basking Spot Lamp 100W', price: 11.99, keywords: ['reptile', 'accessory'] },
];

// ── category inference (mirrors ledger-atom.ts inferCategory) ─────────────────

const inferCategory = (keywords: string[], name: string): string => {
    const text = `${keywords.join(' ')} ${name}`.toLowerCase();
    if (/food|kibble|wet|dry|treat|chew|snack|flakes|pellet/.test(text)) return 'Food & Treats';
    if (/toy|ball|rope|tug|puzzle|scratch/.test(text)) return 'Toys';
    if (/med|vitamin|supplement|calming|health|composure/.test(text)) return 'Health & Wellness';
    if (/harness|collar|lead|leash|fountain|lamp|aquarium|kit/.test(text)) return 'Accessories';
    if (/bed|crate|mat|blanket|orthopedic/.test(text)) return 'Beds & Housing';
    if (/litter|sand|tray|pad/.test(text)) return 'Litter & Hygiene';
    return 'Other';
};

// ── pet name pool ─────────────────────────────────────────────────────────────

const PET_NAMES = ['Buddy', 'Luna', 'Max', 'Bella', 'Charlie', 'Daisy', 'Milo', 'General'];

// ── helpers ───────────────────────────────────────────────────────────────────

const hashSeed = (value: string): number => {
    let h = 0;
    for (let i = 0;i < value.length;i++) {
        h = (h << 5) - h + value.charCodeAt(i);
        h |= 0;
    }
    return Math.abs(h) + 1;
};

// ── summary type ──────────────────────────────────────────────────────────────

interface LedgerSummaryBucket {
    label: string;
    total: number;
    count: number;
}

interface LedgerSummary {
    grandTotal: number;
    transactionCount: number;
    byCategory: LedgerSummaryBucket[];
    byPet: LedgerSummaryBucket[];
    bySource: LedgerSummaryBucket[];
    byMonth: { month: string; cart: number; auto: number; total: number; }[];
}

interface LedgerResponse {
    entries: LedgerEntry[];
    summary: LedgerSummary;
}

// ── summary builder ───────────────────────────────────────────────────────────

const buildSummary = (entries: LedgerEntry[]): LedgerSummary => {
    const sumMap = <K extends string>(
        key: (e: LedgerEntry) => K
    ): LedgerSummaryBucket[] => {
        const m = new Map<string, { total: number; count: number; }>();
        for (const e of entries) {
            const k = key(e);
            const cur = m.get(k) ?? { total: 0, count: 0 };
            cur.total += e.qty * e.unitPrice;
            cur.count += 1;
            m.set(k, cur);
        }
        return Array.from(m.entries())
            .map(([label, v]) => ({ label, total: Math.round(v.total * 100) / 100, count: v.count }))
            .sort((a, b) => b.total - a.total);
    };

    const monthMap = new Map<string, { cart: number; auto: number; }>();
    for (const e of entries) {
        const d = new Date(e.date);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const cur = monthMap.get(key) ?? { cart: 0, auto: 0 };
        const total = e.qty * e.unitPrice;
        if (e.source === 'cart') cur.cart += total;
        else cur.auto += total;
        monthMap.set(key, cur);
    }

    const byMonth = Array.from(monthMap.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, v]) => ({
            month,
            cart: Math.round(v.cart * 100) / 100,
            auto: Math.round(v.auto * 100) / 100,
            total: Math.round((v.cart + v.auto) * 100) / 100,
        }));

    const grandTotal = entries.reduce((s, e) => s + e.qty * e.unitPrice, 0);

    return {
        grandTotal: Math.round(grandTotal * 100) / 100,
        transactionCount: entries.length,
        byCategory: sumMap(e => e.category),
        byPet: sumMap(e => e.petName),
        bySource: sumMap(e => e.source),
        byMonth,
    };
};

// ── entry generator ───────────────────────────────────────────────────────────

const generateEntries = (count: number, months: number): LedgerEntry[] => {
    const entries: LedgerEntry[] = [];
    const now = new Date();

    for (let i = 0;i < count;i++) {
        const product = faker.helpers.arrayElement(PRODUCT_POOL);
        const source = faker.helpers.arrayElement<LedgerSource>(['cart', 'auto']);
        const petName = faker.helpers.arrayElement(PET_NAMES);
        const category = inferCategory(product.keywords, product.name);

        // Scatter dates uniformly across the requested months window
        const date = faker.date.between({
            from: new Date(now.getFullYear(), now.getMonth() - months + 1, 1),
            to: now,
        });

        // Small unit-price jitter ±10%
        const priceJitter = faker.number.float({ min: 0.9, max: 1.1, multipleOf: 0.01 });
        const unitPrice = Math.round(product.price * priceJitter * 100) / 100;
        const qty = faker.number.int({ min: 1, max: 3 });

        entries.push({
            id: faker.string.uuid(),
            date: date.toISOString(),
            sku: product.sku,
            name: product.name,
            category,
            petName,
            qty,
            unitPrice,
            source,
        });
    }

    // Most-recent first
    return entries.sort((a, b) => b.date.localeCompare(a.date));
};

// ── route handler ─────────────────────────────────────────────────────────────

export async function GET(request: NextRequest): Promise<NextResponse<LedgerResponse>> {
    const search = request.nextUrl.searchParams;

    // Optional query params with safe defaults
    const rawCount = Number(search.get('count'));
    const rawMonths = Number(search.get('months'));
    const rawSeed = search.get('seed');

    const count = Number.isFinite(rawCount) && rawCount > 0 ? Math.min(rawCount, 500) : 60;
    const months = Number.isFinite(rawMonths) && rawMonths > 0 ? Math.min(rawMonths, 36) : 6;

    // Deterministic seed: explicit seed param or hash of "count-months"
    const seed = rawSeed
        ? hashSeed(rawSeed)
        : hashSeed(`${count}-${months}`);

    faker.seed(seed);

    const entries = generateEntries(count, months);
    const summary = buildSummary(entries);

    return NextResponse.json(
        { entries, summary },
        {
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
                'Content-Type': 'application/json; charset=utf-8',
            },
        }
    );
}
