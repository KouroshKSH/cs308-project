import React, { useState , useEffect } from 'react';
import {
  Typography,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DrawerMenu from '../components/DrawerMenu';
import './ProductManagerPage.css';

const API_URL = process.env.REACT_APP_API_URL;

const ProductManagerPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('Product & Category Management');
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token"); // removethe token
    navigate("/"); // go to landing page
  };

  // when "Delivery Management" is selected, get ALL the deliveries
  useEffect(() => {
    if (activeSection === 'Delivery Management') {
      fetchDeliveries();
    }
  }, [activeSection]);

  const fetchDeliveries = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/deliveries`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDeliveries(response.data);
    } catch (err) {
      setError('Failed to fetch deliveries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'Product & Category Management':
        return (
          <div className="scrollable-content">
            <Card variant="outlined" style={{ marginBottom: '20px' }}>
              <CardContent>
                <Typography variant="h6">Product & Category Management</Typography>
                <List>
                  <ListItem>- Add or remove products</ListItem>
                  <ListItem>- Manage product categories</ListItem>
                  <ListItem>- Update stock quantities</ListItem>
                </List>
              </CardContent>
            </Card>
          </div>
        );
      case 'Delivery Management':
        return (
          <div className="scrollable-content">
            <Card variant="outlined" style={{ marginBottom: '20px' }}>
              <CardContent>
                <Typography variant="h6">Delivery Management</Typography>
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <Typography color="error">{error}</Typography>
                ) : (
                  <List>
                    {deliveries.length === 0 ? (
                      <Typography>No deliveries found.</Typography>
                    ) : (
                      deliveries.map((delivery) => (
                        <ListItem
                          key={delivery.delivery_id}
                          style={{
                            padding: '15px',
                            border: '1px solid #ddd',
                            marginBottom: '10px',
                            borderRadius: '8px',
                          }}
                        >
                          <ListItemText
                            primary={`Order ID: ${delivery.order_id}`}
                            secondary={
                              <>
                                <div><strong>Status:</strong> {delivery.delivery_status}</div>
                                <div><strong>Address:</strong> {delivery.delivery_address}</div>
                                <div><strong>Tracking Number:</strong> {delivery.tracking_number || 'N/A'}</div>
                                <div><strong>Shipped Date:</strong> {new Date(delivery.shipped_date).toLocaleString()}</div>
                              </>
                            }
                          />
                        </ListItem>
                      ))
                    )}
                  </List>
                )}
              </CardContent>
            </Card>
          </div>
        );
      case 'Comment Moderation':
        return (
          <div className="scrollable-content">
            <Card variant="outlined" style={{ marginBottom: '20px' }}>
              <CardContent>
                <Typography variant="h6">Comment Moderation</Typography>
                <List>
                  <ListItem>- Approve or reject product comments</ListItem>
                </List>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };


  return (
    <>
      <div style={{ padding: '10px 20px 0 30px' }}>
        <DrawerMenu />
      </div>

      <div style={{ display: 'flex', height: '100vh', flexDirection: 'row-reverse' }}>
        {/* Right Vertical Navbar */}
        <div
          style={{
            width: '350px',
            backgroundColor: '#f5f5f5',
            padding: '20px',
            borderLeft: '1px solid #ddd',
          }}
        >
          <Typography variant="h6" style={{ marginBottom: '20px', fontWeight: 'bold' }}>
            Product Manager Dashboard
          </Typography>
          <Divider style={{ marginBottom: '20px' }} />
          <div
            style={{
              cursor: 'pointer',
              marginBottom: '10px',
              color: activeSection === 'Product & Category Management' ? '#1976d2' : 'inherit',
              fontWeight: activeSection === 'Product & Category Management' ? 'bold' : 'normal',
              fontSize: '1.3em',
            }}
            onClick={() => setActiveSection('Product & Category Management')}
          >
            Product & Category Management
          </div>
          <List style={{ paddingLeft: '20px', marginBottom: '20px' }}>
            <ListItem>Add or remove products</ListItem>
            <ListItem>Manage product categories</ListItem>
            <ListItem>Update stock quantities</ListItem>
          </List>
          <Divider style={{ marginBottom: '20px' }} />
          <div
            style={{
              cursor: 'pointer',
              marginBottom: '10px',
              color: activeSection === 'Delivery Management' ? '#1976d2' : 'inherit',
              fontWeight: activeSection === 'Delivery Management' ? 'bold' : 'normal',
              fontSize: '1.3em',
            }}
            onClick={() => setActiveSection('Delivery Management')}
          >
            Delivery Management
          </div>
          <List style={{ paddingLeft: '20px', marginBottom: '20px' }}>
            <ListItem>View all deliveries with status</ListItem>
            <ListItem>Update delivery status (pending, shipped, delivered)</ListItem>
          </List>
          <Divider style={{ marginBottom: '20px' }} />
          <div
            style={{
              cursor: 'pointer',
              marginBottom: '10px',
              color: activeSection === 'Comment Moderation' ? '#1976d2' : 'inherit',
              fontWeight: activeSection === 'Comment Moderation' ? 'bold' : 'normal',
              fontSize: '1.3em',
            }}
            onClick={() => setActiveSection('Comment Moderation')}
          >
            Comment Moderation
          </div>
          <List style={{ paddingLeft: '20px' }}>
            <ListItem>Approve or reject product comments</ListItem>
          </List>
        </div>

        {/* Main Content Area */}
        <div style={{ flex: 1, padding: '20px' }}>
          <Typography variant="h4" gutterBottom>
            {activeSection}
          </Typography>
          {renderContent()}

        <Button
          variant="contained"
          color="secondary"
          onClick={handleLogout}
          style={{
            marginTop: '20px',
            backgroundColor: '#f44336',
            color: '#fff',
            padding: '10px 20px',
            fontSize: '16px',
        }}>
            Logout
          </Button>
        </div>
      </div>
    </>
  );
};

export default ProductManagerPage;
