import {
  CircleUserRound,
  LogOut,
  Sparkles,
  Menu,
  X,
} from "lucide-react";
import { auth } from "@/firebaseConfig";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/authContext";
import { useState } from "react";

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <nav className="px-6 py-4 flex items-center justify-between w-full border-b shadow-sm  relative">
      <a
        href="/dashboard"
        className="flex items-center gap-2 text-xl font-bold text-gray-800"
      >
        <Sparkles className="w-6 h-6 text-blue-500" />
        <span>MockAI</span>
      </a>

      <button
        className="md:hidden text-gray-700"
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <div className="hidden md:flex items-center gap-4">
        <div className="flex items-center gap-2">
          <CircleUserRound className="w-7 h-7 text-gray-700" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              {user?.displayName}
            </span>
            <span className="text-xs text-gray-500">{user?.email}</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 shadow-md px-4 py-2 rounded-md"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>

      {menuOpen && (
        <div className="absolute top-full right-4 mt-2 w-[92vw] sm:w-[300px] bg-white border rounded-xl shadow-md z-50 p-4 flex flex-col gap-4 md:hidden">
          <div className="flex items-center gap-2">
            <CircleUserRound className="w-7 h-7 text-gray-700" />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">
                {user?.displayName}
              </span>
              <span className="text-xs text-gray-500">{user?.email}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 shadow-md px-4 py-2 rounded-md w-full justify-center"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      )}
    </nav>
  );
}
