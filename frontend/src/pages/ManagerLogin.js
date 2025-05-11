import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
    Typography, 
    TextField, 
    Button, 
    MenuItem, 
    Select, 
    FormControl, 
    InputLabel, 
    Box 
} from "@mui/material";
import axios from "axios";

const ManagerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${
            process.env.REACT_APP_API_URL
        }/auth/manager-login`, 
        {
            email,
            password,
            role,
        }
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        if (role === "productManager") {
          navigate("/product-manager");
        } else if (role === "salesManager") {
          navigate("/sales-manager");
        }
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "auto", padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Manager Login
      </Typography>
      {errorMessage && <Typography color="error">{errorMessage}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Role</InputLabel>
          <Select value={role} onChange={(e) => setRole(e.target.value)} required>
            <MenuItem value="productManager">Product Manager</MenuItem>
            <MenuItem value="salesManager">Sales Manager</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
      </form>
    </Box>
  );
};

export default ManagerLogin;