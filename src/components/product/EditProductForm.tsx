import { useState, useEffect } from "react";
import { useProducts } from "../../hooks/useProducts";
import type { Product } from "../../types/index";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface EditProductFormProps {
  product: Product;
  onComplete: () => void;
}

export const EditProductForm = ({ product, onComplete }: EditProductFormProps) => {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  
  const { updateProduct, isUpdatingProduct } = useProducts();

  useEffect(() => {
    setName(product.name);
    setDescription(product.description);
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    
    updateProduct({
      productId: product.id,
      updates: {
        name: name.trim(),
        description: description.trim(),
      }
    });
    
    onComplete();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Product</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Product Name *</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Running Shoes"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the product"
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onComplete}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isUpdatingProduct || !name.trim() || (name === product.name && description === product.description)}
          >
            {isUpdatingProduct ? "Updating..." : "Update Product"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};