import React, { useContext, useState } from 'react'
import './Cart.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom'
import { toast } from "react-toastify";
import { getImageUrl } from "../../utils/imageUrl";
import { validators } from "../../utils/validation";

const Cart = () => {

  const { cartItems, food_list, removeFromCart, getTotalCartAmount, url, setPromocode, promocode, targetPromocode, setIsCorrectPromo, isCorrectPromo, token } = useContext(StoreContext);
  const navigate = useNavigate();
  const [promoError, setPromoError] = useState("");

  const handleProceedToCheckout = () => {
    if (!token) {
      toast.error("Please sign in to proceed to payment");
      return;
    }
    navigate('/order');
  };

  const handlePromoChange = (e) => {
    setPromocode(e.target.value);
    if (promoError) setPromoError(validators.promocode(e.target.value));
  };

  const handlePromoBlur = () => {
    if (!String(promocode || "").trim()) {
      setPromoError("");
      return;
    }
    setPromoError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const error = validators.promocode(promocode);
    setPromoError(error);
    if (error) return;

    if (targetPromocode === promocode && !isCorrectPromo) {
      setIsCorrectPromo(true);
      toast.success("Promo Code Applied Successfully !!");
      setPromoError("");
    }
    else if (targetPromocode !== promocode) {
      if (isCorrectPromo) setIsCorrectPromo(false);
      setPromoError("Invalid promo code");
      toast.error("Invalid Promo Code !!")
    }
    setPromocode("");
  }

  const hasItems = food_list.some((item) => cartItems[item._id] > 0);

  return (
    <div className='cart'>
      <div className="cart-header">
        <h1>Your Cart</h1>
        <p>Review your items before checkout</p>
      </div>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <hr />
        {!hasItems && <p className="cart-empty">Your cart is empty. Explore the menu to add something delicious.</p>}
        {food_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={index}>
                <div className="cart-items-title cart-items-item">
                  <img src={getImageUrl(item.image)} alt="" />
                  <p>{item.name}</p>
                  <p>₹{item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>₹{item.price * cartItems[item._id]}</p>
                  <button className='cross' onClick={() => {
                    removeFromCart(item._id);
                  }}>Remove</button>
                </div>
                <hr />
              </div>
            )
          }
        })}
      </div>
      <div className="cart-bottom">
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
          <button onClick={handleProceedToCheckout}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, Enter it here</p>
            <form className="cart-promocode-input" onSubmit={handleSubmit} noValidate>
              <div className="form-field cart-promocode-field">
                <input
                  type="text"
                  value={promocode}
                  onChange={handlePromoChange}
                  onBlur={handlePromoBlur}
                  placeholder='promo code'
                  className={promoError ? "field-invalid" : ""}
                />
                {promoError ? <p className="field-error">{promoError}</p> : null}
              </div>
              <button type='submit'>Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
