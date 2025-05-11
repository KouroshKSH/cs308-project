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
import ProductManagerPage from "./pages/ProductManagerPage";
import SalesManagerPage from "./pages/SalesManagerPage";
import ManagerLogin from "./pages/ManagerLogin";

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

        {/* Customer routes for their profile page */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute role="customer">
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
        {/* TODO: these two need to be protected */}
        {/* <Route path="/product-manager" element={<ProductManagerPage />} /> */}

        {/* protecting the product manager page via manager login page */}
        {/* Manager routes */}
        <Route
          path="/manager-login"
          element={<ManagerLogin />}
        />
        <Route
          path="/product-manager"
          element={
            <ProtectedRoute role="productManager">
              <ProductManagerPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sales-manager"
          element={
            <ProtectedRoute role="salesManager">
              <SalesManagerPage />
            </ProtectedRoute>
          }
        />

        {/* not protecting sales manager page for now since Ayca is working on its frontend */}
        {/* <Route path="/sales-manager" element={<SalesManagerPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;