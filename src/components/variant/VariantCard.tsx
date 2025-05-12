import { useState } from "react";
import type { Variant } from "../../types/index";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { formatCurrency } from "../../lib/utils";
import { Edit, Trash } from "lucide-react";
import { EditVariantForm } from "./EditVariantForm";
import { useProducts } from "../../hooks/useProducts";

interface VariantCardProps {
  productId: string;
  variant: Variant;
}

export const VariantCard = ({ productId, variant }: VariantCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { deleteVariant } = useProducts();

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this variant?")) {
      deleteVariant({ productId, variantId: variant.id });
    }
  };

  if (isEditing) {
    return (
      <EditVariantForm
        productId={productId}
        variant={variant}
        onComplete={() => setIsEditing(false)}
      />
    );
  }

  return (
    <Card className="mb-2">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1">
              {Object.entries(variant.attributes).map(([key, value]) => (
                value && (
                  <Badge key={key} variant="outline" className="capitalize">
                    {key}: {value}
                  </Badge>
                )
              ))}
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Price</p>
                <p className="font-medium">{formatCurrency(variant.price)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">SKU</p>
                <p className="font-medium text-xs">{variant.sku}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Stock</p>
                <p className="font-medium">{variant.stock}</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleDelete}>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};