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
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import "./MiniCart.css";

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
      PaperProps={{
        sx: {
          width: 340, // fix the width
          maxHeight: 420, // you can scroll if it's more than max height
          overflowY: "auto",
          p: 0.5,
        },
      }}
    >
      <div className="mini-cart-container">
        {loading ? (
          <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
            <CircularProgress size={24} />
          </Box>
        ) : cart.items.length === 0 ? (
          <MenuItem>Your cart is empty</MenuItem>
        ) : (
          <>
            {cart.items.map((item, idx) => (
              <MenuItem
                key={idx}
                sx={{
                  whiteSpace: "normal",
                  alignItems: "flex-start",
                  py: 1,
                  px: 1.5,
                  minHeight: 70,
                }}
              >
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%"
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" fontWeight="bold">
                      {item.name}
                    </Typography>
                    {/* we can also show the color as `{item.color_name}` but not needed */}
                    
                    <Typography variant="body2">
                      {item.discount_percent ? (
                        <>
                          <span className="original-price">${item.original_price}</span>
                          <span className="discounted-price">${item.discounted_price}</span>
                          &nbsp;(x{item.quantity})
                          <span className="discount-percent">{item.discount_percent}%</span>
                        </>
                      ) : (
                        <>
                          ${item.original_price} (x{item.quantity})
                        </>
                      )}
                    </Typography>
                    
                    
                    <Typography variant="body2">
                      Size: {item.size_name}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      ml: 2,
                      gap: 0.5,
                    }}
                  >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton
                      size="small"
                      onClick={() => handleUpdateQuantity(item, item.quantity - 1, idx)}
                      disabled={actionLoading === idx || item.quantity <= 1}
                      title="Decrease"
                    >
                      <RemoveIcon sx={{ color: "#222" }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleUpdateQuantity(item, item.quantity + 1, idx)}
                      disabled={actionLoading === idx}
                      title="Increase"
                    >
                      <AddIcon sx={{ color: "#222" }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleRemove(item, idx)}
                      disabled={actionLoading === idx}
                      title="Remove"
                    >
                      <DeleteIcon sx={{ color: "#222" }} />
                    </IconButton>
                    </Box>
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
                  navigate(
                    "/checkout",
                    { state: { role: "customer" } }
                  );
                }}
              >
                Check Out
              </Button>
            </MenuItem>
          </>
        )}
      </div>
    </Menu>
  );
};

export default MiniCart;