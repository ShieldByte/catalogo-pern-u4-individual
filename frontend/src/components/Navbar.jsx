import { Link } from "react-router-dom";
import { LogIn, LogOut, ShoppingBag } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

export default function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <header className="bg-base-100 border-b border-base-300">
      <div className="navbar max-w-6xl mx-auto px-4">
        <div className="flex-1">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold">
            <ShoppingBag className="size-6 text-primary" />
            Catálogo PERN
          </Link>
        </div>
        {user ? (
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-sm">{user.name}</span>
            <span className={`badge ${user.role === "admin" ? "badge-primary" : "badge-ghost"}`}>{user.role}</span>
            <button className="btn btn-ghost btn-sm" onClick={logout}>
              <LogOut className="size-4" /> Salir
            </button>
          </div>
        ) : (
          <Link to="/login" className="btn btn-ghost btn-sm">
            <LogIn className="size-4" /> Iniciar sesión
          </Link>
        )}
      </div>
    </header>
  );
}
