import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const TempProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/products/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product info:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  if (!product) {
    return <div>Loading...</div>;
  }

  // the product columns:
  // product_id, serial_number, name, description, 
  // price, department_id, category_id, material, image_url, stock_quantity, warranty_status, distributor_info, popularity_score
  return (
    <div>
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
    </div>
  );
};

export default TempProductPage;