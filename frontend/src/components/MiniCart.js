import React, { useEffect, useState } from "react";
import { 
    Menu, 
    MenuItem, 
    Button, 
    Typography, 
    Box,
    CircularProgress,
    IconButton
} from "@mui/material";
import { getOrCreateSessionId } from "../utils/sessionStorage";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const MiniCart = ({ anchorEl, open, onClose }) => {
  const [cart, setCart] = useState({ items: [], total_price: 0 });
  const [loading, setLoading] = useState(true);

  // item index for which action is loading
  const [actionLoading, setActionLoading] = useState(null);
  const navigate = useNavigate();

  // get the content of the cart from the DB
  const fetchCart = async () => {
    setLoading(true);
    try {
      const sessionId = getOrCreateSessionId();
      const token = localStorage.getItem("token");
      const headers = { "x-session-id": sessionId };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await axios.get(`${API_URL}/cart`, { headers });
      setCart(res.data);
    } catch (err) {
      setCart({ items: [], total_price: 0 });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (open) fetchCart();
    // eslint-disable-next-line
  }, [open]);

  // Handlers for plus, minus, remove
  const handleUpdateQuantity = async (item, newQty, idx) => {
    if (newQty < 1) return;
    setActionLoading(idx);
    try {
      const sessionId = getOrCreateSessionId();
      const token = localStorage.getItem("token");
      const headers = { "x-session-id": sessionId };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      await axios.put(`${API_URL}/cart/update`, {
        product_id: item.product_id,
        variation_id: item.variation_id,
        quantity: newQty,
      }, { headers });
      await fetchCart();
    } catch (err) {
      console.error("Failed to update quantity:", err);
      alert("An error occurred while updating the cart. Please try again.");
    }
    setActionLoading(null);
  };

  const handleRemove = async (item, idx) => {
    setActionLoading(idx);
    try {
      const sessionId = getOrCreateSessionId();
      const token = localStorage.getItem("token");
      const headers = { "x-session-id": sessionId };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      await axios.delete(`${API_URL}/cart/remove`, {
        headers,
        data: {
          product_id: item.product_id,
          variation_id: item.variation_id,
        },
      });
      await fetchCart();
    } catch (err) {
      console.error("Failed to remove item:", err);
      alert("An error occurred while removing the item. Please try again.");
      throw new Error("Failed to remove item from cart");
    }
    setActionLoading(null);
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
    >
      {loading ? (
        <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
          <CircularProgress size={24} />
        </Box>
      ) : cart.items.length === 0 ? (
        <MenuItem>Your cart is empty</MenuItem>
      ) : (
        <>
          {cart.items.map((item, idx) => (
            <MenuItem key={idx} sx={{ whiteSpace: "normal", alignItems: "flex-start" }}>
              <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" fontWeight="bold">
                    {item.name} - {item.size_name} / {item.color_name}
                    </Typography>
                  <Typography variant="body2">
                    ${item.price} (x{item.quantity})
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleUpdateQuantity(item, item.quantity - 1, idx)}
                    disabled={actionLoading === idx || item.quantity <= 1}
                    title="Decrease"
                  >
                    ➖
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleUpdateQuantity(item, item.quantity + 1, idx)}
                    disabled={actionLoading === idx}
                    title="Increase"
                  >
                    ➕
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleRemove(item, idx)}
                    disabled={actionLoading === idx}
                    title="Remove"
                  >
                    🗑️
                  </IconButton>
                </Box>
              </Box>
            </MenuItem>
          ))}
          <MenuItem divider>
            <Typography variant="subtitle2" sx={{ flex: 1 }}>
              Total: ${cart.total_price}
            </Typography>
          </MenuItem>
          <MenuItem>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => {
                onClose();
                navigate("/checkout");
              }}
            >
              Check Out
            </Button>
          </MenuItem>
        </>
      )}
    </Menu>
  );
};

export default MiniCart;