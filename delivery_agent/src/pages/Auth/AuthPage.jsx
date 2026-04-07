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
    const payload = currState === "Login" ? data : { ...data, role: "delivery" };

    try {
       const response = await axios.post(`${url}${endpoint}`, payload);

        if(!response.data.success) {
        alert(response.data.message);
        return;
        }

        if(currState === "Sign Up"){
            setCurrState("Login");
            return;
          }

          window.location.href = `/verifyotp?email=${data.email}`;
    } catch (error) {
      console.error(error);
      alert("Something went wrong: Delivery");
    }

    sessionStorage.setItem("delivery_token", token);
    localStorage.setItem("delivery_token", token);
    window.location.href = "/";
  };

  return (
    <div className="role-auth-page">
      <form className="role-auth-card" onSubmit={onSubmit} autoComplete="off">
        <h2>{currState} as Delivery Agent</h2>
        {currState === "Sign Up" && (
          <>
            <input name="name" value={data.name} onChange={onChangeHandler} placeholder="Name" required autoComplete="off" />
            <input name="phone" value={data.phone} onChange={onChangeHandler} placeholder="Phone" required autoComplete="off" />
          </>
        )}
        <input type="email" name="email" value={data.email} onChange={onChangeHandler} placeholder="Email" required autoComplete={currState === "Login" ? "username" : "off"} />
        <input type="password" name="password" value={data.password} onChange={onChangeHandler} placeholder="Password" required autoComplete={currState === "Login" ? "current-password" : "new-password"} />
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
