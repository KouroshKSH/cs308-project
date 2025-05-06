import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import LandingPage from "./pages/LandingPage";
import CheckoutPage from "./pages/CheckoutPage";
import ProfilePage from "./pages/ProfilePage";
import ProductPage from "./pages/ProductPage";
import OrderStatusPage from "./pages/OrderStatusPage";
import ContactPage from "./pages/ContactPage";
import InvoicePage from "./pages/InvoicePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/product/:productId" element={<ProductPage />} />
        <Route path="/order/:orderId" element={<OrderStatusPage />}
        />
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
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="/contact" element={<ContactPage />} />
        <Route
          path="/invoice/:orderId"
          element={
            <ProtectedRoute>
              <InvoicePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;