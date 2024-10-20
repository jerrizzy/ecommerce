import './App.css';
import Navbar from "./components/Navbar";
import Footer from './components/Footer';
import { Outlet, useLoaderData } from "react-router-dom"


function App() {
  
  const user = useLoaderData()

  return (
    <div>
      <Navbar  />
     

      <div className="container">
      <Outlet context={[user]} />
      </div>

      <Footer />
    </div>
  )
}

export default App;
