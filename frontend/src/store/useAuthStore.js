import { create } from "zustand";
import toast from "react-hot-toast";
import { api, errorMessage } from "../lib/api";

const KEY = "catalogo_sesion";

function leerSesion() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? { token: null, user: null };
  } catch {
    return { token: null, user: null };
  }
}

function guardarSesion(sesion) {
  try {
    if (sesion.token) localStorage.setItem(KEY, JSON.stringify(sesion));
    else localStorage.removeItem(KEY);
  } catch {
    /* almacenamiento no disponible: la sesión dura mientras la pestaña esté abierta */
  }
}

export const useAuthStore = create((set, get) => ({
  ...leerSesion(),
  loggingIn: false,

  isAdmin: () => get().user?.role === "admin",

  login: async (email, password) => {
    set({ loggingIn: true });
    try {
      const { data } = await api.post("/auth/login", { email, password });
      const sesion = { token: data.data.token, user: data.data.user };
      guardarSesion(sesion);
      set(sesion);
      toast.success(`Bienvenido, ${sesion.user.name}`);
      return true;
    } catch (err) {
      toast.error(errorMessage(err, "No se pudo iniciar sesión"));
      return false;
    } finally {
      set({ loggingIn: false });
    }
  },

  logout: () => {
    guardarSesion({ token: null });
    set({ token: null, user: null });
  },
}));

// Cada petición lleva el token; si la API responde 401 la sesión se cierra.
api.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401 && useAuthStore.getState().token) {
      useAuthStore.getState().logout();
      toast.error("Tu sesión expiró. Vuelve a iniciar sesión.");
    }
    return Promise.reject(err);
  }
);
