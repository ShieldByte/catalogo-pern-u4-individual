import { create } from "zustand";
import { api, errorMessage } from "../lib/api";

// Estado compartido del catálogo entre componentes.
export const useProductStore = create((set) => ({
  products: [],
  loading: false,
  error: null,

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
}));
