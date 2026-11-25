import { useEffect, useRef } from "react";
import { TriangleAlert } from "lucide-react";

// Confirmación de baja: Cancelar conserva el producto; Eliminar llama a onConfirm.
export default function ConfirmDeleteModal({ product, onCancel, onConfirm }) {
  const ref = useRef(null);

  useEffect(() => {
    if (product) ref.current?.showModal();
    else ref.current?.close();
  }, [product]);

  return (
    <dialog ref={ref} className="modal" onClose={onCancel}>
      <div className="modal-box">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <TriangleAlert className="size-5 text-warning" /> Eliminar producto
        </h3>
        <p className="py-4">
          ¿Seguro que quieres eliminar <strong>{product?.name}</strong>? Esta acción no se puede deshacer.
        </p>
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onCancel}>Cancelar</button>
          <button className="btn btn-error" onClick={onConfirm}>Eliminar</button>
        </div>
      </div>
    </dialog>
  );
}
