import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "./UserDetails.css";

const UserDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const url = import.meta.env.VITE_API_URL || "http://localhost:4000";


    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${url}/api/user/${id}`);

                if (response.data.success) {
                    setUser(response.data.data);
                } else {
                    toast.error(response.data.message || "User not found");
                }
            } catch (error) {
                toast.error("Failed to load user");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id, url]);

    const handleDelete = async () => {
        const confirmed = window.confirm("Delete this user permanently?");
        if (!confirmed) return;

        try {
            const response = await axios.delete(`${url}/api/user/${id}`);

            if (response.data.success) {
                toast.success("User deleted");
                navigate("/users");
            } else {
                toast.error(response.data.message || "Delete failed");
            }
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    if (loading) {
        return (
            <div className="user-details">
                <p className="user-details-status">Loading user details...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="user-details">
                <p className="user-details-status">User not found.</p>
                <button
                    type="button"
                    className="user-details-btn user-details-btn--back"
                    onClick={() => navigate("/users")}
                    style={{ marginTop: 16 }}
                >
                    Back
                </button>
            </div>
        );
    }

    return (
        <div className="user-details">
            <div className="user-details-header">
                <div>
                    <h2>{user.name}</h2>
                    <p>Complete user details</p>
                </div>
                <div className="user-details-actions">
                    <button
                        type="button"
                        className="user-details-btn user-details-btn--back"
                        onClick={() => navigate("/users")}
                    >
                        Back
                    </button>
                    <button
                        type="button"
                        className="user-details-btn user-details-btn--delete"
                        onClick={handleDelete}
                    >
                        Delete
                    </button>
                </div>
            </div>

            <div className="user-details-card">
                <div className="user-details-row">
                    <span>Email</span>
                    <strong>{user.email}</strong>
                </div>
                <div className="user-details-row">
                    <span>Phone</span>
                    <strong>{user.phone}</strong>
                </div>
                <div className="user-details-row">
                    <span>Role</span>
                    <strong className="user-details-role">{user.role}</strong>
                </div>

                {user.role === "user" && (
                    <div className="user-details-row">
                        <span>Total Amount Bought</span>
                        <strong>₹{user.totalAmountBought || 0}</strong>
                    </div>
                )}

                {user.role === "delivery" && (
                    <div className="user-details-row">
                        <span>Availability</span>
                        <strong>{user.available ? "Available" : "Unavailable"}</strong>
                    </div>
                )}

                <div className="user-details-row user-details-row--block">
                    <span>Addresses</span>
                    {user.address?.length ? (
                        <ul className="user-details-addresses">
                            {user.address.map((addr) => (
                                <li key={addr._id}>
                                    {addr.firstName} {addr.lastName}, {addr.street}, {addr.city},{" "}
                                    {addr.state}, {addr.country} - {addr.zipcode}
                                    {addr.phone ? ` · ${addr.phone}` : ""}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <strong>No saved addresses</strong>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDetails;