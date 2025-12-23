import React, { useEffect, useState } from "react";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Footer";
import Api from "../Utills/Api";
import { useNavigate } from "react-router-dom";
import logo from "../../Frozenwala.png";
import { motion, AnimatePresence } from "framer-motion";
import { use } from "react";
import axios from "axios";
import { FiArrowLeft } from "react-icons/fi";

function CartDetails() {
  const navigate = useNavigate();

  const [getProduct, setGetProduct] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [discountPrice, setDiscount] = useState(0);
  const [previousPrice, setPreviousPrice] = useState(0);
  const [walletValue, setWalletValue] = useState(0);

  const [stock, setStock] = useState({});

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    getStock();
  }, []);
  const getStock = async () => {
    try {
      // const response = await Api.get(`api/stock/`);
      const response = await axios.get(`https://backend.frozenwala.com/api/stock/`);
      const map = {};
      response.data.forEach((item) => (map[item.item_id] = item.openingstock));
      setStock(map);
    } catch (error) {
      console.error("Error getting stock:", error);
    }
  };
  const uid = localStorage.getItem("user_id");

  const getProducts = async () => {
    try {
      const response = await Api.get(`api/get_cart/?user_id=${uid}`);
      console.log("response from cart: ", response.data);
      setGetProduct(response.data);
    } catch (error) {
      console.log("Error fetching cart items:", error);
    }
  };

  const getTotalPrice = async () => {
    try {
      const response = await Api.get(`api/get_total_price/?user_id=${uid}`);
      setTotalPrice(response.data.total_price);
      setDeliveryCharge(response.data.delivery_charge);
      setDiscount(response.data.discounted_price);
      setPreviousPrice(response.data.previous_price);
      setWalletValue(response.data.wallet_value);
    } catch (error) {
      console.log("Error fetching total price:", error);
    }
  };

  useEffect(() => {
    getProducts();
    getTotalPrice();
  }, []);

  const removeItemFromCart = async (itemId) => {
    try {
      await Api.delete(`api/remove-cart-item/?cart_id=${itemId}`);
      setGetProduct((prev) => prev.filter((item) => item.id !== itemId));
      getTotalPrice();
      refRestCart();
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const subOne = async (id) => {
    const item = getProduct.find((i) => i.id === id);
    if (!item || item.quantity <= 1) return alert("Minimum quantity is 1");
    await Api.post(`api/decrease/`, { cart_id: id });
    setGetProduct((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, quantity: Math.max(i.quantity - 1, 1) } : i
      )
    );
    getTotalPrice();
  };

  const addOne = async (id) => {
    const item = getProduct.find((i) => i.id === id);
    if (!item) return;
    const availableStock = stock[item.product_id] || 0;
    if (item.quantity >= availableStock) {
      return alert(`Only ${availableStock} items available in stock.`);
    }
    await Api.post(`api/increase/`, { cart_id: id });
    setGetProduct((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i))
    );
    getTotalPrice();
  };

  const checkoutNow = () => navigate("/checkout");

  const [refresh, setRefresh] = useState(false);
  const refRestCart = () => setRefresh((prev) => !prev);

  return (
    <div style={{ background: "#f8f9fa", minHeight: "100vh" }}>
      <Navbar refreshCart={refresh} />

      {/* Animated Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-4 relative"
        style={{marginTop: "20px"}}
      >
        <button
          onClick={() => navigate(-1)}
          className="back-btn"
          style={{position: "absolute", top: "80px", left: "65px"}}
        >
          <FiArrowLeft />
          <span className="back-text">Back</span>
        </button>
        <div>
          <h2 className="fw-bold text-dark mb-0 mt-5">🛍️ Your Shopping Cart</h2>
          <p className="text-muted mb-0">Review your items before checkout</p>
        </div>
      </motion.div>

      <main
        className="container d-flex flex-wrap justify-content-between gap-4 py-4"
        style={{ minHeight: "60vh" }}
      >
        {/* Left Section - Cart Items */}
        <div className="flex-grow-1" style={{ minWidth: "300px" }}>
          <AnimatePresence>
            {getProduct.length > 0 ? (
              getProduct.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="cart-item d-flex align-items-center justify-content-between p-3 mb-3 bg-white rounded-4 shadow-sm flex-wrap"
                >
                  <motion.img
                    src={item.product_image || logo}
                    alt={item.product_name}
                    className="rounded-3 mb-2 mb-md-0"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => navigate(`/products/${item.product_id}`)}
                  />

                  <div className="flex-grow-1 px-3">
                    <h5 className="fw-semibold text-dark mb-1">
                      {item.product_name}
                    </h5>
                    <div style={{ display: "flex" }}>
                      <p className="text-muted mb-2">₹{item.item_new_price}</p>
                      <span
                        className="old-price"
                        style={{
                          textDecoration: "line-through",
                          color: "#999",
                          fontSize: "18px",
                          marginLeft: "10px",
                        }}
                      >
                        ₹{item.item_old_price || 0}
                      </span>
                       <span className="discount-badge" style={{ 
        backgroundColor: '#F17228', 
        color: 'white', 
        padding: '4px 8px', 
        borderRadius: '12px', 
        fontSize: '14px', 
        marginLeft: '10px',
        fontWeight: 'bold'
      }}>
        {item.discount_percentage}% OFF
      </span>
                    </div>
                    <div className="d-flex align-items-center">
                      <button
                        onClick={() => subOne(item.id)}
                        className="btn btn-sm  me-2"
                        style={{
                          backgroundColor: "#F17228",
                          color: "white",
                          width: "30px",
                          height: "30px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        −
                      </button>
                      <span className="fw-bold fs-2">{item.quantity}</span>
                      <button
                        onClick={() => addOne(item.id)}
                        className="btn btn-sm ms-2"
                        style={{
                          backgroundColor: "#79B93C",
                          color: "white",
                          width: "30px",
                          height: "30px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeItemFromCart(item.id)}
                    className="btn btn-danger fw-semibold mt-2 mt-md-0"
                  >
                    Remove
                  </motion.button>
                </motion.div>
              ))
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-muted mt-5 fs-5"
              >
                🛒 Your cart is empty.
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Right Section - Summary */}
        {getProduct.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="summary-card bg-white shadow-sm p-4 rounded-4"
            style={{
              flex: "1 1 350px",
              height: "fit-content",
            }}
          >
            <h4 className="fw-bold mb-3 text-dark">💰 Price Details</h4>
            <div className="d-flex flex-column gap-2 text-secondary">
              <div className="d-flex justify-content-between">
                <span>Subtotal:</span>
                <strong>₹{previousPrice}</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span>Delivery:</span>
                <strong>₹{deliveryCharge}</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span>Discount:</span>
                <strong>₹{discountPrice}</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span>Wallet Discount:</span>
                <strong>₹{walletValue}</strong>
              </div>
              <hr />
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Total Payable:</h5>
                <h4 className="mb-0 text-success fw-bold">₹{totalPrice}</h4>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={checkoutNow}
              className="btn w-100 mt-4 fw-semibold text-white"
              style={{
                background: "linear-gradient(90deg, #F17228 0%, #f58b4c 100%)",
              }}
            >
              Proceed to Checkout →
            </motion.button>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default CartDetails;
