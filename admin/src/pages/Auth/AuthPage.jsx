import React, { useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import "./AuthPage.css";

const AuthPage = () => {
  const [params] = useSearchParams();
  const mode = params.get("mode") === "signup" ? "Sign Up" : "Login";
  const [currState, setCurrState] = useState(mode);
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
    const endpoint = currState === "Login" ? "/api/user/login" : "/api/user/register";
    const payload = currState === "Login" ? data : { ...data, role: "admin" };
    const response = await axios.post(`${url}${endpoint}`, payload);

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
        <h2>{currState} as Admin</h2>
        {currState === "Sign Up" && (
          <>
            <input name="name" value={data.name} onChange={onChangeHandler} placeholder="Name" required />
            <input name="phone" value={data.phone} onChange={onChangeHandler} placeholder="Phone" required />
          </>
        )}
        <input type="email" name="email" value={data.email} onChange={onChangeHandler} placeholder="Email" required />
        <input type="password" name="password" value={data.password} onChange={onChangeHandler} placeholder="Password" required />
        <button type="submit">{currState === "Login" ? "Login" : "Create account"}</button>
        <p>
          {currState === "Login" ? "Need an account?" : "Already registered?"}{" "}
          <span onClick={() => setCurrState(currState === "Login" ? "Sign Up" : "Login")}>
            {currState === "Login" ? "Sign up" : "Login"}
          </span>
        </p>
      </form>
    </div>
  );
};

export default AuthPage;
