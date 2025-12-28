"use client"

import { Box } from "@mui/material"
import TopNavbar from "./components/Navbar/TopNavbar.jsx"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import DashboardPage from "./pages/DashboardPage.jsx"
import NewHypothesis from "./pages/NewHypothesis.jsx"
import Login from "./pages/Login.jsx"
import { useState, useEffect } from "react"

function ProtectedRoute({ children }) {
  const user = localStorage.getItem("user")
  return user ? children : <Navigate to="/" replace />
}

export default function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    // Listen for storage changes (e.g., login from LoginPage)
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      } else {
        setUser(null)
      }
    }

    window.addEventListener("storage", handleStorageChange)

    const handleLogin = () => {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    }

    window.addEventListener("userLoggedIn", handleLogin)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("userLoggedIn", handleLogin)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
    window.location.href = "/"
  }

  return (
    <Box sx={{ width: "100%", margin: 0, padding: 0 }}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <>
                  <TopNavbar userName={user?.userName || "User"} onLogoutClick={handleLogout} />
                  <DashboardPage />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/new"
            element={
              <ProtectedRoute>
                <>
                  <TopNavbar userName={user?.userName || "User"} onLogoutClick={handleLogout} />
                  <NewHypothesis />
                </>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </Box>
  )
}
