import React, { useEffect, useState } from "react";
import Api from "../Utills/Api.js";
import Footer from "../Home/Footer";
import Navbar from "../Home/Navbar";
import { useNavigate } from "react-router-dom";
import useRazorpay from "react-razorpay";
import logo from "../../Frozenwala.png";
import { motion } from "framer-motion";
import "./Checkout.css";
import { toast } from "react-toastify";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [Razorpay] = useRazorpay();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // STATES
  const [deliveryOption, setDeliveryOption] = useState("delivery");
  const [selectedPickup, setSelectedPickup] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [getProduct, setGetProduct] = useState([]);
  
  // COUPONS
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);

  // PRICE STATES
  const [baseTotal, setBaseTotal] = useState(0);
  const [previousPrice, setPreviousPrice] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);

  // WALLET
  const wallet = Number(localStorage.getItem("wallet") || 0);
  const [walletValue, setWalletValue] = useState(0);
  const [walletBalance, setWalletBalance] = useState(wallet);

  // COUPON INPUT
  const [couponCode, setCouponCode] = useState("");
  const [couponApply, setCouponApply] = useState(false);
  const [pickup, setPickup] = useState(0);

  const uid = localStorage.getItem("user_id");

  const [addressInfo, setAddressInfo] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zip: "",
  });

  const calculateFinalPrice = () => {
    let price = previousPrice;

    if (deliveryCharge >= 0) price += deliveryCharge;

    if (couponApply || discount > 0) price -= discount;

    if (walletValue > 0) {
      if (price - walletValue < 1) {
        setWalletValue(price - 1);
        price = 1;
      } else {
        price -= walletValue;
      }
    }

    if (price < 0) price = 0;

    setFinalPrice(price);
  };

  // FETCH CART + PRICE
  useEffect(() => {
    getProducts();
    getTotalPrice();
    fetchAvailableCoupons();
  }, [pickup]);

  useEffect(() => {
    calculateFinalPrice();
  }, [discount, deliveryCharge, walletBalance, walletValue]);

  // GET CART PRODUCTS
  const getProducts = async () => {
    try {
      const response = await Api.get(`api/get_cart/?user_id=${uid}`);
      setGetProduct(response.data);
    } catch (error) {
      console.error("Cart error:", error);
    }
  };

  // FETCH COUPONS
  const fetchAvailableCoupons = async () => {
    setLoadingCoupons(true);
    try {
      const response = await Api.get("api/get_all_coupon/");
      if (response.data.status === true) {
        setAvailableCoupons(response.data.coupons || []);
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
    } finally {
      setLoadingCoupons(false);
    }
  };

  // GET TOTAL PRICE
  const getTotalPrice = async (pickupVal = pickup) => {
    try {
      const response = await Api.get(
        `api/get_total_price/?user_id=${uid}&coupon_code=${
          couponApply ? couponCode : ""
        }&used_wallet=0&pick_up=${pickupVal}`
      );

      setBaseTotal(response.data.total_price - response.data.delivery_charge);
      setPreviousPrice(response.data.previous_price);

      if (!couponApply) {
        setDiscount(response.data.discounted_price);
      }

      setDeliveryCharge(response.data.delivery_charge);

      setTimeout(() => calculateFinalPrice(), 50);
    } catch (error) {
      console.error("Price error:", error);
    }
  };

  // APPLY COUPON
  const applyCoupon = async () => {
    // if (baseTotal < 1000) {
    //   return toast.error("Cart value must be at least ₹1000 to apply coupon");
    // }
    try {
      if (!couponCode) return toast.error("Enter coupon code");

      const response = await Api.post("api/apply-coupon/", {
        coupon_code: couponCode,
        cart_value: baseTotal,
      });

      if (response.data.status === true) {
        setDiscount(response.data.discount);
        setCouponApply(true);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }

      calculateFinalPrice();
    } catch (error) {
      console.error("Coupon error:", error);
      toast.error("Invalid coupon");
    }
  };

  // REMOVE COUPON
  const removeCoupon = () => {
    setCouponApply(false);
    setCouponCode("");
    setDiscount(0);
    calculateFinalPrice();
    toast.info("Coupon removed");
  };

  // PAYMENT HANDLER
  const razorpayKeyId = "rzp_live_RYSfTyxfbAycrR";

  const handlePayment = async () => {
    const { name, phone, address, city, state, country, zip } = addressInfo;
    if (
      deliveryOption === "delivery" &&
      (!name || !phone || !address || !city || !state || !country || !zip || !selectedOption)
    ) {
      return alert("Please fill all delivery details.");
    }
const pick_up = deliveryOption === "delivery" ? 0 : 1;
console.log("selectedOption : ",selectedOption)
    try {
      const bodyData = {
        user_id: uid,
        total_amount: finalPrice,
        newname: name,
        address,
        city,
        state,
        country,
        zip_code: zip,
        phone,
        delivery_time: selectedOption ? selectedOption : selectedPickup,
        coupon_code: couponCode,
        walet_value: walletValue,
        delivery_price: deliveryCharge,
        discounted_price: discount,
        previous_price: previousPrice,
        pick_up: pick_up,
      };

      const response = await Api.post("api/create_order/", bodyData);

      const options = {
        currency: "INR",
        key: razorpayKeyId,
        amount: finalPrice * 100,
        name: "Frozenwala Cart",
        order_id: response.data.razorpay_order_id,
        handler: async function (res) {
          await Api.post("api/verify_payment/", {
            razorpay_payment_id: res.razorpay_payment_id,
            razorpay_order_id: res.razorpay_order_id,
            razorpay_signature: res.razorpay_signature,
          });
          navigate("/orderdone");
        },
      };

      new Razorpay(options).open();
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  // ADDRESS CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddressInfo((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Navbar />

      <motion.div className="checkout-container">
        <div className="checkout-left">
          <div className="checkout-card">
            <h3>Customer Details</h3>

            <div className="option-buttons">
              <button
                className={`option-btn ${deliveryOption === "delivery" ? "active" : ""}`}
                onClick={() => { setDeliveryOption("delivery"); setPickup(0); getTotalPrice(0); }}
              >
                Delivery
              </button>

              <button
                className={`option-btn ${deliveryOption === "pickup" ? "active" : ""}`}
                onClick={() => { setDeliveryOption("pickup"); setPickup(1); getTotalPrice(1); }}
              >
                Pickup
              </button>
            </div>

            {deliveryOption === "delivery" && (
              <div className="address-form">
                <h4>Add New Address</h4>
                {Object.entries(addressInfo).map(([key, val]) => (
                  <input
                    key={key}
                    type="text"
                    name={key}
                    placeholder={key}
                    value={val}
                    onChange={handleChange}
                  />
                ))}

                <div className="delivery-timing">
                  <h6>Select Delivery Timing:</h6>
                  {["Within 1hr", "1-3 hrs"].map((time) => (
                    <label key={time}>
                      <input
                        type="radio"
                        checked={selectedOption === time}
                        onChange={() => setSelectedOption(time)}
                      />
                      {time}
                    </label>
                  ))}
                </div>

                <button className="pay-btn" onClick={handlePayment}>Proceed to Pay</button>
              </div>
            )}

            {deliveryOption === "pickup" && (
              <div className="pickup-form">
                <h4>Select Pickup Timing</h4>
                {["Within 1hr", "1hr–3hrs"].map((time) => (
                  <label key={time}>
                    <input
                      type="radio"
                      checked={selectedPickup === time}
                      onChange={() => setSelectedPickup(time)}
                    />
                    {time}
                  </label>
                ))}

                <button className="pay-btn" onClick={handlePayment}>Proceed to Pay</button>
              </div>
            )}
          </div>
        </div>

        <div className="checkout-right">
          <h3>Items</h3>

          {getProduct?.map((item) => (
            <div className="item-card" key={item.id}>
              <div className="item-info">
                <img src={item.product_image || logo} alt={item.product_name} />
                <div>
                  <span className="item-name">{item.product_name}</span>
                  <p>₹{item.price}</p>
                </div>
              </div>
              <span>Qty {item.quantity}</span>
            </div>
          ))}

          <div className="price-summary">
            {/* AVAILABLE COUPONS */}
            <div className="available-coupons-section">
              <h4>Available Offers</h4>
              {loadingCoupons ? (
                <div className="coupon-loading">Loading offers...</div>
              ) : availableCoupons.length > 0 ? (
                <div className="coupon-cards-container">
                  {availableCoupons.map((coupon, index) => (
                    <div 
                      className="coupon-card" 
                      key={index}
                      onClick={() => {
                        setCouponCode(coupon.coupon);
                        toast.info(`Coupon ${coupon.coupon} copied! Click Apply to use.`);
                      }}
                    >
                      <div className="coupon-header">
                        <span className="coupon-code">{coupon.coupon}</span>
                        <span className="coupon-badge">
                          {coupon.coupon_type === "Flat" ? "₹" : "%"}
                        </span>
                      </div>
                      <div className="coupon-body">
                        <p className="coupon-value">
                          {coupon.coupon_type === "Flat" 
                            ? `₹${coupon.coupon_value} OFF` 
                            : `${coupon.coupon_value}% OFF`
                          }
                        </p>
                        <p className="coupon-minimum">
                          Min. purchase: ₹{coupon.minimum_purchase}
                        </p>
                      </div>
                      <div className="coupon-footer">
                        <p className="coupon-description">{coupon.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-coupons">No offers available at the moment</div>
              )}

              <p className="coupon-hint">👆 Click on any coupon to copy, then click Apply</p>
            </div>

            {/* COUPON INPUT */}
            <div className="coupon-input-section">
              <input
                type="text"
                placeholder="Enter Coupon Code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="coupon-input"
              />
              {couponApply ? (
                <button onClick={removeCoupon} className="apply-btn remove-btn">
                  Remove
                </button>
              ) : (
                <button onClick={applyCoupon} className="apply-btn">
                  Apply Coupon
                </button>
              )}
            </div>

            {/* WALLET */}
            <div className="summary-row">
              <p>Wallet Balance: ₹{walletBalance}</p>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={walletValue > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setWalletValue(walletBalance);
                    } else {
                      setWalletValue(0);
                    }
                  }}
                />
                <span className="slider"></span>
              </label>
            </div>

            {/* FINAL PRICE */}
            <div className="summary-totals">
              <h4>Price Summary</h4>
              <p>Total Price: ₹{previousPrice}</p>
              <p>Delivery: ₹{deliveryCharge}</p>
              <p>Discount: ₹{discount}</p>
              <p>Wallet Used: ₹{walletValue}</p>
              <h5>Payable: ₹{finalPrice || previousPrice + deliveryCharge}</h5>
            </div>
          </div>
        </div>
      </motion.div>

      <Footer />
    </>
  );
};

export default CheckoutPage;
