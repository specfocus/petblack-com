import axios from 'axios';

/**
 * Enum of recommended Hugging Face datasets for an Amazon-style store demo.
 * Each value corresponds to a specific Dataset ID on the Hugging Face Hub.
 */
export enum AmazonDemoDatasets {
    // Balanced dataset with products, metadata, and direct image links
    GeneralProducts = "datahiveai/Amazon-Reviews-Dataset",

    // High-resolution images and specialized metadata for retail
    RetailCatalog = "Shopify/product-catalogue",

    // Massive collection of reviews and product meta (2023 version)
    FullReviews2023 = "McAuley-Lab/Amazon-Reviews-2023",

    // Ideal for fashion-focused store demos
    FashionAsos = "UniqueData/asos-e-commerce-dataset",

    // Product descriptions optimized for visual-language models
    DescriptionsVLM = "philschmid/amazon-product-descriptions-vlm",

    // Standard product filters and categories
    FilteredProducts = "iarbel/amazon-product-data-filter"
}

export type AmazonDemoDataset = `${AmazonDemoDatasets}`;

// Interfaces for the store demo data
export interface ProductRow {
    sku: string;
    name: string;
    description: string;
    image_url: string;
    price?: number;
}

export class HFDatasetService {
    private readonly baseUrl = 'https://datasets-server.huggingface.co';
    private readonly hfToken: string;

    constructor(token: string) {
        this.hfToken = token;
    }

    /**
     * Fetches rows from a specific dataset. 
     * Example dataset: "datahiveai/Amazon-Reviews-Dataset"
     */
    async getProductData(dataset: AmazonDemoDataset, split: string = 'train', offset: number = 0, length: number = 10): Promise<ProductRow[]> {
        try {
            const response = await axios.get(`${this.baseUrl}/rows`, {
                params: { dataset, split, offset, length },
                headers: { Authorization: `Bearer ${this.hfToken}` }
            });

            // Map the generic 'row' format to your store's Product interface
            return response.data.rows.map((item: any) => {
                const row = item.row;
                return {
                    sku: row.asin || row.sku || row.id,
                    name: row.title || row.product_name,
                    description: row.description || row.text || '',
                    image_url: row.image_url || row.imUrl || 'https://placeholder.com',
                    price: row.price || 0
                };
            });
        } catch (error) {
            console.error('Error fetching HF dataset rows:', error);
            throw error;
        }
    }

    /**
     * Gets the list of available splits (train, validation, test) for a dataset
     */
    async getSplits(dataset: string) {
        const response = await axios.get(`${this.baseUrl}/splits`, {
            params: { dataset },
            headers: { Authorization: `Bearer ${this.hfToken}` }
        });
        return response.data.splits;
    }
}
