import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Route, Routes } from 'react-router-dom'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthPage from './pages/Auth/AuthPage';
import { Navigate } from 'react-router-dom';
import Assignment from './pages/Assignment/Assignment'


const App = () => {
  const url = "http://localhost:4000"
  const token = sessionStorage.getItem("admin_token") || localStorage.getItem("admin_token");

  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/*"
          element={token ? (
            <>
              <Navbar />
              <div className="app-content">
                <Sidebar />
                <Routes>
                  <Route path="/add" element={<Add url={url} />} />
                  <Route path="/list" element={<List url={url} />} />
                  <Route path="/orders" element={<Orders url={url} />} />
                  <Route path="/assign-orders" element={<Assignment url={url} />} />
                  <Route path="*" element={<Navigate to="/add" replace />} />
                </Routes>
              </div>
            </>
          ) : (
            <Navigate to="/auth?mode=login" replace />
          )}
        />
      </Routes>
    </div>
  )
}

export default App
