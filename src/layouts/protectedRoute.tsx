import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/authContext";
import Footer from "@/components/Footer"; 
import Navbar from "@/components/Navbar";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading)
    return <div className="bg-gradient-to-br from-[#EBE7E4] via-white to-[#CBDFF7] flex items-center justify-center min-h-screen text-center">Loading...</div>;

  return user ? (
    <div className="min-h-screen bg-gradient-to-br from-[#EBE7E4] via-white to-[#CBDFF7] text-gray-900">
      <Navbar/>
      <Outlet />
      <Footer />
    </div>
  ) : (
    <Navigate to="/signin" replace />
  );
};

export default ProtectedRoute;
