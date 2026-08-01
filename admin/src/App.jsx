import React, { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Footer from "./components/Footer/Footer";
import { Route, Routes, Navigate } from "react-router-dom";
import Add from "./pages/Add/Add";
import List from "./pages/List/List";
import Orders from "./pages/Orders/Orders";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthPage from "./pages/Auth/AuthPage";
import Assignment from "./pages/Assignment/Assignment";
import Profile from "./pages/Profile/Profile";
import Users from "./pages/Users/Users";
import UserDetails from "./pages/UserDetails/UserDetails";
import Categories from "./pages/Categories/Categories";
import { hasPermission, PERMISSIONS } from "./utils/permissions";
import { useAuth } from "./context/AuthContext";

const App = () => {
  const { role, loading, isAuthenticated, url } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const defaultPath = role === "admin" ? "/orders" : "/add";

  const RequirePermission = ({ permission, children }) => {
    if (!hasPermission(role, permission)) {
      return <Navigate to={defaultPath} replace />;
    }
    return children;
  };

  if (loading) {
    return (
      <div className="admin-app">
        <ToastContainer />
        <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="admin-app">
      <ToastContainer />
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/verifyotp" element={<Navigate to="/auth?mode=login" replace />} />
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <>
                <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <div className="app-content">
                  <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                  <main className="app-main">
                    <Routes>
                      <Route
                        path="/add"
                        element={
                          <RequirePermission permission={PERMISSIONS.FOODS_MANAGE}>
                            <Add url={url} />
                          </RequirePermission>
                        }
                      />
                      <Route
                        path="/list"
                        element={
                          <RequirePermission permission={PERMISSIONS.FOODS_MANAGE}>
                            <List url={url} />
                          </RequirePermission>
                        }
                      />
                      <Route
                        path="/categories"
                        element={
                          <RequirePermission permission={PERMISSIONS.CATEGORIES_MANAGE}>
                            <Categories url={url} />
                          </RequirePermission>
                        }
                      />
                      <Route
                        path="/orders"
                        element={
                          <RequirePermission permission={PERMISSIONS.ORDERS_VIEW}>
                            <Orders url={url} />
                          </RequirePermission>
                        }
                      />
                      <Route
                        path="/assign-orders"
                        element={
                          <RequirePermission permission={PERMISSIONS.ORDERS_ASSIGN}>
                            <Assignment url={url} />
                          </RequirePermission>
                        }
                      />
                      <Route
                        path="/users"
                        element={
                          <RequirePermission permission={PERMISSIONS.USERS_MANAGE}>
                            <Users />
                          </RequirePermission>
                        }
                      />
                      <Route
                        path="/users/:id"
                        element={
                          <RequirePermission permission={PERMISSIONS.USERS_MANAGE}>
                            <UserDetails />
                          </RequirePermission>
                        }
                      />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="*" element={<Navigate to={defaultPath} replace />} />
                    </Routes>
                  </main>
                </div>
                <Footer />
              </>
            ) : (
              <Navigate to="/auth?mode=login" replace />
            )
          }
        />
      </Routes>
    </div>
  );
};

export default App;
