import { useState, useEffect } from "react";
import type { Variant } from "../../types/index";
import { useProducts } from "../../hooks/useProducts";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface EditVariantFormProps {
  productId: string;
  variant: Variant;
  onComplete: () => void;
}

export const EditVariantForm = ({ productId, variant, onComplete }: EditVariantFormProps) => {
  const [size, setSize] = useState(variant.attributes.size || "");
  const [color, setColor] = useState(variant.attributes.color || "");
  const [material, setMaterial] = useState(variant.attributes.material || "");
  const [price, setPrice] = useState(variant.price.toString());
  const [sku, setSku] = useState(variant.sku);
  const [stock, setStock] = useState(variant.stock.toString());
  
  const { updateVariant, isUpdatingVariant } = useProducts();

  useEffect(() => {
    setSize(variant.attributes.size || "");
    setColor(variant.attributes.color || "");
    setMaterial(variant.attributes.material || "");
    setPrice(variant.price.toString());
    setSku(variant.sku);
    setStock(variant.stock.toString());
  }, [variant]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      alert("Please enter a valid price");
      return;
    }
    
    if (!stock || isNaN(Number(stock)) || Number(stock) < 0) {
      alert("Please enter a valid stock quantity");
      return;
    }
    
    updateVariant({
      productId,
      variantId: variant.id,
      updates: {
        attributes: {
          size: size.trim() || undefined,
          color: color.trim() || undefined,
          material: material.trim() || undefined,
        },
        price: Number(price),
        sku: sku.trim() || `SKU-${Date.now()}`,
        stock: Number(stock),
      }
    });
    
    onComplete();
  };

  return (
    <Card className="mb-2">
      <CardHeader>
        <CardTitle className="text-base">Edit Variant</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-size">Size</Label>
              <Input
                id="edit-size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="e.g. M, L, XL"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-color">Color</Label>
              <Input
                id="edit-color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g. Red, Blue"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-material">Material</Label>
              <Input
                id="edit-material"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="e.g. Cotton, Leather"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-price">Price (₦) *</Label>
              <Input
                id="edit-price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="5000"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-sku">SKU</Label>
              <Input
                id="edit-sku"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="Auto-generated if empty"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-stock">Stock *</Label>
              <Input
                id="edit-stock"
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="10"
                min="0"
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onComplete}>
            Cancel
          </Button>
          <Button type="submit" disabled={isUpdatingVariant}>
            {isUpdatingVariant ? "Updating..." : "Update Variant"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}