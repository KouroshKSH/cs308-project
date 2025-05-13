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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DrawerMenu from '../components/DrawerMenu';
import './ProductManagerPage.css';
import FilterListIcon from "@mui/icons-material/FilterList";

const API_URL = process.env.REACT_APP_API_URL;

const ProductManagerPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('Product & Category Management');
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // for filtering deliveries
  const [filterStatusDeliveries, setFilterStatusDeliveries] = useState('');

  // for getting the manager info and displaying it
  const [managerInfo, setManagerInfo] = useState(null); // State to store manager info

  const fetchManagerProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setManagerInfo(response.data.user); // Set manager info from the response
    } catch (err) {
      console.error('Failed to fetch manager profile:', err);
      setError('Failed to load manager profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch manager profile on component mount
  // useEffect(() => {
  //   fetchManagerProfile();
  // }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // removethe token
    navigate("/"); // go to landing page
  };

  // when "Delivery Management" is selected, get ALL the deliveries
  useEffect(() => {
    fetchManagerProfile();
    if (activeSection === 'Delivery Management') {
      fetchDeliveries(filterStatusDeliveries);
    }
  }, [activeSection, filterStatusDeliveries]);

  const fetchDeliveries = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const endpoint = filterStatusDeliveries
        ? `${API_URL}/deliveries/status/${filterStatusDeliveries}` // Fetch deliveries by status
        : `${API_URL}/deliveries`; // Fetch all deliveries
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // const response = await axios.get(`${API_URL}/deliveries`, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });
      setDeliveries(response.data);
    } catch (err) {
      setError('Failed to fetch deliveries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to update delivery status (to shipped or delivered)
  const updateDeliveryStatus = async (deliveryId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_URL}/deliveries/${deliveryId}/status`,
        { delivery_status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Refresh the deliveries list after updating
      fetchDeliveries(filterStatusDeliveries);
    } catch (err) {
      console.error('Failed to update delivery status:', err);
      alert('Failed to update delivery status. Please try again.');
    }
  };

  const handleFilterChange = (event) => {
    setFilterStatusDeliveries(event.target.value);
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
                <Typography 
                  variant="h6"
                  style={{ marginBottom: '20px', fontWeight: 'bold' }}
                >
                    Delivery Management
                  </Typography>
                
                {/* Filter Dropdown with Icon */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                  <FilterListIcon style={{ marginRight: '8px', color: 'rgba(0, 0, 0, 0.54)' }} />
                  <FormControl style={{ minWidth: 200 }}>
                    <InputLabel id="filter-label">Delivery Status</InputLabel>
                    <Select
                      labelId="filter-label"
                      value={filterStatusDeliveries}
                      onChange={handleFilterChange}
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="shipped">Shipped</MenuItem>
                      <MenuItem value="delivered">Delivered</MenuItem>
                    </Select>
                  </FormControl>
                </div>

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
                            style={{ fontSize: '1.2em' }}
                          />
                          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            {/* Ship Button */}
                            <Button
                              variant="contained"
                              color="primary"
                              disabled={delivery.delivery_status !== 'pending'}
                              onClick={() => updateDeliveryStatus(delivery.delivery_id, 'shipped')}
                            >
                              Ship
                            </Button>
                            {/* Deliver Button */}
                            <Button
                              variant="contained"
                              color="success"
                              disabled={delivery.delivery_status === 'delivered'}
                              onClick={() => updateDeliveryStatus(delivery.delivery_id, 'delivered')}
                            >
                              Deliver
                            </Button>
                          </div>
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
            width: '450px',
            backgroundColor: '#f5f5f5',
            padding: '20px',
            borderLeft: '1px solid #ddd',
          }}
        >
          <Typography variant="h4" style={{ marginBottom: '20px', fontWeight: 'bold' }}>
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

          <Divider style={{ marginBottom: '20px' }} />
          
          <Typography
            variant="body1"
            style={{
              fontSize: '1.2em',
              marginTop: '20px',
              marginBottom: '15px',
              textAlign: 'center',
              color: 'rgba(0, 0, 0, 0.7)',
            }}
          >
            Would you like to log out?
          </Typography>

          {/* Logout Button at the bottom */}
          <Button
            variant="contained"
            color="secondary"
            onClick={handleLogout}
            style={{
              backgroundColor: '#f44336',
              color: '#fff',
              padding: '10px 20px',
              fontSize: '16px',
              width: 'calc(100% - 40px)',
            }}
          >
            Logout
          </Button>
        </div>

        {/* Main Content Area */}
        <div style={{padding: '20px', width: '80%', textAlign: 'center'}}>
          {/* Manager Info Moved Here */}
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : managerInfo ? (
            <div 
              className="manager-profile-info" 
              style={{ 
                marginBottom: '30px', 
                padding: '15px', 
                border: '1px solid #eee', 
                borderRadius: '8px', 
                backgroundColor: '#f9f9f9',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                textAlign: 'left',
              }}>
              <Typography variant="h5" style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                Hello Manager {managerInfo.username}
              </Typography>
              <Typography variant="body1">
                <strong>Role:</strong> Product Manager
              </Typography>
              <Typography variant="body1">
                <strong>Email:</strong> {managerInfo.email}
              </Typography>
            </div>
          ) : null}
          <Typography variant="h4" gutterBottom>
            {activeSection}
          </Typography>
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default ProductManagerPage;
