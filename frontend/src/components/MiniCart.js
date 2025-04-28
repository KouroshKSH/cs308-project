import React, { useEffect, useState } from "react";
import { Menu, MenuItem, Button, Typography, Box, CircularProgress } from "@mui/material";
import { getOrCreateSessionId } from "../utils/sessionStorage";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const MiniCart = ({ anchorEl, open, onClose }) => {
  const [cart, setCart] = useState({ items: [], total_price: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
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
    fetchCart();
  }, [open]);

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
              <Box>
                <Typography variant="body1" fontWeight="bold">{item.name}</Typography>
                <Typography variant="body2">
                  ${item.price} (x{item.quantity})
                </Typography>
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
                navigate("/cart");
              }}
            >
              Go to Cart
            </Button>
          </MenuItem>
        </>
      )}
    </Menu>
  );
};

export default MiniCart;