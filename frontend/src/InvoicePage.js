import React from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Paper } from "@mui/material";

const InvoicePage = () => {
  const { orderId } = useParams();

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Payment Completed
        </Typography>
        <Typography variant="h6" gutterBottom>
          Thank you for your order!
        </Typography>
        <Typography variant="body1">
          Your order number is <b>{orderId}</b>.
        </Typography>
        <Typography variant="body2" sx={{ mt: 2 }}>
          You will receive an email with your invoice and delivery details.
        </Typography>
      </Paper>
    </Box>
  );
};

export default InvoicePage;