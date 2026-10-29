// Written by us, never by Tara: it starts the app Tara writes in src/app.jsx.
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './base.css';
import App from './app.jsx';

// Tara's own styles, when she writes src/index.css.
import.meta.glob('./index.css', { eager: true });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
