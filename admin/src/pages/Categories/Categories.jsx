import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";
import "./Categories.css";

const Categories = ({ url }) => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [image, setImage] = useState(false);
    const [loading, setLoading] = useState(true);

    const token =
        sessionStorage.getItem("admin_token") ||
        localStorage.getItem("admin_token");

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${url}/api/category/list`);
            if (response.data.success) {
                setCategories(response.data.data || []);
            } else {
                toast.error(response.data.message || "Failed to load categories");
            }
        } catch (error) {
            toast.error("Failed to load categories");
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("Category name is required");
            return;
        }

        if (!image) {
            toast.error("Category image is required");
            return;
        }

        const formData = new FormData();
        formData.append("name", name.trim());
        formData.append("image", image);

        try {
            const response = await axios.post(`${url}/api/category/add`, formData, {
                headers: { token },
            });

            if (response.data.success) {
                toast.success("Category added");
                setName("");
                setImage(false);
                fetchCategories();
            } else {
                toast.error(response.data.message || "Failed to add category");
            }
        } catch (error) {
            toast.error("Failed to add category");
        }
    };

    const handleRemove = async (id) => {
        const confirmed = window.confirm("Delete this category?");
        if (!confirmed) return;

        try {
            const response = await axios.post(
                `${url}/api/category/remove`,
                { id },
                { headers: { token } }
            );

            if (response.data.success) {
                toast.success("Category removed");
                fetchCategories();
            } else {
                toast.error(response.data.message || "Failed to remove category");
            }
        } catch (error) {
            toast.error("Failed to remove category");
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [url]);

    return (
        <div className="categories-page">
            <div className="categories-header">
                <h2>Categories</h2>
                <p>Create and manage food categories</p>
            </div>

            <form className="categories-form" onSubmit={handleAdd}>
                <div className="categories-upload">
                    <p>Category Image</p>
                    <label htmlFor="category-image">
                        <img
                            src={image ? URL.createObjectURL(image) : assets.upload_area}
                            alt="Upload"
                        />
                    </label>
                    <input
                        id="category-image"
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>

                <div className="categories-fields">
                    <input
                        type="text"
                        placeholder="Category name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <button type="submit">Add Category</button>
                </div>
            </form>

            {loading ? (
                <p className="categories-status">Loading categories...</p>
            ) : categories.length === 0 ? (
                <p className="categories-status">No categories yet. Add your first one.</p>
            ) : (
                <div className="categories-grid">
                    {categories.map((cat) => (
                        <article className="categories-card" key={cat._id}>
                            <img src={`${url}/images/${cat.image}`} alt={cat.name} />
                            <div className="categories-card-body">
                                <h4>{cat.name}</h4>
                                <button type="button" onClick={() => handleRemove(cat._id)}>
                                    Remove
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Categories;