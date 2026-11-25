import { create } from "zustand";
import toast from "react-hot-toast";
import { api, errorMessage } from "../lib/api";

const emptyForm = { name: "", price: "", image: "" };

// Estado compartido del catálogo entre componentes.
export const useProductStore = create((set, get) => ({
  products: [],
  currentProduct: null,
  loading: false,
  error: null,

  formData: emptyForm,
  formErrors: {},
  saving: false,

  setFormData: (formData) => set({ formData }),
  resetForm: () => set({ formData: emptyForm, formErrors: {} }),

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get("/products");
      set({ products: data.data });
    } catch (err) {
      set({ error: errorMessage(err, "No se pudo cargar el catálogo"), products: [] });
    } finally {
      set({ loading: false });
    }
  },

  fetchProduct: async (id) => {
    set({ loading: true, error: null, currentProduct: null });
    try {
      const { data } = await api.get(`/products/${id}`);
      const p = data.data;
      set({ currentProduct: p, formData: { name: p.name, price: String(p.price), image: p.image }, formErrors: {} });
    } catch (err) {
      set({ error: errorMessage(err, "No se pudo cargar el producto") });
    } finally {
      set({ loading: false });
    }
  },

  updateProduct: async (id) => {
    set({ saving: true, formErrors: {} });
    try {
      const { formData } = get();
      const { data } = await api.put(`/products/${id}`, { ...formData, price: Number(formData.price) });
      set({ currentProduct: data.data });
      toast.success("Cambios guardados");
      return true;
    } catch (err) {
      get().applyValidationErrors(err);
      toast.error(errorMessage(err, "No se pudieron guardar los cambios"));
      return false;
    } finally {
      set({ saving: false });
    }
  },

  deleteProduct: async (id) => {
    try {
      await api.delete(`/products/${id}`);
      set((state) => ({ products: state.products.filter((p) => p.id !== id) }));
      toast.success("Producto eliminado");
      return true;
    } catch (err) {
      toast.error(errorMessage(err, "No se pudo eliminar el producto"));
      await get().fetchProducts();
      return false;
    }
  },

  // Convierte los errores de Zod que devuelve la API en { campo: mensaje }
  applyValidationErrors: (err) => {
    const errors = {};
    for (const e of err?.response?.data?.errors ?? []) errors[e.field] = e.message;
    set({ formErrors: errors });
  },

  addProduct: async () => {
    set({ saving: true, formErrors: {} });
    try {
      const { formData } = get();
      await api.post("/products", { ...formData, price: Number(formData.price) });
      await get().fetchProducts();
      get().resetForm();
      toast.success("Producto agregado");
      return true;
    } catch (err) {
      get().applyValidationErrors(err);
      toast.error(errorMessage(err, "No se pudo agregar el producto"));
      return false;
    } finally {
      set({ saving: false });
    }
  },
}));
