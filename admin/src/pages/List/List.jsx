import React, { useState, useEffect } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";

const List = ({ url }) => {
  const [list, setList] = useState([]);

  const token =
    sessionStorage.getItem("admin_token") ||
    localStorage.getItem("admin_token");

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Food list could not be fetched!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load food list");
    }
  };

  const removeFood = async (foodId) => {
    try {
      const response = await axios.post(
        `${url}/api/food/remove`,
        { id: foodId },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Food removed successfully!");
        await fetchList();
      } else {
        toast.error(response.data.message || "Error removing food");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error removing food");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list add flex-col">
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item) => {
          return (
            <div key={item._id} className="list-table-format">
              <img src={`${url}/images/` + item.image} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{item.price}</p>
              <button onClick={() => removeFood(item._id)} className="cross">
                REMOVE
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default List;