import pandas as pd
import sqlite3
import json

# 1. Configuration - Replace these with your actual file paths
DATASET_PATH = 'amazon_products.csv'  # or 'dataset.json'
DATABASE_NAME = 'store_demo.db'

def setup_database(file_path, db_name):
    # Load the data (Detecting file type)
    print(f"--- Loading dataset from {file_path} ---")
    if file_path.endswith('.csv'):
        df = pd.read_csv(file_path)
    elif file_path.endswith('.json'):
        df = pd.read_json(file_path, lines=True)
    
    # 2. Data Mapping (Standardizing different dataset schemas)
    # Most Amazon datasets use these common fields; we map them to demo-friendly names
    column_mapping = {
        'asin': 'sku',
        'title': 'name',
        'large_image_url': 'image_url',
        'imUrl': 'image_url',
        'description': 'description',
        'price': 'price',
        'brand': 'brand'
    }
    
    # Rename columns that exist in the dataset
    df = df.rename(columns={k: v for k, v in column_mapping.items() if k in df.columns})
    
    # 3. Basic Cleaning
    # Ensure mandatory fields for a store demo aren't empty
    df = df.dropna(subset=['sku', 'name']) 
    df['price'] = df['price'].fillna(0.0)
    df['image_url'] = df['image_url'].fillna('https://placeholder.com')
    
    # 4. Save to SQL
    conn = sqlite3.connect(db_name)
    print(f"--- Writing to {db_name} ---")
    
    # Create the 'products' table
    # 'if_exists=replace' creates a fresh table for your demo each time
    df.to_sql('products', conn, if_exists='replace', index=False)
    
    # Verification Query
    cursor = conn.cursor()
    sample = cursor.execute("SELECT sku, name, price FROM products LIMIT 3").fetchall()
    print("\nSuccess! Sample Data in Database:")
    for row in sample:
        print(row)
        
    conn.close()

if __name__ == "__main__":
    try:
        setup_demo_database(DATASET_PATH, DATABASE_NAME)
    except Exception as e:
        print(f"Error: {e}")
