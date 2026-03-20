import React, { useContext, useEffect, useState } from 'react'
import './Profile.css'
import axios from 'axios'
import { StoreContext } from '../../context/StoreContext'
import { toast } from "react-toastify"

const Profile = () => {

    const { url, DefaultData, setDefaultData, defaultIndex, setDefaultIndex } = useContext(StoreContext);
    const [user, setUser] = useState([]);
    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: ""
    })
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
    const [isChangePassword, setIsChangePassword] = useState(false);
    const [showAddressForm, setShowAddressForm] = useState(false);

    const handlePasswordChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setPasswordData((passwordData) => ({ ...passwordData, [name]: value }));
    }

    const getUser = async () => {
        const token = localStorage.getItem("token");
        const response = await axios.post(url + '/api/user/getuser', {}, { headers: { token: token } });
        if (response.data.success) {
            setUser(response.data.data);
        }
    }

    const changePassword = async (e) => {
        e.preventDefault();
        const response = await axios.post(url + "/api/user/updatepassword", { email: user.email, oldPassword: passwordData.oldPassword, newPassword: passwordData.newPassword });
        if (response.data.success) {
            toast.success(response.data.message);
            setIsChangePassword(false);
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
    }

    const onsubmitHandler = async (e) => {
        e.preventDefault();
        const response = await axios.post(url + "/api/user/updateaddress", { email: user.email, address: data });
        if (response.data.success) {
            setShowAddressForm(false);
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
        const token = localStorage.getItem("token");
        const response = await axios.post(url + "/api/user/deleteaddress", { id: addId }, { headers: { token: token } });
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

    return (
        <div className="profile">

            <div className="profile-container">
                <h2>My Profile</h2>

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

                            <form onSubmit={onsubmitHandler} className="profile-address-form">
                                <div className="multi-fields">
                                    <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First name' />
                                    <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last name' />
                                </div>
                                <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email' />
                                <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
                                <div className="multi-fields">
                                    <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
                                    <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
                                </div>
                                <div className="multi-fields">
                                    <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip code' />
                                    <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
                                </div>
                                <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' />

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
                        <button className="profile-btn profile-btn-sm" onClick={() => setShowAddressForm(true)}>
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
                        <p>No addresses saved</p>
                    )}
                </div>

                <div className="profile-card">
                    <h3>Change Password</h3>

                    {isChangePassword &&
                        (<>
                            <form autoComplete="off">
                                <input
                                    type="password"
                                    name="oldPassword"
                                    placeholder="Old Password"
                                    value={passwordData.oldPassword}
                                    onChange={handlePasswordChange}
                                />

                                <input
                                    type="password"
                                    name="newPassword"
                                    placeholder="New Password"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                />
                            </form>
                            <button onClick={changePassword}>Update Password</button>
                        </>)
                    }
                    {!isChangePassword && <button onClick={() => setIsChangePassword(true)}>Change Password</button>}
                </div>

            </div>
        </div>
    )
}

export default Profile