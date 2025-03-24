import { Route, Routes } from "react-router-dom";
import PublicLayout from "./layouts/public-layout";
import Home from "./pages/Home";
import AuthenticationLayout from "./layouts/auth-layout";
import Singup from "./pages/Singup";
import SinginPage from "./pages/Singin";

function App() {

  return (
    <>
      <Routes>
        <Route>
          <Route element={<PublicLayout />} >
            <Route index element={ <Home/>} />
          </Route>
        </Route>

        
        <Route>
        <Route element={<AuthenticationLayout />} >
            <Route path="/signup" element={<Singup />} />
            <Route path="/signin" element={ <SinginPage/>} />
          </Route>
        </Route>

        <Route>

        </Route>
    </Routes>

    </>
  )
}

export default App
