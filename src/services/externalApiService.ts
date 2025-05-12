import type { Product } from "../types/index";

// Fake Store API integration
export const fetchProductsFromAPI = async (): Promise<Product[]> => {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    const data = await response.json();
    
    // Transform the data to match our Product type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((item: any) => ({
      id: item.id.toString(),
      name: item.title,
      description: item.description,
      createdAt: new Date(),
      updatedAt: new Date(),
      variants: [
        {
          id: `variant-${item.id}-1`,
          productId: item.id.toString(),
          attributes: {
            category: item.category,
          },
          price: item.price,
          sku: `SKU-${item.id}`,
          stock: Math.floor(Math.random() * 50) + 1, // Random stock between 1-50
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ],
    }));
  } catch (error) {
    console.error("Error fetching products from API:", error);
    return [];
  }
};

// Import external products into local storage
export const importProductsFromAPI = async (): Promise<boolean> => {
  try {
    const products = await fetchProductsFromAPI();
    if (products.length === 0) return false;
    
    // Get existing products
    const existingProductsStr = localStorage.getItem('products');
    const existingProducts = existingProductsStr ? JSON.parse(existingProductsStr) : [];
    
    // Add API products, avoiding duplicates by ID
    const existingIds = new Set(existingProducts.map((p: Product) => p.id));
    const newProducts = products.filter(p => !existingIds.has(p.id));
    
    localStorage.setItem('products', JSON.stringify([...existingProducts, ...newProducts]));
    return true;
  } catch (error) {
    console.error("Error importing products:", error);
    return false;
  }
};
