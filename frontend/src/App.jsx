import react from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import NotFound from "./pages/NotFound"
import DashBoard from "./pages/Dashboard"
import ProtectedRoute from "./components/ProtectedRoute"

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

// Apenas para que seja obrigado a logar pós registro
function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/dashboard"
          element={
            <ProtectedRoute>

              <DashBoard />

            </ProtectedRoute>
          } />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterAndLogout/>} />
        <Route path="*" element={<NotFound />} />
      </Routes>

    </BrowserRouter>
  )
}

export default App
