import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation

import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import { Google as GoogleIcon } from "@mui/icons-material";
import axios from "axios";
import { getOrCreateSessionId } from "./utils/sessionStorage";

const API_URL = process.env.REACT_APP_API_URL; // Load API URL from .env

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

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(2),
}));

export default function Login() {
  const navigate = useNavigate();
  // const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const setIsLoggedIn = React.useState(false)[1]; // Use state setter function
  const location = useLocation(); // Access the state passed via navigate
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [emailError, setEmailError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const validateInputs = () => {
    let isValid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      isValid = false;
    } else {
      setEmailError(false);
    }

    // we do not need to check password strong here

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateInputs()) return;
  
    try {
      const sessionId = getOrCreateSessionId();
      const response = await axios.post(
        `${API_URL}/auth/login`,
        { email, password },
        {
          headers: { "x-session-id": sessionId },
          withCredentials: true
        }
      );

      // console.log("Token saved to localStorage:", response.data.token); // for logging

      // Check if the response contains a token
      if (response.data.token) {
        localStorage.setItem('token', response.data.token); // Save the token
        setIsLoggedIn(true); // Trigger state update
        setErrorMessage(''); // Clear any previous error messages
        // OLD: navigate('/dashboard'); // Redirect to the dashboard

        // Redirect to the intended page or default to the profile page
        const redirectTo = location.state?.redirectTo || "/profile"; // or checkout page
        console.log("Redirecting to:", redirectTo); // for logging
        navigate(redirectTo);
      } else {
        setErrorMessage('Login failed. No token received.');
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setErrorMessage('User not found');
      } else if (err.response && err.response.status === 401) {
        setErrorMessage('Invalid password');
      } else {
        setErrorMessage('Something went wrong. Please try again later.');
      }
    }
  };

  const handleBackToHome = () => {
    // Clear inputs and redirect to landing page
    setEmail("");
    setPassword("");
    navigate("/");
  };

  return (
    <SignInContainer>
      {/* Back to Home Button */}
      <Button
        variant="outlined"
        color="primary"
        onClick={handleBackToHome}
        sx={{ position: "absolute", top: 20, left: 20 }}
      >
        Back to Home
      </Button>
      <CssBaseline />
      <Card variant="outlined">
        <Typography component="h1" variant="h4" sx={{ textAlign: "center" }}>
          Log In
        </Typography>
        {errorMessage && <Typography color="error">{errorMessage}</Typography>}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <TextField
              error={emailError}
              helperText={emailError ? "Enter a valid email" : ""}
              type="email"
              name="email"
              placeholder="your@email.com"
              required
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <TextField
              type="password"
              name="password"
              placeholder="••••••"
              required
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
          <Button type="submit" fullWidth variant="contained">
            Log In
          </Button>
          <Link href="#" variant="body2" sx={{ textAlign: "center" }}>
            Forgot your password?
          </Link>
        </Box>
        <Divider>or</Divider>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Button fullWidth variant="outlined" startIcon={<GoogleIcon />} onClick={() => alert("Log In with Google")}>
            Log In with Google
          </Button>
          <Typography sx={{ textAlign: "center" }}>
            Don't have an account?{" "}
            <Link href="/signup" variant="body2">
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Card>
    </SignInContainer>
  );
}