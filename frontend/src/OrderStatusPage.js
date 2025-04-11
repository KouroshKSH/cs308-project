import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  List,
  ListItem,
  ListItemText,
  Button,
  Paper,
} from '@mui/material';

const mockOrderData = {
  '12345': {
    orderId: '12345', // type `http://localhost:3000/order/12345` in URL bar to visit
    orderDate: '2025-04-01',
    totalAmount: '$150.00',
    status: 'Shipped',
    customer: {
      name: 'Reza Yıldırım',
      address: 'yılmaz sokak, Istanbul, Türkiye',
      contact: '+90 555 123 4567',
    },
    items: [
      { name: 'Product 1', quantity: 1, price: '$50.00' },
      { name: 'Product 2', quantity: 2, price: '$100.00' },
    ],
    estimatedDelivery: '2025-04-10',
  },
    '67890': {
        orderId: '67890',
        orderDate: '2025-04-02',
        totalAmount: '$200.00',
        status: 'Pending',
        customer: {
        name: 'John Smith',
        address: 'Main St, New York, USA',
        contact: '+90 555 987 6543',
        },
        items: [
        { name: 'Product 3', quantity: 1, price: '$200.00' },
        ],
        estimatedDelivery: '2025-04-15',
    },
};

const statusSteps = ['Pending', 'Processing', 'Shipped', 'Delivered'];

const OrderStatusPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Simulate fetching order data
    const fetchedOrder = mockOrderData[orderId];
    if (fetchedOrder) {
      setOrder(fetchedOrder);
    } else {
      console.error('Order not found');
    }
  }, [orderId]);

  if (!order) {
    return <Typography>Loading order details...</Typography>;
  }

  const currentStep = statusSteps.indexOf(order.status);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Order Details
        </Typography>
        <Typography>Order ID: {order.orderId}</Typography>
        <Typography>Order Date: {order.orderDate}</Typography>
        <Typography>Total Amount: {order.totalAmount}</Typography>

        <Box sx={{ my: 4 }}>
          <Stepper activeStep={currentStep} alternativeLabel>
            {statusSteps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Typography variant="h6" gutterBottom>
          Shipping Information
        </Typography>
        <Typography>Name: {order.customer.name}</Typography>
        <Typography>Address: {order.customer.address}</Typography>
        <Typography>Contact: {order.customer.contact}</Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Items in Order
        </Typography>
        <List>
          {order.items.map((item, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`${item.name} (x${item.quantity})`}
                secondary={`Price: ${item.price}`}
              />
            </ListItem>
          ))}
        </List>

        <Typography variant="h6" gutterBottom>
          Estimated Delivery
        </Typography>
        <Typography>{order.estimatedDelivery}</Typography>

        <Button
          variant="contained"
          sx={{ mt: 3 }}
          onClick={() => navigate('/')}
        >
          Back to Home
        </Button>
      </Paper>
    </Box>
  );
};

export default OrderStatusPage;
