import React, { useState , useEffect } from 'react';
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
import axios from 'axios';
import DrawerMenu from '../components/DrawerMenu';
import './ProductManagerPage.css';
import FilterListIcon from "@mui/icons-material/FilterList";
import Footer from '../components/Footer';
import { jsPDF } from "jspdf";

const API_URL = process.env.REACT_APP_API_URL;

// used for the category management's filtering
const CATEGORY_ROOTS = [
  { label: "All", value: "all" },
  { label: "Men", value: 1 },
  { label: "Women", value: 2 },
  { label: "Kids", value: 3 },
];

const ProductManagerPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('Product & Category Management');
  const [deliveries, setDeliveries] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // for filtering deliveries
  const [filterStatusDeliveries, setFilterStatusDeliveries] = useState('');

  // for filtering comments
  const [filterStatusComments, setFilterStatusComments] = useState('');

  // for getting the manager info and displaying it
  const [managerInfo, setManagerInfo] = useState(null); // State to store manager info

  // for stock management
  const [productVariations, setProductVariations] = useState([]);
  const [loadingVariations, setLoadingVariations] = useState(false);
  const [errorVariations, setErrorVariations] = useState(null);

  // for category management
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [errorCategories, setErrorCategories] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("all");

  // For product filter dropdown
  const [productFilter, setProductFilter] = useState('all');
  const [productIdOptions, setProductIdOptions] = useState([]);

  const [stockInputs, setStockInputs] = useState({}); // { [variation_id]: value }
  const [updatingStock, setUpdatingStock] = useState({}); // { [variation_id]: true/false }

  const handleStockInputChange = (variation_id, value) => {
    // Only allow positive integers
    if (value === '' || /^\d+$/.test(value)) {
      setStockInputs((prev) => ({ ...prev, [variation_id]: value }));
    }
  };

  const handleUpdateStock = async (variation_id) => {
    const value = stockInputs[variation_id];
    if (!value || isNaN(value) || parseInt(value) < 0) {
      alert('Please enter a positive integer greater or equal to zero.');
      return;
    }
    setUpdatingStock((prev) => ({ ...prev, [variation_id]: true }));
    try {
      await axios.put(
        `${API_URL}/product-variations/${variation_id}/stock`,
        { stock_quantity: parseInt(value) }
      );
      // Refresh the table after update
      const url =
        productFilter === 'all'
          ? `${API_URL}/product-variations`
          : `${API_URL}/product-variations?product_id=${productFilter}`;
      const res = await axios.get(url);
      setProductVariations(res.data);
      setStockInputs((prev) => ({ ...prev, [variation_id]: '' }));
    } catch (err) {
      alert('Failed to update stock. Please try again.');
    } finally {
      setUpdatingStock((prev) => ({ ...prev, [variation_id]: false }));
    }
  };

  // Fetch product IDs for dropdown
  useEffect(() => {
    if (activeSection === 'Stock Management') {
      axios
        .get(`${API_URL}/product-variations/product-ids`)
        .then((res) => setProductIdOptions(res.data))
        .catch(() => setProductIdOptions([]));
    }
  }, [activeSection]);

  // Fetch product variations (filtered)
  useEffect(() => {
    if (activeSection === 'Stock Management') {
      setLoadingVariations(true);
      setErrorVariations(null);
      const url =
        productFilter === 'all'
          ? `${API_URL}/product-variations`
          : `${API_URL}/product-variations?product_id=${productFilter}`;
      axios
        .get(url)
        .then((res) => setProductVariations(res.data))
        .catch(() => setErrorVariations('Failed to load product variations.'))
        .finally(() => setLoadingVariations(false));
    }
  }, [activeSection, productFilter]);

  const handleProductFilterChange = (event) => {
    setProductFilter(event.target.value);
  };

  const handleDownloadPDF = async (orderId) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL;
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

  // Fetch manager profile only once when the component mounts
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
        setManagerInfo(response.data.user); // Store manager info in state
      } catch (err) {
        console.error('Failed to fetch manager profile:', err);
        setError('Failed to load manager profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchManagerProfile();
  }, []); // Empty dependency array ensures this runs only once

  const handleLogout = () => {
    localStorage.removeItem("token"); // removethe token
    navigate("/"); // go to landing page
  };

  // for fetching the info of the items
  useEffect(() => {
    if (activeSection === 'Delivery Management') {
      fetchDeliveries(filterStatusDeliveries); // Fetch deliveries when activeSection or filter changes
    }
  }, [activeSection, filterStatusDeliveries]); // Dependencies for fetching deliveries

  // Update useEffect to refetch comments when filter changes
  useEffect(() => {
    if (activeSection === 'Comment Moderation') {
      fetchComments();
    }
  }, [activeSection, filterStatusComments]);

  const fetchDeliveries = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const endpoint = filterStatusDeliveries
        ? `${API_URL}/deliveries/status/${filterStatusDeliveries}` // Fetch deliveries by status
        : `${API_URL}/deliveries`; // Fetch all deliveries
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDeliveries(response.data);
    } catch (err) {
      setError('Failed to fetch deliveries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to update delivery status (to shipped or delivered)
  const updateDeliveryStatus = async (deliveryId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_URL}/deliveries/${deliveryId}/status`,
        { delivery_status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Refresh the deliveries list after updating
      fetchDeliveries(filterStatusDeliveries);
    } catch (err) {
      console.error('Failed to update delivery status:', err);
      alert('Failed to update delivery status. Please try again.');
    }
  };

  const handleFilterChange = (event) => {
    setFilterStatusDeliveries(event.target.value);
  };

  // Fetch all comments
  const fetchComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const endpoint = filterStatusComments
        ? `${API_URL}/reviews?status=${filterStatusComments}` // Fetch comments by status
        : `${API_URL}/reviews`; // Fetch all comments
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComments(response.data);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
      setError('Failed to load comments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to update comment status
  const updateCommentStatus = async (reviewId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_URL}/reviews/${reviewId}/status`,
        { newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Refresh the comments list after updating
      fetchComments();
    } catch (err) {
      console.error('Failed to update comment status:', err);
      alert('Failed to update comment status. Please try again.');
    }
  };

  // Fetch all product variations when Stock Management is active
  useEffect(() => {
    if (activeSection === 'Stock Management') {
      setLoadingVariations(true);
      setErrorVariations(null);
      axios
        .get(`${API_URL}/product-variations`)
        .then((res) => setProductVariations(res.data))
        .catch(() => setErrorVariations('Failed to load product variations.'))
        .finally(() => setLoadingVariations(false));
    }
  }, [activeSection]);

  // Handle filter change
  const handleCommentFilterChange = (event) => {
    setFilterStatusComments(event.target.value);
  };

  // Fetch all categories when Category Management is active
  // Fetch categories with filter
  useEffect(() => {
    if (activeSection === 'Category Management') {
      setLoadingCategories(true);
      setErrorCategories(null);
      let url;
      if (categoryFilter === "all") {
        url = `${API_URL}/categories`;
      } else {
        url = `${API_URL}/categories/descendants/${categoryFilter}`;
      }
      axios
        .get(url)
        .then((res) => setCategories(res.data))
        .catch(() => setErrorCategories('Failed to load categories.'))
        .finally(() => setLoadingCategories(false));
    }
  }, [activeSection, categoryFilter]);
  // useEffect(() => {
  //   if (activeSection === 'Category Management') {
  //     setLoadingCategories(true);
  //     setErrorCategories(null);
  //     axios
  //       .get(`${API_URL}/categories`)
  //       .then((res) => setCategories(res.data))
  //       .catch(() => setErrorCategories('Failed to load categories.'))
  //       .finally(() => setLoadingCategories(false));
  //   }
  // }, [activeSection]);

  const renderContent = () => {
    switch (activeSection) {
      
      // stock management
      case 'Stock Management':
        return (
          <div className="scrollable-content">
            <Card variant="outlined" style={{ marginBottom: '20px' }}>
              <CardContent>
                <Typography variant="h6" style={{ marginBottom: '20px', fontWeight: 'bold' }}>
                  Stock Management
                </Typography>

                {/* Filter Dropdown */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                  <FilterListIcon style={{ marginRight: '8px', color: 'rgba(0, 0, 0, 0.54)' }} />
                  <FormControl style={{ minWidth: 250 }}>
                    <InputLabel id="product-filter-label">Filter by Product</InputLabel>
                    <Select
                      labelId="product-filter-label"
                      value={productFilter}
                      label="Filter by Product"
                      onChange={handleProductFilterChange}
                    >
                      <MenuItem value="all">All</MenuItem>
                      {productIdOptions.map((opt) => (
                        <MenuItem key={opt.product_id} value={opt.product_id}>
                          {opt.product_id} - {opt.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                {loadingVariations ? (
                  <CircularProgress />
                ) : errorVariations ? (
                  <Typography color="error">{errorVariations}</Typography>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th style={{ border: '1px solid #ddd', padding: '8px' }}>Product ID</th>
                          <th style={{ border: '1px solid #ddd', padding: '8px' }}>Product Name</th>
                          <th style={{ border: '1px solid #ddd', padding: '8px' }}>Variation ID</th>
                          <th style={{ border: '1px solid #ddd', padding: '8px' }}>Size ID</th>
                          <th style={{ border: '1px solid #ddd', padding: '8px' }}>Color ID</th>
                          <th style={{ border: '1px solid #ddd', padding: '8px' }}>Stock Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                          {productVariations.map((row) => (
                          <tr key={row.variation_id}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.product_id}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.product_name}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.variation_id}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.size_id}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.color_id}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.stock_quantity}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px', minWidth: 180 }}>
                              <input
                                type="number"
                                min="0"
                                step="1"
                                style={{ width: 70, marginRight: 8, padding: 4 }}
                                value={stockInputs[row.variation_id] || ''}
                                onChange={(e) => handleStockInputChange(row.variation_id, e.target.value)}
                              />
                              <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                disabled={
                                  updatingStock[row.variation_id] ||
                                  !stockInputs[row.variation_id] ||
                                  isNaN(stockInputs[row.variation_id]) ||
                                  parseInt(stockInputs[row.variation_id]) < 0
                                }
                                onClick={() => handleUpdateStock(row.variation_id)}
                              >
                                {updatingStock[row.variation_id] ? <CircularProgress size={18} /> : 'Update'}
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      // product management
      case 'Product Management':
        return (
          <div className="scrollable-content">
            <Card variant="outlined" style={{ marginBottom: '20px' }}>
              <CardContent>
                <Typography variant="h6">Product Management</Typography>
                <List>
                  <ListItem>Add or remove products</ListItem>
                </List>
              </CardContent>
            </Card>
          </div>
        );

      // category management
      case 'Category Management':
        return (
          <div className="scrollable-content">
            <Card variant="outlined" style={{ marginBottom: '20px', maxHeight: 600, overflowY: 'auto' }}>
              <CardContent>
                <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: 16 }}>
                  Category Management
                </Typography>
                {/* Filter Dropdown */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                  <FilterListIcon style={{ marginRight: 8, color: 'rgba(0,0,0,0.54)' }} />
                  <FormControl style={{ minWidth: 180 }}>
                    <InputLabel id="category-filter-label">Filter by</InputLabel>
                    <Select
                      labelId="category-filter-label"
                      value={categoryFilter}
                      label="Filter by"
                      onChange={e => setCategoryFilter(e.target.value)}
                    >
                      {CATEGORY_ROOTS.map(opt => (
                        <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                {loadingCategories ? (
                  <CircularProgress />
                ) : errorCategories ? (
                  <Typography color="error">{errorCategories}</Typography>
                ) : (
                  <List>
                    {categories.length === 0 ? (
                      <Typography>No categories found.</Typography>
                    ) : (
                      categories.map((cat) => (
                        <ListItem
                          key={cat.category_id}
                          style={{
                            border: '1px solid #ddd',
                            borderRadius: 8,
                            marginBottom: 10,
                            background: '#fafafa',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                          }}
                        >
                          <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                            ID: {cat.category_id}: {cat.category_name || cat.name}
                          </Typography>
                          {cat.parent_category_id && (
                            <Typography variant="body2" color="textSecondary">
                              Parent: {cat.parent_name || '-'} (ID: {cat.parent_category_id})
                            </Typography>
                          )}
                        </ListItem>
                      ))
                    )}
                  </List>
                )}
              </CardContent>
            </Card>
          </div>
        );

      // delivery management
      case 'Delivery Management':
        return (
          <div className="scrollable-content">
            <Card variant="outlined" style={{ marginBottom: '20px' }}>
              <CardContent>
                <Typography 
                  variant="h6"
                  style={{ marginBottom: '20px', fontWeight: 'bold' }}
                >
                    Delivery Management
                  </Typography>
                
                {/* Filter Dropdown with Icon */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                  <FilterListIcon style={{ marginRight: '8px', color: 'rgba(0, 0, 0, 0.54)' }} />
                  <FormControl style={{ minWidth: 200 }}>
                    <InputLabel id="filter-label">Delivery Status</InputLabel>
                    <Select
                      labelId="filter-label"
                      value={filterStatusDeliveries}
                      onChange={handleFilterChange}
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="shipped">Shipped</MenuItem>
                      <MenuItem value="delivered">Delivered</MenuItem>
                    </Select>
                  </FormControl>
                </div>

                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <Typography color="error">{error}</Typography>
                ) : (
                  <List>
                    {deliveries.length === 0 ? (
                      <Typography>No deliveries found.</Typography>
                    ) : (
                      deliveries.map((delivery) => (
                        <ListItem
                          key={delivery.delivery_id}
                          style={{
                            padding: '15px',
                            border: '1px solid #ddd',
                            marginBottom: '10px',
                            borderRadius: '8px',
                          }}
                        >
                          <ListItemText
                            primary={`Order ID: ${delivery.order_id}`}
                            secondary={
                              <>
                                <div><strong>Status:</strong> {delivery.delivery_status}</div>
                                <div><strong>Address:</strong> {delivery.delivery_address}</div>
                                <div><strong>Tracking Number:</strong> {delivery.tracking_number || 'N/A'}</div>
                                <div><strong>Issued Date:</strong> {new Date(delivery.shipped_date).toLocaleString()}</div>
                              </>
                            }
                            style={{ fontSize: '1.2em' }}
                          />
                          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            {/* download PDF button */}
                            <Button
                              variant="outlined"
                              onClick={() => handleDownloadPDF(delivery.order_id)}
                              sx={{
                                color: 'red',
                                borderColor: 'red',
                                backgroundColor: 'white',
                                '&:hover': {
                                  backgroundColor: '#ffe6e6',
                                  borderColor: 'darkred',
                                },
                                marginRight: '10px', // spacing between buttons
                              }}
                            >
                              PDF
                            </Button>

                            {/* Ship Button */}
                            <Button
                              variant="contained"
                              color="primary"
                              disabled={delivery.delivery_status !== 'pending'}
                              onClick={() => updateDeliveryStatus(delivery.delivery_id, 'shipped')}
                            >
                              Ship
                            </Button>

                            {/* Deliver Button */}
                            <Button
                              variant="contained"
                              color="success"
                              disabled={delivery.delivery_status === 'delivered'}
                              onClick={() => updateDeliveryStatus(delivery.delivery_id, 'delivered')}
                            >
                              Deliver
                            </Button>
                          </div>
                        </ListItem>
                      ))
                    )}
                  </List>
                )}
              </CardContent>
            </Card>
          </div>
        );

      // comment moderation
      case 'Comment Moderation':
        return (
          <div className="scrollable-content">
          <Card variant="outlined" style={{ marginBottom: '20px' }}>
            <CardContent>
              <Typography variant="h6" style={{ marginBottom: '20px', fontWeight: 'bold' }}>
                Comment Moderation
              </Typography>

              {/* Filter Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <FilterListIcon style={{ marginRight: '8px', color: 'rgba(0, 0, 0, 0.54)' }} />
                <FormControl style={{ minWidth: 200 }}>
                  <InputLabel id="comment-filter-label">Comment Status</InputLabel>
                  <Select
                    labelId="comment-filter-label"
                    value={filterStatusComments}
                    onChange={handleCommentFilterChange}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>
              </div>

              {loading ? (
                <CircularProgress />
              ) : error ? (
                <Typography color="error">{error}</Typography>
              ) : (
                <List>
                  {comments.length === 0 ? (
                    <Typography>No comments found.</Typography>
                  ) : (
                    comments.map((comment) => (
                      <ListItem
                        key={comment.review_id}
                        style={{
                          padding: '15px',
                          border: '1px solid #ddd',
                          marginBottom: '10px',
                          borderRadius: '8px',
                        }}
                      >
                        <ListItemText
                          primary={`Review ID: ${comment.review_id}`}
                          secondary={
                            <>
                              {/* <div><strong>Order ID:</strong> {comment.order_id || 'N/A'}</div> */}
                              <div><strong>Comment:</strong> {comment.comment || 'No comment provided'}</div>
                              <div><strong>Rating:</strong> {comment.rating}</div>
                              <div><strong>Status:</strong> {comment.comment_approval}</div>
                              <div>
                                <strong>Created At:</strong>{" "}
                                {comment.created_at && !isNaN(new Date(comment.created_at))
                                  ? new Date(comment.created_at).toLocaleString()
                                  : "N/A"}
                              </div>
                            </>
                          }
                        />
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                          {/* Approve Button */}
                          <Button
                            variant="contained"
                            color="success"
                            disabled={comment.comment_approval === 'approved'}
                            onClick={() => updateCommentStatus(comment.review_id, 'approved')}
                          >
                            Approve
                          </Button>
                          {/* Reject Button */}
                          <Button
                            variant="contained"
                            color="error"
                            disabled={comment.comment_approval === 'rejected'}
                            onClick={() => updateCommentStatus(comment.review_id, 'rejected')}
                          >
                            Reject
                          </Button>
                        </div>
                      </ListItem>
                    ))
                  )}
                </List>
              )}
            </CardContent>
          </Card>
        </div>
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
        <div
          style={{
            width: '450px',
            backgroundColor: '#f5f5f5',
            padding: '20px',
            borderLeft: '1px solid #ddd',
          }}
        >
          <Typography variant="h4" style={{ marginBottom: '20px', fontWeight: 'bold' }}>
            Product Manager Dashboard
          </Typography>
          <Divider style={{ marginBottom: '20px' }} />

          <div
            style={{
              cursor: 'pointer',
              marginBottom: '10px',
              color: activeSection === 'Stock Management' ? '#1976d2' : 'inherit',
              fontWeight: activeSection === 'Stock Management' ? 'bold' : 'normal',
              fontSize: '1.3em',
            }}
            onClick={() => setActiveSection('Stock Management')}
          >
            Stock Management
          </div>
          <List style={{ paddingLeft: '20px', marginBottom: '20px' }}>
            <ListItem>Update stock quantities</ListItem>
          </List>
          <Divider style={{ marginBottom: '20px' }} />

          <div
            style={{
              cursor: 'pointer',
              marginBottom: '10px',
              color: activeSection === 'Product Management' ? '#1976d2' : 'inherit',
              fontWeight: activeSection === 'Product Management' ? 'bold' : 'normal',
              fontSize: '1.3em',
            }}
            onClick={() => setActiveSection('Product Management')}
          >
            Product Management
          </div>
          <List style={{ paddingLeft: '20px', marginBottom: '20px' }}>
            {/* <ListItem>Manage Products</ListItem> */}
          </List>
          <Divider style={{ marginBottom: '20px' }} />

          <div
            style={{
              cursor: 'pointer',
              marginBottom: '10px',
              color: activeSection === 'Category Management' ? '#1976d2' : 'inherit',
              fontWeight: activeSection === 'Category Management' ? 'bold' : 'normal',
              fontSize: '1.3em',
            }}
            onClick={() => setActiveSection('Category Management')}
          >
            Category Management
          </div>
          <List style={{ paddingLeft: '20px', marginBottom: '20px' }}>
            {/* <ListItem>Manage product categories</ListItem> */}
          </List>
          <Divider style={{ marginBottom: '20px' }} />

          <div
            style={{
              cursor: 'pointer',
              marginBottom: '10px',
              color: activeSection === 'Delivery Management' ? '#1976d2' : 'inherit',
              fontWeight: activeSection === 'Delivery Management' ? 'bold' : 'normal',
              fontSize: '1.3em',
            }}
            onClick={() => setActiveSection('Delivery Management')}
          >
            Delivery Management
          </div>
          <List style={{ paddingLeft: '20px', marginBottom: '20px' }}>
            <ListItem>View all deliveries with status</ListItem>
            <ListItem>Update delivery status</ListItem>
          </List>
          <Divider style={{ marginBottom: '20px' }} />
          <div
            style={{
              cursor: 'pointer',
              marginBottom: '10px',
              color: activeSection === 'Comment Moderation' ? '#1976d2' : 'inherit',
              fontWeight: activeSection === 'Comment Moderation' ? 'bold' : 'normal',
              fontSize: '1.3em',
            }}
            onClick={() => setActiveSection('Comment Moderation')}
          >
            Comment Moderation
          </div>
          <List style={{ paddingLeft: '20px' }}>
            <ListItem>Approve or reject product comments</ListItem>
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

          {/* Logout Button at the bottom */}
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
                Hello Product Manager {managerInfo.username}
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
      <Footer />
    </>
  );
};

export default ProductManagerPage;
