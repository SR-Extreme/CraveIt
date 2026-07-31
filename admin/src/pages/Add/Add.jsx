import React, { useEffect, useState } from "react";
import "./Add.css";
import { assets } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { hasErrors, validators } from "../../utils/validation";

const Add = ({ url }) => {
  const [image, setImage] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: ""});
  const [errors, setErrors] = useState({});


  const getFieldError = (name, value) => {
    switch (name) {
      case "name":
        return validators.text(value, "Product name");
      case "description":
        return validators.text(value, "Product description", 10);
      case "price":
        return validators.price(value);
      case "category":
        return validators.select(value, "Category");
      case "image":
        return validators.image(value);
      default:
        return "";
    }
  };

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: getFieldError(name, value) }));
    }
  };

  const onBlurHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setErrors((prev) => ({ ...prev, [name]: getFieldError(name, value) }));
  };

  const onImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file || false);
    setErrors((prev) => ({ ...prev, image: getFieldError("image", file) }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const nextErrors = {
      image: getFieldError("image", image),
      name: getFieldError("name", data.name),
      description: getFieldError("description", data.description),
      price: getFieldError("price", data.price),
      category: getFieldError("category", data.category)};
    setErrors(nextErrors);

    if (!categories.length || !data.category) {
      toast.error("Please create a category first");
      return;
    }

    if (hasErrors(nextErrors)) return;

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("image", image);

    try {
      const response = await axios.post(`${url}/api/food/add`, formData);

      if (response.data.success) {
        setData({
          name: "",
          description: "",
          price: "",
          category: categories[0] || "",
        });
        setImage(false);
        setErrors({});
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to add food");
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await axios.get(`${url}/api/category/list`);
        if (response.data.success && response.data.data?.length) {
          const names = response.data.data.map((cat) => cat.name);
          setCategories(names);
          setData((prev) => ({
            ...prev,
            category: names[0]}));
        } else {
          setCategories([]);
          setData((prev) => ({ ...prev, category: "" }));
        }
      } catch (error) {
        setCategories([]);
        toast.error("Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [url]);

  return (
    <div className="add">
      <div className="add-header">
        <h2>Add Items</h2>
        <p>Create a new food item for the menu</p>
      </div>

      {!loadingCategories && categories.length === 0 && (
        <p className="add-category-empty">
          No categories found. Create categories first before adding food.
        </p>
      )}

      <form className="flex-col" onSubmit={onSubmitHandler} noValidate>
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt=""
            />
          </label>
          <input
            onChange={onImageChange}
            onBlur={() => setErrors((prev) => ({ ...prev, image: getFieldError("image", image) }))}
            type="file"
            id="image"
            accept="image/*"
            hidden
          />
          {errors.image ? <p className="field-error">{errors.image}</p> : null}
        </div>

        <div className="add-product-name flex-col">
          <p>Product name</p>
          <input
            onChange={onChangeHandler}
            onBlur={onBlurHandler}
            value={data.name}
            type="text"
            name="name"
            placeholder="Type here"
            className={errors.name ? "field-invalid" : ""}
          />
          {errors.name ? <p className="field-error">{errors.name}</p> : null}
        </div>

        <div className="add-product-description flex-col">
          <p>Product description</p>
          <textarea
            onChange={onChangeHandler}
            onBlur={onBlurHandler}
            value={data.description}
            name="description"
            rows="6"
            placeholder="Write content here"
            className={errors.description ? "field-invalid" : ""}
          />
          {errors.description ? <p className="field-error">{errors.description}</p> : null}
        </div>

        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product category</p>
            <select
              onChange={onChangeHandler}
              onBlur={onBlurHandler}
              value={data.category}
              name="category"
              disabled={!categories.length}
              className={errors.category ? "field-invalid" : ""}
            >
              {categories.length === 0 ? (
                <option value="">No categories available</option>
              ) : (
                categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))
              )}
            </select>
            {errors.category ? <p className="field-error">{errors.category}</p> : null}
          </div>

          <div className="add-price flex-col">
            <p>Product price</p>
            <input
              onChange={onChangeHandler}
              onBlur={onBlurHandler}
              value={data.price}
              type="Number"
              name="price"
              placeholder="20"
              className={errors.price ? "field-invalid" : ""}
            />
            {errors.price ? <p className="field-error">{errors.price}</p> : null}
          </div>
        </div>

        <button
          type="submit"
          className="add-btn"
          disabled={!categories.length}
        >
          ADD
        </button>
      </form>
    </div>
  );
};

export default Add;
