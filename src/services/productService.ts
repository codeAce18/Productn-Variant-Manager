import type { Product, Variant } from "../types/index";

// Local storage keys
const PRODUCTS_KEY = "products";

// Get all products from localStorage
export const getProducts = (): Product[] => {
  const productsData = localStorage.getItem(PRODUCTS_KEY);
  if (!productsData) return [];
  
  const products: Product[] = JSON.parse(productsData);
  // Convert string dates back to Date objects
  return products.map(product => ({
    ...product,
    createdAt: new Date(product.createdAt),
    updatedAt: new Date(product.updatedAt),
    variants: product.variants.map(variant => ({
      ...variant,
      createdAt: new Date(variant.createdAt),
      updatedAt: new Date(variant.updatedAt),
    })),
  }));
};

// Add a new product
export const addProduct = (product: Omit<Product, "id" | "createdAt" | "updatedAt">): Product => {
  const products = getProducts();
  const newProduct: Product = {
    ...product,
    id: generateId(),
    createdAt: new Date(),
    updatedAt: new Date(),
    variants: [],
  };
  
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify([...products, newProduct]));
  return newProduct;
};

// Update an existing product
export const updateProduct = (productId: string, updates: Partial<Product>): Product | null => {
  const products = getProducts();
  const productIndex = products.findIndex(p => p.id === productId);
  
  if (productIndex === -1) return null;
  
  const updatedProduct = {
    ...products[productIndex],
    ...updates,
    updatedAt: new Date(),
  };
  
  products[productIndex] = updatedProduct;
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  
  return updatedProduct;
};

// Delete a product
export const deleteProduct = (productId: string): boolean => {
  const products = getProducts();
  const filteredProducts = products.filter(p => p.id !== productId);
  
  if (filteredProducts.length === products.length) return false;
  
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(filteredProducts));
  return true;
};

// Add a variant to a product
export const addVariant = (productId: string, variant: Omit<Variant, "id" | "productId" | "createdAt" | "updatedAt">): Variant | null => {
  const products = getProducts();
  const productIndex = products.findIndex(p => p.id === productId);
  
  if (productIndex === -1) return null;
  
  const newVariant: Variant = {
    ...variant,
    id: generateId(),
    productId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  products[productIndex].variants.push(newVariant);
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  
  return newVariant;
};

// Update a variant
export const updateVariant = (productId: string, variantId: string, updates: Partial<Variant>): Variant | null => {
  const products = getProducts();
  const productIndex = products.findIndex(p => p.id === productId);
  
  if (productIndex === -1) return null;
  
  const variantIndex = products[productIndex].variants.findIndex(v => v.id === variantId);
  
  if (variantIndex === -1) return null;
  
  const updatedVariant = {
    ...products[productIndex].variants[variantIndex],
    ...updates,
    updatedAt: new Date(),
  };
  
  products[productIndex].variants[variantIndex] = updatedVariant;
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  
  return updatedVariant;
};

// Delete a variant
export const deleteVariant = (productId: string, variantId: string): boolean => {
  const products = getProducts();
  const productIndex = products.findIndex(p => p.id === productId);
  
  if (productIndex === -1) return false;
  
  const initialVariantsLength = products[productIndex].variants.length;
  products[productIndex].variants = products[productIndex].variants.filter(v => v.id !== variantId);
  
  if (products[productIndex].variants.length === initialVariantsLength) return false;
  
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  return true;
};

// Helper to generate a unique ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}
