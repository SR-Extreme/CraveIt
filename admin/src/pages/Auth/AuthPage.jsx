import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./AuthPage.css";
import { isStaffRole } from "../../utils/permissions";
import { hasErrors, validators } from "../../utils/validation";
import getApiUrl from "../../utils/apiUrl";

const AuthPage = () => {
  const [data, setData] = useState({
    email: "omniprep2004@gmail.com",
    password: "12345678",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [resetStep, setResetStep] = useState(null);
  const url = getApiUrl();

  const getFieldError = (name, value, allData = data) => {
    if (name === "email") return validators.email(value);
    if (name === "password") return validators.password(value);
    if (name === "otp") return validators.otp(value);
    if (name === "newPassword") return validators.password(value, "New password");
    if (name === "confirmPassword") {
      return validators.confirmPassword(value, allData.newPassword);
    }
    return "";
  };

  const onChangeHandler = (event) => {
    const { name, value: rawValue } = event.target;
    const value = name === "otp" ? rawValue.replace(/\D/g, "").slice(0, 6) : rawValue;
    setData((prev) => {
      const next = { ...prev, [name]: value };
      if (errors[name] || (name === "newPassword" && errors.confirmPassword)) {
        setErrors((prevErrors) => {
          const nextErrors = {
            ...prevErrors,
            [name]: getFieldError(name, value, next),
          };
          if (name === "newPassword" && prevErrors.confirmPassword) {
            nextErrors.confirmPassword = getFieldError(
              "confirmPassword",
              next.confirmPassword,
              next
            );
          }
          return nextErrors;
        });
      }
      return next;
    });
  };

  const onBlurHandler = (event) => {
    const { name, value } = event.target;
    setErrors((prev) => ({ ...prev, [name]: getFieldError(name, value) }));
  };

  const openForgotPassword = () => {
    setResetStep("email");
    setErrors({});
    setData((prev) => ({
      ...prev,
      otp: "",
      newPassword: "",
      confirmPassword: "",
    }));
  };

  const backToLogin = () => {
    setResetStep(null);
    setErrors({});
    setData((prev) => ({
      ...prev,
      email: prev.email || "omniprep2004@gmail.com",
      otp: "",
      newPassword: "",
      confirmPassword: "",
      password: "12345678",
    }));
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
        toast.error(response.data.message || "Login failed");
        return;
      }

      const { role, requiresOtp } = response.data;

      if (requiresOtp) {
        toast.error("This portal is for Admin / SuperAdmin only.");
        return;
      }

      if (!isStaffRole(role)) {
        toast.error("This account is not an admin account.");
        return;
      }

      toast.success("Login successful");
      window.location.href = role === "admin" ? "/orders" : "/add";
    } catch (error) {
      console.log(error);
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const onForgotSubmit = async (event) => {
    event.preventDefault();

    if (resetStep === "email") {
      const emailError = getFieldError("email", data.email);
      setErrors({ email: emailError });
      if (emailError) return;

      setLoading(true);
      try {
        const response = await axios.post(`${url}/api/user/forgot-password`, {
          email: data.email,
        });
        if (!response.data.success) {
          toast.error(response.data.message);
          return;
        }
        toast.success(response.data.message);
        setResetStep("otp");
        setErrors({});
      } catch (error) {
        console.error(error);
        toast.error("Failed to send OTP. Please try again.");
      } finally {
        setLoading(false);
      }
      return;
    }

    if (resetStep === "otp") {
      const otpError = getFieldError("otp", data.otp);
      setErrors({ otp: otpError });
      if (otpError) return;

      setLoading(true);
      try {
        const response = await axios.post(`${url}/api/user/verify-reset-otp`, {
          email: data.email,
          otp: data.otp,
        });
        if (!response.data.success) {
          toast.error(response.data.message);
          return;
        }
        toast.success(response.data.message);
        setResetStep("password");
        setErrors({});
      } catch (error) {
        console.error(error);
        toast.error("OTP verification failed. Please try again.");
      } finally {
        setLoading(false);
      }
      return;
    }

    if (resetStep === "password") {
      const nextErrors = {
        newPassword: getFieldError("newPassword", data.newPassword),
        confirmPassword: getFieldError("confirmPassword", data.confirmPassword),
      };
      setErrors(nextErrors);
      if (hasErrors(nextErrors)) return;

      setLoading(true);
      try {
        const response = await axios.post(`${url}/api/user/reset-password`, {
          email: data.email,
          otp: data.otp,
          newPassword: data.newPassword,
        });
        if (!response.data.success) {
          toast.error(response.data.message);
          return;
        }
        toast.success(response.data.message);
        backToLogin();
      } catch (error) {
        console.error(error);
        toast.error("Failed to reset password. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const resendResetOtp = async () => {
    const emailError = getFieldError("email", data.email);
    if (emailError) {
      toast.error(emailError);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${url}/api/user/forgot-password`, {
        email: data.email,
      });
      if (!response.data.success) {
        toast.error(response.data.message);
        return;
      }
      toast.success("OTP resent successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (resetStep) {
    const titles = {
      email: "Forgot Password",
      otp: "Verify OTP",
      password: "Reset Password",
    };
    const buttonLabels = {
      email: "Send OTP",
      otp: "Verify OTP",
      password: "Reset Password",
    };

    return (
      <div className="role-auth-page">
        <form className="role-auth-card" onSubmit={onForgotSubmit} autoComplete="off" noValidate>
          <h2>{titles[resetStep]}</h2>

          {resetStep === "email" && (
            <>
              <p className="role-auth-hint">
                Enter your registered email to receive a reset OTP.
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
            </>
          )}

          {resetStep === "otp" && (
            <>
              <p className="role-auth-hint">
                Enter the 6-digit OTP sent to
                <br />
                <strong>{data.email}</strong>
              </p>
              <div className="form-field">
                <input
                  type="text"
                  name="otp"
                  value={data.otp}
                  onChange={onChangeHandler}
                  onBlur={onBlurHandler}
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                  inputMode="numeric"
                  autoComplete="off"
                  className={errors.otp ? "field-invalid" : ""}
                />
                {errors.otp ? <p className="field-error">{errors.otp}</p> : null}
              </div>
            </>
          )}

          {resetStep === "password" && (
            <>
              <p className="role-auth-hint">
                Create a new password for your account.
              </p>
              <div className="form-field">
                <input
                  type="password"
                  name="newPassword"
                  value={data.newPassword}
                  onChange={onChangeHandler}
                  onBlur={onBlurHandler}
                  placeholder="New Password"
                  autoComplete="new-password"
                  className={errors.newPassword ? "field-invalid" : ""}
                />
                {errors.newPassword ? (
                  <p className="field-error">{errors.newPassword}</p>
                ) : null}
              </div>
              <div className="form-field">
                <input
                  type="password"
                  name="confirmPassword"
                  value={data.confirmPassword}
                  onChange={onChangeHandler}
                  onBlur={onBlurHandler}
                  placeholder="Confirm Password"
                  autoComplete="new-password"
                  className={errors.confirmPassword ? "field-invalid" : ""}
                />
                {errors.confirmPassword ? (
                  <p className="field-error">{errors.confirmPassword}</p>
                ) : null}
              </div>
            </>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Please wait..." : buttonLabels[resetStep]}
          </button>

          {resetStep === "otp" ? (
            <p>
              Didn&apos;t receive the OTP?{" "}
              <span onClick={loading ? undefined : resendResetOtp}>Resend OTP</span>
            </p>
          ) : null}

          <p>
            Remember your password?{" "}
            <span onClick={backToLogin}>Back to Login</span>
          </p>
        </form>
      </div>
    );
  }

  return (
    <div className="role-auth-page">
      <form className="role-auth-card" onSubmit={onSubmit} noValidate>
        <h2>Login as Admin</h2>
        <p className="role-auth-hint">Admin & SuperAdmin</p>
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
        <p className="forgot-password-link">
          <span onClick={openForgotPassword}>Forgot Password?</span>
        </p>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default AuthPage;