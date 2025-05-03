import React from 'react';
import { Typography, Button, Card, CardContent, List, ListItem } from '@mui/material';

const ProductManagerPage = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
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

      <Button variant="contained" color="secondary">
        Logout
      </Button>
    </div>
  );
};

export default ProductManagerPage;
