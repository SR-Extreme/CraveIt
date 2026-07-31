import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const url = import.meta.env.VITE_API_URL || "http://localhost:4000";
    const token =
        sessionStorage.getItem("admin_token") ||
        localStorage.getItem("admin_token");

    useEffect(() => {
        const fetchProfile = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await axios.post(
                    `${url}/api/user/getuser`,
                    {},
                    { headers: { token } }
                );

                if (response.data.success) {
                    setProfile(response.data.data);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [token, url]);

    if (loading) {
        return (
            <div className="admin-profile">
                <p>Loading profile...</p>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="admin-profile">
                <p>Unable to load profile.</p>
            </div>
        );
    }

    return (
        <div className="admin-profile">
            <h2>Admin Profile</h2>
            <p className="admin-profile-subtitle">Your account details</p>

            <div className="admin-profile-card">
                <div className="admin-profile-row">
                    <span>Name</span>
                    <strong>{profile.name}</strong>
                </div>
                <div className="admin-profile-row">
                    <span>Email</span>
                    <strong>{profile.email}</strong>
                </div>
                <div className="admin-profile-row">
                    <span>Phone</span>
                    <strong>{profile.phone}</strong>
                </div>
                <div className="admin-profile-row">
                    <span>Role</span>
                    <strong className="admin-profile-role">{profile.role}</strong>
                </div>
            </div>
        </div>
    );
};

export default Profile;