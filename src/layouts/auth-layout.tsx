import { Outlet } from 'react-router-dom'

const AuthenticationLayout = () => {
  return (
    <div className='w-screen h-screen overflow-hidden flex justify-center items-center relative  bg-gradient-to-br from-[#EBE7E4] via-white to-[#CBDFF7]'>
    <Outlet/>
    </div>
  )
}

export default AuthenticationLayout