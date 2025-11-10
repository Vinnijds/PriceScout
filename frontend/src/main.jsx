// src/main.jsx (NOVA ESTRUTURA DE ROTAS)
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Importações
import App from './App.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import MainLayout from './components/MainLayout.jsx';
import Comparar from './pages/Comparar.jsx'; 
import ComparacaoDetalhe from './pages/ComparacaoDetalhe.jsx';
import Perfil from './pages/Perfil.jsx';

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
    element: <ProtectedRoute />, // 1. O Guardião (Verifica se está logado)
    children: [
      {
        element: <App />, // 2. O Layout do Header (Barra Azul)
        children: [
          {
            element: <MainLayout />, // 3. O Layout de 3 Colunas
            children: [
              {
                path: '/dashboard', // A página de "Procurar"
                element: <Dashboard />,
              },
              {
                path: '/comparar', // A nova página de seleção
                element: <Comparar />,
              },
              {
                // A nova página de detalhes (com IDs dinâmicos)
                path: '/comparar/:id1/:id2', 
                element: <ComparacaoDetalhe />,
              },
              {
            path: '/perfil',
            element: <Perfil />,
          }
            ]
          }
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