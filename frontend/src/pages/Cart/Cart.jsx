import React, { useContext } from 'react'
import './Cart.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom'
import { toast } from "react-toastify";

const Cart = () => {

  const { cartItems, food_list, removeFromCart, getTotalCartAmount, url, setPromocode, promocode, targetPromocode, setIsCorrectPromo, isCorrectPromo } = useContext(StoreContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (targetPromocode === promocode && !isCorrectPromo) {
      setIsCorrectPromo(true);
      toast.success("Promo Code Applied Successfully !!");
    }
    else if (targetPromocode !== promocode) {
      if (isCorrectPromo) setIsCorrectPromo(false);
      toast.error("Invalid Promo Code !!")
    }
    setPromocode("");
  }

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={index}>
                <div className="cart-items-title cart-items-item">
                  <img src={url + "/images/" + item.image} alt="" />
                  <p>{item.name}</p>
                  <p>₹{item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>₹{item.price * cartItems[item._id]}</p>
                  <button className='cross' onClick={() => {
                    removeFromCart(item._id);
                  }}>REMOVE</button>
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
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount() === 0 ? 0 : 5}</p>
            </div>
            {isCorrectPromo ? (<>
              <hr />
              <div className="cart-total-details">
                <p className="cart-promocode-discount">PROMO CODE</p>
                <p className="cart-promocode-discount">₹{getTotalCartAmount() === 0 ? 0 : -10}</p>
              </div>
            </>) : null}
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{getTotalCartAmount() === 0 ? 0 : isCorrectPromo ? getTotalCartAmount() - 5 : getTotalCartAmount() + 5}</b>
            </div>
          </div>
          <button onClick={() => navigate('/order')}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, Enter it here</p>
            <form className="cart-promocode-input" onSubmit={handleSubmit}>
              <input type="text" value={promocode} onChange={(e) => setPromocode(e.target.value)} placeholder='promo code' />
              <button type='submit'>Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
