import React, { useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import "./AuthPage.css";

const AuthPage = () => {
  const [params] = useSearchParams();
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const url = "http://localhost:4000";

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const endpoint = "/api/user/login";
    const response = await axios.post(`${url}${endpoint}`, data);

    if (!response.data.success) {
      alert(response.data.message);
      return;
    }

    const token = response.data.token;
    const profileResponse = await axios.post(`${url}/api/user/getuser`, {}, { headers: { token } });
    if (!profileResponse.data.success || profileResponse.data.data?.role !== "admin") {
      alert("This account is not an admin account.");
      return;
    }

    sessionStorage.setItem("admin_token", token);
    localStorage.setItem("admin_token", token);
    window.location.href = "/add";
  };

  return (
    <div className="role-auth-page">
      <form className="role-auth-card" onSubmit={onSubmit}>
        <h2>Login as Admin</h2>
        <input type="email" name="email" value={data.email} onChange={onChangeHandler} placeholder="Email" required />
        <input type="password" name="password" value={data.password} onChange={onChangeHandler} placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AuthPage;
