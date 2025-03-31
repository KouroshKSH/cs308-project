import React, { useEffect, useState } from "react";

const CheckoutPage = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  return (
    <div>
      <h1>Checkout</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cart.map((item, index) => (
            <li key={index}>
              {item.name} - {item.price}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CheckoutPage;