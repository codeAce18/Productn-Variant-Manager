import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct,
  addVariant,
  updateVariant,
  deleteVariant
} from "../services/productService";
import type { Product, Variant } from "../types/index";

export const useProducts = () => {
  const queryClient = useQueryClient();

  // Get all products query
  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: getProducts
  });

  // Add product mutation
  const addProductMutation = useMutation({
    mutationFn: (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => 
      Promise.resolve(addProduct(product)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: ({ productId, updates }: { productId: string, updates: Partial<Product> }) => 
      updateProduct(productId, updates) as unknown as Promise<Product>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: (productId: string) => 
      Promise.resolve(deleteProduct(productId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  });

  // Add variant mutation
  const addVariantMutation = useMutation({
    mutationFn: ({ productId, variant }: { 
      productId: string, 
      variant: Omit<Variant, "id" | "productId" | "createdAt" | "updatedAt"> 
    }) => addVariant(productId, variant) as unknown as Promise<Variant>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  });

  // Update variant mutation
  const updateVariantMutation = useMutation({
    mutationFn: ({ 
      productId, 
      variantId, 
      updates 
    }: { 
      productId: string, 
      variantId: string, 
      updates: Partial<Variant> 
    }) => updateVariant(productId, variantId, updates) as unknown as Promise<Variant>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  });

  // Delete variant mutation
  const deleteVariantMutation = useMutation({
    mutationFn: ({ productId, variantId }: { productId: string, variantId: string }) => 
      Promise.resolve(deleteVariant(productId, variantId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  });

  return {
    // Queries
    products: productsQuery.data || [],
    isLoading: productsQuery.isLoading,
    isError: productsQuery.isError,
    error: productsQuery.error,
    
    // Mutations
    addProduct: addProductMutation.mutate,
    updateProduct: updateProductMutation.mutate,
    deleteProduct: deleteProductMutation.mutate,
    addVariant: addVariantMutation.mutate,
    updateVariant: updateVariantMutation.mutate,
    deleteVariant: deleteVariantMutation.mutate,
    
    // Mutation states
    isAddingProduct: addProductMutation.isPending,
    isUpdatingProduct: updateProductMutation.isPending,
    isDeletingProduct: deleteProductMutation.isPending,
    isAddingVariant: addVariantMutation.isPending,
    isUpdatingVariant: updateVariantMutation.isPending,
    isDeletingVariant: deleteVariantMutation.isPending,
  };
};