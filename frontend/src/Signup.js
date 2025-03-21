import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Button, CssBaseline, Divider, FormControl, FormLabel, Link, TextField, Typography, Stack, Card as MuiCard } from "@mui/material";
import { styled } from "@mui/material/styles";
import zxcvbn from "zxcvbn";

const API_URL = process.env.REACT_APP_API_URL;

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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validateInputs = () => {
    if (!name || name.length < 3) {
      setErrorMessage("Name must be at least 3 characters long.");
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
      // await axios.post(
      //   `${API_URL}/api/auth/signup`, 
      //   { name, email, password }, 
      //   { withCredentials: true }
      // );


      await axios.post(
        `${API_URL}/register`, 
        { name, email, password }, 
        { withCredentials: true }
      );
      navigate("/dashboard");
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SignUpContainer>
      <CssBaseline />
      <Card variant="outlined">
        <Typography component="h1" variant="h4" sx={{ textAlign: "center" }}>
          Sign Up
        </Typography>
        {errorMessage && <Typography color="error">{errorMessage}</Typography>}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <TextField type="text" required fullWidth value={name} onChange={(e) => setName(e.target.value)} />
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
          <Link href="/" variant="body2">
            Log In
          </Link>
        </Typography>
      </Card>
    </SignUpContainer>
  );
}