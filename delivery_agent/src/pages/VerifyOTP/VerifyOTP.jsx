import React from 'react'
import "./VerifyOTP.css"
import { useState } from 'react';
import axios from "axios"
import {useSearchParams} from "react-router-dom"

const VerifyOTP = () => {
    const [otp,setOtp] = useState("");
    const [params] = useSearchParams();
    const email = params.get("email");

    const handleSubmit = async(e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:4000/api/user/verifyotp",{otp:otp,email:email});

            if(response.data.success){
                const token = response.data.token;

                const profileResponse = await axios.post(`http://localhost:4000/api/user/getuser`, {}, { headers: { token } });
                if (!profileResponse.data.success || profileResponse.data.data?.role !== "delivery") {
                    alert("This account is not a delivery account.");
                    return;
                }

            sessionStorage.setItem("delivery_token", token);
            localStorage.setItem("delivery_token", token);
            window.location.href = "/";

            }else{
                alert(response.data.message);
            }
        } catch (error) {
            console.log(error);
            alert(error);
        }
    }

  return (
        <div className="role-auth-page">
            <form className="role-auth-card" onSubmit={handleSubmit} autoComplete="off">
                <h2>Verify OTP</h2>

                <p style={{ textAlign: "center", marginBottom: "12px", color: "#555" }}>
                    Enter the 6-digit OTP sent to
                    <br />
                    <strong>{email}</strong>
                </p>

                <input
                    type="text"
                    name="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    maxLength="6"
                    autoComplete="off"
                    required
                />

                <button type="submit">Verify OTP</button>

                <p>
                    Didn’t receive the OTP?{" "}
                    <span style={{ cursor: "pointer" }}>
                        Resend OTP
                    </span>
                </p>
            </form>
        </div>
    );
}

export default VerifyOTP
