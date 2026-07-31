import React, { useContext, useEffect, useState } from 'react'
import './Profile.css'
import axios from 'axios'
import { StoreContext } from '../../context/StoreContext'
import { toast } from "react-toastify"
import { addressValidators, hasErrors, validators } from '../../utils/validation'

const Profile = () => {

    const { url, DefaultData, setDefaultData, defaultIndex, setDefaultIndex } = useContext(StoreContext);
    const [user, setUser] = useState([]);
    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: ""
    })
    const [passwordErrors, setPasswordErrors] = useState({})
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        phone: ""
    })
    const [addressErrors, setAddressErrors] = useState({})
    const [isChangePassword, setIsChangePassword] = useState(false);
    const [showAddressForm, setShowAddressForm] = useState(false);

    const handlePasswordChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setPasswordData((passwordData) => ({ ...passwordData, [name]: value }));
        if (passwordErrors[name]) {
            const message = name === "oldPassword"
                ? validators.password(value, "Old password")
                : validators.password(value, "New password");
            setPasswordErrors((prev) => ({ ...prev, [name]: message }));
        }
    }

    const handlePasswordBlur = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        const message = name === "oldPassword"
            ? validators.password(value, "Old password")
            : validators.password(value, "New password");
        setPasswordErrors((prev) => ({ ...prev, [name]: message }));
    }

    const getUser = async () => {
        const response = await axios.post(url + '/api/user/getuser', {});
        if (response.data.success) {
            setUser(response.data.data);
        }
    }

    const changePassword = async (e) => {
        e.preventDefault();
        const nextErrors = {
            oldPassword: validators.password(passwordData.oldPassword, "Old password"),
            newPassword: validators.password(passwordData.newPassword, "New password"),
        };
        if (passwordData.oldPassword && passwordData.newPassword && passwordData.oldPassword === passwordData.newPassword) {
            nextErrors.newPassword = "New password must be different from old password";
        }
        setPasswordErrors(nextErrors);
        if (hasErrors(nextErrors)) return;

        const response = await axios.post(url + "/api/user/updatepassword", { email: user.email, oldPassword: passwordData.oldPassword, newPassword: passwordData.newPassword });
        if (response.data.success) {
            toast.success(response.data.message);
            setIsChangePassword(false);
            setPasswordErrors({});
        } else {
            toast.error(response.data.message);
        }
        setPasswordData({
            oldPassword: "",
            newPassword: ""
        })
    }

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
        if (addressErrors[name]) {
            setAddressErrors((prev) => ({ ...prev, [name]: addressValidators[name](value) }));
        }
    }

    const onBlurHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setAddressErrors((prev) => ({ ...prev, [name]: addressValidators[name](value) }));
    }

    const onsubmitHandler = async (e) => {
        e.preventDefault();
        const nextErrors = {};
        Object.keys(addressValidators).forEach((key) => {
            nextErrors[key] = addressValidators[key](data[key]);
        });
        setAddressErrors(nextErrors);
        if (hasErrors(nextErrors)) return;

        const response = await axios.post(url + "/api/user/updateaddress", { email: user.email, address: data });
        if (response.data.success) {
            setShowAddressForm(false);
            setAddressErrors({});
            setData({
                firstName: "",
                lastName: "",
                email: "",
                street: "",
                city: "",
                state: "",
                zipcode: "",
                country: "",
                phone: ""
            })
            toast.success(response.data.message);
            getUser();
        }
    }

    const defaultAddressHandler = (address, index) => {
        setDefaultData({
            firstName: address.firstName,
            lastName: address.lastName,
            email: address.email,
            street: address.street,
            city: address.city,
            state: address.state,
            zipcode: address.zipcode,
            country: address.country,
            phone: address.phone
        })
        setDefaultIndex(index);
    }

    const deleteAddress = async (addId, index) => {
        const response = await axios.post(url + "/api/user/deleteaddress", { id: addId });
        if (response.data.success) {
            setDefaultData({
                firstName: "",
                lastName: "",
                email: "",
                street: "",
                city: "",
                state: "",
                zipcode: "",
                country: "",
                phone: ""
            })
            setDefaultIndex(null);
            getUser();
            toast.success(response.data.message);
        }
    }

    useEffect(() => {
        getUser();
    }, [])

    useEffect(() => {
        if (!showAddressForm) return;

        const onKeyDown = (e) => {
            if (e.key === "Escape") setShowAddressForm(false);
        }

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", onKeyDown);

        return () => {
            document.body.style.overflow = originalOverflow;
            window.removeEventListener("keydown", onKeyDown);
        }
    }, [showAddressForm])

    const fieldClass = (name) => (addressErrors[name] ? "field-invalid" : "");

    return (
        <div className="profile">

            <div className="profile-container">
                <h2>My Profile</h2>
                <p className="profile-subtitle">Manage your details, addresses, and password</p>

                {/* USER DETAILS */}
                <div className="profile-card">
                    <h3>Personal Info</h3>

                    <div className="profile-row">
                        <span>Name:</span>
                        <p>{user.name}</p>
                    </div>

                    <div className="profile-row">
                        <span>Email:</span>
                        <p>{user.email}</p>
                    </div>

                    <div className="profile-row">
                        <span>Phone:</span>
                        <p>{user.phone}</p>
                    </div>
                </div>

                {showAddressForm && (
                    <div
                        className="profile-modal-overlay"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Add new delivery address"
                        onMouseDown={() => setShowAddressForm(false)}
                    >
                        <div className="profile-modal" onMouseDown={(e) => e.stopPropagation()}>
                            <div className="profile-modal-header">
                                <p className="profile-modal-title">Delivery Information</p>
                                <button
                                    type="button"
                                    className="profile-icon-btn"
                                    onClick={() => setShowAddressForm(false)}
                                    aria-label="Close address form"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={onsubmitHandler} className="profile-address-form" noValidate>
                                <div className="multi-fields">
                                    <div className="form-field">
                                        <input name='firstName' onChange={onChangeHandler} onBlur={onBlurHandler} value={data.firstName} type="text" placeholder='First name' className={fieldClass("firstName")} />
                                        {addressErrors.firstName ? <p className="field-error">{addressErrors.firstName}</p> : null}
                                    </div>
                                    <div className="form-field">
                                        <input name='lastName' onChange={onChangeHandler} onBlur={onBlurHandler} value={data.lastName} type="text" placeholder='Last name' className={fieldClass("lastName")} />
                                        {addressErrors.lastName ? <p className="field-error">{addressErrors.lastName}</p> : null}
                                    </div>
                                </div>
                                <div className="form-field">
                                    <input name='email' onChange={onChangeHandler} onBlur={onBlurHandler} value={data.email} type="email" placeholder='Email' className={fieldClass("email")} />
                                    {addressErrors.email ? <p className="field-error">{addressErrors.email}</p> : null}
                                </div>
                                <div className="form-field">
                                    <input name='street' onChange={onChangeHandler} onBlur={onBlurHandler} value={data.street} type="text" placeholder='Street' className={fieldClass("street")} />
                                    {addressErrors.street ? <p className="field-error">{addressErrors.street}</p> : null}
                                </div>
                                <div className="multi-fields">
                                    <div className="form-field">
                                        <input name='city' onChange={onChangeHandler} onBlur={onBlurHandler} value={data.city} type="text" placeholder='City' className={fieldClass("city")} />
                                        {addressErrors.city ? <p className="field-error">{addressErrors.city}</p> : null}
                                    </div>
                                    <div className="form-field">
                                        <input name='state' onChange={onChangeHandler} onBlur={onBlurHandler} value={data.state} type="text" placeholder='State' className={fieldClass("state")} />
                                        {addressErrors.state ? <p className="field-error">{addressErrors.state}</p> : null}
                                    </div>
                                </div>
                                <div className="multi-fields">
                                    <div className="form-field">
                                        <input name='zipcode' onChange={onChangeHandler} onBlur={onBlurHandler} value={data.zipcode} type="text" placeholder='Zip code' className={fieldClass("zipcode")} />
                                        {addressErrors.zipcode ? <p className="field-error">{addressErrors.zipcode}</p> : null}
                                    </div>
                                    <div className="form-field">
                                        <input name='country' onChange={onChangeHandler} onBlur={onBlurHandler} value={data.country} type="text" placeholder='Country' className={fieldClass("country")} />
                                        {addressErrors.country ? <p className="field-error">{addressErrors.country}</p> : null}
                                    </div>
                                </div>
                                <div className="form-field">
                                    <input name='phone' onChange={onChangeHandler} onBlur={onBlurHandler} value={data.phone} type="text" placeholder='Phone' className={fieldClass("phone")} />
                                    {addressErrors.phone ? <p className="field-error">{addressErrors.phone}</p> : null}
                                </div>

                                <div className="profile-modal-actions">
                                    <button type="submit" className="profile-btn">
                                        Save address
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* ADDRESS */}
                <div className="profile-card">
                    <div className="profile-card-header">
                        <h3>Saved Addresses</h3>
                        <button className="profile-btn profile-btn-sm" onClick={() => { setShowAddressForm(true); setAddressErrors({}); }}>
                            + Add new address
                        </button>
                    </div>

                    {user.address?.length > 0 ? (
                        user.address.map((addr, index) => (
                            <div key={index} className="address-item">
                                <div className="address-main">
                                    <div className="address-topline">
                                        <p className="address-name">{addr.firstName} {addr.lastName}</p>
                                    </div>
                                    <p className="address-line">
                                        {addr.street}, {addr.city}, {addr.state} - {addr.zipcode}, {addr.country}
                                    </p>
                                    <p className="address-phone-line">
                                        <span className="address-phone-label">Phone</span>
                                        <span className="address-phone">{addr.phone}</span>
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    className="address-remove-btn"
                                    onClick={() => deleteAddress(addr._id, index)}
                                    aria-label={`Remove address for ${addr.firstName} ${addr.lastName}`}
                                >
                                    ✕
                                </button>
                                <div className="address-actions">
                                    <button
                                        type="button"
                                        onClick={() => defaultAddressHandler(addr, index)}
                                        className={`profile-btn profile-btn-xs ${defaultIndex === index ? "profile-btn-default" : ""}`}
                                    >
                                        {defaultIndex === index ? "Default Address" : "Set default"}
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="profile-empty">No addresses saved yet.</p>
                    )}
                </div>

                <div className="profile-card">
                    <h3>Change Password</h3>

                    {isChangePassword &&
                        (<>
                            <form autoComplete="off" onSubmit={changePassword} noValidate>
                                <div className="form-field">
                                    <input
                                        type="password"
                                        name="oldPassword"
                                        placeholder="Old Password"
                                        value={passwordData.oldPassword}
                                        onChange={handlePasswordChange}
                                        onBlur={handlePasswordBlur}
                                        className={passwordErrors.oldPassword ? "field-invalid" : ""}
                                    />
                                    {passwordErrors.oldPassword ? <p className="field-error">{passwordErrors.oldPassword}</p> : null}
                                </div>

                                <div className="form-field">
                                    <input
                                        type="password"
                                        name="newPassword"
                                        placeholder="New Password"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        onBlur={handlePasswordBlur}
                                        className={passwordErrors.newPassword ? "field-invalid" : ""}
                                    />
                                    {passwordErrors.newPassword ? <p className="field-error">{passwordErrors.newPassword}</p> : null}
                                </div>
                                <button type="submit">Update Password</button>
                            </form>
                        </>)
                    }
                    {!isChangePassword && <button onClick={() => { setIsChangePassword(true); setPasswordErrors({}); }}>Change Password</button>}
                </div>

            </div>
        </div>
    )
}

export default Profile
