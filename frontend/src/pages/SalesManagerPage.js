import React from 'react';
import {
  Typography,
  Button,
  Card,
  CardContent,
  List,
  ListItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DrawerMenu from '../components/DrawerMenu';

const SalesManagerPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      <div style={{ padding: '10px 20px 0 30px' }}>
        <DrawerMenu />
      </div>

    {/* main content of sales manager's page */}
      <div style={{ padding: '20px', maxWidth: '90%', margin: '0 auto' }}>

        <Typography variant="h4" gutterBottom>
          Sales Manager Dashboard
        </Typography>

        <Card variant="outlined" style={{ marginBottom: '20px' }}>
          <CardContent>
            <Typography variant="h6">Price & Discount Management</Typography>
            <List>
              <ListItem>- Set product prices</ListItem>
              <ListItem>- Apply discounts to selected items</ListItem>
              <ListItem>- Notify users with items in their wishlist</ListItem>
            </List>
          </CardContent>
        </Card>

        <Card variant="outlined" style={{ marginBottom: '20px' }}>
          <CardContent>
            <Typography variant="h6">Invoice and Reports</Typography>
            <List>
              <ListItem>- View invoices by date range</ListItem>
              <ListItem>- Print or download invoices as PDF</ListItem>
              <ListItem>- View profit/loss chart between dates</ListItem>
            </List>
          </CardContent>
        </Card>

        <Button
          variant="contained"
          color="secondary"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </>
  );
};

export default SalesManagerPage;
