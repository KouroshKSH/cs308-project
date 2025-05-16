import React, { useState } from 'react';
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
import './SalesManagerPage.css';

// Static sales data
// TODO: I'll change this to use Zeynep's backend API
const salesData = [
  { name: 'Product 1', sales: 10 },
  { name: 'Product 2', sales: 5 },
  { name: 'Product 3', sales: 15 },
  { name: 'Product 4', sales: 8 },
];

const SalesManagerPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('Sales per Product');

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };


  const renderContent = () => {
    switch (activeSection) {
      case 'Sales per Product':
        return (
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
        );
      case 'Price & Discount Management':
        return (
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
        );
      case 'Invoice and Reports':
        return (
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
        <div className="right-navbar">
          <Typography variant="h4" style={{ marginBottom: '20px', fontWeight: 'bold' }}>
            Sales Manager Dashboard
          </Typography>
          <div
            className={`nav-item ${activeSection === 'Sales per Product' ? 'active' : ''}`}
            onClick={() => setActiveSection('Sales per Product')}
          >
            Sales per Product
          </div>
          <div
            className={`nav-item ${activeSection === 'Price & Discount Management' ? 'active' : ''}`}
            onClick={() => setActiveSection('Price & Discount Management')}
          >
            Price & Discount Management
          </div>
          <div
            className={`nav-item ${activeSection === 'Invoice and Reports' ? 'active' : ''}`}
            onClick={() => setActiveSection('Invoice and Reports')}
          >
            Invoice and Reports
          </div>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleLogout}
            style={{ marginTop: '20px' }}
          >
            Logout
          </Button>
        </div>

        {/* Main Content Area */}
        <div className="main-content">
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default SalesManagerPage;

