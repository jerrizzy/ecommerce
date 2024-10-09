import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ErrorPage from './components/ErrorPage'
import Home from './components/Home'
import About from './components/About'
import Contact from './components/Contact'
import ProductList from './components/ProductList'
import ProductPage from './components/ProductPage'
import NewProduct from './components/NewProduct.jsx'
import Cart from './components/Cart'
import Login from './components/Login'
import Logout from './components/Logout'
import './index.css'
import { 
  userLoader,
  productListLoader,
  productPageLoader,
  newProductLoader,
} from './loaders.js'
import { createBrowserRouter, RouterProvider } from "react-router-dom"


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    loader: userLoader,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/about',
        element: <About />
      },
      {
        path: '/contact',
        element: <Contact />
      },
      {
        path: '/cart',
        element: <Cart />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/logout',
        element: <Logout />
      },
      {
        path: '/productpage/:id',
        element: <ProductPage />,
        loader: productPageLoader
      },
      {
        path: '/products',
        element: <ProductList />,
        loader: productListLoader
      },
      {
        path: '/newproducts',
        element: <NewProduct />,
        loader: newProductLoader
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
