import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { LogIn, Lock, Mail } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, login, loggingIn } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (user) return <Navigate to="/" replace />;

  return (
    <main className="max-w-md mx-auto px-4 py-12">
      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body">
          <h1 className="card-title text-2xl">Iniciar sesión</h1>
          <p className="text-sm text-base-content/70 mb-2">
            Cualquier visitante puede consultar el catálogo. Para crear, editar o eliminar productos inicia sesión como administrador.
          </p>
          <form
            className="flex flex-col gap-4"
            onSubmit={async (e) => {
              e.preventDefault();
              if (await login(email, password)) navigate("/");
            }}
          >
            <label className="input input-bordered w-full flex items-center gap-2">
              <Mail className="size-4 opacity-60" />
              <input className="grow" type="email" placeholder="correo@ejemplo.com" value={email}
                onChange={(e) => setEmail(e.target.value)} required autoComplete="username" name="email" />
            </label>
            <label className="input input-bordered w-full flex items-center gap-2">
              <Lock className="size-4 opacity-60" />
              <input className="grow" type="password" placeholder="Contraseña" value={password}
                onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" name="password" />
            </label>
            <button className="btn btn-primary" disabled={loggingIn}>
              {loggingIn ? <span className="loading loading-spinner loading-sm" /> : <LogIn className="size-4" />}
              Entrar
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
