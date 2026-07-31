import React, { useState } from 'react'
import './LoginPopup.css'
import { IoClose } from 'react-icons/io5'

const LoginPopup = ({ setShowLogin }) => {
  const [currState, setCurrState] = useState("Sign Up")

  const roleClientUrls = {
    admin: import.meta.env.VITE_ADMIN_APP_URL || "http://localhost:5174",
    user: import.meta.env.VITE_USER_APP_URL || "http://localhost:5173",
    delivery: import.meta.env.VITE_DELIVERY_APP_URL || "http://localhost:5175",
  }

  const onClickHandler = async (event, selectedRole) => {
    event.preventDefault()
    const mode = currState === "Login" ? "login" : "signup"
    window.location.href = `${roleClientUrls[selectedRole]}/auth?mode=${mode}`
  }

  const close = () => setShowLogin(false)

  return (
    <div className="login-popup" role="dialog" aria-modal="true" aria-labelledby="login-popup-heading">
      <div className="login-popup-backdrop" onClick={close} aria-hidden="true" />
      <div className="login-popup-card">
        <div className="login-popup-header">
          <h2 id="login-popup-heading">{currState}</h2>
          <button type="button" className="login-popup-close" onClick={close} aria-label="Close">
            <IoClose size={28} />
          </button>
        </div>
        <p className="login-popup-sub">Choose how you want to continue</p>
        <div className="login-popup-actions">
          <button type="button" className="login-popup-role login-popup-role--user" onClick={(e) => onClickHandler(e, "user")}>
            <span className="login-popup-role-label">{currState} as</span>
            <span className="login-popup-role-title">User</span>
          </button>
          <button type="button" className="login-popup-role login-popup-role--delivery" onClick={(e) => onClickHandler(e, "delivery")}>
            <span className="login-popup-role-label">{currState} as</span>
            <span className="login-popup-role-title">Delivery Agent</span>
          </button>
          {currState === "Login" &&
            <button type="button" className="login-popup-role login-popup-role--admin" onClick={(e) => onClickHandler(e, "admin")}>
              <span className="login-popup-role-label">{currState} as</span>
              <span className="login-popup-role-title">Admin</span>
            </button>}
        </div>
        <div className="login-popup-footer">
          {currState === "Login" ? (
            <p>Create a new account? <button type="button" className="login-popup-link" onClick={() => setCurrState("Sign Up")}>Sign up</button></p>
          ) : (
            <p>Already have an account? <button type="button" className="login-popup-link" onClick={() => setCurrState("Login")}>Login</button></p>
          )}
        </div>
      </div>
    </div>
  )
}

export default LoginPopup
