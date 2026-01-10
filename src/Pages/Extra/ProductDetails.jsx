import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProductDetails.css";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import Navber from "../Home/Navbar.jsx";
import Footer from "../Home/Footer.jsx";
import Api from "../Utills/Api";
import { toast } from "react-toastify";
import axios from "axios";
import { FiArrowLeft } from "react-icons/fi";
import logo from "../../Frozenwala.png";

const ProductDetails = ({ refreshCart }) => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState({});
  const [stock, setStock] = useState({});
  
  const [itemMedia, setItemMedia] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  const uid = localStorage.getItem("user_id");
  const pageSize = 5; 

  useEffect(() => {
    const pendingReview = localStorage.getItem("pending_review");
    if (pendingReview) {
      const { id: pendingId, rating: pendingRating, comment: pendingComment } = JSON.parse(pendingReview);
      if (pendingId === id) {
        setRating(pendingRating);
        setComment(pendingComment);
        setTimeout(() => {
          localStorage.removeItem("pending_review");
        }, 1000);
      }
    }
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://backend.frozenwala.com/api/product-detail/?product_id=${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
        const data = await response.json();
        setProduct(data.product);

        const itemMediaFiles = [{"media_path": data.product.item_photo, "media_type": "image"}, ...data.product.image_gallery];
        setItemMedia(itemMediaFiles);
        setCurrentImageIndex(0);

        getCartItems();
        getStock();

        fetchReviews(1);
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchReviews = async (page = 1) => {
    if (!id) return;
    
    setLoadingReviews(true);
    try {
      const response = await Api.get(`api/review-list/${id}/?page=${page}&page_size=${pageSize}`);
      
      if (response.data) {
        setReviews(response.data.reviews || []);
        setCurrentPage(response.data.current_page || 1);
        setTotalPages(response.data.total_pages || 1);
        setTotalReviews(response.data.total_reviews || 0);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      // toast.error("Failed to load reviews");
    } finally {
      setLoadingReviews(false);
    }
  };

  const getCartItems = async () => {
    if (!uid) return;
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
    if (!product) return;
    
    const available = stock[productId] || product.stock || 0;
    if (available === 0) {
      toast.error("No stock available");
      return;
    }
    
    if (uid) {
      try {
        await Api.post(`api/add_to_cart/`, { 
          product_id: productId, 
          u_id: uid 
        });

        setCartItems(prev => ({
          ...prev,
          [productId]: (prev[productId] || 0) + 1
        }));

        if (refreshCart) refreshCart();
        
        toast.success("Added to cart successfully!");
      } catch (error) {
        console.error("Error adding product to cart:", error);
        toast.error("Failed to add to cart");
      }
    } else {
      navigate("/login");
    }
  };

  const addOne = async (productId) => {
    if (!uid) {
      navigate("/login");
      return;
    }
    
    const available = stock[productId] || product?.stock || 0;
    const currentQty = cartItems[productId] || 0;
    
    if (available > currentQty) {
      try {
        await Api.post(`api/increase/main/`, { 
          product_id: productId, 
          user_id: uid 
        });
        
        setCartItems(prev => ({ 
          ...prev, 
          [productId]: currentQty + 1 
        }));
        
        if (refreshCart) refreshCart();
        toast.success("Quantity increased");
      } catch (error) {
        console.error("Error increasing quantity:", error);
        toast.error("Failed to increase quantity");
      }
    } else {
      toast.error(`Only ${available} items available in stock.`);
    }
  };

  const subOne = async (productId) => {
    if (!uid) return;
    
    if (cartItems[productId] > 1) {
      try {
        await Api.post(`api/decrease/main/`, { 
          product_id: productId, 
          user_id: uid 
        });
        
        setCartItems(prev => ({
          ...prev,
          [productId]: prev[productId] - 1,
        }));
        
        if (refreshCart) refreshCart();
        toast.info("Quantity decreased");
      } catch (error) {
        console.error("Error decreasing quantity:", error);
        toast.error("Failed to decrease quantity");
      }
    } else {
      try {
        await Api.post(`api/remove_from_cart/`, {
          product_id: productId,
          user_id: uid
        });
        
        const updatedCartItems = { ...cartItems };
        delete updatedCartItems[productId];
        setCartItems(updatedCartItems);
        
        if (refreshCart) refreshCart();
        toast.info("Item removed from cart");
      } catch (error) {
        console.error("Error removing from cart:", error);
        toast.error("Failed to remove from cart");
      }
    }
  };

  const handleSubmitReview = async () => {
    if (!uid) {
      if (rating > 0 || comment.trim() !== ""){
        localStorage.setItem("pending_review", JSON.stringify({ id, rating, comment }));
      }
      toast.error("Please login to submit a review");
      navigate("/login/?next=" + window.location.pathname);
      return;
    }
    
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    
    if (comment.trim() === "") {
      toast.error("Please write a review");
      return;
    }
    
    setSubmittingReview(true);
    try {
      const response = await Api.post(`api/review/${id}/`, {
        rating: rating,
        review_text: comment.trim()
      });
      
      if (response.data) {
        toast.success("Review submitted successfully!");
        setComment("");
        setRating(0);

        const productResponse = await fetch(
          `https://backend.frozenwala.com/api/product-detail/?product_id=${id}`
        );
        if (productResponse.ok) {
          const productData = await productResponse.json();
          setProduct(productData.product);
        }
        
        // Refresh reviews
        fetchReviews(1);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchReviews(newPage);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <>
        <Navber />
        <div className="product-container">
          <div className="loading">Loading product details...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navber />
        <div className="product-container">
          <div className="error">Error: {error}</div>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navber />
        <div className="product-container">
          <div className="error">Product not found.</div>
        </div>
        <Footer />
      </>
    );
  }

  const isInCart = cartItems[product.id] > 0;
  const availableStock = stock[product.id] || product.stock || 0;

  const ratingValue = typeof product.rating === 'object' 
    ? (product.rating?.average || 0) 
    : (product.rating || 0);
  
  const productTotalReviews = typeof product.rating === 'object'
    ? (product.rating?.total_reviews || 0)
    : 0;

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
          style={{
            padding: '8px 12px',
            margin: '0 4px',
            border: `1px solid ${currentPage === i ? '#F17228' : '#ddd'}`,
            backgroundColor: currentPage === i ? '#F17228' : 'white',
            color: currentPage === i ? 'white' : '#333',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {i}
        </button>
      );
    }
    
    return (
      <div className="pagination" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            padding: '8px 12px',
            margin: '0 4px',
            border: '1px solid #ddd',
            backgroundColor: currentPage === 1 ? '#f5f5f5' : 'white',
            color: currentPage === 1 ? '#999' : '#333',
            borderRadius: '4px',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
          }}
        >
          Previous
        </button>
        
        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              style={{
                padding: '8px 12px',
                margin: '0 4px',
                border: '1px solid #ddd',
                backgroundColor: 'white',
                color: '#333',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              1
            </button>
            {startPage > 2 && <span style={{ margin: '0 4px' }}>...</span>}
          </>
        )}
        
        {pages}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span style={{ margin: '0 4px' }}>...</span>}
            <button
              onClick={() => handlePageChange(totalPages)}
              style={{
                padding: '8px 12px',
                margin: '0 4px',
                border: '1px solid #ddd',
                backgroundColor: 'white',
                color: '#333',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {totalPages}
            </button>
          </>
        )}
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            padding: '8px 12px',
            margin: '0 4px',
            border: '1px solid #ddd',
            backgroundColor: currentPage === totalPages ? '#f5f5f5' : 'white',
            color: currentPage === totalPages ? '#999' : '#333',
            borderRadius: '4px',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
          }}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <>
      <Navber />
      <div className="product-container">
        <button
          onClick={() => navigate(-1)}
          className="back-btn"
        >
          <FiArrowLeft />
          <span className="back-text">Back</span>
        </button>
        <div className="product-gallery" style={{ display: "flex", flexDirection: "column", gap: "30px", alignItems: "center" }}>
          <div className="main-image-container" style={{ position: "relative" }}>
            {itemMedia[currentImageIndex]?.media_type === 'video' ? (
              <video
                src={itemMedia[currentImageIndex]?.media_path}
                controls
                style={{ width: "400px", height: "400px", objectFit: "contain", borderRadius: "8px" }}
              />
            ) : (
              <img
                src={itemMedia[currentImageIndex]?.media_path || product.item_photo || logo}
                alt={product.title}
                className="main-product-image"
                style={{ width: "400px", height: "400px", objectFit: "contain", borderRadius: "8px" }}
                onError={(e) => { e.target.src = "/static/media/Frozenwala.png"; }}
              />
            )}
            {itemMedia.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev - 1 + itemMedia.length) % itemMedia.length)}
                  style={{
                    position: "absolute",
                    left: "-50px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    cursor: "pointer",
                    fontSize: "20px"
                  }}
                >
                  ‹
                </button>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev + 1) % itemMedia.length)}
                  style={{
                    position: "absolute",
                    right: "-50px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    cursor: "pointer",
                    fontSize: "20px"
                  }}
                >
                  ›
                </button>
              </>
            )}
          {itemMedia.length > 1 && (
            <div className="thumbnails" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '400px' }}>
              {itemMedia.map((media, index) => (
                media.media_type === 'video' ? (
                  <video
                    key={index}
                    src={media.media_path}
                    style={{
                      width: '70px',
                      height: '70px',
                      objectFit: 'cover',
                      cursor: 'pointer',
                      border: index === currentImageIndex ? '3px solid #F17228' : '3px solid transparent',
                      borderRadius: '6px'
                    }}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ) : (
                  <img
                    key={index}
                    src={media.media_path || logo}
                    alt={`Thumbnail ${index + 1}`}
                    style={{
                      width: '70px',
                      height: '70px',
                      objectFit: 'cover',
                      cursor: 'pointer',
                      border: index === currentImageIndex ? '3px solid #F17228' : '3px solid transparent',
                      borderRadius: '6px'
                    }}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                )
              ))}
            </div>
          )}
          </div>
        </div>

        <motion.div
          className="product-info"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 60 }}
        >
          <h2 className="product-title">{product.title}</h2>

          <div className="rating">
            {Array(5)
              .fill()
              .map((_, i) => (
                <FaStar
                  key={i}
                  color={i < Math.round(ratingValue) ? "#FFD700" : "#ddd"}
                />
              ))}
            <span>
              ({ratingValue.toFixed(1)}) 
              {productTotalReviews > 0 && ` • ${productTotalReviews} review${productTotalReviews !== 1 ? 's' : ''}`}
            </span>
          </div>

          <h3 className="price">
  ₹{product.item_new_price}{" "}
  {product.item_old_price && product.item_old_price > product.item_new_price && (
    <>
      <span className="old-price" style={{ textDecoration: 'line-through', color: '#999', fontSize: '18px', marginLeft: '10px' }}>
        ₹{product.item_old_price}
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
    </>
  )}
</h3>

          <p className="description">{product.description || "No description available."}</p>

          <p className="stock">Stock: {availableStock}</p>
          <p className="brand">Brand: {product.brand_name}</p>

          {availableStock === 0 ? (
            <button className="buy-btn" disabled style={{ opacity: 0.6 }}>
              Out of Stock
            </button>
          ) : isInCart ? (
            <div className="cart-controls">
              <div className="d-flex justify-content-center align-items-center gap-3">
                <button 
                  className="qty-btn" 
                  onClick={() => subOne(product.id)}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: '2px solid #F17228',
                    backgroundColor: 'white',
                    color: '#F17228',
                    fontSize: '20px',
                    cursor: 'pointer'
                  }}
                >
                  -
                </button>
                <span className="fw-bold" style={{ fontSize: '18px', minWidth: '30px', textAlign: 'center' }}>
                  {cartItems[product.id]}
                </span>
                <button 
                  className="qty-btn" 
                  onClick={() => addOne(product.id)}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: '2px solid #F17228',
                    backgroundColor: 'white',
                    color: '#F17228',
                    fontSize: '20px',
                    cursor: 'pointer'
                  }}
                >
                  +
                </button>
              </div>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="buy-btn"
              onClick={() => onPressAddToCart(product.id)}
            >
              🛒 Add to Cart
            </motion.button>
          )}

          <div className="review-section" style={{ marginTop: '40px' }}>
            <h4>Customer Reviews ({totalReviews})</h4>

            <div className="add-review" style={{ marginBottom: '30px', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
              <h5>Write a Review</h5>
              <div className="rating-input" style={{ marginBottom: '15px' }}>
                <p style={{ marginBottom: '10px' }}>Your Rating:</p>
                <div style={{ display: 'flex', gap: '5px' }}>
                  {[...Array(5)].map((star, index) => {
                    const currentRating = index + 1;
                    return (
                      <label key={index}>
                        <input
                          type="radio"
                          name="rating"
                          value={currentRating}
                          onClick={() => setRating(currentRating)}
                          style={{ display: 'none' }}
                        />
                        <FaStar
                          size={30}
                          color={currentRating <= (hover || rating) ? "#FFD700" : "#ddd"}
                          onMouseEnter={() => setHover(currentRating)}
                          onMouseLeave={() => setHover(0)}
                          style={{ cursor: 'pointer' }}
                        />
                      </label>
                    );
                  })}
                </div>
              </div>
              <div className="review-textarea" style={{ marginBottom: '15px' }}>
                <textarea
                  placeholder="Share your experience with this product..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>
              <button 
                onClick={handleSubmitReview}
                disabled={submittingReview}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#F17228',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: submittingReview ? 'not-allowed' : 'pointer',
                  opacity: submittingReview ? 0.7 : 1
                }}
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>

            <div className="reviews-list">
              {loadingReviews ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  Loading reviews...
                </div>
              ) : reviews.length > 0 ? (
                <>
                  {reviews.map((review, i) => (
                    <motion.div
                      key={review.id || i}
                      className="review"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      style={{
                        padding: '15px',
                        borderBottom: '1px solid #eee',
                        marginBottom: '15px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <strong style={{ fontSize: '16px' }}>{review.user_name}</strong>
                        <span style={{ color: '#666', fontSize: '14px' }}>{formatDate(review.created_at)}</span>
                      </div>
                      <div className="stars" style={{ display: 'flex', gap: '3px', marginBottom: '10px' }}>
                        {Array(5)
                          .fill()
                          .map((_, j) => (
                            <FaStar key={j} size={16} color={j < review.rating ? "#FFD700" : "#ddd"} />
                          ))}
                        <span style={{ marginLeft: '8px', color: '#666' }}>{review.rating.toFixed(1)}</span>
                      </div>
                      <p style={{ margin: 0, lineHeight: '1.5' }}>{review.review_text}</p>
                    </motion.div>
                  ))}
                  
                  {/* Pagination */}
                  {totalPages > 1 && renderPagination()}
                  
                  <div style={{ textAlign: 'center', marginTop: '10px', color: '#666', fontSize: '14px' }}>
                    Showing {reviews.length} of {totalReviews} reviews
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                  No reviews yet. Be the first to review this product!
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetails;