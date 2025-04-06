import { Facebook, Twitter, Linkedin, SparklesIcon } from "lucide-react";

export default function Footer() {
  return (
    <>
      <footer className="md:h-[80px] text-gray-700 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          
          
          <div className="text-lg font-semibold flex gap-2 cursor-pointer"> <SparklesIcon />MockAI</div>
  
                
          <p className="text-center text-gray-600 text-sm mt-4">
          © 2025 MockAI. All rights reserved.
        </p>
         
  
          
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-600 hover:text-gray-500">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-500">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-500">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
  
       
      </footer>
    </>
  );
}
