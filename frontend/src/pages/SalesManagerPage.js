import React, { useState, useEffect } from 'react';
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
  TextField,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DrawerMenu from '../components/DrawerMenu';
import Footer from '../components/Footer';
import axios from 'axios';
import "./SalesManagerPage.css";
import FilterListIcon from '@mui/icons-material/FilterList';
import { jsPDF } from "jspdf"; // for invoices

// Chart imports:
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts';


const API_URL = process.env.REACT_APP_API_URL;

const SalesManagerPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('Sales per Product');

  const [revenueData, setRevenueData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartError, setChartError] = useState(null);
  // For date range (optional, for future)
  const [chartStartDate, setChartStartDate] = useState('2025-03-01');
  const [chartEndDate, setChartEndDate] = useState('2025-06-01');
  const [productSalesData, setProductSalesData] = useState([]);
  const [productSalesLoading, setProductSalesLoading] = useState(false);
  const [productSalesError, setProductSalesError] = useState(null);


  // for sales campaigns
  const [salesCampaigns, setSalesCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(""); // Default to no filter

  // for invoices
  const [invoices, setInvoices] = useState([]);
  const [invoicesLoading, setInvoicesLoading] = useState(false);
  const [invoicesError, setInvoicesError] = useState(null);
  const [invoiceStartDate, setInvoiceStartDate] = useState('2025-05-01');
  const [invoiceEndDate, setInvoiceEndDate] = useState('2025-06-01');


  // for returns
  const [returns, setReturns] = useState([]);
  const [returnsLoading, setReturnsLoading] = useState(false);
  const [returnsError, setReturnsError] = useState(null);
  // "", "pending", "approved", "rejected"
  const [returnsFilter, setReturnsFilter] = useState("");


  // for creating new sales campaigns
  const [newCampaign, setNewCampaign] = useState({
    productId: "",
    discountPercent: "",
    startDate: new Date().toISOString().split("T")[0], // Default to today
    endDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0], // Default to tomorrow
  });

  const [products, setProducts] = useState([]); // For the product dropdown

  // State for manager profile
  const [managerInfo, setManagerInfo] = useState(null);

  // Fetch manager profile
  useEffect(() => {
    const fetchManagerProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setManagerInfo(response.data.user);
      } catch (err) {
        console.error('Failed to fetch manager profile:', err);
        setError('Failed to load manager profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchManagerProfile();
  }, []);

  // Fetch sales data for charts
  useEffect(() => {
    if (activeSection === 'Charts') {
      const fetchRevenueData = async () => {
        setChartLoading(true);
        setChartError(null);
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(
            `${API_URL}/orders/stats/daily-revenue-profit/date-range`,
            {
              headers: { Authorization: `Bearer ${token}` },
              params: {
                startDate: chartStartDate,
                endDate: chartEndDate,
              },
            }
          );
          setRevenueData(response.data);
        } catch (err) {
          setChartError('Failed to load revenue data');
        } finally {
          setChartLoading(false);
        }
      };
      fetchRevenueData();
    }
  }, [activeSection, chartStartDate, chartEndDate]);

  useEffect(() => {
    if (activeSection === 'Charts') {
      const fetchProductSales = async () => {
        setProductSalesLoading(true);
        setProductSalesError(null);
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(
            `${API_URL}/orders/stats/products`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setProductSalesData(response.data);
        } catch (err) {
          setProductSalesError('Failed to load product sales data');
        } finally {
          setProductSalesLoading(false);
        }
      };
      fetchProductSales();
    }
  }, [activeSection]);

  // Fetch sales campaigns
  useEffect(() => {
    const fetchSalesCampaigns = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_URL}/sales-campaigns/details`);
        setSalesCampaigns(response.data);
      } catch (err) {
        console.error("Failed to fetch sales campaigns:", err);
        setError("Failed to load sales campaigns. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSalesCampaigns();
  }, []);

  // Fetch sales campaigns with filter
  useEffect(() => {
    const fetchSalesCampaigns = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_URL}/sales-campaigns/details`, {
          params: { filter }, // Pass the filter as a query parameter
        });
        setSalesCampaigns(response.data);
      } catch (err) {
        console.error("Failed to fetch sales campaigns:", err);
        setError("Failed to load sales campaigns. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSalesCampaigns();
  }, [filter]); // Re-fetch campaigns when the filter changes

  const deleteSalesCampaign = async (salesId) => {
    try {
      await axios.delete(`${API_URL}/sales-campaigns/${salesId}`);
      // Refresh the sales campaigns list after deletion
      const response = await axios.get(`${API_URL}/sales-campaigns/details`, {
        params: { filter }, // Pass the current filter
      });
      setSalesCampaigns(response.data);
    } catch (err) {
      console.error("Failed to delete sales campaign:", err);
      alert("Failed to delete sales campaign. Please try again.");
    }
  };

  // Fetch products for the dropdown
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/products`); // Fetch products from the new endpoint
        setProducts(response.data); // Set the products in state
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    fetchProducts();
  }, []);

  // Handle form submission
  const handleCreateCampaign = async () => {
    try {
      const { productId, discountPercent, startDate, endDate } = newCampaign;

      // Validate inputs
      if (!productId || !discountPercent || !startDate || !endDate) {
        alert("Please fill in all fields.");
        return;
      }
      if (discountPercent < 1 || discountPercent > 99) {
        alert("Discount percent must be between 1 and 99.");
        return;
      }
      if (new Date(endDate) < new Date(startDate)) {
        alert("End date cannot be before start date.");
        return;
      }

      await axios.post(`${API_URL}/sales-campaigns`, {
        productId,
        discountPercent,
        startDate,
        endDate,
      });

      // Refresh the sales campaigns list
      const response = await axios.get(`${API_URL}/sales-campaigns/details`, {
        params: { filter },
      });
      setSalesCampaigns(response.data);

      // Reset the form
      setNewCampaign({
        productId: "",
        discountPercent: "",
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0],
      });

      alert("Sales campaign created successfully!");
    } catch (err) {
      console.error("Failed to create sales campaign:", err);
      alert(err.response?.data?.message || "Failed to create sales campaign. Please try again.");
    }
  };

  // Fetch invoices when section or date range changes
  useEffect(() => {
    if (activeSection === 'Invoices') {
      const fetchInvoices = async () => {
        setInvoicesLoading(true);
        setInvoicesError(null);
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(
            `${API_URL}/orders/orders-between-dates`,
            {
              headers: { Authorization: `Bearer ${token}` },
              params: {
                startDate: invoiceStartDate,
                endDate: invoiceEndDate,
              },
            }
          );
          setInvoices(response.data);
        } catch (err) {
          setInvoicesError('Failed to load invoices.');
        } finally {
          setInvoicesLoading(false);
        }
      };
      fetchInvoices();
    }
  }, [activeSection, invoiceStartDate, invoiceEndDate]);

  const handleDownloadInvoicePDF = async (orderId) => {
    try {
      const response = await axios.get(`${API_URL}/orders/with-items-public/${orderId}`);
      const { order, items } = response.data;

      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.text('Invoice', 14, 20);

      doc.setFontSize(14);
      doc.text(`Invoice No: ${String(order.order_id).padStart(5, '0')}`, 14, 30);
      doc.text(`Billing Address: ${order.delivery_address}`, 14, 40);
      doc.text(`Issue Date: ${formatDate(order.order_date)}`, 14, 50);

      doc.text('Items', 14, 60);
      doc.text('Product Name', 14, 70);
      doc.text('Quantity', 100, 70);
      doc.text('Unit Price', 140, 70);
      doc.text('Amount', 180, 70);

      let y = 80;
      items.forEach((item) => {
        const price = parseFloat(item.price_at_purchase) || 0;
        const amount = price * item.quantity;
        doc.text(item.product_name, 14, y);
        doc.text(item.quantity.toString(), 100, y);
        doc.text(price.toFixed(2), 140, y);
        doc.text(amount.toFixed(2), 180, y);
        y += 10;
      });

      doc.text(`Total Amount: ${order.total_price}`, 14, y + 10);
      doc.save(`invoice-${String(order.order_id).padStart(5, '0')}.pdf`);
    } catch (err) {
      alert("Failed to generate PDF");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Fetch returns when section or filter changes
  useEffect(() => {
    if (activeSection === 'Return Requests') {
      const fetchReturns = async () => {
        setReturnsLoading(true);
        setReturnsError(null);
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`${API_URL}/returns`, {
            headers: { Authorization: `Bearer ${token}` },
            params: returnsFilter ? { status: returnsFilter } : {},
          });
          setReturns(response.data);
        } catch (err) {
          setReturnsError('Failed to load returns. Please try again.');
        } finally {
          setReturnsLoading(false);
        }
      };
      fetchReturns();
    }
  }, [activeSection, returnsFilter]);

  const updateReturnStatus = async (returnId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_URL}/returns/${returnId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Refresh the returns list after updating
      const response = await axios.get(`${API_URL}/returns`, {
        headers: { Authorization: `Bearer ${token}` },
        params: returnsFilter ? { status: returnsFilter } : {},
      });
      setReturns(response.data);
    } catch (err) {
      alert('Failed to update return status. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };


  const renderContent = () => {
    const maxRevenue = Math.max(...productSalesData.map(d => d.total_revenue || 0), 0);
    const maxTotalRevenue = Math.max(...revenueData.map(d => d.total_revenue || 0), 0);
    switch (activeSection) {
      case 'Charts':
        return (
          <Card variant="outlined" style={{ marginBottom: '20px', padding: '20px' }}>
          <Typography variant="h6" gutterBottom>
            Charts Overview
          </Typography>

          {/* Date range picker */}
          <div style={{ display: "flex", gap: "40px", marginBottom: "20px" }}>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <Typography><strong>Start Date:</strong></Typography>
              {["Year", "Month", "Day"].map((label, index) => (
                <TextField
                  key={label}
                  label={label}
                  type="number"
                  value={chartStartDate.split("-")[index]}
                  onChange={e => {
                    const [y, m, d] = chartStartDate.split("-");
                    const values = [y, m, d];
                    values[index] = e.target.value.padStart(2, "0");
                    setChartStartDate(values.join("-"));
                  }}
                  style={{ width: "120px", height: "40px" }}
                  inputProps={{ min: 1 }}
                />
              ))}
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <Typography><strong>End Date:</strong></Typography>
              {["Year", "Month", "Day"].map((label, index) => (
                <TextField
                  key={label}
                  label={label}
                  type="number"
                  value={chartEndDate.split("-")[index]}
                  onChange={e => {
                    const [y, m, d] = chartEndDate.split("-");
                    const values = [y, m, d];
                    values[index] = e.target.value.padStart(2, "0");
                    setChartEndDate(values.join("-"));
                  }}
                  style={{ width: "120px", height: "40px" }}
                  inputProps={{ min: 1 }}
                />
              ))}
            </div>
          </div>

          <Divider className="chart-section-divider"></Divider>

          {/* Combined Line Chart: Total Revenue and Profits */}
          <Typography variant="h6" gutterBottom>
            Line Chart for Total Revenue and Profits
          </Typography>
          {chartLoading ? (
            <CircularProgress />
          ) : chartError ? (
            <Typography color="error">{chartError}</Typography>
          ) : (
            <ResponsiveContainer 
              width="100%"
              height={400} // Adjusted height for better spacing
            > {/* Increased height for better spacing */}
              <LineChart data={revenueData} margin={{ top: 40, right: 30, left: 0, bottom: 5 }}> {/* Increased top margin */}
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  angle={-45}
                  textAnchor="end"
                  tick={{ fill: "#222", fontWeight: 600, fontSize: 13 }}
                  height={60}
                />
                <YAxis
                  tick={{ fill: "#222", fontWeight: 600, fontSize: 13 }}
                  tickFormatter={v => `$${v}`}
                  padding={{ top: 20 }} // Add padding to the top of Y-axis
                  domain={[0, maxTotalRevenue]} // Set the domain to start from 0 to max revenue
                />
                <Tooltip formatter={v => `$${v}`} />
                <Legend verticalAlign="top" height={36}/> {/* Legend for combined lines */}
                <Line type="monotone" dataKey="total_revenue" stroke="#1976d2" strokeWidth={3} name="Total Revenue" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="total_profit" stroke="#43a047" strokeWidth={3} name="Total Profit" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          )}

          <Divider className="chart-section-divider" style={{
            margin: '32px 0 24px 0',
            backgroundColor: '#eeeeee',
            height: '2px',
          }}/>

          {/* Combined Bar Chart: Total Revenue and Profits */}
          <Typography variant="h6" gutterBottom>
            Bar Chart for Total Revenue and Profits
          </Typography>
          {chartLoading ? (
            <CircularProgress />
          ) : chartError ? (
            <Typography color="error">{chartError}</Typography>
          ) : (
            <ResponsiveContainer 
              width="100%" 
              height={400}
            > {/* Increased height for better spacing */}
              <BarChart data={revenueData} margin={{ top: 40, right: 30, left: 0, bottom: 5 }}> {/* Increased top margin */}
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  angle={-45}
                  textAnchor="end"
                  tick={{ fill: "#222", fontWeight: 600, fontSize: 13 }}
                  height={60}
                />
                <YAxis
                  tick={{ fill: "#222", fontWeight: 600, fontSize: 13 }}
                  tickFormatter={v => `$${v}`}
                  padding={{ top: 20 }} // Add padding to the top of Y-axis
                  domain={[0, maxTotalRevenue]} // Set the domain to start from 0 to max revenue
                />
                <Tooltip formatter={v => `$${v}`} />
                <Legend verticalAlign="top" height={36}/> {/* Legend for combined bars */}
                <Bar dataKey="total_revenue" fill="#1976d2" name="Total Revenue" />
                <Bar dataKey="total_profit" fill="#43a047" name="Total Profit" />
              </BarChart>
            </ResponsiveContainer>
          )}

          <Divider className="chart-section-divider" style={{
            margin: '32px 0 24px 0',
            backgroundColor: '#eeeeee',
            height: '2px',
          }}/>

          <Typography variant="subtitle1" gutterBottom>
            Bar Chart: Sales per Product
          </Typography>
          {productSalesLoading ? (
            <CircularProgress />
          ) : productSalesError ? (
            <Typography color="error">{productSalesError}</Typography>
          ) : (
            <ResponsiveContainer width="100%" height={650}>
              <BarChart
                data={productSalesData}
                margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="product_name"
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                  tick={{ fill: "#222", fontWeight: 600, fontSize: 13 }}
                  height={80}
                />
                <YAxis
                  tick={{ fill: "#222", fontWeight: 600, fontSize: 13 }}
                  tickFormatter={v => `$${v}`}
                  padding={{ top: 20 }} // Add padding to the top of Y-axis
                  domain={[0, maxRevenue]} // Set the domain to start from 0 to max revenue
                />
                <Tooltip formatter={v => `$${v}`} />
                <Legend verticalAlign="top" height={36}/>
                <Bar dataKey="total_revenue" fill="#e57373" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        
        );
      case 'Sales Campaigns':
        return (
          <Card variant="outlined" style={{ marginBottom: '20px', padding: '20px' }}>
            <CardContent>
              <Typography variant="h5">Sales Campaigns</Typography>

              {/* Create Campaign */}
              <Card variant="outlined" style={{ marginBottom: "20px", padding: "20px" }}>
                <Typography variant="h6" gutterBottom>
                  Create New Sales Campaign
                </Typography>

                {/* Inputs Row 1: Product & Discount */}
                <div style={{ display: "flex", gap: "20px", marginBottom: "15px" }}>
                  <FormControl fullWidth>
                    <InputLabel id="product-label">Select Product</InputLabel>
                    <Select
                      labelId="product-label"
                      value={newCampaign.productId}
                      onChange={(event) => setNewCampaign({ ...newCampaign, productId: event.target.value })}
                    >
                      {products.map((product) => (
                        <MenuItem key={product.product_id} value={product.product_id}>
                          {product.product_id} - {product.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    label="Discount Percent"
                    type="number"
                    value={newCampaign.discountPercent}
                    onChange={(event) => setNewCampaign({ ...newCampaign, discountPercent: event.target.value })}
                    inputProps={{ min: 1, max: 99 }}
                  />
                </div>

                {/* Inputs Row 2: Start & End Date */}
                <div style={{ display: "flex", gap: "40px", marginBottom: "20px" }}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <Typography><strong>Start Date:</strong></Typography>
                    {["Year", "Month", "Day"].map((label, index) => (
                      <TextField
                        key={label}
                        label={label}
                        type="number"
                        value={newCampaign.startDate.split("-")[index]}
                        onChange={(e) => {
                          const [y, m, d] = newCampaign.startDate.split("-");
                          const values = [y, m, d];
                          values[index] = e.target.value.padStart(2, "0");
                          setNewCampaign({ ...newCampaign, startDate: values.join("-") });
                        }}
                        style={{ width: "120px", height: "40px" }}
                        inputProps={{ min: 1 }}
                      />
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <Typography><strong>End Date:</strong></Typography>
                    {["Year", "Month", "Day"].map((label, index) => (
                      <TextField
                        key={label}
                        label={label}
                        type="number"
                        value={newCampaign.endDate.split("-")[index]}
                        onChange={(e) => {
                          const [y, m, d] = newCampaign.endDate.split("-");
                          const values = [y, m, d];
                          values[index] = e.target.value.padStart(2, "0");
                          setNewCampaign({ ...newCampaign, endDate: values.join("-") });
                        }}
                        style={{ width: "120px", height: "40px" }}
                        inputProps={{ min: 1 }}
                      />
                    ))}
                  </div>

                  {/* Button */}
                  <Button
                    variant="contained"
                    color="primary"
                    size="medium"
                    style={{ 
                      alignSelf: "flex-start", 
                      width: "fit-content", 
                      padding: "5px 19px",
                      fontSize: "16px",
                      height: "45px",
                    }}
                    onClick={handleCreateCampaign}
                  >
                    Create Campaign
                  </Button>
                </div>

              </Card>

              {/* Filter Section */}
              <div style={{ display: "flex", alignItems: "center", marginBottom: "20px", gap: "10px" }}>
                <FilterListIcon />
                <FormControl style={{ minWidth: 200 }}>
                  <InputLabel id="filter-label">Filter Campaigns</InputLabel>
                  <Select
                    labelId="filter-label"
                    value={filter}
                    onChange={(event) => setFilter(event.target.value)}
                  >
                    <MenuItem value="">All Campaigns</MenuItem>
                    <MenuItem value="ongoing">Ongoing</MenuItem>
                    <MenuItem value="not-started">Not Started</MenuItem>
                    <MenuItem value="ended">Ended</MenuItem>
                  </Select>
                </FormControl>
              </div>

              {/* Current Campaigns */}
              <Typography variant="h6" gutterBottom>
                Current Sales Campaigns
              </Typography>
              {loading ? (
                <CircularProgress />
              ) : error ? (
                <Typography color="error">{error}</Typography>
              ) : salesCampaigns.length === 0 ? (
                <Typography>No sales campaigns found.</Typography>
              ) : (
                <List>
                  {salesCampaigns.map((campaign) => (
                    <Card
                      key={campaign.sales_id}
                      variant="outlined"
                      style={{
                        marginBottom: "12px",
                        padding: "12px 16px",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        backgroundColor: "#fafafa",
                      }}
                    >
                      <CardContent style={{ padding: 0 }}>
                        <Typography variant="subtitle1" style={{ fontWeight: 600 }}>
                          Campaign ID: {campaign.sales_id}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Product:</strong> {campaign.product_name} (ID: {campaign.product_id})
                        </Typography>
                        <Typography variant="body2">
                          <strong>Original Price:</strong> ${campaign.original_price.toFixed(2)}, <strong>Discounted Price:</strong> ${campaign.discounted_price.toFixed(2)}, <strong>Discount Percent:</strong> {campaign.discount_percent}%
                        </Typography>
                        <Typography variant="body2">
                          <strong>Start Date:</strong> {new Date(campaign.start_date).toLocaleDateString()},
                          <strong> End Date:</strong> {new Date(campaign.end_date).toLocaleDateString()},
                          <strong> Status:</strong> {campaign.campaign_status}
                        </Typography>
                        <div style={{ marginTop: "10px" }}>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => deleteSalesCampaign(campaign.sales_id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
          );
      case 'Price Management':
        return (
          <Card variant="outlined" style={{ marginBottom: '20px' }}>
            <CardContent>
              <Typography variant="h6">Price Management</Typography>
              <List>
                <ListItem>Set product prices</ListItem>
                {/* <ListItem>- Apply discounts to selected items</ListItem> */}
                {/* <ListItem>- Notify users with items in their wishlist</ListItem> */}
              </List>
            </CardContent>
          </Card>
        );
      case 'Invoices':
        return (
        <Card variant="outlined" style={{ marginBottom: '20px', padding: '20px' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Invoices
            </Typography>
            {/* Date Range Picker */}
            <div style={{ display: "flex", gap: "40px", marginBottom: "20px" }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <Typography><strong>Start Date:</strong></Typography>
                {["Year", "Month", "Day"].map((label, index) => (
                  <TextField
                    key={label}
                    label={label}
                    type="number"
                    value={invoiceStartDate.split("-")[index]}
                    onChange={e => {
                      const [y, m, d] = invoiceStartDate.split("-");
                      const values = [y, m, d];
                      values[index] = e.target.value.padStart(2, "0");
                      setInvoiceStartDate(values.join("-"));
                    }}
                    style={{ width: "120px", height: "40px" }}
                    inputProps={{ min: 1 }}
                  />
                ))}
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <Typography><strong>End Date:</strong></Typography>
                {["Year", "Month", "Day"].map((label, index) => (
                  <TextField
                    key={label}
                    label={label}
                    type="number"
                    value={invoiceEndDate.split("-")[index]}
                    onChange={e => {
                      const [y, m, d] = invoiceEndDate.split("-");
                      const values = [y, m, d];
                      values[index] = e.target.value.padStart(2, "0");
                      setInvoiceEndDate(values.join("-"));
                    }}
                    style={{ width: "120px", height: "40px" }}
                    inputProps={{ min: 1 }}
                  />
                ))}
              </div>
            </div>
            <Divider style={{ marginBottom: '20px' }} />
            {invoicesLoading ? (
              <CircularProgress />
            ) : invoicesError ? (
              <Typography color="error">{invoicesError}</Typography>
            ) : invoices.length === 0 ? (
              <Typography>No invoices found for this date range.</Typography>
            ) : (
              <List>
                {invoices.map((invoice) => (
                  <ListItem
                    key={invoice.order_id}
                    style={{
                      padding: '15px',
                      border: '1px solid #ddd',
                      marginBottom: '10px',
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      background: '#fafafa',
                    }}
                  >
                    <ListItemText
                      primary={`Order ID: ${invoice.order_id}`}
                      secondary={
                        <>
                          <div><strong>Status:</strong> {invoice.status}</div>
                          <div><strong>Address:</strong> {invoice.delivery_address}</div>
                          <div><strong>Tracking Number:</strong> {invoice.tracking_number || 'N/A'}</div>
                          <div><strong>Issued Date:</strong> {invoice.order_date ? new Date(invoice.order_date).toLocaleString() : 'N/A'}</div>
                          {/* Only show invoice URL if not null */}
                          {invoice.invoice_pdf_url && (
                            <div><strong>Invoice URL:</strong> <a href={invoice.invoice_pdf_url} target="_blank" rel="noopener noreferrer">{invoice.invoice_pdf_url}</a></div>
                          )}
                        </>
                      }
                    />
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      <Button
                        variant="outlined"
                        onClick={() => handleDownloadInvoicePDF(invoice.order_id)}
                        sx={{
                          color: 'red',
                          borderColor: 'red',
                          backgroundColor: 'white',
                          '&:hover': {
                            backgroundColor: '#ffe6e6',
                            borderColor: 'darkred',
                          },
                        }}
                      >
                        PDF
                      </Button>
                    </div>
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
        );
        case 'Return Requests':
          return (
            <Card variant="outlined" style={{ marginBottom: '20px', padding: '20px' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Return Requests
                </Typography>
                {/* Filter Dropdown */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '10px' }}>
                  <FilterListIcon />
                  <FormControl style={{ minWidth: 200 }}>
                    <InputLabel id="returns-filter-label">Filter by Status</InputLabel>
                    <Select
                      labelId="returns-filter-label"
                      value={returnsFilter}
                      onChange={(event) => setReturnsFilter(event.target.value)}
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="approved">Approved</MenuItem>
                      <MenuItem value="rejected">Rejected</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                {returnsLoading ? (
                  <CircularProgress />
                ) : returnsError ? (
                  <Typography color="error">{returnsError}</Typography>
                ) : returns.length === 0 ? (
                  <Typography>No return requests found.</Typography>
                ) : (
                  <List>
                    {returns.map((ret) => (
                      <ListItem
                        key={ret.return_id}
                        style={{
                          padding: '15px',
                          border: '1px solid #ddd',
                          marginBottom: '10px',
                          borderRadius: '8px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                        }}
                      >
                        <ListItemText
                          primary={`Return ID: ${ret.return_id}`}
                          secondary={
                            <>
                              <div><strong>Status:</strong> {ret.status}</div>
                              <div><strong>Order ID:</strong> {ret.order_id}</div>
                              <div><strong>User ID:</strong> {ret.user_id}</div>
                              <div><strong>Refund Amount:</strong> {ret.refund_amount ?? 'N/A'}</div>
                              <div><strong>Requested At:</strong> {new Date(ret.request_date).toLocaleString()}</div>
                            </>
                          }
                        />
                        {/* Approve/Reject buttons */}
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                          {/* Approve Button */}
                          <Button
                            variant="contained"
                            color="success"
                            disabled={ret.status === 'approved'}
                            onClick={() => updateReturnStatus(ret.return_id, 'approved')}
                          >
                            Approve
                          </Button>
                          {/* Reject Button */}
                          <Button
                            variant="contained"
                            color="error"
                            disabled={ret.status === 'approved' || ret.status === 'rejected'}
                            onClick={() => updateReturnStatus(ret.return_id, 'rejected')}
                          >
                            Reject
                          </Button>
                        </div>
                      </ListItem>
                    ))}
                  </List>
                )}
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
              color: activeSection === 'Charts' ? '#1976d2' : 'inherit',
              fontWeight: activeSection === 'Charts' ? 'bold' : 'normal',
              fontSize: '1.3em',
            }}
            onClick={() => setActiveSection('Charts')}
          >
            Charts
          </div>

          <List style={{ paddingLeft: '10px' }}>
            <ListItem>View & Analyze Charts</ListItem>
          </List>

          <Divider style={{ marginBottom: '10px' }} />

          <div
            style={{
              cursor: 'pointer',
              marginBottom: '10px',
              color: activeSection === 'Sales Campaigns' ? '#1976d2' : 'inherit',
              fontWeight: activeSection === 'Sales Campaigns' ? 'bold' : 'normal',
              fontSize: '1.3em',
            }}
            onClick={() => setActiveSection('Sales Campaigns')}
          >
            Sales Campaigns
          </div>

          <List style={{ paddingLeft: '10px' }}>
            <ListItem>View & Update Campaigns</ListItem>
          </List>

          <Divider style={{ marginBottom: '10px' }} />

          <div
            style={{
              cursor: 'pointer',
              marginBottom: '10px',
              color: activeSection === 'Price Management' ? '#1976d2' : 'inherit',
              fontWeight: activeSection === 'Price Management' ? 'bold' : 'normal',
              fontSize: '1.3em',
            }}
            onClick={() => setActiveSection('Price Management')}
          >
            Price Management
          </div>

          <List style={{ paddingLeft: '10px'}}>
            <ListItem>Set prices for new products</ListItem>
            {/* <ListItem>Notify users about discounts</ListItem> */}
          </List>

          <Divider style={{ marginBottom: '10px' }} />

          <div
            style={{
              cursor: 'pointer',
              marginBottom: '10px',
              color: activeSection === 'Invoices' ? '#1976d2' : 'inherit',
              fontWeight: activeSection === 'Invoices' ? 'bold' : 'normal',
              fontSize: '1.3em',
            }}
            onClick={() => setActiveSection('Invoices')}
          >
            Invoices
          </div>

          <List style={{ paddingLeft: '10px' }}>
            <ListItem>View & Manage Invoices</ListItem>
          </List>

          <Divider style={{ marginBottom: '10px' }} />

          <div
            style={{
              cursor: 'pointer',
              marginBottom: '10px',
              color: activeSection === 'Return Requests' ? '#1976d2' : 'inherit',
              fontWeight: activeSection === 'Return Requests' ? 'bold' : 'normal',
              fontSize: '1.3em',
            }}
            onClick={() => setActiveSection('Return Requests')}
          >
            Return Requests
          </div>
          <List style={{ paddingLeft: '10px'}}>
            <ListItem>Manage Returns</ListItem>
          </List>
          <Divider style={{ marginBottom: '10px' }} />
          
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
          {managerInfo && (
            <div className="manager-profile-info">
              <Typography variant="h5" style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                Hello Sales Manager {managerInfo.username}
              </Typography>
              <Typography variant="body1">
                <strong>Role:</strong> Sales Manager
              </Typography>
              <Typography variant="body1">
                <strong>Email:</strong> {managerInfo.email}
              </Typography>
            </div>
          )}
          {renderContent()}
        </div>
      </div>

      <div style={{ marginBottom: '10px' }} />
      <Footer />
    </>
  );
};

export default SalesManagerPage;

