import { useProductStore } from "../store/useProductStore";
import ProductForm from "./ProductForm";

export const ADD_MODAL_ID = "add_product_modal";

export default function AddProductModal() {
  const { addProduct, resetForm } = useProductStore();
  const close = () => document.getElementById(ADD_MODAL_ID)?.close();

  return (
    <dialog id={ADD_MODAL_ID} className="modal" onClose={resetForm}>
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Agregar producto</h3>
        <ProductForm
          submitLabel="Agregar"
          onCancel={close}
          onSubmit={async () => {
            if (await addProduct()) close();
          }}
        />
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>Cerrar</button>
      </form>
    </dialog>
  );
}
