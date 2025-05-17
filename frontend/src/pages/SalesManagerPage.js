import React, { useState } from 'react';
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
import DrawerMenu from '../components/DrawerMenu';
import Footer from '../components/Footer';

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
          <Typography 
            variant="h4" 
            style={
              { 
                marginBottom: '20px', 
                fontWeight: 'bold' 
              }
            }>
            Sales Manager Dashboard
          </Typography>

          <Divider style={{ marginBottom: '20px' }} />

          <div
            style={{
              cursor: 'pointer',
              marginBottom: '10px',
              color: activeSection === 'Sales per Product' ? '#1976d2' : 'inherit',
              fontWeight: activeSection === 'Sales per Product' ? 'bold' : 'normal',
              fontSize: '1.3em',
            }}
            onClick={() => setActiveSection('Sales per Product')}
          >
            Sales per Product
          </div>

          <List style={{ paddingLeft: '20px', marginBottom: '20px' }}>
            <ListItem>View sales data</ListItem>
            <ListItem>Analyze product performance</ListItem>
          </List>

          <Divider style={{ marginBottom: '20px' }} />

          <div
            style={{
              cursor: 'pointer',
              marginBottom: '10px',
              color: activeSection === 'Price & Discount Management' ? '#1976d2' : 'inherit',
              fontWeight: activeSection === 'Price & Discount Management' ? 'bold' : 'normal',
              fontSize: '1.3em',
            }}
            onClick={() => setActiveSection('Price & Discount Management')}
          >
            Price & Discount Management
          </div>

          <List style={{ paddingLeft: '20px', marginBottom: '20px' }}>
            <ListItem>Set prices for new products</ListItem>
            <ListItem>Apply discounts to items</ListItem>
            <ListItem>Notify users about discounts</ListItem>
          </List>

          <Divider style={{ marginBottom: '20px' }} />

          <div
            style={{
              cursor: 'pointer',
              marginBottom: '10px',
              color: activeSection === 'Invoice and Reports' ? '#1976d2' : 'inherit',
              fontWeight: activeSection === 'Invoice and Reports' ? 'bold' : 'normal',
              fontSize: '1.3em',
            }}
            onClick={() => setActiveSection('Invoice and Reports')}
          >
            Invoice and Reports
          </div>

          <List style={{ paddingLeft: '20px' }}>
            <ListItem>View and manage invoices</ListItem>
            <ListItem>Analyze profit/loss charts</ListItem>
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
        <div className="main-content">
          {renderContent()}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default SalesManagerPage;

