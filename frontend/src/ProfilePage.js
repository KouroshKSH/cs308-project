import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import axios from "axios";

const mockOrders = [
  { id: 1, name: "Yellow Dress", price: "$49.99", time: "2025-03-29 10:30", status: "Delivered" },
  { id: 2, name: "Dark Jeans", price: "$29.99", time: "2025-03-28 15:20", status: "Shipped" },
  { id: 3, name: "Light Jeans", price: "$79.99", time: "2025-03-27 18:00", status: "Processing" },
];

// Base URL for the API
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleGoToCheckout = () => {
    navigate("/checkout");
  };

  // get the user's info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        // const response = await axios.get("http://localhost:5000/api/users/profile", {
        //   headers: { Authorization: `Bearer ${token}` },
        // });
        const response = await axios.get(`${BASE_URL}/users/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserInfo(response.data);
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    };

    fetchUserInfo();
  }, []);

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

      {/* show the user's past orders */}
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

      {/* show the user's info */}
      <Typography variant="h6" style={{ marginTop: "20px" }}>
        User Info
      </Typography>
      {userInfo ? (
        <div style={{ marginTop: "10px" }}>
          <Typography variant="body1">Username: {userInfo.username}</Typography>
          <Typography variant="body1">Email: {userInfo.email}</Typography>
          <Typography variant="body1">Address: {userInfo.address || "N/A"}</Typography>
          <Typography variant="body1">Phone Number: {userInfo.phone_number || "N/A"}</Typography>
        </div>
      ) : (
        <Typography variant="body2">Loading user info...</Typography>
      )}
    </div>
  );
};

export default ProfilePage;