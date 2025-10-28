// src/main.jsx (NOVA ESTRUTURA DE ROTAS)
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Importações
import App from './App.jsx';
import Home from './pages/Home.jsx'; // <-- IMPORTA A NOVA HOME
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx'; // <-- O Guardião

import './index.css';

// 1. Define a nova estrutura de rotas
const router = createBrowserRouter([
  // --- ROTAS PÚBLICAS (Sem a barra de navegação) ---
  {
    path: '/',
    element: <Home />, // A nova página inicial
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  
  // --- ROTAS PROTEGIDAS (Com a barra de navegação) ---
  {
    element: <ProtectedRoute />, // O "Guardião"
    children: [
      {
        element: <App />, // O "Layout" que tem a nav bar
        children: [
          {
            path: '/dashboard', // O Dashboard agora é /dashboard
            element: <Dashboard />,
          },
          // Ex: { path: '/perfil', element: <Perfil /> }
          // (Qualquer outra página logada iria aqui)
        ]
      }
    ]
  }
]);

// 2. Renderiza o App
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);