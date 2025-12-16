import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import OpeningAnimation from "./components/common/OpeningAnimation";
import Navbar from "./components/common/Navbar";
import Notification from "./components/common/Notification";
import Home from "./components/pages/Home";
import Product from "./components/pages/Product";
import Order from "./components/pages/Order";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import Contact from "./components/pages/Contact";
import Payment from "./components/pages/Payment";
import AdminDashboard from "./components/pages/AdminDashboard"; 
import { db } from "./services/database";

function AppContent() {
  const [showAnimation, setShowAnimation] = useState(true);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const user = db.getCurrentUser();
    setCurrentUser(user);

    setTimeout(() => {
      setShowAnimation(false);
    }, 5000);
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  const updateUser = () => {
    const user = db.getCurrentUser();
    setCurrentUser(user);
  };

  const handleLogout = () => {
    db.logoutUser();
    setCurrentUser(null);
    showNotification("Berhasil logout");
  };

  return (
    <>
      {showAnimation && <OpeningAnimation />}

      {!showAnimation && (
        <>
          <Navbar
            currentUser={currentUser}
            onLogout={handleLogout}
            showNotification={showNotification}
          />

          <Notification
            show={notification.show}
            message={notification.message}
            type={notification.type}
          />

          <div className="h-20"></div>

          <Routes location={location}>
            
            {/* --- PERUBAHAN DI SINI: Tambahkan props showNotification --- */}
            <Route 
              path="/" 
              element={<Home showNotification={showNotification} />} 
            />
            {/* --------------------------------------------------------- */}

            <Route
              path="/products"
              element={
                <Product
                  showNotification={showNotification}
                  db={db}
                />
              }
            />

            <Route
              path="/order"
              element={
                <Order
                  showNotification={showNotification}
                  db={db}
                />
              }
            />

            <Route
              path="/admin"
              element={<AdminDashboard showNotification={showNotification} />}
            />

            <Route
              path="/login"
              element={
                <Login
                  showNotification={showNotification}
                  updateUser={updateUser}
                />
              }
            />

            <Route
              path="/register"
              element={
                <Register
                  showNotification={showNotification}
                  updateUser={updateUser}
                />
              }
            />

            <Route
              path="/contact"
              element={<Contact showNotification={showNotification} />}
            />

            <Route
              path="/payment"
              element={
                <Payment
                  showNotification={showNotification}
                  db={db}
                />
              }
            />
          </Routes>
        </>
      )}
    </>
  );
}

function App() {
  return (
    <Router future={{ v7_startTransition: true }}>
      <AppContent />
    </Router>
  );
}

export default App;