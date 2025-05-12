import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// Uncomment to enable React Query DevTools
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// Uncomment to enable React Query DevTools
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { Product } from "./types/index";
import { useProducts } from "./hooks/useProducts";
import { ProductCard } from "./components/product/ProductCard";
import { AddProductForm } from "./components/product/AddProductForm";
import { EditProductForm } from "./components/product/EditProductForm";
import { Button } from "./components/ui/button";
import { Input } from "@/components/ui/input"
import { Search, Plus } from "lucide-react";

// Create a client
const queryClient = new QueryClient();

function ProductManager() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isImporting, setIsImporting] = useState(false);
  const { products, isLoading, isError, error } = useProducts();

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleImportProducts = async () => {
    try {
      setIsImporting(true);
      const { importProductsFromAPI } = await import('./services/externalApiService');
      const success = await importProductsFromAPI();
      
      if (success) {
        // Refresh the products
        queryClient.invalidateQueries({ queryKey: ["products"] });
        alert("Products imported successfully!");
      } else {
        alert("No products were imported. Please try again.");
      }
    } catch (error) {
      console.error("Error importing products:", error);
      alert("Failed to import products. Please try again.");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="lg:text-[42px] text-[35px] font-bold mb-4 md:mb-0 text-[#162120] ">Product Manager</h1>
        <div className="lg:flex  lg:gap-y-0 items-center lg:gap-4 sm:flex-wrap">
          <Button
            onClick={handleImportProducts}
            variant="outline"
            className="flex items-center"
            disabled={isImporting}
            >
            {isImporting ? "Importing..." : "Import Products"}
          </Button>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center mt-4 lg:mt-0 bg-[#95BF47]  hover:bg-[#5E8E3E]"
          >
            {showAddForm ? "Cancel" : (
              <>Add Product <Plus className="ml-2 h-4 w-4" /></>
            )}
          </Button>
        </div>
      </div>

      {showAddForm && (
        <div className="mb-6">
          <AddProductForm onComplete={() => setShowAddForm(false)} />
        </div>
      )}

      {editingProduct && (
        <div className="mb-6">
          <EditProductForm 
            product={editingProduct} 
            onComplete={() => setEditingProduct(null)} 
          />
        </div>
      )}

      <div className="mb-6 relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            className="pl-10 border border-gray-300 focus:border-[#95BF47] focus:ring-[#95BF47]"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading products...</div>
      ) : isError ? (
        <div className="text-center py-8 text-red-500">
          Error loading products: {error?.toString()}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {searchTerm ? "No products match your search." : "No products yet. Add your first product."}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={setEditingProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProductManager />
      {/* Uncomment to enable React Query DevTools */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}