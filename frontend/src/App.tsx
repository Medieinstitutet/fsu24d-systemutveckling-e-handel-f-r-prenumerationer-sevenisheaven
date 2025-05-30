import { RouterProvider } from "react-router"
import { AuthProvider } from "./context/AuthContext"
import { router } from "./Router"

function App() {

  return (
    <>
     <AuthProvider>
          <RouterProvider router={router}></RouterProvider>
      </AuthProvider>
    </>
  )
}

export default App
