import { Outlet } from "react-router"
import Navbar from "./Navbar/Navbar"
import Footer from "./Footer/Footer"

function App() {

  return (
    <>
      <div>
        <Navbar/>
        <Outlet/>
        <Footer/>
      </div>
    </>
  )
}

export default App
