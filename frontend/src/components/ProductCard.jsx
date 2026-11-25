import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";

const formatoPrecio = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" });

export default function ProductCard({ product, onDelete }) {
  return (
    <article className="card bg-base-100 shadow-sm border border-base-300 overflow-hidden">
      <figure className="aspect-[4/3] bg-base-200">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
      </figure>
      <div className="card-body p-4">
        <h2 className="card-title text-base">{product.name}</h2>
        <p className="text-lg font-semibold text-primary">{formatoPrecio.format(product.price)}</p>
        <div className="card-actions justify-end mt-2">
          <button className="btn btn-sm btn-outline btn-error" onClick={() => onDelete(product)}>
            <Trash2 className="size-4" /> Eliminar
          </button>
          <Link to={`/product/${product.id}`} className="btn btn-sm btn-outline btn-info">
            <Pencil className="size-4" /> Editar
          </Link>
        </div>
      </div>
    </article>
  );
}
