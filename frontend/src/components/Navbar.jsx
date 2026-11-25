import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

export default function Navbar() {
  return (
    <header className="bg-base-100 border-b border-base-300">
      <div className="navbar max-w-6xl mx-auto px-4">
        <div className="flex-1">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold">
            <ShoppingBag className="size-6 text-primary" />
            Catálogo PERN
          </Link>
        </div>
      </div>
    </header>
  );
}
