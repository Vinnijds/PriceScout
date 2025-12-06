// src/App.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
// import { useAuth } from './context/AuthContext';
// import { FaSearch, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

function App() {
  // const { isAuthenticated, user, logout } = useAuth();
  // const navigate = useNavigate();

  // const handleLogout = () => {
  //   logout();
  //   navigate('/login');
  // };

  // if (!isAuthenticated) {
  //   return <Outlet />;
  // }

  // return (
  //   <div style={styles.pageContainer}>
  //     {/* === HEADER ANTIGO (AGORA ESTÁ NO MainLayout.jsx) === */}
  //     {/* <header style={styles.header}>
  //       <div style={styles.headerContent}>
  //         <Link to="/dashboard" style={styles.logo}>
  //           <img src="/logo.png" alt="PriceScout Logo" style={styles.logoImg} />
  //           PriceScout
  //         </Link>
  //         <div style={styles.searchBar}>
  //           <FaSearch style={styles.searchIcon} />
  //           <input
  //             type="text"
  //             placeholder="Pesquisar..."
  //             style={styles.searchInput}
  //           />
  //         </div>
  //         <div
  //           style={{ ...styles.userInfo, cursor: 'pointer' }}
  //           onClick={() => navigate('/perfil')}
  //           title="Ver Perfil"
  //         >
  //           <FaUserCircle size={24} style={styles.userAvatar} />
  //           <span style={styles.userName}>{user.nome}</span>
  //           <FaSignOutAlt
  //             size={20}
  //             style={styles.logoutIcon}
  //             onClick={(e) => {
  //               e.stopPropagation();
  //               handleLogout();
  //             }}
  //             title="Sair"
  //           />
  //         </div>
  //       </div>
  //     </header> */}
  //     <main style={styles.mainContent}>
  //       <Outlet />
  //     </main>
  //   </div>
  // );

  return <Outlet />;
}

// --- ESTILOS ANTIGOS (COMENTADOS) ---
// const styles = {
//   pageContainer: {
//     backgroundColor: '#f4f7f6',
//     minHeight: '100vh',
//     fontFamily: 'Arial, sans-serif',
//   },
//   header: {
//     backgroundColor: '#3b5998',
//     color: '#fff',
//     padding: '0 40px',
//     boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//   },
//   headerContent: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     height: '70px',
//     maxWidth: '1500px',
//     margin: '0 auto',
//   },
//   logo: {
//     fontSize: '24px',
//     fontWeight: 'bold',
//     color: '#fff',
//     textDecoration: 'none',
//     display: 'flex',
//     alignItems: 'center',
//   },
//   logoImg: {
//     width: '30px',
//     height: '30px',
//     marginRight: '10px',
//     filter: 'brightness(0) invert(1)',
//   },
//   searchBar: {
//     position: 'relative',
//     flex: 1,
//     maxWidth: '600px',
//     margin: '0 40px',
//   },
//   searchInput: {
//     width: '100%',
//     padding: '10px 15px 10px 40px',
//     borderRadius: '20px',
//     border: 'none',
//     backgroundColor: 'rgba(255, 255, 255, 0.9)',
//     fontSize: '16px',
//   },
//   searchIcon: {
//     position: 'absolute',
//     left: '15px',
//     top: '50%',
//     transform: 'translateY(-50%)',
//     color: '#555',
//   },
//   userInfo: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '15px',
//   },
//   userAvatar: {
//     color: '#fff',
//   },
//   userName: {
//     fontSize: '16px',
//   },
//   logoutIcon: {
//     cursor: 'pointer',
//     opacity: 0.8,
//     transition: 'opacity 0.2s',
//   },
//   mainContent: {
//     maxWidth: '1500px',
//     margin: '20px auto',
//     padding: '0 40px',
//   },
// };

//OBS:
//O App.jsx file agora está simplificado para apenas renderizar o Outlet do React Router.
//fiz um componente e coloquei na mainloyout.jsx o header que estava aqui antes.
export default App;