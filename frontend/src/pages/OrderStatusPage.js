import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  List,
  ListItem,
  ListItemText,
  Button,
  Paper,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton, 
  Snackbar,
  Alert,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  LocalShipping as LocalShippingIcon,
  DoneAll as DoneAllIcon,
} from "@mui/icons-material";
import axios from "axios";
import Footer from "../components/Footer";
import "./OrderStatusPage.css";

const API_URL = process.env.REACT_APP_API_URL;

// Define the standard status steps for the stepper
const statusSteps = ["processing", "in-transit", "delivered"];

// Custom Step Icon Component for the Stepper
// This component will render different icons based on step status and order cancellation.
const CustomStepIcon = ({ active, completed, icon, error, orderStatus }) => {
  // Styles for the icons
  const iconStyles = {
    fontSize: 24, // Adjusted for the stepper icon
    color: "#9e9e9e", // Default grey
  };

  // Render a red 'X' icon if the order is cancelled and this is the first step
  if (orderStatus === 'cancelled' && icon === 1) {
    return <CancelIcon sx={{ ...iconStyles, color: "#f44336" }} />; // Red color for cancelled
  }

  // Render standard icons based on step completion/activity
  switch (icon) {
    case 1: // Processing step
      return <CheckCircleIcon sx={{ ...iconStyles, color: completed || active ? "#4caf50" : "#9e9e9e" }} />;
    case 2: // In-transit step
      return <LocalShippingIcon sx={{ ...iconStyles, color: completed || active ? "#ff9800" : "#9e9e9e" }} />;
    case 3: // Delivered step
      return <DoneAllIcon sx={{ ...iconStyles, color: completed || active ? "#2196f3" : "#9e9e9e" }} />;
    default:
      return null;
  }
};


const OrderStatusPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [cancelMessage, setCancelMessage] = useState({ type: '', text: '' }); // type: 'success' or 'error'

  // Effect to fetch order details when the component mounts or orderId changes
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true); // Set loading to true before fetching
        const response = await axios.get(`${API_URL}/orders/with-items/${orderId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setOrderDetails(response.data);
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error("Error loading order details:", err);
        setError("Error loading order details. Please try again.");
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const calculateEstimatedDelivery = (orderDate) => {
    if (!orderDate) {
      console.error("orderDate is undefined or invalid:", orderDate);
      return null;
    }
    const date = new Date(orderDate);
    if (isNaN(date)) {
      console.error("Invalid date:", orderDate);
      return null;
    }
    date.setDate(date.getDate() + 7);
    return date;
  };

  // Function to format a date string into DD/MM/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`; 
  };

  // Handler for when the "Cancel Order" button is clicked
  const handleCancelOrderClick = () => {
    if (orderDetails.order.status.toLowerCase() !== 'processing') {
      // If order is not 'processing', show an error message
      setCancelMessage({ type: 'error', text: "Order cannot be cancelled. Only processing orders are eligible for cancellation." });
    } else {
      // If eligible, show the confirmation pop-up
      setShowCancelConfirmation(true);
    }
  };

  // Handler for confirming the cancellation in the pop-up
  const handleConfirmCancel = async () => {
    setShowCancelConfirmation(false); // Close the confirmation pop-up
    setLoading(true); // Show loading indicator

    try {
      await axios.patch(`${API_URL}/orders/${orderId}/cancel`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // Update the order status in the local state to 'cancelled'
      setOrderDetails(prevDetails => ({
        ...prevDetails,
        order: {
          ...prevDetails.order,
          status: 'cancelled'
        }
      }));
      // Changed the success message here
      setCancelMessage({ type: 'success', text: "Order cancelled successfully." });
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error("Error cancelling order:", err);
      const errorMessage = err.response?.data?.message || "Failed to cancel order. Please try again.";
      setCancelMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  // Handler for closing the confirmation pop-up without cancelling
  const handleCloseConfirmation = () => {
    setShowCancelConfirmation(false);
  };

  // Handler for closing the Snackbar message
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setCancelMessage({ type: '', text: '' });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error" sx={{ textAlign: 'center', mt: 4 }}>{error}</Typography>;
  }


  if (!orderDetails) {
    return <Typography sx={{ textAlign: 'center', mt: 4 }}>No order details available.</Typography>;
  }

  const { order, items } = orderDetails;
  const estimatedDelivery = calculateEstimatedDelivery(order.order_date);

  // Determine the active step for the stepper
  // If order is cancelled, set activeStep to -1 so no step is "active" in the linear flow,
  // but we'll use the error prop on the first step to show the 'X'.
  const currentStep = statusSteps.indexOf(order.status.toLowerCase());

  return (
    <>
      <div className="order-status-container">
        <Box sx={{ maxWidth: 800, mx: "auto", p: 4 }}>
          <Paper elevation={3} className="order-status-paper">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Order Details
              </Typography>
              {/* Cancel Order Button */}
              {order.status.toLowerCase() !== 'cancelled' && ( // Only show if not already cancelled
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleCancelOrderClick}
                  sx={{ ml: 'auto' }} // Pushes the button to the right
                >
                  Cancel Order
                </Button>
              )}
            </Box>

            {/* Display cancellation message (error or success) */}
            {cancelMessage.text && (
              <Alert severity={cancelMessage.type} sx={{ mb: 2 }}>
                {cancelMessage.text}
              </Alert>
            )}

            <Typography>Order Number: {order.order_id}</Typography>
            <Typography>Order Date: {formatDate(order.order_date)}</Typography>
            <Typography>Total Price: ${order.total_price}</Typography>
            {/* Display current order status */}
            <Typography>Order Status: <span style={{ fontWeight: 'bold', color: order.status.toLowerCase() === 'cancelled' ? '#f44336' : 'inherit' }}>{order.status}</span></Typography>

            <Box sx={{ my: 4 }}>
              {/* Conditionally render Stepper or a simple "Cancelled" message */}
              {order.status.toLowerCase() !== 'cancelled' ? (
                <Stepper activeStep={currentStep} alternativeLabel>
                  {statusSteps.map((label) => (
                    <Step key={label}>
                      <StepLabel
                        StepIconComponent={(props) => (
                          <CustomStepIcon
                            {...props}
                            orderStatus={order.status.toLowerCase()}
                          />
                        )}
                      >
                        {label.charAt(0).toUpperCase() + label.slice(1)}
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              ) : (
                // Custom display for cancelled order
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
                  <CancelIcon sx={{ fontSize: 48, color: "#f44336", mb: 1 }} /> {/* Adjusted font size here */}
                  <Typography variant="h5" color="error">Order Cancelled</Typography>
                </Box>
              )}
            </Box>

            <Typography variant="h6" gutterBottom>
              Shipping Information
            </Typography>
            <Typography>Delivery Address: {order.delivery_address}</Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Items in Order
            </Typography>
            <List>
              {items.map((item) => (
                <ListItem key={item.order_item_id}>
                  <ListItemText
                    primary={`${item.product_name} (x${item.quantity})`}
                    secondary={`Price at Purchase: $${item.price_at_purchase}`}
                  />
                </ListItem>
              ))}
            </List>

            <Typography variant="h6" gutterBottom>
              Estimated Delivery
            </Typography>
            <Typography>
              {estimatedDelivery ? formatDate(estimatedDelivery) : "N/A"}
            </Typography>

            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/")}
                sx={{ flex: 1 }}
              >
                Back to Home
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#9c27b0", 
                  color: "#fff",
                  flex: 1,
                  "&:hover": { backgroundColor: "#7b1fa2" }, 
                }}
                onClick={() => navigate("/profile")}
              >
                Back to Profile
              </Button>
            </Box>
          </Paper>
        </Box>
      </div>

      <Footer />

      {/* Confirmation Dialog for Cancellation */}
      <Dialog
        open={showCancelConfirmation}
        onClose={handleCloseConfirmation}
        aria-labelledby="cancel-order-dialog-title"
        aria-describedby="cancel-order-dialog-description"
      >
        <DialogTitle id="cancel-order-dialog-title">Confirm Order Cancellation</DialogTitle>
        <DialogContent>
          <DialogContentText id="cancel-order-dialog-description">
            Are you sure you want to cancel this order? This action cannot be undone, and the order will be marked as 'cancelled'.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmation} color="primary">
            No, Keep Order
          </Button>
          <Button onClick={handleConfirmCancel} color="error" autoFocus>
            Yes, Cancel Order
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OrderStatusPage;
