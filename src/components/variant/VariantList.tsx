import type { Variant } from "../../types/index";
import { VariantCard } from "./VariantCard";

interface VariantListProps {
  productId: string;
  variants: Variant[];
}

export const VariantList = ({ productId, variants }: VariantListProps) => {
  return (
    <div className="space-y-2">
      {variants.map((variant) => (
        <VariantCard
          key={variant.id}
          productId={productId}
          variant={variant}
        />
      ))}
    </div>
  );
};