import React from 'react'
import Navbar from './components/navbar/Navbar'
import { Routes, Route, useLocation } from 'react-router-dom'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import Footer from './components/Footer/Footer'
import LoginPopup from './components/LoginPopup/LoginPopup'
import { useState } from 'react'
import Verify from './pages/Verify/Verify'
import MyOrders from './pages/MyOrders/MyOrders'
import Search from './pages/Search/Search'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Profile from './pages/Profile/Profile'
import OrderTracking from './pages/OrderTracking/OrderTracking'
import Auth from './pages/Auth/Auth'
import VerifyOTP from './pages/VerifyOTP/VerifyOTP'
import Explore from "./pages/Explore/Explore";
import FoodDetails from "./pages/FoodDetails/FoodDetails";

const App = () => {

  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();
  const hideLayout = location.pathname === "/auth" || location.pathname === "/verifyotp";
  return (
    <>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      <div className={hideLayout ? "auth-route-root" : "app"}>
        {!hideLayout && <Navbar setShowLogin={setShowLogin} />}
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path="/explore" element={<Explore />} />
          <Route path="/food/:id" element={<FoodDetails />} />
          <Route path='/auth' element={<Auth />}></Route>
          <Route path='/verifyotp' element={<VerifyOTP />} />
          <Route path='/cart' element={<Cart />}></Route>
          <Route path='/order' element={<PlaceOrder />}></Route>
          <Route path='/verify' element={<Verify />} />
          <Route path='/myorders' element={<MyOrders />} />
          <Route path='/myprofile' element={<Profile />} />
          <Route path='/search' element={<Search />} />
          <Route path="/track-order/:orderId" element={<OrderTracking />} />
        </Routes>
      </div>
      {!hideLayout && <Footer />}
      <ToastContainer />
    </>
  );
};

export default App
