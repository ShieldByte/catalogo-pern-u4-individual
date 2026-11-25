import axios from "axios";

// En producción el frontend y la API se sirven desde el mismo origen.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 10000,
});

export function errorMessage(err, fallback = "Ocurrió un error inesperado") {
  return err?.response?.data?.message || fallback;
}
