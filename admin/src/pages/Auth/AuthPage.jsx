import React, { useState } from "react";
import axios from "axios";
import "./AuthPage.css";
import { isStaffRole } from "../../utils/permissions";
import { hasErrors, validators } from "../../utils/validation";

const AuthPage = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const url = import.meta.env.VITE_API_URL || "http://localhost:4000";

  const getFieldError = (name, value) => {
    if (name === "email") return validators.email(value);
    if (name === "password") return validators.password(value);
    return "";
  };

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: getFieldError(name, value) }));
    }
  };

  const onBlurHandler = (event) => {
    const { name, value } = event.target;
    setErrors((prev) => ({ ...prev, [name]: getFieldError(name, value) }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {
      email: getFieldError("email", data.email),
      password: getFieldError("password", data.password),
    };
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;

    setLoading(true);

    try {
      const response = await axios.post(`${url}/api/user/login`, data);

      if (!response.data.success) {
        alert(response.data.message || "Login failed");
        return;
      }

      const { role, requiresOtp } = response.data;

      if (requiresOtp) {
        alert("This portal is for Admin / SuperAdmin only.");
        return;
      }

      if (!isStaffRole(role)) {
        alert("This account is not an admin account.");
        return;
      }

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
      <form className="role-auth-card" onSubmit={onSubmit} noValidate>
        <h2>Login as Admin</h2>
        <p style={{ textAlign: "center", marginBottom: "12px", color: "#666", fontSize: "14px" }}>
          Admin & SuperAdmin
        </p>
        <div className="form-field">
          <input
            type="email"
            name="email"
            value={data.email}
            onChange={onChangeHandler}
            onBlur={onBlurHandler}
            placeholder="Email"
            className={errors.email ? "field-invalid" : ""}
          />
          {errors.email ? <p className="field-error">{errors.email}</p> : null}
        </div>
        <div className="form-field">
          <input
            type="password"
            name="password"
            value={data.password}
            onChange={onChangeHandler}
            onBlur={onBlurHandler}
            placeholder="Password"
            className={errors.password ? "field-invalid" : ""}
          />
          {errors.password ? <p className="field-error">{errors.password}</p> : null}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default AuthPage;
