import React from 'react';        
import { createRoot } from 'react-dom/client'
import App from './app/App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);