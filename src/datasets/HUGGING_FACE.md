For your TypeScript-based store demo, the most efficient way to access Hugging Face datasets without downloading massive files is via the Hugging Face Datasets Server REST API. Unlike the Python library which handles downloads locally, this API allows you to fetch metadata, rows, and previews directly via standard HTTP requests. [1] 
## 1. Setup and Authentication
First, install a lightweight HTTP client (like axios) to handle the requests. You will also need a Read-only Access Token from your [Hugging Face Settings](https://huggingface.co/settings/tokens). [2] 

npm install axios

## 2. TypeScript Client Service
This service provides methods to fetch dataset metadata and actual product rows (skus, images, descriptions) from the Hub. [1] 

import axios from 'axios';
// Interfaces for the store demo dataexport interface ProductRow {
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
  async getProductData(dataset: string, split: string = 'train', offset: number = 0, length: number = 10): Promise<ProductRow[]> {
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

## 3. Usage in your Store Demo
You can now use this service to populate your frontend or search index on the fly.

async function loadStoreDemo() {
  const hfService = new HFDatasetService('your_hf_token_here');
  
  // Fetching a slice of 50 products for the store catalog
  const products = await hfService.getProductData('datahiveai/Amazon-Reviews-Dataset', 'train', 0, 50);
  
  console.log(`Loaded ${products.length} products for the demo!`);
  console.log('First Product SKU:', products[0].sku);
}

## Key API Endpoints for Demos

* /rows: The primary endpoint for fetching actual data samples.
* /search: Allows you to perform text-based searches within the dataset.
* /info: Provides metadata like the number of rows, column names, and dataset size. [1] 

Do you want me to help you map this service to a specific React or Next.js component for your storefront?

[1] [https://dlthub.com](https://dlthub.com/context/source/hugging-face-datasets)
[2] [https://huggingface.co](https://huggingface.co/blog/PaulieScanlon/how-to-use-hugging-face-inference-endpoints)
