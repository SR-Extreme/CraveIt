import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Users.css";

const Users = () => {
    const navigate = useNavigate();
    const [tab, setTab] = useState("user");
    const [users, setUsers] = useState([]);
    const [topCustomers, setTopCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    const url = import.meta.env.VITE_API_URL || "http://localhost:4000";


    const roleQuery = tab === "user" ? "user" : "delivery";

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${url}/api/user/getallusers`, {
                params: { role: roleQuery },
            });

            if (response.data.success) {
                setUsers(response.data.data || []);
            } else {
                toast.error(response.data.message || "Failed to load users");
                setUsers([]);
            }
        } catch (error) {
            toast.error("Failed to load users");
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchTopCustomers = async () => {
        try {
            const response = await axios.get(`${url}/api/user/top-customers`);
            if (response.data.success) {
                setTopCustomers(response.data.data || []);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm("Delete this user permanently?");
        if (!confirmed) return;

        try {
            const response = await axios.delete(`${url}/api/user/${id}`);

            if (response.data.success) {
                toast.success("User deleted");
                fetchUsers();
                if (tab === "user") fetchTopCustomers();
            } else {
                toast.error(response.data.message || "Delete failed");
            }
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    useEffect(() => {
        fetchUsers();
        if (tab === "user") {
            fetchTopCustomers();
        }
    }, [tab]);

    const rank1 = topCustomers[0];
    const rank2 = topCustomers[1];
    const rank3 = topCustomers[2];

    const renderTopCard = (user, rank) => {
        if (!user) {
            return <div className={`users-top-card users-top-card--empty rank-${rank}`} />;
        }

        return (
            <article className={`users-top-card rank-${rank}`}>
                <span className="users-top-rank">#{rank}</span>
                <h4>{user.name}</h4>
                <p>{user.email}</p>
                <p>{user.phone}</p>
                <strong>₹{user.totalAmountBought || 0}</strong>
            </article>
        );
    };

    return (
        <div className="users-page">
            <div className="users-header">
                <h2>User Management</h2>
                <p>Manage customers and delivery agents</p>
            </div>

            <div className="users-tabs">
                <button
                    type="button"
                    className={tab === "user" ? "active" : ""}
                    onClick={() => setTab("user")}
                >
                    Users
                </button>
                <button
                    type="button"
                    className={tab === "delivery" ? "active" : ""}
                    onClick={() => setTab("delivery")}
                >
                    Delivery Agents
                </button>
            </div>

            <div className="users-panel">
                {tab === "user" && (
                    <section className="users-top">
                        <h3>Top 3 Customers</h3>
                        <div className="users-top-podium">
                            {renderTopCard(rank2, 2)}
                            {renderTopCard(rank1, 1)}
                            {renderTopCard(rank3, 3)}
                        </div>
                    </section>
                )}

                {loading ? (
                    <p className="users-status">Loading users...</p>
                ) : users.length === 0 ? (
                    <p className="users-status">No users found in this tab.</p>
                ) : (
                    <div className="users-list">
                        {users.map((user) => (
                            <article className="users-card" key={user._id}>
                                <div className="users-card-info">
                                    <h4>{user.name}</h4>
                                    <p>{user.email}</p>
                                    <p>{user.phone}</p>
                                    {tab === "user" && (
                                        <span>Spent: ₹{user.totalAmountBought || 0}</span>
                                    )}
                                    {tab === "delivery" && (
                                        <span>
                                            {user.available ? "Available" : "Unavailable"}
                                        </span>
                                    )}
                                </div>
                                <div className="users-card-actions">
                                    <button
                                        type="button"
                                        className="users-btn users-btn--view"
                                        onClick={() => navigate(`/users/${user._id}`)}
                                    >
                                        View
                                    </button>
                                    <button
                                        type="button"
                                        className="users-btn users-btn--delete"
                                        onClick={() => handleDelete(user._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Users;