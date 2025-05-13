import React, { useState } from 'react';
import {
  Typography,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DrawerMenu from '../components/DrawerMenu';

const ProductManagerPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('Product & Category Management');

  const handleLogout = () => {
    localStorage.removeItem("token"); // removethe token
    navigate("/"); // go to landing page
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'Product & Category Management':
        return (
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
        );
      case 'Delivery Management':
        return (
          <Card variant="outlined" style={{ marginBottom: '20px' }}>
            <CardContent>
              <Typography variant="h6">Delivery Management</Typography>
              <List>
                <ListItem>- View all deliveries with status</ListItem>
                <ListItem>- Update delivery status (pending, shipped, delivered)</ListItem>
              </List>
            </CardContent>
          </Card>
        );
      case 'Comment Moderation':
        return (
          <Card variant="outlined" style={{ marginBottom: '20px' }}>
            <CardContent>
              <Typography variant="h6">Comment Moderation</Typography>
              <List>
                <ListItem>- Approve or reject product comments</ListItem>
              </List>
            </CardContent>
          </Card>
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
            borderRight: '1px solid #ddd',
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
            }}
            onClick={() => setActiveSection('Product & Category Management')}
          >
            Product & Category Management
          </div>
          <List style={{ paddingLeft: '20px', marginBottom: '20px' }}>
            <ListItem>- Add or remove products</ListItem>
            <ListItem>- Manage product categories</ListItem>
            <ListItem>- Update stock quantities</ListItem>
          </List>
          <Divider style={{ marginBottom: '20px' }} />
          <div
            style={{
              cursor: 'pointer',
              marginBottom: '10px',
              color: activeSection === 'Delivery Management' ? '#1976d2' : 'inherit',
              fontWeight: activeSection === 'Delivery Management' ? 'bold' : 'normal',
            }}
            onClick={() => setActiveSection('Delivery Management')}
          >
            Delivery Management
          </div>
          <List style={{ paddingLeft: '20px', marginBottom: '20px' }}>
            <ListItem>- View all deliveries with status</ListItem>
            <ListItem>- Update delivery status (pending, shipped, delivered)</ListItem>
          </List>
          <Divider style={{ marginBottom: '20px' }} />
          <div
            style={{
              cursor: 'pointer',
              marginBottom: '10px',
              color: activeSection === 'Comment Moderation' ? '#1976d2' : 'inherit',
              fontWeight: activeSection === 'Comment Moderation' ? 'bold' : 'normal',
            }}
            onClick={() => setActiveSection('Comment Moderation')}
          >
            Comment Moderation
          </div>
          <List style={{ paddingLeft: '20px' }}>
            <ListItem>- Approve or reject product comments</ListItem>
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
