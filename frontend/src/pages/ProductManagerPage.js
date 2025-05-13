import React from 'react';
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
  // add the part about active section

  // add the part about render Content

  const handleLogout = () => {
    localStorage.removeItem("token"); // removethe token
    navigate("/"); // go to landing page
  };

  return (
    <>
      <div style={{ padding: '10px 20px 0 30px' }}>
        <DrawerMenu />
      </div>

      {/* main content of product manager's page */}
      <div style={{ padding: '20px', maxWidth: '80%', margin: '0 auto' }}>
        <Typography variant="h4" gutterBottom>
          Product Manager Dashboard
        </Typography>

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

        <Card variant="outlined" style={{ marginBottom: '20px' }}>
          <CardContent>
            <Typography variant="h6">Delivery Management</Typography>
            <List>
              <ListItem>- View all deliveries with status</ListItem>
              <ListItem>- Update delivery status (pending, shipped, delivered)</ListItem>
            </List>
          </CardContent>
        </Card>

        <Card variant="outlined" style={{ marginBottom: '20px' }}>
          <CardContent>
            <Typography variant="h6">Comment Moderation</Typography>
            <List>
              <ListItem>- Approve or reject product comments</ListItem>
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

export default ProductManagerPage;
