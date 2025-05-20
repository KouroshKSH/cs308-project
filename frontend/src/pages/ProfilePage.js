import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Card,
  CardContent,
  Avatar,
  Divider,
  Breadcrumbs,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DrawerMenu from '../components/DrawerMenu';
import Footer from '../components/Footer';
import FavoriteIcon from '@mui/icons-material/Favorite';
import "./ProfilePage.css";

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

  // for wishlist
  const [wishlist, setWishlist] = useState([]);
  const [openWishlist, setOpenWishlist] = useState(false);

  useEffect(() => {
    fetchUserProfile();
    fetchCart();
    fetchWishlist();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ordersWithItems = response.data.orders.map(order => ({
        ...order,
        items: order.items || []
      }));
      setProfile(response.data.user);
      setOrders(ordersWithItems);
    } catch {
      setError('Error loading profile');
    }
  };

  // for showing the cart items
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data);
    } catch {
      setCart({ items: [], total_price: 0 });
    }
  };

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(res.data); // Set wishlist data
    } catch {
      setWishlist([]); // Default to empty if error occurs
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleBackToHome = () => navigate('/');

  const handleToggleOrders = () => {
    setOpenOrders(!openOrders);
    if (!openOrders) setOpenCart(false);
  };

  const handleToggleCart = () => {
    setOpenCart(!openCart);
    if (!openCart) setOpenOrders(false);
  };

  const handleToggleWishlist = () => {
    setOpenWishlist(!openWishlist);
    if (!openWishlist) {
      setOpenOrders(false);
      setOpenCart(false);
    }
  };

  const handleRemoveFromWishlist = async (productId, variationId) => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      // Call the backend to remove the item from the wishlist
      await axios.delete(`${API_URL}/wishlist/remove`, {
        headers,
        data: { product_id: productId, variation_id: variationId },
      });

      // Update the wishlist state to remove the item locally
      setWishlist((prevWishlist) =>
        prevWishlist.filter(
          (item) =>
            item.product_id !== productId || item.variation_id !== variationId
        )
      );

      alert('Item removed from wishlist!');
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
      alert('Failed to remove item from wishlist.');
    }
  };

  // Navigate to the Order Status page, passing the orderId in the URL
  const handleOrderClick = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>Loading...</div>;

  return (
    <>
      <Box padding="10px 20px 0 30px">
        <DrawerMenu />
      </Box>

      {/* Breadcrumb */}
      <Box sx={{ px: 4, mt: 2 }}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
          <Typography
            color="inherit"
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={handleBackToHome}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Typography>
          <Typography color="text.primary">Profile</Typography>
        </Breadcrumbs>
      </Box>

      <Box
        sx={{
          px: 4,
          py: 5,
          maxWidth: '900px',
          margin: '40px auto',
          backgroundColor: '#ffffff',
          borderRadius: 4,
          boxShadow: 3,
          border: '1px solid #e0e0e0',
        }}
      >
        {/* Header */}
        <Box textAlign="center" mb={4}>
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              width: 100,
              height: 100,
              fontSize: 40,
              margin: '0 auto',
            }}
          >
            {profile.username.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="h4" fontWeight="bold" mt={2}>
            Welcome, {profile.username}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {profile.email}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {profile.phone_number || 'Phone not provided'} | {profile.address || 'Address not provided'}
          </Typography>
        </Box>

        {/* Toggle Buttons */}
        <Box display="flex" justifyContent="center" gap={3} mb={3}>
          
          {/* order toggle */}
          <Button
            variant={openOrders ? 'contained' : 'outlined'}
            startIcon={<ReceiptLongIcon />}
            onClick={handleToggleOrders}
            sx={{ borderRadius: 10, minWidth: 140 }}
          >
            Orders
          </Button>

          {/* cart toggle */}
          <Button
            variant={openCart ? 'contained' : 'outlined'}
            startIcon={<ShoppingCartIcon />}
            onClick={handleToggleCart}
            sx={{ borderRadius: 10, minWidth: 140 }}
          >
            Cart
          </Button>

          {/* wishlist toggle */}
          <Button
            variant={openWishlist ? 'contained' : 'outlined'}
            startIcon={<FavoriteIcon />}
            onClick={handleToggleWishlist}
            sx={{ borderRadius: 10, minWidth: 140 }}
          >
            Wishlist
          </Button>
        </Box>

        {/* Orders */}
        <Collapse in={openOrders}>
          <Typography variant="h5" mb={2}>Order History</Typography>
          {orders.length === 0 ? (
            <Typography>No orders yet.</Typography>
          ) : (
            <List>
              {orders.map(order => (
                <Card key={order.order_id} sx={{ mb: 2, cursor: 'pointer' }} onClick={() => handleOrderClick(order.order_id)}>
                  <CardContent>
                    <Typography variant="subtitle1"><strong>Order #{order.order_id}</strong></Typography>
                    <Typography>Status: {order.status}</Typography>
                    <Typography>Total: ${order.total_price}</Typography>
                    <Typography>Delivered to: {order.delivery_address}</Typography>
                    <Typography>
                      Order Date: {order.order_date ? new Date(order.order_date).toLocaleString() : 'N/A'}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </List>
          )}
        </Collapse>

        {/* Cart */}
        <Collapse in={openCart}>
         <div className="profile-cart-container">
            <Typography variant="h5" mt={4} mb={2}>Your Cart</Typography>
            {cart.items.length === 0 ? (
              <Typography>Your cart is empty.</Typography>
            ) : (
              <List>
                {cart.items.map((item, idx) => (
                  <Card key={idx} sx={{ mb: 2 }}>
                    <CardContent 
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                        }}
                      >
                      <Box>
                        <Typography fontWeight="bold">{item.name}</Typography>
                        <Typography>Size: {item.size_name} | Color: {item.color_name}</Typography>
                        {/* <Typography>Quantity: {item.quantity} | ${item.price}</Typography> */}

                        <Typography>
                        {item.discount_percent ? (
                          <>
                            <span className="original-price">${item.original_price}</span>
                            <span className="discounted-price">${item.discounted_price}</span>
                            <span className="discount-percent">{item.discount_percent}%</span>
                            &nbsp;(x{item.quantity})
                          </>
                        ) : (
                          <>${item.original_price} (x{item.quantity})</>
                        )}
                      </Typography>

                      </Box>
                      <img
                        src={`${process.env.PUBLIC_URL}/assets/images/${item.image_url}.jpg`}
                        alt={item.name}
                        onError={e => e.target.src = `${process.env.PUBLIC_URL}/assets/images/placeholder.jpg`}
                        style={{ width: 80, height: 100, objectFit: "cover", borderRadius: 4 }}
                      />
                    </CardContent>
                  </Card>
                ))}
                <Divider sx={{ my: 2 }} />
                <ListItem
                  secondaryAction={
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => navigate("/checkout")}
                      sx={{ borderRadius: 1, minWidth: 120, minHeight: 40 }}
                    >
                      Check Out
                    </Button>
                  }
                >
                  <ListItemText primary={<strong>Total: ${cart.total_price}</strong>} />
                </ListItem>
              </List>
            )}
          </div>
        </Collapse>

        {/* Wishlist */}
        <Collapse in={openWishlist}>
          <div className="profile-wishlist-container">
          <Typography variant="h5" mt={4} mb={2}>
            Your Wishlist
          </Typography>
          {wishlist.length === 0 ? (
            <Typography>Your wishlist is empty.</Typography>
          ) : (
            <List>
              {wishlist.map((item, idx) => (
                <Card key={idx} sx={{ mb: 2 }}>
                  <CardContent 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center'
                    }}
                  >
                    {/* left section for product info in the wishlist */}
                    <Box>
                      <Typography fontWeight="bold">{item.name}</Typography>
                      {/* <Typography>Price: ${item.price}</Typography> */}

                      <Typography>
                      {item.discount_percent ? (
                        <>
                          <span className="original-price">${item.original_price}</span>
                          <span className="discounted-price">${item.discounted_price}</span>
                          <span className="discount-percent">{item.discount_percent}%</span>
                        </>
                      ) : (
                        <>${item.original_price}</>
                      )}
                    </Typography>
                    </Box>

                    {/* Right Section: Product Image and Remove Button */}
                    <Box 
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1,
                        }}
                      >
                      <img
                        src={`${process.env.PUBLIC_URL}/assets/images/${item.image_url}.jpg`}
                        alt={item.name}
                        onError={(e) =>
                          (e.target.src = `${process.env.PUBLIC_URL}/assets/images/placeholder.jpg`)
                        }
                        style={{
                          width: 100,
                          height: 100,
                          objectFit: 'cover',
                          borderRadius: 6,
                        }}
                      />
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() =>
                          handleRemoveFromWishlist(item.product_id, item.variation_id)
                        }
                        sx={{
                          textTransform: 'none',
                          fontWeight: 'bold',
                          borderRadius: 1,
                          minWidth: 100,
                        }}
                      >
                        Remove
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </List>
          )}
          </div>
        </Collapse>

        <Box mt={5} textAlign="center">
          <Button 
            variant="contained"
            color="secondary"
            onClick={handleLogout} 
            sx={{
              borderRadius: 1,
              minWidth: 180,
              minHeight: 50,
              }}
            >
            Logout
          </Button>
        </Box>
      </Box>
   

      {/* Add a gap before the footer */}
      <Box sx={{ marginBottom: "200px" }} />

      <Footer />
    </>
  );
};

export default ProfilePage;
