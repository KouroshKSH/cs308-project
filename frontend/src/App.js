import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";

const Dashboard = () => {
  const handleLogout = () => {
    document.cookie = "token=; Max-Age=0"; // ✅ Clears cookie-based JWT
    window.location.href = "/";
  };

  return (
    <div>
      <h2>Welcome to the Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
