"use client"

import { useState } from "react"
import { Box, Typography, Button, TextField, IconButton, MenuItem, Snackbar, Alert } from "@mui/material"
import { useNavigate } from "react-router-dom"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import elevanceLogo from "../assets/Elevance_logo.png"
import homeBg from "../assets/home-bg.jpg"

export default function LoginPage() {
  const navigate = useNavigate()
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [step, setStep] = useState(1)
  const [userId, setUserId] = useState("")
  const [role, setRole] = useState("user")
  const [availableRoles, setAvailableRoles] = useState(["user", "Admin"])
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ open: false, message: "", severity: "error" })
  const aplctnCd = "compintel" // Default application code

  const handleSSOClick = () => {
    setShowLoginForm(true)
    setError("")
  }

  // const handleBack = () => {
  //   setShowLoginForm(false)
  //   setStep(1)
  //   setUserId("")
  //   setRole("user")
  //   setPassword("")
  //   setError("")
  //   setUserName("")
  // }

  const handleValidateUser = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch(`http://localhost:8002/users/${userId}?aplctn_cd=${aplctnCd}&role=${role}`)

      if (response.ok) {
        const data = await response.json()
        console.log("[v0] User validation response:", data)

        if (data.userExists) {
          setUserName(data.userName)
          setAvailableRoles(data.availableRoles || [role])
          setStep(2) // Move to password step
          setToast({
            open: true,
            message: data.message || "User validated successfully",
            severity: "success",
          })
        } else {
          setToast({
            open: true,
            message: "User not found",
            severity: "error",
          })
        }
      } else {
        setToast({
          open: true,
          message: "Invalid user credentials. Please check your user ID and role.",
          severity: "error",
        })
      }
    } catch (err) {
      console.error("[v0] User validation error:", err)
      setToast({
        open: true,
        message: "Unable to validate user. Please try again.",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("http://localhost:8002/users/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
                    password: password,

        },
        body: JSON.stringify({
          user_id: userId,
          aplctn_cd: aplctnCd,
          role: role,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Login response:", data)

        const userInfo = {
          userId: data.userId,
          userName: userName,
          role: role,
          aplctnCd: aplctnCd,
        }

        localStorage.setItem("user", JSON.stringify(userInfo))

        window.dispatchEvent(new Event("userLoggedIn"))

        setToast({
          open: true,
          message: "Login successful! Redirecting...",
          severity: "success",
        })

        // Navigate to dashboard after brief delay
        setTimeout(() => {
          navigate("/dashboard")
        }, 1000)
      } else {
        const errorData = await response.json()
        setToast({
          open: true,
          message: errorData.message || "Invalid credentials. Please try again.",
          severity: "error",
        })
      }
    } catch (err) {
      console.error("[v0] Login error:", err)
      setToast({
        open: true,
        message: "Login failed. Please try again.",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCloseToast = () => {
    setToast({ ...toast, open: false })
  }

  const handleBackToStep1 = () => {
    setStep(1)
    setPassword("")
    setError("")
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          height: "60px",
          backgroundColor: "#1A3673",
          display: "flex",
          alignItems: "center",
          px: 3,
        }}
      >
        <Box
          component="img"
          src={elevanceLogo}
          alt="Elevance Health"
          sx={{
            height: 32,
            objectFit: "contain",
            filter: "brightness(1.1)",
          }}
        />
        <Box
          sx={{
            width: "1px",
            height: 30,
            backgroundColor: "white",
            mx: 2,
          }}
        />
        <Typography
          sx={{
            color: "white",
            fontSize: "1.4rem",
            fontWeight: 500,
            fontFamily: "IBM Plex Sans",
            lineHeight: "16px",
            letterSpacing: "0.32px",
          }}
        >
          MCM: Competitive Intelligence
        </Typography>
      </Box>

      {/* Background Image */}
      <Box
        sx={{
          position: "absolute",
          top: 60,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${homeBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Login Card */}
      <Box
        sx={{
          position: "absolute",
          width: "588px",
          minHeight: "375px",
          top: "324px",
          left: "780px",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          padding: "48px 33px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Shared Header Section */}
        <Typography
          sx={{
            fontSize: "36px",
            color: "#002D9C",
            mb: 1,
            textAlign: "center",
            fontWeight: 400,
            fontFamily: "IBM Plex Sans",
            lineHeight: "50px",
            letterSpacing: "0px",
          }}
        >
          Welcome to
        </Typography>
        <Typography
          sx={{
            fontWeight: 700,
            mb: 4,
            textAlign: "center",
            fontSize: "36px",
            color: "#002D9C",
            fontFamily: "IBM Plex Sans",
            lineHeight: "50px",
            letterSpacing: "0px",
          }}
        >
          MCM: Competitive Intelligence
        </Typography>

        {/* Conditional Rendering of SSO Button or Login Form */}
        {!showLoginForm ? (
          <>
            <Button
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              onClick={handleSSOClick}
              sx={{
                backgroundColor: "#0F62FE",
                color: "white",
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 500,
                py: 1.5,
                px: 4,
                width: "100%",
                borderRadius: "0px",
                "&:hover": {
                  backgroundColor: "#2563eb",
                },
              }}
            >
              Continue with single sign-on (SSO)
            </Button>
            <Typography
              sx={{
                mt: 3,
                fontSize: "0.875rem",
                color: "#666",
              }}
            >
              Need help? Contact{" "}
              <Typography
                component="span"
                sx={{
                  color: "#2563eb",
                  cursor: "pointer",
                  textDecoration: "underline",
                  "&:hover": {
                    color: "#1d4ed8",
                  },
                }}
              >
                Administrator
              </Typography>
            </Typography>
          </>
        ) : (
          <Box sx={{ width: "100%" }}>
            {step === 1 && (
              <Box component="form" onSubmit={handleValidateUser}>
                {/* <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    mb: 2,
                  }}
                >
                  <IconButton
                    onClick={handleBack}
                    sx={{
                      color: "#2563eb",
                      "&:hover": {
                        backgroundColor: "rgba(37, 99, 235, 0.1)",
                        color: "#1d4ed8",
                      },
                    }}
                    aria-label="Back to SSO"
                  >
                    <ArrowBackIcon />
                  </IconButton>
                </Box> */}

                <TextField
                  fullWidth
                  label="User ID"
                  variant="outlined"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                  size="small"
                  sx={{
                    mb: 1.5,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 0,
                    },
                  }}
                />

                <TextField
                  fullWidth
                  select
                  label="Role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  size="small"
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 0,
                    },
                  }}
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                </TextField>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{
                    backgroundColor: "#0F62FE",
                    color: "white",
                    textTransform: "none",
                    fontSize: "1rem",
                    fontWeight: 500,
                    borderRadius: "0px",
                    py: 1.2,
                    "&:hover": {
                      backgroundColor: "#1d4ed8",
                    },
                    "&:disabled": {
                      backgroundColor: "#cbd5e1",
                    },
                  }}
                >
                  {loading ? "Validating..." : "Next"}
                </Button>

                <Typography
                  sx={{
                    mt: 3,
                    fontSize: "0.875rem",
                    color: "#666",
                    textAlign: "center",
                  }}
                >
                  Need help? Contact{" "}
                  <Typography
                    component="span"
                    sx={{
                      color: "#2563eb",
                      cursor: "pointer",
                      textDecoration: "underline",
                      "&:hover": {
                        color: "#1d4ed8",
                      },
                    }}
                  >
                    Administrator
                  </Typography>
                </Typography>
              </Box>
            )}

            {step === 2 && (
              <Box component="form" onSubmit={handleLogin}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    mb: 2,
                  }}
                >
                  <IconButton
                    onClick={handleBackToStep1}
                    sx={{
                      color: "#2563eb",
                      "&:hover": {
                        backgroundColor: "rgba(37, 99, 235, 0.1)",
                        color: "#1d4ed8",
                      },
                    }}
                    aria-label="Back to user validation"
                  >
                    <ArrowBackIcon />
                  </IconButton>
                </Box>

                <Typography
                  sx={{
                    mb: 2,
                    fontSize: "0.875rem",
                    color: "#666",
                  }}
                >
                  Welcome, <strong>{userName}</strong>
                </Typography>

                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  size="small"
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 0,
                    },
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{
                    backgroundColor: "#0F62FE",
                    color: "white",
                    textTransform: "none",
                    fontSize: "1rem",
                    fontWeight: 500,
                    borderRadius: "0px",
                    py: 1.2,
                    "&:hover": {
                      backgroundColor: "#1d4ed8",
                    },
                    "&:disabled": {
                      backgroundColor: "#cbd5e1",
                    },
                  }}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>

                <Typography
                  sx={{
                    mt: 3,
                    fontSize: "0.875rem",
                    color: "#666",
                    textAlign: "center",
                  }}
                >
                  Need help? Contact{" "}
                  <Typography
                    component="span"
                    sx={{
                      color: "#2563eb",
                      cursor: "pointer",
                      textDecoration: "underline",
                      "&:hover": {
                        color: "#1d4ed8",
                      },
                    }}
                  >
                    Administrator
                  </Typography>
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseToast} severity={toast.severity} sx={{ width: "100%" }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
