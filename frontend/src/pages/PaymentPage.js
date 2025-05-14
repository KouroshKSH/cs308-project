import React, { useState } from "react";
import { Box, Paper, Typography, Button, TextField, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

const PaymentConfirmationPage = () => {
  const navigate = useNavigate();
  const [smsCode, setSmsCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {
    if (smsCode !== "6174") {
      alert("Incorrect SMS code. Please try again.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      navigate("/"); // ✅ redirect to home page
    }, 2000);
  };

  const handleCancel = () => {
    navigate("/"); // Cancel also returns to home
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", p: 4, mt: 8 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom color="primary">
          Mock Bank
        </Typography>

        <Typography variant="subtitle1" sx={{ my: 2 }}>
          Amount: <strong>$119.97</strong>
        </Typography>

        <Typography variant="subtitle2" sx={{ mb: 3 }}>
          Card: **** **** **** 1234
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
          Please enter the 4-digit code sent via SMS
        </Typography>

        <TextField
          label="SMS Code"
          value={smsCode}
          onChange={(e) => setSmsCode(e.target.value)}
          fullWidth
          margin="normal"
          inputProps={{ maxLength: 4 }}
        />

        {loading ? (
          <CircularProgress sx={{ mt: 3 }} />
        ) : (
          <>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ mt: 2 }}
              onClick={handleConfirm}
            >
              Confirm Payment
            </Button>

            <Button
              variant="text"
              color="secondary"
              fullWidth
              sx={{ mt: 1 }}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default PaymentConfirmationPage;
