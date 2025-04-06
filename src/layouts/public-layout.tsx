
import Footer from "@/components/Footer"
import { Outlet } from "react-router-dom"


const PublicLayout = () => {
  return (
    <div className="bg-gradient-to-br from-[#EBE7E4] via-white to-[#CBDFF7] text-gray-900">
      <Outlet /> 
      <Footer/>
    </div>
  )
}
export default PublicLayout