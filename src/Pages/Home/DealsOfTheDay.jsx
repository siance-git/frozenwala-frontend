import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Api from "../Utills/Api";
import { useNavigate } from "react-router-dom";
import logo from "../../Frozenwala.png";
import "./Popular.css";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function Popular({ refreshCart }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [getProduct, setGetProduct] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [stock, setStock] = useState({});
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  const itemsPerPage = 3;
  const uid = localStorage.getItem("user_id");
  const navigate = useNavigate();

  // ✅ Fetch all data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      const uid = localStorage.getItem("user_id");

      // Always fetch recommended products (public endpoint)
      const popularRes = await fetch(
        "https://backend.frozenwala.com/api/deal-of-the-day/"
      );
      const popularData = await popularRes.json();
      setGetProduct(popularData);
      console.log("popular items : ", popularData);

      // Only fetch cart and stock if user is logged in
      if (accessToken && uid) {
        try {
          const [cartRes, stockRes] = await Promise.all([
            Api.get(`api/get_cart/?user_id=${uid}`),
            axios.get(`https://backend.frozenwala.com/api/stock/`),
          ]);

          const cartMap = {};
          if (cartRes.data && Array.isArray(cartRes.data)) {
            cartRes.data.forEach(
              (item) => (cartMap[item.product_id] = item.quantity)
            );
            setCartItems(cartMap);
          }

          const stockMap = {};
          if (stockRes.data && Array.isArray(stockRes.data)) {
            stockRes.data.forEach(
              (item) => (stockMap[item.item_id] = item.openingstock)
            );
            setStock(stockMap);
          }
        } catch (authError) {
          console.log(
            "User not logged in or token expired, skipping cart/stock"
          );
        }
      }
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  // ✅ Auto slide carousel
  useEffect(() => {
    if (getProduct.length > 0) {
      const interval = setInterval(() => handleScroll("next"), 3500);
      return () => clearInterval(interval);
    }
  }, [getProduct]);

  const handleScroll = (direction) => {
    const totalSlides = Math.ceil(getProduct.length / itemsPerPage);
    setCurrentSlide((prev) =>
      direction === "next"
        ? (prev + 1) % totalSlides
        : (prev - 1 + totalSlides) % totalSlides
    );
  };

  const visibleItems = [];
  for (let i = 0; i < getProduct.length; i += itemsPerPage) {
    visibleItems.push(getProduct.slice(i, i + itemsPerPage));
  }

  // ✅ Add to cart logic
  const onPressAddToCart = async (productId) => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) return navigate("/login");

    try {
      await Api.post(`api/add_to_cart/`, { product_id: productId, u_id: uid });
      setCartItems((prev) => ({
        ...prev,
        [productId]: (prev[productId] || 0) + 1,
      }));
      refreshCart();
      //   toast.success("Added to cart!");
    } catch (err) {
      console.error("Add to cart failed:", err);
    }
  };

  // ✅ Increase/Decrease quantity
  const addOne = async (productId) => {
    const currentQty = cartItems[productId] || 0;
    const available = stock[productId];

    if (available > currentQty) {
      await Api.post(`api/increase/main/`, {
        product_id: productId,
        user_id: uid,
      });
      setCartItems((prev) => ({ ...prev, [productId]: currentQty + 1 }));
      refreshCart();
    } else {
      toast.warning(`Only ${available} items in stock`);
    }
  };

  const subOne = async (productId) => {
    await Api.post(`api/decrease/main/`, {
      product_id: productId,
      user_id: uid,
    });
    setCartItems((prev) => {
      const updated = { ...prev };
      if (updated[productId] > 1) updated[productId] -= 1;
      else delete updated[productId];
      return updated;
    });
    refreshCart();
  };

  // ✅ Toggle Wishlist
  // ✅ Toggle Wishlist (fixed logic)
  const toggleWishlist = (product) => {
    let updatedWishlist = [...wishlist];
    const exists = updatedWishlist.find((item) => item.id === product.id);

    if (exists) {
      // remove
      updatedWishlist = updatedWishlist.filter(
        (item) => item.id !== product.id
      );
      // toast.info(`${product.title} removed from wishlist`);
    } else {
      // add
      updatedWishlist.push(product);
      // toast.success(`${product.title} added to wishlist`);
    }

    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

    // Notify other components (like Navbar or WishlistPage)
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  return (
    <section className="popular-section py-4 overflow-hidden">
      <div className="container text-center">
        <motion.h5
          className="fw-bold fs-3 lh-sm mb-4 text-gradient"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Deals of the Day
        </motion.h5>

        <div className="position-relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              className="row gx-3 justify-content-center"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.6 }}
            >
              {visibleItems[currentSlide]?.map((item) => {
                const isSoldOut = stock[item.id] === 0;
                const isInWishlist = wishlist.some((w) => w.id === item.id);

                return (
                  <motion.div
                    key={item.id}
                    className="col-10 col-sm-6 col-md-4 mb-3"
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 150 }}
                  >
                    <div className="card card-span border-0 shadow-sm h-70 p-2 rounded-4 position-relative small-card">
                      {/* Sold out badge */}
                      {isSoldOut && (
                        <div className="sold-out-badge">Sold Out</div>
                      )}

                      {/* ❤️ Wishlist Icon */}
                      <div
                        onClick={() => toggleWishlist(item)}
                        style={{
                          position: "absolute",
                          top: "15px",
                          right: "15px",
                          cursor: "pointer",
                        }}
                      >
                        {isInWishlist ? (
                          <FaHeart size={26} color="red" />
                        ) : (
                          <CiHeart size={26} color="#bbb" />
                        )}
                      </div>

                      <motion.img
                        src={item.item_photo || logo}
                        alt={item.title}
                        className="img-fluid rounded-4 w-100 popular-img"
                        style={{ cursor: "pointer" }}
                        // whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.4 }}
                        onClick={() => navigate(`products/${item.id}`)}
                      />

                      <div className="card-body text-center mt-2">
                        {/* ✅ Fixed title height for consistency */}
                        <h6
                          className="fw-bold text-truncate"
                          style={{ minHeight: "40px" }}
                        >
                          {item.title}
                        </h6>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <p className="fw-bold text-danger mb-2">
                            ₹{item.item_new_price}
                          </p>

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
                          <span
                            className="discount-badge"
                            style={{
                              backgroundColor: "#F17228",
                              color: "white",
                              padding: "4px 8px",
                              borderRadius: "12px",
                              fontSize: "14px",
                              marginLeft: "10px",
                              fontWeight: "bold",
                            }}
                          >
                            {item.discount_percentage}% OFF
                          </span>
                        </div>
                        {cartItems[item.id] && !isSoldOut ? (
                          <div className="d-flex justify-content-center align-items-center gap-2">
                            <button
                              className="qty-btn"
                              onClick={() => subOne(item.id)}
                            >
                              -
                            </button>
                            <span className="fw-bold">
                              {cartItems[item.id]}
                            </span>
                            <button
                              className="qty-btn"
                              onClick={() => addOne(item.id)}
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            className="btn btn-danger btn-sm rounded-pill mt-2 px-3"
                            onClick={() => onPressAddToCart(item.id)}
                            disabled={isSoldOut}
                          >
                            Add to Cart
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export default Popular;
