import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./Login";
import SignUp from "./Signup";
import LandingPage from "./LandingPage";
import CheckoutPage from "./CheckoutPage";
import ProfilePage from "./ProfilePage";
import ProductPage from "./ProductPage";
import OrderStatusPage from "./OrderStatusPage";
import ContactPage from "./ContactPage";
import TempProductPage from "./tempProductPage";
// import PaymentPage from "./PaymentPage";
import InvoicePage from "./InvoicePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/tempProductPage/:productId" element={<TempProductPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        {/* <Route path="/PaymentPage" element={<PaymentPage/>} /> */}
        <Route path="/product/:productId" element={<ProductPage />} />
        <Route path="/order/:orderId" element={<OrderStatusPage />}
        // type `http://localhost:3000/order/12345` in URL bar to visit
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
        {/* <Route path="/PaymentPage" element={<PaymentPage/>}/> */}
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