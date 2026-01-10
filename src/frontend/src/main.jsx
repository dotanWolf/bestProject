import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import MainPage from './components/MainPage/MainPage.jsx';
import LoginPage from './components/LoginPage/LoginPage.jsx';
import SignUpPage from './components/SignUpPage/SignUpPage.jsx';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/*',
    element: <MainPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignUpPage />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);