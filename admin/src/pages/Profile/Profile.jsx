import React, { useEffect, useState } from "react";
import axios from "axios";
import getApiUrl from "../../utils/apiUrl";
import "./Profile.css";

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const url = getApiUrl();


    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.post(`${url}/api/user/getuser`, {});

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
    }, [url]);

    if (loading) {
        return (
            <div className="admin-profile">
                <p className="admin-profile-status">Loading profile...</p>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="admin-profile">
                <p className="admin-profile-status">Unable to load profile.</p>
            </div>
        );
    }

    return (
        <div className="admin-profile">
            <div className="admin-profile-header">
                <h2>Admin Profile</h2>
                <p className="admin-profile-subtitle">Your account details</p>
            </div>

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