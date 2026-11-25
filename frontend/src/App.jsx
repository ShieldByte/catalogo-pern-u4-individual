import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";

export default function App() {
  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  );
}
