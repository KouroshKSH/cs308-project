import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DrawerMenu from "./components/DrawerMenu";
import "./tempProductPage.css";
import { getOrCreateSessionId } from './utils/sessionStorage';

const TempProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [variations, setVariations] = useState([]);
  const [quantity, setQuantity] = useState(1);


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/products/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product info:", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/products/${productId}/reviews`);
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching product reviews:", error);
      }
    };

    const fetchVariations = async () => {
      try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/products/${productId}/variations`);
          setVariations(response.data);
      } catch (error) {
          console.error("Error fetching variations:", error);
      }
    };

    fetchProduct();
    fetchVariations();
    fetchReviews();
  }, [productId]);

  // Function to handle the addition of a product with its variation to the cart
  const addToCart = async () => {
    try {
        const headers = {};
        const token = localStorage.getItem('token');

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        } else {
            headers['x-session-id'] = getOrCreateSessionId();
        }

        await axios.post(`${process.env.REACT_APP_API_URL}/cart/add`, {
            product_id: productId,
            variation_id: selectedVariation,
            quantity: quantity
        }, { headers });

        alert('Added to cart successfully!');
    } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Failed to add to cart');
    }
};

  if (!product) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Loading...</div>;
  }

  // the product columns:
  // product_id, serial_number, name, description, 
  // price, department_id, category_id, material, image_url, stock_quantity, warranty_status, distributor_info, popularity_score
  return (
    <div>
        {/* the famous drawer again */}
        <DrawerMenu />

        {/* the main content */}
        <div className="content">

          {/* show general product information */}
          <h1>Product Info</h1>
          <p><strong>ID:</strong> {product.product_id}</p>
          <p><strong>Serial Number:</strong> {product.serial_number}</p>
          <p><strong>Name:</strong> {product.name}</p>
          <p><strong>Description:</strong> {product.description}</p>
          <p><strong>Price:</strong> ${product.price}</p>
          <p><strong>Department ID:</strong> {product.department_id}</p>
          <p><strong>Category ID:</strong> {product.category_id}</p>
          <p><strong>Material:</strong> {product.material}</p>
          <p><strong>Image URL:</strong> {product.image_url}</p>
          <p><strong>Stock Quantity:</strong> {product.stock_quantity}</p>
          <p><strong>Warranty Status:</strong> {product.warranty_status}</p>
          <p><strong>Distributor Info:</strong> {product.distributor_info}</p>
          <p><strong>Popularity Score:</strong> {product.popularity_score}</p>

          {/* button for adding to cart */}
          <div className="add-to-cart-section">
            <select
              value={selectedVariation || ''}
              onChange={(e) => setSelectedVariation(e.target.value)}
            >
              {/* TODO: maybe we can offer color variation later too */}
              <option value="">Select Size</option>
              {variations.map(v => (
                <option
                  key={v.variation_id}
                  value={v.variation_id}
                  disabled={v.stock_quantity === 0}
                >
                  {/* can't choose something that is out of stock */}
                  {v.size} {v.stock_quantity === 0 ? '(Out of Stock)' : ''}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            />
            <button
              onClick={addToCart}
              disabled={!selectedVariation}
            >
              Add to Cart
            </button>
          </div>

          {/* show the reviews for this product */}
          <h2>Product Reviews</h2>
          {reviews.length === 0 ? (
              <p>No reviews available for this product.</p>
          ) : (
              reviews.map((review) => (
              <div key={review.review_id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
                  <p><strong>Username:</strong> {review.username}</p>
                  <p><strong>Rating:</strong> {review.rating ? `${review.rating} number of stars` : "0 number of stars"}</p>
                  <p><strong>Comment:</strong> {review.comment || "No comment posted"}</p>
                  <p><strong>Date:</strong> {new Date(review.created_at).toISOString().split("T")[0]}</p>
              </div>
              ))
            )}
        </div>
  </div>
  );
};

export default TempProductPage;