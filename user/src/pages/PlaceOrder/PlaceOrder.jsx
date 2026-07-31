import React, { useState, useContext, useEffect } from 'react'
import axios from 'axios'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { addressValidators, hasErrors } from '../../utils/validation'

const PlaceOrder = () => {

  const { getTotalCartAmount, token, food_list, cartItems, url, isCorrectPromo, DefaultData } = useContext(StoreContext);

  const [data, setData] = useState({
    firstName: DefaultData.firstName,
    lastName: DefaultData.lastName,
    email: DefaultData.email,
    street: DefaultData.street,
    city: DefaultData.city,
    state: DefaultData.state,
    zipcode: DefaultData.zipcode,
    country: DefaultData.country,
    phone: DefaultData.phone
  })
  const [errors, setErrors] = useState({})

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: addressValidators[name](value) }));
    }
  }

  const onBlurHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setErrors((prev) => ({ ...prev, [name]: addressValidators[name](value) }));
  }

  const validateForm = () => {
    const nextErrors = {};
    Object.keys(addressValidators).forEach((key) => {
      nextErrors[key] = addressValidators[key](data[key]);
    });
    setErrors(nextErrors);
    return !hasErrors(nextErrors);
  }

  const placeOrder = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    })

    let orderData = {
      address: data,
      items: orderItems,
      amount: isCorrectPromo ? getTotalCartAmount() - 5 : getTotalCartAmount() + 5,
      isCorrectPromo: isCorrectPromo
    }
    let response = await axios.post(url + "/api/order/place", orderData);
    if (response.data.success) {
      const { session_url } = response.data;
      window.location.replace(session_url);
    }
    else {
      alert("Error");
    }
  }

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      toast.error("Please sign in to proceed to payment");
      navigate('/cart')
    }
    else if (getTotalCartAmount() === 0) {
      navigate('/cart')
    }
  }, [token]);

  const fieldClass = (name) => (errors[name] ? "field-invalid" : "");

  return (
    <form onSubmit={placeOrder} className='place-order' noValidate>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <p className="place-order-subtitle">Where should we deliver your order?</p>
        <div className="multi-fields">
          <div className="form-field">
            <input name='firstName' onChange={onChangeHandler} onBlur={onBlurHandler} value={data.firstName} type="text" placeholder='First name' className={fieldClass("firstName")} />
            {errors.firstName ? <p className="field-error">{errors.firstName}</p> : null}
          </div>
          <div className="form-field">
            <input name='lastName' onChange={onChangeHandler} onBlur={onBlurHandler} value={data.lastName} type="text" placeholder='Last name' className={fieldClass("lastName")} />
            {errors.lastName ? <p className="field-error">{errors.lastName}</p> : null}
          </div>
        </div>
        <div className="form-field">
          <input name='email' onChange={onChangeHandler} onBlur={onBlurHandler} value={data.email} type="email" placeholder='Email address' className={fieldClass("email")} />
          {errors.email ? <p className="field-error">{errors.email}</p> : null}
        </div>
        <div className="form-field">
          <input name='street' onChange={onChangeHandler} onBlur={onBlurHandler} value={data.street} type="text" placeholder='Street' className={fieldClass("street")} />
          {errors.street ? <p className="field-error">{errors.street}</p> : null}
        </div>
        <div className="multi-fields">
          <div className="form-field">
            <input name='city' onChange={onChangeHandler} onBlur={onBlurHandler} value={data.city} type="text" placeholder='City' className={fieldClass("city")} />
            {errors.city ? <p className="field-error">{errors.city}</p> : null}
          </div>
          <div className="form-field">
            <input name='state' onChange={onChangeHandler} onBlur={onBlurHandler} value={data.state} type="text" placeholder='State' className={fieldClass("state")} />
            {errors.state ? <p className="field-error">{errors.state}</p> : null}
          </div>
        </div>
        <div className="multi-fields">
          <div className="form-field">
            <input name='zipcode' onChange={onChangeHandler} onBlur={onBlurHandler} value={data.zipcode} type="text" placeholder='Zip code' className={fieldClass("zipcode")} />
            {errors.zipcode ? <p className="field-error">{errors.zipcode}</p> : null}
          </div>
          <div className="form-field">
            <input name='country' onChange={onChangeHandler} onBlur={onBlurHandler} value={data.country} type="text" placeholder='Country' className={fieldClass("country")} />
            {errors.country ? <p className="field-error">{errors.country}</p> : null}
          </div>
        </div>
        <div className="form-field">
          <input name='phone' onChange={onChangeHandler} onBlur={onBlurHandler} value={data.phone} type="text" placeholder='Phone' className={fieldClass("phone")} />
          {errors.phone ? <p className="field-error">{errors.phone}</p> : null}
        </div>
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}.00</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount() === 0 ? 0 : 5}.00</p>
            </div>
            {isCorrectPromo ? (<>
              <hr />
              <div className="cart-total-details">
                <p className="cart-promocode-discount">PROMO CODE</p>
                <p className="cart-promocode-discount">₹{getTotalCartAmount() === 0 ? 0 : -10}.00</p>
              </div>
            </>) : null}
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{getTotalCartAmount() === 0 ? 0 : isCorrectPromo ? getTotalCartAmount() - 5 : getTotalCartAmount() + 5}.00</b>
            </div>
          </div>
          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
