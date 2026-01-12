import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './index.css';

// --- Import Components ---
import MainPage from "./components/MainPage/MainPage";
import LoginPage from "./components/LoginPage/LoginPage";
import SignUpPage from "./components/SignUpPage/SignUpPage";
import LandingPage from "./pages/LandingPage/LandingPage"; // Ensure this file exists

// --- Protected Route Logic ---
// This checks if a token exists. If not, it redirects to the Landing Page.
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// --- Main Render ---
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* 1. Root Path -> Landing Page (Public) */}
        <Route path="/" element={<LandingPage />} />

        {/* 2. Authentication Pages (Public) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* 3. Protected App Routes */}
        {/* The "/*" wildcard allows MainPage to handle sub-routes like /my-drive, /recent, etc. */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);