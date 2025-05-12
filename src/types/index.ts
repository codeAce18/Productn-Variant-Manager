export interface Product {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    variants: Variant[];
  }
  
  export interface Variant {
    id: string;
    productId: string;
    attributes: {
      size?: string;
      color?: string;
      material?: string;
      [key: string]: string | undefined;
    };
    price: number;
    sku: string;
    stock: number;
    createdAt: Date;
    updatedAt: Date;
}