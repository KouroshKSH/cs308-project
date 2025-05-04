import React, { useEffect, useState } from 'react';
import AccountCircle from "@mui/icons-material/AccountCircle";
import { List, ListItem, ListItemText, Button, Typography, Collapse } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const API_URL = process.env.REACT_APP_API_URL;

const ProfilePage = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);

  // for showing the orders
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [openOrders, setOpenOrders] = useState(false);

  // for showing the cart items
  const [cart, setCart] = useState({ items: [], total_price: 0 });
  const [openCart, setOpenCart] = useState(false);

  useEffect(() => {
    fetchUserProfile();
    fetchCart();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!API_URL) {
        throw new Error('API URL not defined. Please set REACT_APP_API_URL in your .env file.');
      }

      const response = await axios.get(`${API_URL}/user/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Fetched FULL data from backend:', response.data);

      const ordersWithItems = response.data.orders.map((order) => {
        return {
          ...order,
          items: order.items || []
        };
      });

      setProfile(response.data.user);
      setOrders(ordersWithItems);
    } catch (error) {
      console.error('Error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Error loading profile');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  // for showing the orders
  const handleToggleOrders = () => {
    setOpenOrders(!openOrders);
  };

  const handleOrderClick = (orderId) => {
    // Navigate to the Order Status page, passing the orderId in the URL
    navigate(`/order/${orderId}`);
  };

  // for showing the cart items
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { "Authorization": `Bearer ${token}` };
      const res = await axios.get(`${API_URL}/cart`, { headers });
      setCart(res.data);
    } catch (err) {
      setCart({ items: [], total_price: 0 });
    }
  };

  const handleToggleCart = () => {
    setOpenCart(!openCart);
    if (!openCart) setOpenOrders(false);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{
      padding: '20px',
      textAlign: 'left',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      paddingBottom: '60px',
      maxWidth: 600,
      margin: '0 auto'
    }}>
      {/* Back to Home Button */}
      <Button
        variant="outlined"
        color="primary"
        onClick={handleBackToHome}
        style={{ position: 'absolute', top: '20px', left: '10px' }}
      >
        Back to Home
      </Button>

      {/* Profile Content */}
      <div style={{ marginBottom: '20px', marginTop: '40px' }}>
        <AccountCircle style={{ fontSize: '4rem', marginBottom: '10px' }} />
        <Typography variant="h4" style={{ fontWeight: 'bold', marginBottom: '16px' }}>
          Hi {profile.username}
        </Typography>
        <div style={{ display: 'flex', gap: '40px', marginBottom: '8px' }}>
          <Typography variant="body1"><strong>Email:</strong> {profile.email}</Typography>
          <Typography variant="body1"><strong>Phone:</strong> {profile.phone_number || 'Not provided'}</Typography>
        </div>
        <div style={{ marginBottom: '8px' }}>
          <Typography variant="body1"><strong>Address:</strong> {profile.address || 'Not provided'}</Typography>
        </div>
      </div>

      {/* clickable items to show the user's past Orders and Cart content */}
      <div style={{ marginTop: '20px' }}>
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center', marginBottom: '10px' }}>
          {/* Orders Section */}
          <Typography
            variant="h6"
            color={openOrders ? "primary" : "inherit"}
            onClick={handleToggleOrders}
            style={{ cursor: 'pointer', textDecoration: openOrders ? 'underline' : 'none' }}
          >
            Orders
          </Typography>
          {/* Cart Section */}
          <Typography
            variant="h6"
            color={openCart ? "primary" : "inherit"}
            onClick={handleToggleCart}
            style={{ cursor: 'pointer', textDecoration: openCart ? 'underline' : 'none', display: 'flex', alignItems: 'center' }}
          >
            <ShoppingCartIcon fontSize="small" style={{ marginRight: 4 }} />
            Cart
          </Typography>
        </div>

        <Collapse in={openOrders}>
          <div>
            <h2>Your Orders</h2>
            {orders.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              <List>
                {orders.map((order) => (
                  <div key={order.order_id}>
                    <ListItem
                      style={{ 
                        padding: '15px', 
                        border: '2px solid #ddd', 
                        marginBottom: '10px', 
                        borderRadius: '8px',
                        cursor: 'pointer'
                       }}
                      onClick={() => handleOrderClick(order.order_id)} // Add click event to go to the order status page
                    >
                      <ListItemText
                        primary={<><strong>Order ID: </strong>{order.order_id}</>}
                        secondary={(
                          <>
                            <div><strong>Status:</strong> {order.status}</div>
                            <div><strong>Total Price:</strong> ${order.total_price}</div>
                            <div><strong>Delivery Address:</strong> {order.delivery_address}</div>
                          </>
                        )}
                      />
                    </ListItem>
                  </div>
                ))}
              </List>
            )}
          </div>
        </Collapse>

        {/* Cart Dropdown */}
        <Collapse in={openCart}>
          <div>
            <h2>Your Cart</h2>
            {cart.items.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <List>
                {cart.items.map((item, idx) => (
                  <div key={idx}>
                    <ListItem
                      style={{
                        padding: '15px',
                        border: '2px solid #ddd',
                        marginBottom: '10px',
                        borderRadius: '8px',
                        alignItems: 'flex-start'
                      }}
                    >
                      <ListItemText
                        primary={
                          <span>
                            <strong>{item.name}</strong>
                          </span>
                        }
                        secondary={
                          <>
                            <div>Size: {item.size_name}</div>
                            <div>Color: {item.color_name}</div>
                            <div>Price: ${item.price}</div>
                            <div>Quantity: {item.quantity}</div>
                          </>
                        }
                      />
                    </ListItem>
                  </div>
                ))}
                <ListItem>
                  <ListItemText
                    primary={<strong>Total: ${cart.total_price}</strong>}
                  />
                </ListItem>
              </List>
            )}
          </div>
        </Collapse>
      </div>

      {/* Logout Button */}
      <Button
        variant="contained"
        color="secondary"
        onClick={handleLogout}
        style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}
      >
        Logout
      </Button>
    </div>
  );
};

export default ProfilePage;