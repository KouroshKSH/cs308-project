import React, { useState, useEffect } from 'react';
import {
  Typography,
  Divider,
  CircularProgress,
  Box,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DrawerMenu from '../components/DrawerMenu';
import Footer from '../components/Footer';
import './SalesManagerPage.css';

const SalesManagerPage = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/orders/summary`
        );

        let data = [];
        if (Array.isArray(res.data)) {
          data = res.data;
        } else if (Array.isArray(res.data.data)) {
          data = res.data.data;
        } else {
          console.warn('Unexpected summary shape:', res.data);
        }

        setSummary(
          data.map(item => ({
            month: item.month,
            revenue: item.revenue,
            profit: item.revenue - item.cost,
          }))
        );
      } catch (err) {
        setError('Failed to load monthly summary');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <>
      <Box sx={{ p: 2 }}>
        <DrawerMenu />
      </Box>

      <Box sx={{ display: 'flex', height: '100vh', flexDirection: 'row-reverse' }}>
        <Box className="right-navbar">
          <Typography variant="h4" gutterBottom>
            Sales Manager Dashboard
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ px: 2 }}>
            <Typography>Logout</Typography>
            <button onClick={handleLogout}>Sign out</button>
          </Box>
        </Box>

        <Box className="main-content" sx={{ flexGrow: 1, p: 3 }}>
          <Typography variant="h4" mb={2}>
            Monthly Revenue vs. Profit
          </Typography>

          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={summary}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="revenue" fill="#3366CC" name="Revenue" />
                <Bar dataKey="profit" fill="#DC3912" name="Profit" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Box>
      </Box>

      <Footer />
    </>
  );
};

export default SalesManagerPage;
