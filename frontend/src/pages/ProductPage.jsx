import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useProductStore } from "../store/useProductStore";
import ProductForm from "../components/ProductForm";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentProduct, loading, error, fetchProduct, updateProduct, deleteProduct, resetForm } = useProductStore();
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    fetchProduct(id);
    return resetForm;
  }, [id, fetchProduct, resetForm]);

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/" className="btn btn-ghost btn-sm mb-6">
        <ArrowLeft className="size-4" /> Volver al catálogo
      </Link>

      {loading && (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg" aria-label="Cargando" />
        </div>
      )}

      {error && !loading && <div role="alert" className="alert alert-error">{error}</div>}

      {currentProduct && !loading && (
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-box overflow-hidden bg-base-100 border border-base-300">
            <img src={currentProduct.image} alt={currentProduct.name} className="w-full h-full object-cover aspect-square" />
          </div>
          <div className="card bg-base-100 border border-base-300">
            <div className="card-body">
              <h1 className="card-title text-2xl mb-2">Editar producto</h1>
              <ProductForm submitLabel="Guardar cambios" onSubmit={() => updateProduct(id)} />
              <div className="divider my-2" />
              <button className="btn btn-outline btn-error" onClick={() => setConfirming(true)}>
                <Trash2 className="size-4" /> Eliminar producto
              </button>
            </div>
          </div>
        </div>
      )}
      <ConfirmDeleteModal
        product={confirming ? currentProduct : null}
        onCancel={() => setConfirming(false)}
        onConfirm={async () => {
          setConfirming(false);
          if (await deleteProduct(currentProduct.id)) navigate("/");
        }}
      />
    </main>
  );
}
