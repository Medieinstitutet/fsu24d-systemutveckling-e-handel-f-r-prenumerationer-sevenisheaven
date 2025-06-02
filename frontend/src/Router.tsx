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
import { MyPage } from "./pages/MyPage";
import { Blocked } from "./pages/Blocked";

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
            path: "/blocked",
            element: <Blocked />,
          },
          {
            path: "/login",
            element: <Login />,
          },
          {
            path: "/subscription",
            element: <Subscription />,
          },
          {
            path: "/order-confirmation",
            element: <OrderConfirmation />,
          },
        ],
      },
      {
        path: "/",
        element: <ProtectedRoutes><Layout /></ProtectedRoutes>,
        errorElement: <NotFound />,
        children: [
          {
            path: "/products",
            element: <Products />,
          },
          {
            path: "/products/:id",
            element: <Product />,
          },
          {
            path: "/my-page",
            element: <MyPage />,
          },
        ]
      },
      {
        path: "/",
        element: <ProtectedRoutes><LayoutAdmin /></ProtectedRoutes>,
        errorElement: <NotFound />,
        children: [
          {
            path: "admin/products",
            element: <AdminProducts />,
          },
          {
            path: "/admin",
            element: <Admin />,
          },
        ]
      }
    ])