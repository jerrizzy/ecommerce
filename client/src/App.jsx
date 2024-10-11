import Navbar from "./components/NavBar"
import { Outlet, useLoaderData } from "react-router-dom"


function App() {
  
  const user = useLoaderData()

  return (
    <div>
      <Navbar  />
     

      <div className="container">
      <Outlet context={[user]} />
      </div>

      {/* <footer>This is the footer</footer> */}
    </div>
  )
}

export default App;
