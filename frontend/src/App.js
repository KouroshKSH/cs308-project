import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./Login";
import SignUp from "./Signup";
import LandingPage from "./LandingPage";
import CheckoutPage from "./CheckoutPage";
import ProfilePage from "./ProfilePage";
import ProductPage  from "./ProductPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/product/:productId" element={<ProductPage />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
       
              <ProfilePage />
     
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
