import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const mockOrders = [
  { id: 1, name: "Yellow Dress", price: "$49.99", time: "2025-03-29 10:30", status: "Delivered" },
  { id: 2, name: "Dark Jeans", price: "$29.99", time: "2025-03-28 15:20", status: "Shipped" },
  { id: 3, name: "Light Jeans", price: "$79.99", time: "2025-03-27 18:00", status: "Processing" },
];

const ProfilePage = () => {
  const navigate = useNavigate();

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
    </div>
  );
};

export default ProfilePage;