import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BlockchainProvider } from './BlockchainContext'; // Novo contexto
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BlockchainProvider> {/* Adiciona o provider */}
      <App />
    </BlockchainProvider>
  </React.StrictMode>
);

reportWebVitals();
