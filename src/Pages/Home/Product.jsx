import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Api from "../Utills/Api";
import { useNavigate } from "react-router-dom";
import logo from "../../Frozenwala.png";
import axios from "axios";
import "./Product.css";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StyledPagination = styled(Pagination)(() => ({
  "& .MuiPaginationItem-root": {
    color: "#F17228",
    borderRadius: "50%",
    fontWeight: "600",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#ffece4",
      color: "#d64b16",
      transform: "scale(1.1)",
    },
  },
  "& .Mui-selected": {
    backgroundColor: "#F17228 !important",
    color: "#fff !important",
    boxShadow: "0 3px 6px rgba(0,0,0,0.2)",
    transform: "scale(1.15)",
  },
  "& .MuiPagination-ul": {
    gap: "8px",
  },
}));

function Product({ categoryId, refreshCart }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [stock, setStock] = useState({});
  const [categoryCounts, setCategoryCounts] = useState({});
  const uid = localStorage.getItem("user_id");
  const navigate = useNavigate();
  const pageSize = 20;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(products.length / pageSize);
  const currentData = products.slice((page - 1) * pageSize, page * pageSize);

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  // 🧡 Toggle Wishlist
  const toggleWishlist = (product) => {
    let updatedWishlist = [...wishlist];
    const exists = updatedWishlist.find((item) => item.id === product.id);

    if (exists) {
      updatedWishlist = updatedWishlist.filter((item) => item.id !== product.id);
      // toast.info(`${product.title} removed from wishlist`);
    } else {
      updatedWishlist.push(product);
      // toast.success(`${product.title} added to wishlist`);
    }

    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  useEffect(() => {
    getMenu();
    getStock();
    getCartItems();
  }, []);

  useEffect(() => {
    if (categoryId) getProducts(categoryId);
    else getAllProducts();
  }, [categoryId]);

  const getMenu = async () => {
    try {
      const response = await axios.get(
        `https://backend.frozenwala.com/api/auth/categories/`
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleClick = async (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId === "all") getAllProducts();
    else getProducts(categoryId);
  };

  const getProducts = async (categoryId) => {
    try {
      const response = await axios.get(
        `https://backend.frozenwala.com/api/auth/category/product-all/?category_id=${categoryId}`
      );
      setProducts(response.data);
      setCategoryCounts((prev) => ({
        ...prev,
        [categoryId]: response.data.length,
      }));
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const getAllProducts = async () => {
    try {
      const response = await axios.get(
        `https://backend.frozenwala.com/api/auth/product-all/`
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching all products:", error);
    }
  };

  const getCartItems = async () => {
    try {
      const response = await Api.get(`api/get_cart/?user_id=${uid}`);
      const map = {};
      response.data.forEach((item) => (map[item.product_id] = item.quantity));
      setCartItems(map);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const getStock = async () => {
    try {
      const response = await axios.get(`https://backend.frozenwala.com/api/stock/`);
      const map = {};
      response.data.forEach((item) => (map[item.item_id] = item.openingstock));
      setStock(map);
    } catch (error) {
      console.error("Error getting stock:", error);
    }
  };

  const onPressAddToCart = async (productId) => {
    const available = stock[productId];
    if (available === 0) {
      alert("No stock available");
      return;
    }
    if (uid) {
      try {
        await Api.post(`api/add_to_cart/`, { product_id: productId, u_id: uid });
        refreshCart();
        setCartItems((prev) => ({
          ...prev,
          [productId]: (prev[productId] || 0) + 1,
        }));
      } catch (error) {
        console.error("Error adding product:", error);
      }
    } else navigate("/login");
  };

  const addOne = async (productId) => {
    const available = stock[productId];
    const currentQty = cartItems[productId] || 0;
    if (available > currentQty) {
      await Api.post(`api/increase/main/`, { product_id: productId, user_id: uid });
      setCartItems((prev) => ({ ...prev, [productId]: currentQty + 1 }));
      refreshCart();
    } else {
      alert(`Only ${available} items available in stock.`);
    }
  };

  const subOne = async (productId) => {
    if (cartItems[productId] > 1) {
      await Api.post(`api/decrease/main/`, { product_id: productId, user_id: uid });
      setCartItems((prev) => ({
        ...prev,
        [productId]: prev[productId] - 1,
      }));
    }
  };

  return (
    <div className="min-vh-100 py-4 bg-light">
      <ToastContainer position="top-center" autoClose={1500} />

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-4"
      >
        <h2 className="fw-bold text-danger">Our Delicious Products</h2>
        <p className="text-muted">Explore categories and add your favorites!</p>
      </motion.div>

      {/* Category Buttons */}
      <motion.div
        className="container d-flex flex-wrap justify-content-center gap-2 mb-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        {["all", ...categories.map((c) => c.id)].map((id, index) => {
          const name =
            id === "all" ? "All Products" : categories.find((c) => c.id === id)?.name;
          const count = id === "all" ? products.length : categoryCounts[id];
          const isSelected = selectedCategory === id;

          return (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleClick(id)}
              className="btn"
              style={{
                backgroundColor: isSelected ? "#F17228" : "#fff",
                color: isSelected ? "#fff" : "#F17228",
                border: "2px solid #F17228",
                borderRadius: "50px",
                fontWeight: "600",
                padding: "8px 18px",
              }}
            >
              {name} {count ? `(${count})` : ""}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Products Grid */}
      <div className="container">
        <motion.div
          layout
          className="row gy-4 justify-content-center"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.05 },
            },
          }}
        >
          {currentData.map((product) => {
            const isSoldOut = stock[product.id] === 0;
            const isInWishlist = wishlist.some((item) => item.id === product.id);

            return (
              <motion.div
                key={product.id}
                className="col-6 col-sm-6 col-md-4 col-lg-3"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 100 }}
              >
                <motion.div className="card product-card shadow-sm border-0 rounded-4 h-100 position-relative" style={{cursor:"pointer"}} >
                  {isSoldOut && <div className="sold-out-badge">Sold Out</div>}

                  {/* ❤️ Wishlist Icon */}
                  <div
                    onClick={() => toggleWishlist(product)}
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      cursor: "pointer",
                    }}
                  >
                    {isInWishlist ? (
                      <FaHeart size={26} color="red" />
                    ) : (
                      <CiHeart size={26} color="#bbb" />
                    )}
                  </div>

                  <img
                    src={product.item_photo || logo}
                    alt={product.title}
                    className="img-fluid w-100 product-img"
                     onClick={()=>navigate(`products/${product.id}`)}
                  />
                  <div className="card-body text-center" >
                    <h6 className="fw-bold text-dark text-truncate">
                      {product.title}
                    </h6>
                      <div style={{ display: "flex"  ,  alignItems: "center",
    justifyContent: "center"}}>
                    <p className="fw-semibold text-danger mb-2">
                      ₹{product.item_new_price}
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
                        ₹{product.item_old_price || 0}
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
        {product.discount_percentage}% OFF
      </span>
      </div>
                    {cartItems[product.id] && !isSoldOut ? (
                      <div className="d-flex justify-content-center align-items-center gap-2">
                        <button className="qty-btn" onClick={() => subOne(product.id)}>
                          -
                        </button>
                        <span className="fw-bold">{cartItems[product.id]}</span>
                        <button className="qty-btn" onClick={() => addOne(product.id)}>
                          +
                        </button>
                      </div>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="btn btn-danger btn-sm rounded-pill mt-2 px-3"
                        onClick={() => onPressAddToCart(product.id)}
                        disabled={isSoldOut}
                      >
                        Add to Cart
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Pagination */}
        <Stack direction="row" justifyContent="center" alignItems="center" sx={{ mt: 4 }}>
          <StyledPagination
            count={totalPages}
            page={page}
            onChange={(event, value) => setPage(value)}
            shape="rounded"
            color="primary"
          />
        </Stack>
      </div>
    </div>
  );
}

export default Product;
