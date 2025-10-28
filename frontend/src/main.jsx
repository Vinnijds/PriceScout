// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Nossas importações de páginas e componentes
import App from './App.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import { AuthProvider } from './context/AuthContext.jsx'; // <-- O Provedor
import ProtectedRoute from './components/ProtectedRoute.jsx'; // <-- O Guardião

import './index.css';

// 1. Define as rotas
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // <-- O App.jsx é renderizado aqui
    children: [
      // Rotas Públicas
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },

      // Rotas Protegidas (envelopadas pelo Guardião)
      {
        element: <ProtectedRoute />, // O Guardião
        children: [
          { path: '/', element: <Dashboard /> }
        ]
      }
    ]
  }
]);

// 2. Renderiza o App
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* ESTA É A PARTE MAIS IMPORTANTE:
      O <AuthProvider> DEVE estar "envolvendo" o <RouterProvider>.
      Isso faz com que o <App /> (que está dentro do router) 
      consiga usar o useAuth().
    */}
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);