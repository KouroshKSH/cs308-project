import React, { useState, useEffect } from "react";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import axios from "axios";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token") || ""); // Token'ı localStorage'dan al

  // Sepeti backend'den çek
  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5012/api/cart", {
          headers: {
            "Authorization": `Bearer ${token}`, // Token'ı kullanarak backend'e istek gönderiyoruz
          },
        });
        setCartItems(response.data);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
      setLoading(false);
    };

    fetchCartItems(); // Token varsa sepet verisini çek
  }, [token]);

  // Sepete ürün ekle
  const addToCart = async (productId, quantity) => {
    const response = await axios.post(
      "http://localhost:5012/api/cart/add",
      { productId, quantity },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Token'ı gönderiyoruz
        },
      }
    );
    if (response.data.success) {
      setCartItems(response.data.cart); // Yeni sepet verisiyle güncelle
    }
  };

  // Sepetten ürün çıkar
  const removeFromCart = async (id) => {
    const response = await axios.delete(
      `http://localhost:5012/api/cart/remove`,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        data: { productId: id },
      }
    );
    if (response.data.success) {
      setCartItems(response.data.cart); // Yeni sepet verisiyle güncelle
    }
  };

  // Sepet ürün miktarını güncelle
  const updateQuantity = async (id, quantity) => {
    const response = await axios.put(
      "http://localhost:5012/api/cart/update",
      { productId: id, quantity },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }
    );
    if (response.data.success) {
      setCartItems(response.data.cart); // Yeni sepet verisiyle güncelle
    }
  };

  // Loading Spinner
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Your Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <div>
          <p>Your cart is empty.</p>
          {/* Her durumda Go to Cart butonu gösterilmeli */}
          <button onClick={() => window.location.href = "/cart"}>Go to Cart</button>
        </div>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div key={item.id}>
              <p>{item.name}</p>
              <button onClick={() => removeFromCart(item.id)}>
                <FaTrash />
              </button>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                <FaPlus />
              </button>
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                <FaMinus />
              </button>
            </div>
          ))}
        </div>
      )}
      <h3>Total: ${cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)}</h3>

      {/* Eğer login yoksa sadece sepet gösterilir, checkout'a geçiş için login gereklidir */}
      {token ? (
        <button onClick={() => window.location.href = "/checkout"}>Go to Checkout</button>
      ) : (
        <p>Please log in to proceed to checkout.</p>
      )}
    </div>
  );
}

export default Cart;
