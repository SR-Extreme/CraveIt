import React from "react";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
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

const App = () => {
  const url = import.meta.env.VITE_API_URL || "http://localhost:4000";
  const token =
    sessionStorage.getItem("admin_token") ||
    localStorage.getItem("admin_token");
  const role =
    sessionStorage.getItem("admin_role") ||
    localStorage.getItem("admin_role") ||
    "";

  const defaultPath = role === "admin" ? "/orders" : "/add";

  const RequirePermission = ({ permission, children }) => {
    if (!hasPermission(role, permission)) {
      return <Navigate to={defaultPath} replace />;
    }
    return children;
  };

  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/verifyotp" element={<Navigate to="/auth?mode=login" replace />} />
        <Route
          path="/*"
          element={
            token ? (
              <>
                <Navbar />
                <div className="app-content">
                  <Sidebar />
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
                </div>
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