import React, { useState } from 'react';
import "./../Auth/Auth.css"
import "./VerifyOTP.css"
import axios from "axios"
import { useSearchParams } from "react-router-dom"
import { validators } from "../../utils/validation"

const VerifyOTP = () => {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [params] = useSearchParams();
    const email = params.get("email");
    const url = import.meta.env.VITE_API_URL || "http://localhost:4000";

    const handleChange = (e) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 6);
        setOtp(value);
        if (error) setError(validators.otp(value));
    };

    const handleBlur = () => {
        setError(validators.otp(otp));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpError = validators.otp(otp);
        setError(otpError);
        if (otpError) return;

        try {
            const response = await axios.post(`${url}/api/user/verifyotp`, { otp: otp, email: email });
            if (response.data.success) {
                const profileResponse = await axios.post(`${url}/api/user/getuser`, {});

                if (!profileResponse.data.success || profileResponse.data.data?.role !== "user") {
                    alert("This account is not a user account.");
                    return;
                }

                window.location.href = "/";
            } else {
                alert(response.data.message);
            }
        } catch (err) {
            console.log(err);
            alert(err);
        }
    }

    return (
        <div className="role-auth-page">
            <form className="role-auth-card" onSubmit={handleSubmit} autoComplete="off" noValidate>
                <h2>Verify OTP</h2>

                <p className="role-auth-hint">
                    Enter the 6-digit OTP sent to
                    <br />
                    <strong>{email}</strong>
                </p>

                <div className="form-field">
                    <input
                        type="text"
                        name="otp"
                        value={otp}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter 6-digit OTP"
                        maxLength="6"
                        inputMode="numeric"
                        autoComplete="off"
                        className={error ? "field-invalid" : ""}
                    />
                    {error ? <p className="field-error">{error}</p> : null}
                </div>

                <button type="submit">Verify OTP</button>

                <p>
                    Didn’t receive the OTP?{" "}
                    <span>
                        Resend OTP
                    </span>
                </p>
            </form>
        </div>
    );
}

export default VerifyOTP
