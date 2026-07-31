import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";
import { getImageUrl } from "../../utils/imageUrl";
import { hasErrors, validators } from "../../utils/validation";
import "./Categories.css";

const Categories = ({ url }) => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [image, setImage] = useState(false);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});


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

    const handleNameChange = (e) => {
        const value = e.target.value;
        setName(value);
        if (errors.name) {
            setErrors((prev) => ({ ...prev, name: validators.text(value, "Category name") }));
        }
    };

    const handleNameBlur = () => {
        setErrors((prev) => ({ ...prev, name: validators.text(name, "Category name") }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file || false);
        setErrors((prev) => ({ ...prev, image: validators.image(file) }));
    };

    const handleAdd = async (e) => {
        e.preventDefault();

        const nextErrors = {
            name: validators.text(name, "Category name"),
            image: validators.image(image)};
        setErrors(nextErrors);
        if (hasErrors(nextErrors)) return;

        const formData = new FormData();
        formData.append("name", name.trim());
        formData.append("image", image);

        try {
            const response = await axios.post(`${url}/api/category/add`, formData);

            if (response.data.success) {
                toast.success("Category added");
                setName("");
                setImage(false);
                setErrors({});
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
                { id }
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

            <form className="categories-form" onSubmit={handleAdd} noValidate>
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
                        onChange={handleImageChange}
                        onBlur={() => setErrors((prev) => ({ ...prev, image: validators.image(image) }))}
                    />
                    {errors.image ? <p className="field-error">{errors.image}</p> : null}
                </div>

                <div className="categories-fields">
                    <div className="form-field">
                        <input
                            type="text"
                            placeholder="Category name"
                            value={name}
                            onChange={handleNameChange}
                            onBlur={handleNameBlur}
                            className={errors.name ? "field-invalid" : ""}
                        />
                        {errors.name ? <p className="field-error">{errors.name}</p> : null}
                    </div>
                    <button type="submit">Add Category</button>
                </div>
            </form>

            {loading ? (
                <p className="categories-status">Loading categories...</p>
            ) : categories.length === 0 ? (
                <p className="categories-status">No categories yet. Add your first one.</p>
            ) : (
                <div className="categories-list">
                    {categories.map((cat) => (
                        <article className="categories-card" key={cat._id}>
                            <img src={getImageUrl(cat.image)} alt={cat.name} />
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
