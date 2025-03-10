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
import { useNavigate } from "react-router-dom";
import axios from "axios";
import zxcvbn from "zxcvbn"; // ✅ Strong password validation

const API_URL = process.env.REACT_APP_API_URL; // ✅ Load API URL from .env

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
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [emailError, setEmailError] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const validateInputs = () => {
    let isValid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      isValid = false;
    } else {
      setEmailError(false);
    }

    if (!password || zxcvbn(password).score < 2) {
      setPasswordError(true);
      isValid = false;
    } else {
      setPasswordError(false);
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateInputs()) return;

    try {
      await axios.post(
        `${API_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true } // ✅ Uses secure cookies
      );
      navigate("/dashboard"); // ✅ Redirect after login
    } catch (err) {
      setErrorMessage("Something went wrong. Please try again later.");
    }
  };

  return (
    <SignInContainer>
      <CssBaseline />
      <Card variant="outlined">
        <Typography component="h1" variant="h4" sx={{ textAlign: "center" }}>
          Sign in
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
              error={passwordError}
              helperText={passwordError ? "Password is too weak!" : ""}
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
            Sign in
          </Button>
          <Link href="#" variant="body2" sx={{ textAlign: "center" }}>
            Forgot your password?
          </Link>
        </Box>
        <Divider>or</Divider>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Button fullWidth variant="outlined" startIcon={<GoogleIcon />} onClick={() => alert("Sign in with Google")}>
            Sign in with Google
          </Button>
          <Typography sx={{ textAlign: "center" }}>
            Don’t have an account?{" "}
            <Link href="/signup" variant="body2">
              Sign up
            </Link>
          </Typography>
        </Box>
      </Card>
    </SignInContainer>
  );
}
