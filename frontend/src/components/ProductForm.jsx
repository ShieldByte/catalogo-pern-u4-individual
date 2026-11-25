import { DollarSign, Image, Package } from "lucide-react";
import { useProductStore } from "../store/useProductStore";

// Formulario reutilizable para alta y edición. Los errores vienen de la validación con Zod.
export default function ProductForm({ onSubmit, submitLabel, onCancel }) {
  const { formData, setFormData, formErrors, saving } = useProductStore();

  const field = (key, label, Icon, props) => (
    <label className="form-control w-full flex flex-col gap-1">
      <span className="label-text font-medium">{label}</span>
      <div className={`input input-bordered w-full flex items-center gap-2 ${formErrors[key] ? "input-error" : ""}`}>
        <Icon className="size-4 opacity-60" />
        <input
          className="grow"
          value={formData[key]}
          onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
          {...props}
        />
      </div>
      {formErrors[key] && <span className="text-error text-sm">{formErrors[key]}</span>}
    </label>
  );

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      noValidate
    >
      {field("name", "Nombre", Package, { placeholder: "Ej. Audífonos inalámbricos", name: "name" })}
      {field("price", "Precio (MXN)", DollarSign, { placeholder: "0.00", type: "number", step: "0.01", min: "0", name: "price" })}
      {field("image", "URL de la imagen", Image, { placeholder: "https://...", type: "url", name: "image" })}

      {formData.image?.startsWith("http") && (
        <img src={formData.image} alt="Vista previa" className="h-32 w-full object-cover rounded-box bg-base-200" />
      )}

      <div className="flex justify-end gap-2 mt-2">
        {onCancel && (
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Cancelar
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving && <span className="loading loading-spinner loading-sm" />}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
