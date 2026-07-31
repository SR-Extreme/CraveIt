import React, { useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { hasErrors, validators } from "../../utils/validation";
import "./Auth.css";

const Auth = () => {
    const [params] = useSearchParams();
    const mode = params.get("mode") === "signup" ? "Sign Up" : "Login";
    const [currState, setCurrState] = useState(mode);

    const [data, setData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
    });
    const [errors, setErrors] = useState({});

    const url = "http://localhost:4000";

    const getFieldError = (name, value) => {
        switch (name) {
            case "name":
                return validators.name(value, "Name");
            case "phone":
                return validators.phone(value);
            case "email":
                return validators.email(value);
            case "password":
                return validators.password(value);
            default:
                return "";
        }
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

    const validateForm = () => {
        const nextErrors = {
            email: getFieldError("email", data.email),
            password: getFieldError("password", data.password),
        };
        if (currState === "Sign Up") {
            nextErrors.name = getFieldError("name", data.name);
            nextErrors.phone = getFieldError("phone", data.phone);
        }
        setErrors(nextErrors);
        return !hasErrors(nextErrors);
    };

    const switchState = (nextState) => {
        setCurrState(nextState);
        setErrors({});
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;

        const endpoint =
            currState === "Login" ? "/api/user/login" : "/api/user/register";

        const payload =
            currState === "Login" ? data : { ...data, role: "user" };

        try {
            const response = await axios.post(`${url}${endpoint}`, payload);

            if (!response.data.success) {
                alert(response.data.message);
                return;
            }

            if (currState === "Sign Up") {
                setCurrState("Login");
                setErrors({});
                return;
            }

            window.location.href = `/verifyotp?email=${data.email}`;
        } catch (error) {
            console.error(error);
            alert("Something went wrong: User");
        }
    };

    return (
        <div className="role-auth-page">
            <form className="role-auth-card" onSubmit={onSubmit} autoComplete="off" noValidate>
                <h2>{currState} as User</h2>

                {currState === "Sign Up" && (
                    <>
                        <div className="form-field">
                            <input
                                type="text"
                                name="name"
                                value={data.name}
                                onChange={onChangeHandler}
                                onBlur={onBlurHandler}
                                placeholder="Name"
                                autoComplete="off"
                                className={errors.name ? "field-invalid" : ""}
                            />
                            {errors.name ? <p className="field-error">{errors.name}</p> : null}
                        </div>
                        <div className="form-field">
                            <input
                                type="text"
                                name="phone"
                                value={data.phone}
                                onChange={onChangeHandler}
                                onBlur={onBlurHandler}
                                placeholder="Phone"
                                autoComplete="off"
                                className={errors.phone ? "field-invalid" : ""}
                            />
                            {errors.phone ? <p className="field-error">{errors.phone}</p> : null}
                        </div>
                    </>
                )}

                <div className="form-field">
                    <input
                        type="email"
                        name="email"
                        value={data.email}
                        onChange={onChangeHandler}
                        onBlur={onBlurHandler}
                        placeholder="Email"
                        autoComplete={currState === "Login" ? "username" : "off"}
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
                        autoComplete={currState === "Login" ? "current-password" : "new-password"}
                        className={errors.password ? "field-invalid" : ""}
                    />
                    {errors.password ? <p className="field-error">{errors.password}</p> : null}
                </div>

                <button type="submit">
                    {currState === "Login" ? "Login" : "Create account"}
                </button>

                <p>
                    {currState === "Login" ? "Need an account?" : "Already registered?"}{" "}
                    <span
                        onClick={() =>
                            switchState(currState === "Login" ? "Sign Up" : "Login")
                        }
                    >
                        {currState === "Login" ? "Sign up" : "Login"}
                    </span>
                </p>
            </form>
        </div>
    );
};

export default Auth;
