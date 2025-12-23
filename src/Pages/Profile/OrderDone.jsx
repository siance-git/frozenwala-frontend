import React from 'react'
import './OrderDone.css';
import confetti from "canvas-confetti";
import { useEffect } from 'react';
import { useNavigate,useParams } from 'react-router-dom';

function OrderSuccessfullpage() {
    let {tracking_id} = useParams();
    console.log("trackig no: ",tracking_id)
    const navigate = useNavigate();
    useEffect(() => {
  const duration = 3 * 1000;
  const end = Date.now() + duration;

  const interval = setInterval(() => {
    if (Date.now() > end) {
      return clearInterval(interval);
    }

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, 500);
}, []);

  return (
    <div className="success-container">
      <div className="success-card">
        <div className="checkmark-wrapper">
          <div className="checkmark-circle">
            <div className="checkmark"></div>
          </div>
        </div>
        <h2>Order Placed Successfully!</h2>
        <p>Thank you for your purchase. Your order is being processed.</p>
        <div className="order-details">
          {/* <p>Tracking ID: <strong>{tracking_id}</strong></p> */}
          <p>Estimated Delivery: <strong>Quickly as much as possible</strong></p>
        </div>
        <button className="orders-button w-100 mb-2" onClick={()=>{navigate(`/profile/2`)}}>Order History</button>
        <button className="orders-button w-100" onClick={()=>{navigate("/")}}>Continue to Shopping</button>
      </div>
    </div>);
}

export default OrderSuccessfullpage