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

// Chart imports:
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Static sales data
const salesData = [
  { name: 'Product 1', sales: 10 },
  { name: 'Product 2', sales: 5 },
  { name: 'Product 3', sales: 15 },
  { name: 'Product 4', sales: 8 },
];

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

      <div style={{ padding: '20px', maxWidth: '90%', margin: '0 auto' }}>
        <Typography variant="h4" gutterBottom>
          Sales Manager Dashboard
        </Typography>

        {/* 📊 Sales Bar Chart */}
        <Card variant="outlined" style={{ marginBottom: '20px', padding: '20px' }}>
          <Typography variant="h6" gutterBottom>
            Sales per Product
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* 🔻 Existing content below */}
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
