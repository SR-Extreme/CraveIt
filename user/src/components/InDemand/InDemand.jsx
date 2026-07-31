import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./InDemand.css";
import { StoreContext } from "../../context/StoreContext";
import { getImageUrl } from "../../utils/imageUrl";

const InDemand = () => {
    const { url } = useContext(StoreContext);
    const navigate = useNavigate();
    const [tab, setTab] = useState("quantity");
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchInDemand = async (type) => {
        setLoading(true);
        try {
            const response = await axios.get(`${url}/api/food/in-demand`, {
                params: { type },
            });
            if (response.data.success) {
                setFoods(response.data.data || []);
            } else {
                setFoods([]);
            }
        } catch (error) {
            setFoods([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInDemand(tab);
    }, [tab, url]);

    const rank1 = foods[0];
    const rank2 = foods[1];
    const rank3 = foods[2];

    const renderCard = (food, rank) => {
        if (!food) return <div className={`in-demand-card in-demand-card--empty rank-${rank}`} />;

        const metric =
            tab === "orders"
                ? `${food.totalOrders || 0} orders`
                : `${food.totalQuantityBought || 0} sold`;

        return (
            <article
                className={`in-demand-card rank-${rank}`}
                onClick={() => navigate(`/food/${food._id}`)}
            >
                <span className="in-demand-rank">#{rank}</span>
                <img
                    src={getImageUrl(food.image)}
                    alt={food.name}
                    className="in-demand-image"
                />
                <div className="in-demand-info">
                    <h3>{food.name}</h3>
                    <p className="in-demand-metric">{metric}</p>
                    <p className="in-demand-price">₹{food.price}</p>
                    <span className="in-demand-rating">
                        ★ {(Number(food.averageRating) || 0).toFixed(1)}
                    </span>
                </div>
            </article>
        );
    };

    return (
        <section className="in-demand" id="in-demand">
            <div className="in-demand-header">
                <h2>In Demand</h2>
                <p>The dishes everyone is ordering right now</p>
            </div>

            <div className="in-demand-tabs">
                <button
                    type="button"
                    className={tab === "quantity" ? "active" : ""}
                    onClick={() => setTab("quantity")}
                >
                    Quantity Wise
                </button>
                <button
                    type="button"
                    className={tab === "orders" ? "active" : ""}
                    onClick={() => setTab("orders")}
                >
                    Order Wise
                </button>
            </div>

            {loading ? (
                <p className="in-demand-status">Loading popular dishes...</p>
            ) : foods.length === 0 ? (
                <p className="in-demand-status">No demand data yet. Place some orders!</p>
            ) : (
                <div className="in-demand-podium">
                    {renderCard(rank2, 2)}
                    {renderCard(rank1, 1)}
                    {renderCard(rank3, 3)}
                </div>
            )}
        </section>
    );
};

export default InDemand;