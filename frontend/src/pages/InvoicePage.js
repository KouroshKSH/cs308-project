import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { jsPDF } from "jspdf";
import './InvoicePage.css';
import { Button } from '@mui/material'; // Import Material-UI Button

const InvoicePage = () => {
  const { orderId } = useParams(); // Get the orderId from URL params
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      const token = localStorage.getItem('token');
      const API_URL = process.env.REACT_APP_API_URL;

      if (!token) {
        console.log('No token found');
        setError('Authorization token not found');
        return;
      }

      if (!API_URL) {
        console.log('API_URL not defined');
        setError('API URL not defined');
        return;
      }

      const url = `${API_URL}/orders/with-items/${orderId}`;
      console.log('Fetching from URL:', url);

      try {
        const response = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        console.log('Order data fetched:', response.data);
        setOrderData(response.data);  // Set the order data to state
      } catch (err) {
        console.error('Error fetching order data:', err);
        setError('Failed to fetch order data');
      }
    };

    if (orderId) {
      fetchOrderData();  // Only fetch if orderId exists
    }
  }, [orderId]);  // Dependency array makes sure it re-fetches when orderId changes

  if (error) {
    return <div className="invoice-container">Error: {error}</div>;
  }

  if (!orderData) {
    return <div className="invoice-container">Loading...</div>;
  }

  // Download PDF function
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(22);
    doc.text('Invoice', 14, 20);

    // Add Invoice number
    doc.setFontSize(14);
    doc.text(`Invoice No: ${formatInvoiceNo(orderData.order.order_id)}`, 14, 30);

    // Add Billing Address and Date
    doc.text(`Billing Address: ${orderData.order.delivery_address}`, 14, 40);
    doc.text(`Issue Date: ${formatDate(orderData.order.order_date)}`, 14, 50);

    // Add Items Table Header
    doc.text('Items', 14, 60);
    doc.text('Product Name', 14, 70);
    doc.text('Quantity', 100, 70);
    doc.text('Unit Price', 140, 70);
    doc.text('Amount', 180, 70);

    // Add items list
    let y = 80;
    orderData.items.forEach((item, index) => {
      // Ensure item.price_at_purchase is a number
      const price = parseFloat(item.price_at_purchase) || 0;
      const amount = price * item.quantity;

      doc.text(item.product_name, 14, y);
      doc.text(item.quantity.toString(), 100, y);
      doc.text(price.toFixed(2), 140, y);  // Format price to 2 decimal places
      doc.text(amount.toFixed(2), 180, y);  // Format amount to 2 decimal places
      y += 10;
    });

    // Add Total Amount
    doc.text(`Total Amount: ${orderData.order.total_price}`, 14, y + 10);

    // Save the PDF
    doc.save(`invoice-${formatInvoiceNo(orderData.order.order_id)}.pdf`);
  };

  // Helper function to format the date as dd/mm/yyyy
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Helper function to format invoice number (with leading zeros)
  const formatInvoiceNo = (orderId) => {
    return orderId.toString().padStart(5, '0');
  };

  return (
    <div className="invoice-container">

      {/* Invoice Details */}
      <h1 className="invoice-header">Invoice</h1>
      <p className="invoice-subheader">Thank you for your purchase! Here's your invoice.</p>
      <h2 className="invoice-number">Invoice No: {formatInvoiceNo(orderData.order.order_id)}</h2>
      <p className="invoice-details">Billing Address: {orderData.order.delivery_address}</p>
      <p className="invoice-details">Issue Date: {formatDate(orderData.order.order_date)}</p>
      <h3 className="invoice-items-heading">Items</h3>
      <table className="invoice-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {orderData.items.map((item, index) => (
            <tr key={item.order_item_id} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f9f9f9' }}>
              <td>{item.product_name}</td>
              <td>{item.quantity}</td>
              <td>{parseFloat(item.price_at_purchase).toFixed(2)}</td>
              <td>{(parseFloat(item.price_at_purchase) * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3 className="invoice-total">Total Amount: {orderData.order.total_price}</h3>

      <div className="invoice-footer">

        {/* Back to Profile Button */}
        <Button
          variant="contained"
          color="primary" // Blue button
          onClick={() => navigate("/profile")}
        >
          Back to Profile
        </Button>

        {/* Download PDF Button */}
        <Button
          variant="outlined" // Red outline button
          onClick={downloadPDF}
          sx={{
            color: 'red', // Red text
            borderColor: 'red', // Red outline
            backgroundColor: 'white', // White background
            '&:hover': {
              backgroundColor: '#ffe6e6', // Light red background on hover
              borderColor: 'darkred', // Darker red outline on hover
            },
            marginRight: '10px', // Add spacing between buttons
          }}
        >
          Download PDF
        </Button>

      </div>

    </div>
  );
};

export default InvoicePage;