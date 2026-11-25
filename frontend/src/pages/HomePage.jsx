import { useEffect } from "react";
import { PackageOpen, RefreshCw } from "lucide-react";
import { useProductStore } from "../store/useProductStore";
import ProductCard from "../components/ProductCard";

export default function HomePage() {
  const { products, loading, error, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">Productos</h1>
        <button className="btn btn-ghost btn-sm" onClick={fetchProducts} aria-label="Recargar">
          <RefreshCw className="size-4" /> Recargar
        </button>
      </div>

      {error && <div role="alert" className="alert alert-error mb-6">{error}</div>}

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg" aria-label="Cargando" />
        </div>
      ) : products.length === 0 && !error ? (
        <div className="flex flex-col items-center text-center py-20 gap-3 text-base-content/70" data-testid="catalogo-vacio">
          <PackageOpen className="size-14" />
          <p className="text-lg font-medium">El catálogo está vacío</p>
          <p className="text-sm">Todavía no hay productos registrados.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
