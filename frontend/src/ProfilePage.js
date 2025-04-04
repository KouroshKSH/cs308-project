import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box
} from "@mui/material";
import axios from "axios";

const mockOrders = [
  { id: 1, name: "Yellow Dress", price: "$49.99", time: "2025-03-29 10:30", status: "Delivered" },
  { id: 2, name: "Dark Jeans", price: "$29.99", time: "2025-03-28 15:20", status: "Shipped" },
  { id: 3, name: "Light Jeans", price: "$79.99", time: "2025-03-27 18:00", status: "Processing" },
];

const ProfilePage = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null); // State to store user info
  const [error, setError] = useState("");

  // Fetch user info on component mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users/profile", {
          withCredentials: true, // Ensure cookies are sent
        });
        // print the response data
        console.log("User Info:", response.data);
        setUserInfo(response.data);
      } catch (err) {
        // print the error response
        console.error("Error fetching user info:", err.response?.data);
        setError(err.response?.data?.message || "Failed to fetch user info");
      }
    };
    // const fetchUserInfo = async () => {
    //   try {
    //     const response = await axios.get("http://localhost:5000/api/users/profile", { withCredentials: true });
    //     setUserInfo(response.data);
    //   } catch (err) {
    //     setError(err.response?.data?.message || "Failed to fetch user info");
    //   }
    // };

    fetchUserInfo();
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Handle navigation to home
  const handleBackToHome = () => {
    navigate("/");
  };

  // Handle navigation to checkout
  const handleGoToCheckout = () => {
    // TODO: checkout should show the actual content of cart, this is static
    navigate("/checkout");
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>


      <Button variant="outlined" color="primary" onClick={handleBackToHome}>
        Back to Home
      </Button>


      <Button variant="contained" color="secondary" onClick={handleLogout} style={{ marginLeft: "10px" }}>
        Logout
      </Button>


      <Button variant="contained" color="primary" onClick={handleGoToCheckout} style={{ marginLeft: "10px" }}>
        Go to Checkout Screen
      </Button>

      {/* Order History Section (Static for now) */}
      <Typography variant="h6" style={{ marginTop: "20px" }}>
        Order History
      </Typography>
      <TableContainer component={Paper} style={{ marginTop: "10px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Time of Order</TableCell>
              <TableCell>Status of Delivery</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.name}</TableCell>
                <TableCell>{order.price}</TableCell>
                <TableCell>{order.time}</TableCell>
                <TableCell>{order.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* User Info Section (should fetch from backend per user)*/}
      <Box style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
        <Typography variant="h6">User Information</Typography>
        {error ? (
          <Typography color="error">{error}</Typography>
        ) : userInfo ? (
          <div>
            <Typography><strong>Username:</strong> {userInfo.username}</Typography>
            <Typography><strong>Email:</strong> {userInfo.email}</Typography>
            <Typography><strong>Address:</strong> {userInfo.address}</Typography>
            <Typography><strong>Phone Number:</strong> {userInfo.phone_number}</Typography>
          </div>
        ) : (
          <Typography>Loading...</Typography>
        )}
      </Box>
    </div>
  );
};

export default ProfilePage;