import { createBrowserRouter } from "react-router";
import ProtectedRoutes from "./components/ProtectedRoutes";
import { Admin } from "./pages/Admin";
import { AdminProducts } from "./pages/AdminProducts";
import { Home } from "./pages/Home";
import { Layout } from "./pages/Layout";
import { LayoutAdmin } from "./pages/LayoutAdmin";
import { OrderConfirmation } from "./pages/OrderConfirmation";
import { Product } from "./pages/Product";
import { Products } from "./pages/Products";
import { Subscription } from "./pages/Subscription";
import { NotFound } from "./pages/NotFound";
import { Login } from "./pages/Login";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        errorElement: <NotFound />,
        children: [
          {
            path: "/",
            element: <Home />,
          },
          {
            path: "/login",
            element: <Login />,
          },
          {
            path: "/products",
            element: <Products />,
          },
          {
            path: "/products/:id",
            element: <Product />,
          },
          {
            path: "/subscription",
            element: <Subscription />,
          },
          {
            path: "/order-confirmation",
            element: <OrderConfirmation />,
          },
          {
            path: "/admin",
            element: <Admin />,
          },
        ],
      },
      {
        path: "/",
        element: <ProtectedRoutes><LayoutAdmin /></ProtectedRoutes>,
        errorElement: <NotFound />,
        children: [
        {
          path: "admin/products",
          element: <AdminProducts />,
        }
        ]
  }
])