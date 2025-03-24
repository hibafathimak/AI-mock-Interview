import { Outlet } from 'react-router-dom'

const AuthenticationLayout = () => {
  return (
    <div className='w-screen h-screen overflow-hidden flex justify-center items-center relative  bg-gray-50'>
    <Outlet/>
    </div>
  )
}

export default AuthenticationLayout