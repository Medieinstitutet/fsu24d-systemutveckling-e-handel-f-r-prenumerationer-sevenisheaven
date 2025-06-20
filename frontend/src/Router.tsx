import { createBrowserRouter } from "react-router-dom"; // recommended import path for react-router v6.4+
import ProtectedRoutes from "./components/ProtectedRoutes";
import { Admin } from "./pages/Admin";
import { AdminProducts } from "./pages/AdminProducts";
import { Home } from "./pages/Home";
import { Layout } from "./pages/Layout";
import { Product } from "./pages/Product";
import { Products } from "./pages/Products";
import { Subscription } from "./pages/Subscription";
import { NotFound } from "./pages/NotFound";
import { Login } from "./pages/Login";
import { MyPage } from "./pages/MyPage";
import { Blocked } from "./pages/Blocked";
import { Cart } from "./pages/Cart";
import { OrderConfirmation } from "./pages/OrderConfirmation";
import { ChangeSubscription } from "./components/ChangeSubscription";
import ResetPassword from "./pages/ResetPassword";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/blocked", element: <Blocked /> },
      { path: "/login", element: <Login /> },
      { path: "/subscription", element: <Subscription /> },
      { path: "/order-confirmation", element: <OrderConfirmation /> },
      { path: "/reset-password/:token", element: <ResetPassword />}
    ],
  },
  {
    element: (
      <ProtectedRoutes allowedRoles={["customer"]}>
        <Layout />
      </ProtectedRoutes>
    ),
    children: [
      { path: "/products", element: <Products /> },
      { path: "/products/:id", element: <Product /> },
      { path: "/my-page", element: <MyPage /> },
      { path: "/cart", element: <Cart />},
      { path: "/change_subscription", element: <ChangeSubscription />},
    ],
  },
  {
    element: (
      <ProtectedRoutes allowedRoles={["admin"]}>
        <Layout />
      </ProtectedRoutes>
    ),
    children: [
      { path: "/admin", element: <Admin /> },
      { path: "/admin/products", element: <AdminProducts /> },
    ],
  },
],
{
  basename: window.location.hostname === "medieinstitutet.github.io" ? '/fsu24d-systemutveckling-e-handel-f-r-prenumerationer-sevenisheaven/' : '/'
}
);
