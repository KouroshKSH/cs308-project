import React from 'react';
import { Typography, Button, Card, CardContent, List, ListItem } from '@mui/material';

const SalesManagerPage = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
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

      <Button variant="contained" color="secondary">
        Logout
      </Button>
    </div>
  );
};

export default SalesManagerPage;
