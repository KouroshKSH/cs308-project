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
  TextField,
  Checkbox,
  FormGroup,
  FormControlLabel,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Collapse,
  Paper,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DrawerMenu from '../components/DrawerMenu';
import './ProductManagerPage.css';
import FilterListIcon from "@mui/icons-material/FilterList";
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
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

const DEPARTMENT_OPTIONS = [
  { label: "Men", value: 1 },
  { label: "Women", value: 2 },
  { label: "Kids", value: 3 },
];

// Hardcoded sizes for dropdown based on user-provided data
const mockSizes = [
  { id: 7, name: '25-27' },
  { id: 8, name: '28-30' },
  { id: 9, name: '31-34' },
  { id: 10, name: '35-37' },
  { id: 11, name: '38' },
  { id: 12, name: '39' },
  { id: 13, name: '40' },
  { id: 14, name: '41' },
  { id: 15, name: '42' },
  { id: 16, name: '43' },
  { id: 17, name: '44' },
  { id: 18, name: '45' },
  { id: 5, name: 'Extra Large' },
  { id: 1, name: 'Extra Small' },
  { id: 4, name: 'Large' },
  { id: 3, name: 'Medium' },
  { id: 2, name: 'Small' },
  { id: 6, name: 'Standart' },
];

// Hardcoded colors for dropdown based on user-provided data
const mockColors = [
  { id: 8, name: 'Black' },
  { id: 5, name: 'Blue' },
  { id: 10, name: 'Brown' },
  { id: 9, name: 'Gray' },
  { id: 4, name: 'Green' },
  { id: 12, name: 'Multiple Colors' },
  { id: 2, name: 'Orange' },
  { id: 6, name: 'Pink' },
  { id: 7, name: 'Purple' },
  { id: 1, name: 'Red' },
  { id: 11, name: 'White' },
  { id: 3, name: 'Yellow' },
];

// Warranty status options from the SQL ENUM
const WARRANTY_OPTIONS = [
  { label: 'No Warranty', value: 'No Warranty' },
  { label: '6 Months', value: '6 Months' },
  { label: '1 Year', value: '1 Year' },
  { label: '2 Years', value: '2 Years' },
  { label: 'Lifetime', value: 'Lifetime' },
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
  const [errorVariations, setErrorVariations] = useState(null); // Corrected typo

  // for category management
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [errorCategories, setErrorCategories] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("all");

  // For add category under departments
  const [newDeptCategoryName, setNewDeptCategoryName] = useState('');
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [addingDeptCategory, setAddingDeptCategory] = useState(false);

  // For add subcategory under parent categories
  const [newSubCategoryName, setNewSubCategoryName] = useState('');
  const [selectedParentCategories, setSelectedParentCategories] = useState([]);
  const [addingSubCategory, setAddingSubCategory] = useState(false);


  // For product filter dropdown (Stock Management)
  const [productFilter, setProductFilter] = useState('all');
  const [productIdOptions, setProductIdOptions] = useState([]);

  // For product management
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [errorProducts, setErrorProducts] = useState(null);
  const [newProductName, setNewProductName] = useState('');
  const [newProductSerialNumber, setNewProductSerialNumber] = useState('');
  const [newProductDescription, setNewProductDescription] = useState('');
  // Removed newProductPrice state
  const [newProductCost, setNewProductCost] = useState('');
  const [newProductStockQuantity, setNewProductStockQuantity] = useState(''); // New state for main product stock
  const [selectedProductDepartment, setSelectedProductDepartment] = useState('');
  const [selectedProductCategory, setSelectedProductCategory] = useState('');
  const [newProductMaterial, setNewProductMaterial] = useState(''); // New state for material
  // Removed newProductImageUrl state
  const [newProductWarrantyStatus, setNewProductWarrantyStatus] = useState('No Warranty'); // New state for warranty_status
  const [newProductDistributorInfo, setNewProductDistributorInfo] = useState(''); // New state for distributor_info
  // Removed newProductPopularityScore state

  const [addingProduct, setAddingProduct] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [openDeleteProductDialog, setOpenDeleteProductDialog] = useState(false);

  // For product variations when adding a product
  const [newProductVariations, setNewProductVariations] = useState([
    { serial_number: '', size_id: '', color_id: '', stock_quantity: '' },
  ]);

  // States for deleting specific variations
  const [expandedProductId, setExpandedProductId] = useState(null); // Tracks which product's variations are expanded
  const [productVariationsForDisplay, setProductVariationsForDisplay] = useState([]); // Variations for the expanded product
  const [loadingProductVariationsForDisplay, setLoadingProductVariationsForDisplay] = useState(false);
  const [errorProductVariationsForDisplay, setErrorProductVariationsForDisplay] = useState(null);
  const [variationIdToDelete, setVariationIdToDelete] = useState(null);
  const [productIdForVariationDeletion, setProductIdForVariationDeletion] = useState(null);
  const [openDeleteVariationDialog, setOpenDeleteVariationDialog] = useState(false);
  const [deletingVariation, setDeletingVariation] = useState(false);


  const handleAddProductVariation = () => {
    setNewProductVariations(prevVariations => [
      ...prevVariations,
      { serial_number: '', size_id: '', color_id: '', stock_quantity: '' },
    ]);
  };

  const handleRemoveProductVariation = (index) => {
    setNewProductVariations(prevVariations => prevVariations.filter((_, i) => i !== index));
  };

  const handleNewProductVariationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedVariations = [...newProductVariations];
    updatedVariations[index][name] = value;
    setNewProductVariations(updatedVariations);
  };


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


  // Helper for parent category selection (show all categories as options)
  const parentCategoryOptions = categories.map(cat => ({
    label: `${cat.category_name || cat.name} (ID: ${cat.category_id})`,
    value: cat.category_id,
  }));

  // Handle department checkbox
  const handleDepartmentChange = (deptId) => {
    setSelectedDepartments(prev =>
      prev.includes(deptId)
        ? prev.filter(id => id !== deptId)
        : [...prev, deptId]
    );
  };

  // Handle parent category checkbox
  const handleParentCategoryChange = (catId) => {
    setSelectedParentCategories(prev =>
      prev.includes(catId)
        ? prev.filter(id => id !== catId)
        : [...prev, catId]
    );
  };

  // Add category under departments
  const handleAddDeptCategory = async () => {
    if (!newDeptCategoryName.trim() || selectedDepartments.length === 0) {
      alert("Please enter a name and select at least one department.");
      return;
    }
    setAddingDeptCategory(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/products/categories/under-department`,
        {
          name: newDeptCategoryName.trim(),
          department_ids: selectedDepartments,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNewDeptCategoryName('');
      setSelectedDepartments([]);
      // Refetch categories
      setCategoryFilter("all");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add category.");
    } finally {
      setAddingDeptCategory(false);
    }
  };

  // Add subcategory under parent categories
  const handleAddSubCategory = async () => {
    if (!newSubCategoryName.trim() || selectedParentCategories.length === 0) {
      alert("Please enter a name and select at least one parent category.");
      return;
    }
    setAddingSubCategory(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/products/categories/under-category`,
        {
          name: newSubCategoryName.trim(),
          parent_category_ids: selectedParentCategories,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNewSubCategoryName('');
      setSelectedParentCategories([]);
      // Refetch categories
      setCategoryFilter("all");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add subcategory.");
    } finally {
      setAddingSubCategory(false);
    }
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
      setErrorVariations(null); // Corrected typo
      axios
        .get(`${API_URL}/product-variations`)
        .then((res) => setProductVariations(res.data))
        .catch(() => setErrorVariations('Failed to load product variations.')) // Corrected typo
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
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setErrorCategories('Failed to load categories.');
      })
      .finally(() => setLoadingCategories(false));
  }, [categoryFilter]); // Removed activeSection from dependencies

  // Fetch products when Product Management is active
  useEffect(() => {
    if (activeSection === 'Product Management') {
      fetchProducts();
    }
  }, [activeSection]);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    setErrorProducts(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
    } catch (err) {
      setErrorProducts('Failed to load products.');
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleAddProduct = async () => {
    // Basic validation for required fields
    if (!newProductName.trim() || !newProductSerialNumber.trim() ||
        !newProductDescription.trim() ||
        !selectedProductDepartment ||
        !selectedProductCategory || !newProductWarrantyStatus ||
        newProductVariations.length === 0) {
      alert("Please fill in all required product fields and add at least one variation.");
      return;
    }

    // Cost can be null, so only validate if it's not an empty string
    if (newProductCost !== '' && (isNaN(parseFloat(newProductCost)) || parseFloat(newProductCost) < 0)) {
      alert("Product cost must be a non-negative number if provided.");
      return;
    }
    if (selectedProductCategory === '' || isNaN(parseInt(selectedProductCategory)) || parseInt(selectedProductCategory) < 1) {
        alert("Category ID must be a positive integer.");
        return;
    }

    // Validate main product stock quantity
    if (newProductStockQuantity === '' || isNaN(parseInt(newProductStockQuantity)) || parseInt(newProductStockQuantity) < 0) {
      alert("Product stock quantity must be a non-negative number.");
      return;
    }

    // Validate variations
    for (const variation of newProductVariations) {
      if (!variation.serial_number || !variation.size_id || !variation.color_id || variation.stock_quantity === '') {
        alert("Please fill in all variation fields for all variations.");
        return;
      }
      if (isNaN(variation.stock_quantity) || parseInt(variation.stock_quantity) < 0) {
        alert("Stock quantity for variations must be a non-negative number.");
        return;
      }
    }


    setAddingProduct(true);
    try {
      const token = localStorage.getItem('token');
      const productData = {
        serial_number: newProductSerialNumber.trim(),
        name: newProductName.trim(),
        description: newProductDescription.trim(),
        price: null, // Price is now set to null as it's determined by sales manager
        cost: newProductCost !== '' ? parseFloat(newProductCost) : null, // Set to null if empty
        department_id: selectedProductDepartment,
        category_id: parseInt(selectedProductCategory),
        material: newProductMaterial.trim() || null, // Allow null if empty
        image_url: null, // Removed image_url input, set to null
        warranty_status: newProductWarrantyStatus,
        distributor_info: newProductDistributorInfo.trim() || null, // Allow null if empty
        popularity_score: null, // Removed popularity_score input, set to null
        stock_quantity: parseInt(newProductStockQuantity), // Main product stock quantity
      };

      await axios.post(
        `${API_URL}/products/add-product-with-variation`,
        { productData, variations: newProductVariations.map(v => ({...v, stock_quantity: parseInt(v.stock_quantity)})) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Clear all fields after successful addition
      setNewProductName('');
      setNewProductSerialNumber('');
      setNewProductDescription('');
      // Removed setNewProductPrice(''); // Removed price state setter
      setNewProductCost('');
      setNewProductStockQuantity(''); // Clear main product stock quantity
      setSelectedProductDepartment('');
      setSelectedProductCategory('');
      setNewProductMaterial('');
      // Removed setNewProductImageUrl('');
      setNewProductWarrantyStatus('No Warranty');
      setNewProductDistributorInfo('');
      // Removed setNewProductPopularityScore('');
      setNewProductVariations([{ serial_number: '', size_id: '', color_id: '', stock_quantity: '' }]);
      fetchProducts(); // Refresh product list
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add product.");
    } finally {
      setAddingProduct(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    setDeletingProductId(productId);
    setOpenDeleteProductDialog(true);
  };

  const handleConfirmDeleteProduct = async () => {
    setOpenDeleteProductDialog(false);
    if (!deletingProductId) return;

    setLoadingProducts(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/products/delete-product/${deletingProductId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts(); // Refresh product list
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete product.");
    } finally {
      setLoadingProducts(false);
      setDeletingProductId(null);
    }
  };

  const handleCloseDeleteProductDialog = () => {
    setOpenDeleteProductDialog(false);
    setDeletingProductId(null);
  };

  // Function to fetch variations for a specific product
  const fetchProductVariationsForDisplay = async (productId) => {
    setLoadingProductVariationsForDisplay(true);
    setErrorProductVariationsForDisplay(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/products/${productId}/variations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProductVariationsForDisplay(response.data);
    } catch (err) {
      setErrorProductVariationsForDisplay('Failed to load product variations.');
      setProductVariationsForDisplay([]); // Clear variations on error
    } finally {
      setLoadingProductVariationsForDisplay(false);
    }
  };

  // Function to toggle product variations display
  const handleToggleVariations = (productId) => {
    if (expandedProductId === productId) {
      setExpandedProductId(null); // Collapse if already expanded
      setProductVariationsForDisplay([]); // Clear variations when collapsed
    } else {
      setExpandedProductId(productId); // Expand
      fetchProductVariationsForDisplay(productId); // Fetch variations for the new expanded product
    }
  };

  // Function to handle deleting a specific product variation
  const handleDeleteProductVariation = (productId, variationId) => {
    setProductIdForVariationDeletion(productId);
    setVariationIdToDelete(variationId);
    setOpenDeleteVariationDialog(true);
  };

  // Function to confirm and execute product variation deletion
  const handleConfirmDeleteVariation = async () => {
    setOpenDeleteVariationDialog(false);
    if (!productIdForVariationDeletion || !variationIdToDelete) return;

    setDeletingVariation(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${API_URL}/products/${productIdForVariationDeletion}/variations/${variationIdToDelete}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Product variation deleted successfully.');
      // Refresh the variations list for the currently expanded product
      fetchProductVariationsForDisplay(productIdForVariationDeletion);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete product variation.");
    } finally {
      setDeletingVariation(false);
      setProductIdForVariationDeletion(null);
      setVariationIdToDelete(null);
    }
  };

  // Function to close the variation deletion confirmation dialog
  const handleCloseDeleteVariationDialog = () => {
    setOpenDeleteVariationDialog(false);
    setProductIdForVariationDeletion(null);
    setVariationIdToDelete(null);
  };


  const renderContent = () => {
    switch (activeSection) {

      // Product Management
      case 'Product Management':
        return (
          <div className="scrollable-content">
            <Card
              variant="outlined"
              style={{
                marginBottom: '20px',
                maxWidth: 1300,
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              <CardContent>
                <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: 16 }}>
                  Add New Product
                </Typography>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 12 }}>
                  <TextField
                    label="Product Name"
                    value={newProductName}
                    onChange={e => setNewProductName(e.target.value)}
                    size="small"
                    fullWidth
                    required
                  />
                  <TextField
                    label="Serial Number"
                    value={newProductSerialNumber}
                    onChange={e => setNewProductSerialNumber(e.target.value)}
                    size="small"
                    fullWidth
                    required
                  />
                  <TextField
                    label="Description"
                    value={newProductDescription}
                    onChange={e => setNewProductDescription(e.target.value)}
                    size="small"
                    fullWidth
                    multiline
                    rows={2}
                    required
                  />
                   {/* Removed TextField for Price */}
                   <TextField
                    label="Cost" // Changed label
                    type="number"
                    value={newProductCost}
                    onChange={e => setNewProductCost(e.target.value)}
                    size="small"
                    fullWidth
                    inputProps={{ step: "0.01", min: 0 }}
                    // Removed 'required' as it's now optional
                  />
                  <TextField
                    label="Product Stock Quantity"
                    type="number"
                    value={newProductStockQuantity}
                    onChange={e => setNewProductStockQuantity(e.target.value)}
                    size="small"
                    fullWidth
                    inputProps={{ min: 0 }}
                    required
                  />
                  <FormControl fullWidth size="small" required>
                    <InputLabel>Department</InputLabel>
                    <Select
                      value={selectedProductDepartment}
                      label="Department"
                      onChange={e => setSelectedProductDepartment(e.target.value)}
                    >
                      {DEPARTMENT_OPTIONS.map(opt => (
                        <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    label="Category ID"
                    type="number"
                    value={selectedProductCategory}
                    onChange={e => setSelectedProductCategory(e.target.value)}
                    size="small"
                    fullWidth
                    disabled={!selectedProductDepartment}
                    inputProps={{ min: 1 }}
                    required
                  />
                  <TextField
                    label="Material"
                    value={newProductMaterial}
                    onChange={e => setNewProductMaterial(e.target.value)}
                    size="small"
                    fullWidth
                  />
                  {/* Removed TextField for Image URL */}
                  <FormControl fullWidth size="small" required>
                    <InputLabel>Warranty Status</InputLabel>
                    <Select
                      value={newProductWarrantyStatus}
                      label="Warranty Status"
                      onChange={e => setNewProductWarrantyStatus(e.target.value)}
                    >
                      {WARRANTY_OPTIONS.map(opt => (
                        <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    label="Distributor Info"
                    value={newProductDistributorInfo}
                    onChange={e => setNewProductDistributorInfo(e.target.value)}
                    size="small"
                    fullWidth
                  />
                  {/* Removed TextField for Popularity Score */}

                  {/* Product Variations for Adding */}
                  <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                    Product Variations:
                  </Typography>
                  {newProductVariations.map((variation, index) => (
                    <div key={index} style={{ border: '1px dashed #ccc', padding: 10, borderRadius: 5, position: 'relative', marginBottom: 10 }}>
                      <TextField
                        label="Variation Serial Number"
                        name="serial_number"
                        value={variation.serial_number}
                        onChange={(e) => handleNewProductVariationChange(index, e)}
                        size="small"
                        fullWidth
                        sx={{ mb: 1 }}
                        required
                      />
                      <FormControl fullWidth size="small" sx={{ mb: 1 }} required>
                        <InputLabel>Size</InputLabel>
                        <Select
                          name="size_id"
                          value={variation.size_id}
                          label="Size"
                          onChange={(e) => handleNewProductVariationChange(index, e)}
                        >
                          {mockSizes.map(size => (
                            <MenuItem key={size.id} value={size.id}>{size.name}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl fullWidth size="small" sx={{ mb: 1 }} required>
                        <InputLabel>Color</InputLabel>
                        <Select
                          name="color_id"
                          value={variation.color_id}
                          label="Color"
                          onChange={(e) => handleNewProductVariationChange(index, e)}
                        >
                          {mockColors.map(color => (
                            <MenuItem key={color.id} value={color.id}>{color.name}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <TextField
                        label="Stock Quantity"
                        name="stock_quantity"
                        type="number"
                        value={variation.stock_quantity}
                        onChange={(e) => handleNewProductVariationChange(index, e)}
                        size="small"
                        fullWidth
                        inputProps={{ min: 0 }}
                        required
                      />
                      {newProductVariations.length > 1 && (
                        <IconButton
                          onClick={() => handleRemoveProductVariation(index)}
                          size="small"
                          color="error"
                          sx={{ position: 'absolute', top: 5, right: 5 }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="outlined"
                    onClick={handleAddProductVariation}
                    sx={{ alignSelf: 'flex-start', mb: 2 }}
                  >
                    Add Variation
                  </Button>

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddProduct}
                    disabled={addingProduct}
                  >
                    {addingProduct ? <CircularProgress size={18} /> : "Add Product"}
                  </Button>
                </div>
                <Typography variant="body2" color="textSecondary" style={{ marginBottom: 16 }}>
                  Adds a new product with its initial variations. Price will be set to -1 by default.
                </Typography>
              </CardContent>
            </Card>

            <Divider style={{ margin: '16px 0' }} />

            <Card
              variant="outlined"
              style={{
                marginBottom: '30px',
                maxHeight: 630,
                overflowY: 'auto',
                maxWidth: 1300,
                marginLeft: 'auto',
                marginRight: 'auto'
              }}
            >
              <CardContent>
                <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: 16 }}>
                  Manage Existing Products
                </Typography>
                {loadingProducts ? (
                  <CircularProgress />
                ) : errorProducts ? (
                  <Typography color="error">{errorProducts}</Typography>
                ) : (
                  <List>
                    {products.length === 0 ? (
                      <Typography>No products found.</Typography>
                    ) : (
                      products.map((product) => (
                        <Paper key={product.product_id} elevation={1} sx={{ mb: 2 }}>
                          <ListItem
                            style={{
                              border: '1px solid #ddd',
                              borderRadius: 8,
                              background: '#fafafa',
                              flexDirection: 'column',
                              alignItems: 'flex-start',
                              paddingRight: 10,
                            }}
                          >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                <ListItemText
                                    primary={
                                        <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                                            ID: {product.product_id}: {product.name}
                                        </Typography>
                                    }
                                    secondary={
                                      <>
                                        {/* Removed Cost, Price, Department ID, Category ID */}
                                      </>
                                    }
                                />
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <IconButton
                                        edge="end"
                                        aria-label="toggle variations"
                                        onClick={() => handleToggleVariations(product.product_id)}
                                        size="small"
                                    >
                                        {expandedProductId === product.product_id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                    </IconButton>
                                    <IconButton
                                        edge="end"
                                        aria-label="delete product"
                                        onClick={() => handleDeleteProduct(product.product_id)}
                                        color="error"
                                        disabled={loadingProducts}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </Box>
                            <Collapse in={expandedProductId === product.product_id} timeout="auto" unmountOnExit sx={{ width: '100%' }}>
                                <Box sx={{ mt: 2, pl: 2, pr: 2, pb: 1, borderTop: '1px solid #eee' }}>
                                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                                        Variations:
                                    </Typography>
                                    {loadingProductVariationsForDisplay ? (
                                        <CircularProgress size={20} />
                                    ) : errorProductVariationsForDisplay ? (
                                        <Typography color="error">{errorProductVariationsForDisplay}</Typography>
                                    ) : productVariationsForDisplay.length === 0 ? (
                                        <Typography variant="body2" color="textSecondary">No variations found for this product.</Typography>
                                    ) : (
                                        <List dense disablePadding>
                                            {productVariationsForDisplay.map(variation => (
                                                <ListItem key={variation.variation_id} sx={{ pl: 0, pr: 0 }}>
                                                    <ListItemText
                                                        primary={`ID: ${variation.variation_id}`}
                                                        secondary={
                                                          `Size: ${mockSizes.find(s => s.id === variation.size_id)?.name || 'N/A'} | Color: ${mockColors.find(c => c.id === variation.color_id)?.name || 'N/A'} | Stock: ${variation.stock_quantity}`
                                                        }
                                                    />
                                                    <IconButton
                                                        edge="end"
                                                        aria-label="delete variation"
                                                        onClick={() => handleDeleteProductVariation(product.product_id, variation.variation_id)}
                                                        color="error"
                                                        size="small"
                                                        disabled={deletingVariation}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </ListItem>
                                            ))}
                                        </List>
                                    )}
                                </Box>
                            </Collapse>
                          </ListItem>
                        </Paper>
                      ))
                    )}
                  </List>
                )}
              </CardContent>
            </Card>

            {/* Product Deletion Confirmation Dialog */}
            <Dialog
              open={openDeleteProductDialog}
              onClose={handleCloseDeleteProductDialog}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{"Confirm Product Deletion"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete this product (ID: {deletingProductId})? This action cannot be undone. All associated variations will also be deleted.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDeleteProductDialog} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleConfirmDeleteProduct} color="error" autoFocus>
                  Delete
                </Button>
              </DialogActions>
            </Dialog>

            {/* Product Variation Deletion Confirmation Dialog */}
            <Dialog
              open={openDeleteVariationDialog}
              onClose={handleCloseDeleteVariationDialog}
              aria-labelledby="delete-variation-dialog-title"
              aria-describedby="delete-variation-dialog-description"
            >
              <DialogTitle id="delete-variation-dialog-title">{"Confirm Variation Deletion"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="delete-variation-dialog-description">
                  Are you sure you want to delete variation ID {variationIdToDelete} for product ID {productIdForVariationDeletion}? This action cannot be undone.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDeleteVariationDialog} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleConfirmDeleteVariation} color="error" autoFocus disabled={deletingVariation}>
                  {deletingVariation ? <CircularProgress size={18} /> : 'Delete Variation'}
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        );

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
                          <th style={{ border: '1px solid #ddd', padding: '8px' }}>Action</th>
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

      // category management
      case 'Category Management':
        return (
          <div className="scrollable-content">
            <Card 
              variant="outlined" 
              style={{ 
                  marginBottom: '20px', 
                  maxWidth: 1300, 
                  marginLeft: 'auto', 
                  marginRight: 'auto',
                }}
              >
              <CardContent>
                <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: 16 }}>
                  Add Category Under Departments
                </Typography>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12 }}>
                  <TextField
                    label="Category Name"
                    value={newDeptCategoryName}
                    onChange={e => setNewDeptCategoryName(e.target.value)}
                    size="small"
                  />
                  <FormGroup row>
                    {DEPARTMENT_OPTIONS.map(opt => (
                      <FormControlLabel
                        key={opt.value}
                        control={
                          <Checkbox
                            checked={selectedDepartments.includes(opt.value)}
                            onChange={() => handleDepartmentChange(opt.value)}
                          />
                        }
                        label={opt.label}
                      />
                    ))}
                  </FormGroup>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddDeptCategory}
                    disabled={addingDeptCategory}
                  >
                    {addingDeptCategory ? <CircularProgress size={18} /> : "Add"}
                  </Button>
                </div>
                <Typography variant="body2" color="textSecondary" style={{ marginBottom: 16 }}>
                  Adds a new category directly under selected departments (e.g., "Activewear" under Men & Women).
                </Typography>

                <Divider style={{ margin: '16px 0' }} />

                <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: 16 }}>
                  Add Subcategory Under Parent Categories
                </Typography>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
                  <TextField
                    label="Subcategory Name"
                    value={newSubCategoryName}
                    onChange={e => setNewSubCategoryName(e.target.value)}
                    size="small"
                  />
                  <FormGroup row>
                    {parentCategoryOptions.map(opt => (
                      <FormControlLabel
                        key={opt.value}
                        control={
                          <Checkbox
                            checked={selectedParentCategories.includes(opt.value)}
                            onChange={() => handleParentCategoryChange(opt.value)}
                          />
                        }
                        label={opt.label}
                      />
                    ))}
                  </FormGroup>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddSubCategory}
                    disabled={addingSubCategory}
                  >
                    {addingSubCategory ? <CircularProgress size={18} /> : "Add"}
                  </Button>
                </div>
                <Typography variant="body2" color="textSecondary" style={{ marginBottom: 16 }}>
                  Adds a new subcategory under selected parent categories (e.g., "Running Clothes" under "Shoes" for Men, Women, Kids).
                </Typography>
              </CardContent>
            </Card>

            {/* Filter and list below */}
            <Card 
              variant="outlined" 
              style={{ 
                marginBottom: '30px', 
                maxHeight: 630, 
                overflowY: 'auto', 
                maxWidth: 1300, 
                marginLeft: 'auto', 
                marginRight: 'auto'
              }}
            >
              <CardContent>
                <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: 16 }}>
                  View Categories
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
                                <div><strong>Customer ID:</strong> {delivery.user_id ?? 'N/A'}</div>
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
            minHeight: '80vh',
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
          <List style={{ paddingLeft: '20px'}}>
            <ListItem>View & Update Stock Quantities</ListItem>
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
          <List style={{ paddingLeft: '20px'}}>
            <ListItem>View & Update Products</ListItem>
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
          <List style={{ paddingLeft: '20px' }}>
            <ListItem>View & Add Categories</ListItem>
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
          <List style={{ paddingLeft: '20px'}}>
            <ListItem>View & Update Deliveries</ListItem>
            {/* <ListItem>Update delivery status</ListItem> */}
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
            <ListItem>View & Update Comments</ListItem>
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
                <strong>Role:</strong> Product Manager
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
