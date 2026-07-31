import React, { useState } from "react";
import axios from "axios";
import "./AuthPage.css";
import { isStaffRole } from "../../utils/permissions";

const AuthPage = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const url = import.meta.env.VITE_API_URL || "http://localhost:4000";

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${url}/api/user/login`, data);

      if (!response.data.success) {
        alert(response.data.message || "Login failed");
        return;
      }

      const { token, role, requiresOtp } = response.data;

      if (requiresOtp || !token) {
        alert("This portal is for Admin / SuperAdmin only.");
        return;
      }

      if (!isStaffRole(role)) {
        alert("This account is not an admin account.");
        return;
      }

      sessionStorage.setItem("admin_token", token);
      localStorage.setItem("admin_token", token);
      sessionStorage.setItem("admin_role", role);
      localStorage.setItem("admin_role", role);

      window.location.href = role === "admin" ? "/orders" : "/add";
    } catch (error) {
      console.log(error);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="role-auth-page">
      <form className="role-auth-card" onSubmit={onSubmit}>
        <h2>Login as Admin</h2>
        <p style={{ textAlign: "center", marginBottom: "12px", color: "#666", fontSize: "14px" }}>
          Admin & SuperAdmin — no OTP required
        </p>
        <input
          type="email"
          name="email"
          value={data.email}
          onChange={onChangeHandler}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={data.password}
          onChange={onChangeHandler}
          placeholder="Password"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default AuthPage;