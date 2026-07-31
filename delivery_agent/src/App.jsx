import React, { useContext, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeliveryPanel from "./pages/DeliveryPanel/DeliveryPanel";
import AuthPage from "./pages/Auth/AuthPage";
import "./deliveryAgent.css";
import DeliveryProfile from "./pages/DeliveryProfile/DeliveryProfile";
import DeliveryPastOrders from "./pages/DeliveryPastOrders/DeliveryPastOrders";
import DeliveryCurrentOrders from "./pages/DeliveryCurrentOrders/DeliveryCurrentOrders";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import VerifyOTP from "./pages/VerifyOTP/VerifyOTP";
import { StoreContext } from "./context/StoreContext";
import axios from "axios";

const App = () => {
  const { token, setToken, url } = useContext(StoreContext);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.post(`${url}/api/user/getuser`, {});
        if (response.data.success && response.data.data?.role === "delivery") {
          setToken("authenticated");
        } else {
          setToken("");
        }
      } catch {
        setToken("");
      } finally {
        setAuthChecked(true);
      }
    };
    checkAuth();
  }, [url, setToken]);

  if (!authChecked) {
    return (
      <>
        <div className="delivery-agent-app">
          <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</p>
        </div>
        <ToastContainer />
      </>
    );
  }

  const isAuthenticated = Boolean(token);

  return (
    <>
      <div className="delivery-agent-app">
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/verifyotp" element={<VerifyOTP />} />
          <Route
            path="/*"
            element={
              isAuthenticated ? (
                <DeliveryLayout />
              ) : (
                <Navigate to="/auth?mode=login" replace />
              )
            }
          />
        </Routes>
      </div>
      <ToastContainer />
    </>
  );
};

const DeliveryLayout = () => {
  return (
    <div className="delivery-agent-shell">
      <Navbar />
      <main className="delivery-content delivery-content--padded">
        <Routes>
          <Route path="/" element={<DeliveryCurrentOrders />} />
          <Route path="/past-orders" element={<DeliveryPastOrders />} />
          <Route path="/profile" element={<DeliveryProfile />} />
          <Route path="/delivery-panel" element={<DeliveryPanel />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
