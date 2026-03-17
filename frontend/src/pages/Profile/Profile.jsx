import React, { useContext, useEffect, useState } from 'react'
import './Profile.css'
import axios from 'axios'
import { StoreContext } from '../../context/StoreContext'
import { toast } from "react-toastify"

const Profile = () => {

    const { url } = useContext(StoreContext);
    const [user, setUser] = useState([]);
    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: ""
    })
    const [isChangePassword, setIsChangePassword] = useState(false);

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

    useEffect(() => {
        getUser();
    }, [])

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

                {/* ADDRESS */}
                <div className="profile-card">
                    <h3>Saved Addresses</h3>

                    {user.address?.length > 0 ? (
                        user.address.map((addr, index) => (
                            <div key={index} className="address-box">
                                <p>{addr.firstName} - {addr.lastName}</p>
                                <p>{addr.email}</p>
                                <p>{addr.street}</p>
                                <p>{addr.city} - {addr.state}</p>
                                <p>{addr.zipcode} - {addr.country}</p>
                                <p>{addr.phone}</p>
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