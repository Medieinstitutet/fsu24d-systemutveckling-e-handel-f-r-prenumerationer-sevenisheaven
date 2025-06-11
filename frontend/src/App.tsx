import { RouterProvider } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import { router } from "./Router";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <>
      <AuthProvider>
        <CartProvider>
          <RouterProvider basename={import.meta.env.BASE_URL} router={router}></RouterProvider>
        </CartProvider>
      </AuthProvider>
    </>
  );
}

export default App;
