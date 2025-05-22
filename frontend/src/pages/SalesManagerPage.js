// src/pages/SalesManagerPage.js
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
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/orders/summary`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        // Extract array from res.data or res.data.data
        let dataArray = [];
        if (Array.isArray(res.data)) {
          dataArray = res.data;
        } else if (Array.isArray(res.data.data)) {
          dataArray = res.data.data;
        } else {
          console.warn('Unexpected summary shape:', res.data);
        }

        // Map into chart format: month, revenue, profit
        const chartData = dataArray.map((item) => ({
          month: item.month || item.date || 'Unknown',
          revenue: parseFloat(item.total_revenue ?? item.revenue ?? 0),
          profit:
            parseFloat(item.total_profit ?? 0),
        }));

        setSummary(chartData);
      } catch (err) {
        console.error('Error loading summary:', err);
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

      <Box
        sx={{
          display: 'flex',
          height: '100vh',
          flexDirection: 'row-reverse',
        }}
      >
        <Box className="right-navbar">
          <Typography variant="h4" gutterBottom>
            Sales Manager Dashboard
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ px: 2, mt: 1 }}>
            <Typography
              onClick={handleLogout}
              sx={{ cursor: 'pointer', color: 'error.main' }}
            >
              Logout
            </Typography>
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
          ) : summary.length === 0 ? (
            <Typography>No data available.</Typography>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={summary}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value) =>
                    typeof value === 'number'
                      ? `$${value.toLocaleString()}`
                      : value
                  }
                />
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
