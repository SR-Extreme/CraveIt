import React, { useContext, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { useEffect } from 'react'
import { StoreContext } from '../../context/StoreContext'
import axios from "axios"

const LoginPopup = ({ setShowLogin }) => {

  const { url, setToken } = useContext(StoreContext);
  const [currState, setCurrState] = useState("Sign Up")

  //how to take values from fields and send it to server
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: ""
  })

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  }

  const onLogin = async (event) => {
    event.preventDefault();
    let newUrl = url;
    if (currState === "Login") {
      newUrl += "/api/user/login";
    }
    else {
      newUrl += "/api/user/register";
    }

    const response = await axios.post(newUrl, data);

    if (response.data.success) {
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token); // key:value pair || provided by web browser
      setShowLogin(false);
    } else {
      alert(response.data.message);
    }
  }

  return (
    <div className='login-popup'>
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
        </div>
        <div className="login-popup-inputs">
          {currState === "Login" ? <></> : (<>
            <input type="text" name="name" onChange={onChangeHandler} value={data.name} placeholder='Your Name' required />
            <input type="number" name="phone" onChange={onChangeHandler} value={data.phone} placeholder='Your Phone Number' required />
            <select name="role" onChange={onChangeHandler} value={data.role} required>
              <option value="">Select Role</option>
              <option value="admin">admin</option>
              <option value="user">user</option>
              <option value="delivery">delievery agent</option></select></>)}
          <input type="email" name="email" onChange={onChangeHandler} value={data.email} placeholder='Your email' required />
          <input type="password" name="password" onChange={onChangeHandler} value={data.password} placeholder='Password' required />
        </div>
        <button type="submit">{currState === "Sign Up" ? "Create account" : "Login"}</button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, i agree to the terms of use & privacy policy</p>
        </div>
        {currState === "Login" ?
          <p>Create a new account? <span onClick={() => setCurrState("Sign Up")}>Click here</span></p> :
          <p>Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span></p>}
      </form>
    </div>
  )
}

export default LoginPopup
