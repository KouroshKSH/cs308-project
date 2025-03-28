import React, { useState } from "react";
import { FaTrash, FaPlus, FaMinus, FaShoppingCart } from "react-icons/fa";

function Cart() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "White T-Shirt",
      price: 61.99,
      quantity: 1,
      size: "M",
    },
    {
      id: 2,
      name: "Blue Jeans",
      price: 61.99,
      quantity: 2,
      size: "S",
    },
  ]);

  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
  };

  const changeQuantity = (id, delta) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id
        ? {
            ...item,
            quantity: Math.max(1, item.quantity + delta), // min: 1
          }
        : item
    );
    setCartItems(updatedCart);
  };

  const changeSize = (id, newSize) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, size: newSize } : item
    );
    setCartItems(updatedCart);
  };

  const getTotal = () => {
    return cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "auto", position: "relative" }}>
      {/* 🛒 Cart Icon + Item Count */}
      <div style={{ position: "absolute", top: 10, right: 10 }}>
        <FaShoppingCart size={28} />
        <span
          style={{
            position: "absolute",
            top: -8,
            right: -10,
            backgroundColor: "red",
            color: "white",
            borderRadius: "50%",
            padding: "2px 6px",
            fontSize: "12px",
          }}
        >
          {getTotalItems()}
        </span>
      </div>

      <h2>Your Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                marginBottom: "15px",
                borderRadius: "8px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              <p style={{ fontWeight: "bold", fontSize: "18px" }}>
                {item.name}
              </p>
              <p>
                <strong>Price:</strong> ${item.price}
              </p>

              {/* Quantity Controls */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button
                  onClick={() => changeQuantity(item.id, -1)}
                  style={circleBtnStyle}
                >
                  <FaMinus />
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => changeQuantity(item.id, 1)}
                  style={circleBtnStyle}
                >
                  <FaPlus />
                </button>
              </div>

              {/* Size Selection */}
              <div style={{ marginTop: "10px" }}>
                <label>
                  <strong>Size: </strong>
                  <select
                    value={item.size}
                    onChange={(e) => changeSize(item.id, e.target.value)}
                    style={{ marginLeft: "10px", padding: "4px" }}
                  >
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                  </select>
                </label>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeItem(item.id)}
                style={{
                  marginTop: "15px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#cc0000",
                }}
                title="Remove item"
              >
                <FaTrash size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      <h3>Total: ${getTotal()}</h3>
    </div>
  );
}

// Style for plus/minus circular buttons
const circleBtnStyle = {
  width: "32px",
  height: "32px",
  borderRadius: "50%",
  border: "1px solid #aaa",
  backgroundColor: "#f9f9f9",
  cursor: "pointer",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  transition: "all 0.2s ease-in-out",
};

export default Cart;
