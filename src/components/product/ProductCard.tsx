// src/components/product/ProductCard.tsx
import { useState } from "react";
import type { Product } from "../../types/index";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { VariantList } from "../variant/VariantList";
import { AddVariantForm } from "../variant/AddVariantForm";
import { useProducts } from "../../hooks/useProducts";
import { formatCurrency } from "../../lib/utils";
import { Trash, Edit, Plus, ChevronDown, ChevronUp } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
}

export const ProductCard = ({ product, onEdit }: ProductCardProps) => {
  const [showVariants, setShowVariants] = useState(false);
  const [showAddVariantForm, setShowAddVariantForm] = useState(false);
  const { deleteProduct } = useProducts();

  const totalVariants = product.variants.length;
  const totalStock = product.variants.reduce((acc, variant) => acc + variant.stock, 0);
  const lowestPrice = product.variants.length 
    ? Math.min(...product.variants.map(v => v.price))
    : 0;
  const highestPrice = product.variants.length 
    ? Math.max(...product.variants.map(v => v.price))
    : 0;

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
      deleteProduct(product.id);
    }
  };

  return (
    <Card className="w-full mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{product.name}</CardTitle>
            <CardDescription className="mt-1">
              {product.description}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => onEdit(product)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleDelete}>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
          <div>
            <p className="text-muted-foreground">Variants</p>
            <p className="font-medium">{totalVariants}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Total Stock</p>
            <p className="font-medium">{totalStock}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Price Range</p>
            <p className="font-medium">
              {totalVariants 
                ? `${formatCurrency(lowestPrice)} - ${formatCurrency(highestPrice)}` 
                : "No variants"}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Last Updated</p>
            <p className="font-medium">
              {product.updatedAt.toLocaleDateString()}
            </p>
          </div>
        </div>

        {showAddVariantForm && (
          <div className="mb-4">
            <AddVariantForm 
              productId={product.id} 
              onComplete={() => setShowAddVariantForm(false)} 
            />
          </div>
        )}

        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={() => setShowVariants(!showVariants)}
            className="flex items-center"
          >
            {showVariants ? (
              <>Hide Variants <ChevronUp className="ml-2 h-4 w-4" /></>
            ) : (
              <>Show Variants <ChevronDown className="ml-2 h-4 w-4" /></>
            )}
          </Button>
          
          <Button
            onClick={() => setShowAddVariantForm(!showAddVariantForm)}
            variant="outline"
            className="flex items-center"
          >
            {showAddVariantForm ? "Cancel" : (
              <>Add Variant <Plus className="ml-2 h-4 w-4" /></>
            )}
          </Button>
        </div>

        {showVariants && product.variants.length > 0 && (
          <div className="mt-4">
            <VariantList 
              productId={product.id} 
              variants={product.variants} 
            />
          </div>
        )}
        
        {showVariants && product.variants.length === 0 && (
          <div className="mt-4 p-4 border border-dashed rounded-md text-center text-muted-foreground">
            No variants yet. Add your first variant.
          </div>
        )}
      </CardContent>
    </Card>
  );
};