import * as React from "react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Box, Button, CssBaseline, Divider, FormControl, FormLabel, Link, TextField, Typography, Stack, Card as MuiCard } from "@mui/material";
import { styled } from "@mui/material/styles";
import zxcvbn from "zxcvbn";
import { getOrCreateSessionId } from "../utils/sessionStorage";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/api";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(2),
}));

export default function SignUp() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validateInputs = () => {
    if (!username || username.length < 3) {
      setErrorMessage("Your username must be at least 3 characters long.");
      return false;
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage("Enter a valid email.");
      return false;
    }
    if (!password || zxcvbn(password).score < 2) {
      setErrorMessage("Password is too weak.");
      return false;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return false;
    }
    return true;
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateInputs()) return;
    setLoading(true);
    setErrorMessage("");

    try {
      // First, register the user
      const sessionId = getOrCreateSessionId();
      const registerResponse = await axios.post(
        `${API_URL}/auth/register`,
        { username, email, password },
        {
          withCredentials: true,
          headers: { "x-session-id": sessionId }
        }
      );

      // If the registration response includes a token, store it; otherwise, perform login.
      if (registerResponse.data.token) {
        localStorage.setItem("token", registerResponse.data.token);
      } else {
        // Auto login: call the login endpoint so that you obtain a token.
        const loginResponse = await axios.post(
          `${API_URL}/auth/login`,
          { email, password },
          { withCredentials: true }
        );
        if (loginResponse.data.token) {
          localStorage.setItem("token", loginResponse.data.token);
        } else {
          throw new Error("Token not received on login.");
        }
      }
      // Redirect to intended page or default to profile
      const redirectTo = location.state?.redirectTo || "/profile";
      navigate(redirectTo);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    // Clear inputs and redirect to landing page
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    navigate("/");
  };

  return (
    <SignUpContainer>
      {/* Back to Home Button */}
      <Button
        variant="outlined"
        color="primary"
        onClick={handleBackToHome}
        sx={{ position: "absolute", top: 20, left: 20 }}
      >
        Back to Home
      </Button>

      {/* Sign Up Form */}
      <CssBaseline />
      <Card variant="outlined">
        <Typography component="h1" variant="h4" sx={{ textAlign: "center" }}>
          Sign Up
        </Typography>
        {errorMessage && <Typography color="error">{errorMessage}</Typography>}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <FormControl>
            <FormLabel>Userame</FormLabel>
            <TextField type="text" required fullWidth value={username} onChange={(e) => setUsername(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <TextField type="email" required fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <TextField type="password" required fullWidth value={password} onChange={(e) => setPassword(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>Confirm Password</FormLabel>
            <TextField type="password" required fullWidth value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </FormControl>
          <Button type="submit" fullWidth variant="contained" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </Box>
        <Divider>or</Divider>
        <Typography sx={{ textAlign: "center" }}>
          Already have an account? {" "}
          <Link href="/login" variant="body2">
            Log In
          </Link>
        </Typography>
      </Card>
    </SignUpContainer>
  );
}