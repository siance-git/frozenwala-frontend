import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Pagination, Spinner } from "react-bootstrap";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Api from "../Utills/Api";
import logo from "../../Frozenwala.png";
import Navber from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import axios from "axios"

function SearchResults({ refreshCart }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { query = "" } = location.state || {};

  const uid = localStorage.getItem("user_id");
  const [results, setResults] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [stock, setStock] = useState({});
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(16);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch products with pagination
  const fetchSearchResults = async (pageNum = 1) => {
    if (!query) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `https://backend.frozenwala.com/api/product/search/?q=${query}&page=${pageNum}&page_size=${pageSize}`
      );
      setResults(response.data.results || []);
      setTotal(response.data.total || 0);
      setPage(pageNum);
    } catch (error) {
      console.error("Error fetching paginated results:", error);
      toast.error("Failed to load search results!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch stock info
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

  // ✅ Fetch existing cart items
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

  useEffect(() => {
    getStock();
    getCartItems();
    fetchSearchResults(1);
  }, [query]);

  // ✅ Add product to cart
  const onPressAddToCart = async (productId) => {
    const available = stock[productId];
    if (available === 0) {
      toast.warning("No stock available!");
      return;
    }

    if (uid) {
      try {
        await Api.post(`api/add_to_cart/`, { product_id: productId, u_id: uid });
        refRestCart();
        setCartItems((prev) => ({
          ...prev,
          [productId]: (prev[productId] || 0) + 1,
        }));
      } catch (error) {
        console.error("Error adding product:", error);
        toast.error("Failed to add item to cart!");
      }
    } else {
      navigate("/login");
    }
  };

  // ✅ Increase quantity
  const addOne = async (productId) => {
    const available = stock[productId];
    if (available === 0) {
      toast.warning("No stock available!");
      return;
    }

    const currentQty = cartItems[productId] || 0;
    if (available > currentQty) {
      await Api.post(`api/increase/main/`, { product_id: productId, user_id: uid });
      setCartItems((prev) => ({ ...prev, [productId]: currentQty + 1 }));
     refRestCart();
    } else {
      toast.info(`Only ${available} items available in stock.`);
    }
  };

  // ✅ Decrease quantity
  const subOne = async (productId) => {
    if (cartItems[productId] > 1) {
      await Api.post(`api/decrease/main/`, { product_id: productId, user_id: uid });
      setCartItems((prev) => ({
        ...prev,
        [productId]: prev[productId] - 1,
      }));
     refRestCart();
    }
  };

  // ✅ Pagination Controls
  const totalPages = Math.ceil(total / pageSize);
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    fetchSearchResults(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


const [refresh, setRefresh] = useState(false);
const refRestCart = () => setRefresh(prev => !prev);


  return (
    <>
      <Navber refreshCart={refresh} />
      <Container className="mt-5 pt-5" >
        <h4 className="mb-4 text-center">
          Search Results for <span className="text-warning">"{query}"</span>
        </h4>

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="warning" />
          </div>
        ) : results.length === 0 ? (
          <p className="text-center text-muted">No products found.</p>
        ) : (
          <>
            <Row>
              {results.map((item) => {
                const isSoldOut = stock[item.id] === 0;
                return (
                  <Col key={item.id} sm={6} md={4} lg={3} className="mb-4">
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      transition={{ type: "spring", stiffness: 120 }}
                      className="card shadow-sm border-0 rounded-4 h-100 position-relative"
                    >
                      {isSoldOut && (
                        <div
                          className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 text-white d-flex align-items-center justify-content-center fw-bold fs-5"
                          style={{ borderRadius: "0.5rem" }}
                        >
                          Sold Out
                        </div>
                      )}

                      <Card.Img
                        variant="top"
                        src={item.item_photo || logo}
                        onError={(e) => (e.target.src = logo)}
                        style={{ height: "200px", objectFit: "cover",cursor:"pointer" }}
                        onClick={()=>navigate(`/products/${item.id}`)}
                      />

                      <Card.Body className="d-flex flex-column text-center">
                        <Card.Title
                          className="fw-semibold text-truncate mb-1"
                          title={item.title}
                        >
                          {item.title}
                        </Card.Title>

                        <Card.Text className="mb-2">
                          <span className="text-success fw-bold">
                            ₹{item.item_new_price}
                          </span>{" "}
                          {item.item_old_price && (
                            <span className="text-muted text-decoration-line-through ms-1">
                              ₹{item.item_old_price}
                            </span>
                          )}
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
                        </Card.Text>

                        {/* ✅ Quantity buttons or Add to Cart */}
                        {cartItems[item.id] && !isSoldOut ? (
                          <div className="d-flex justify-content-center align-items-center gap-2 mt-auto">
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => subOne(item.id)}
                              style={{ color: "black" }}
                            >
                              −
                            </Button>
                            <span className="fw-bold">{cartItems[item.id]}</span>
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() => addOne(item.id)}
                              style={{ color: "black" }}
                            >
                              +
                            </Button>
                          </div>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            className="btn btn-warning btn-sm rounded-pill mt-auto fw-semibold"
                            onClick={() => onPressAddToCart(item.id)}
                            disabled={isSoldOut}
                          >
                            {isSoldOut ? "Out of Stock" : "Add to Cart"}
                          </motion.button>
                        )}
                      </Card.Body>
                    </motion.div>
                  </Col>
                );
              })}
            </Row>

            {/* ✅ Pagination Bar */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center my-4">
                <Pagination>
                  <Pagination.Prev
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                  />
                  {[...Array(totalPages)].slice(0, 5).map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <Pagination.Item
                        key={pageNum}
                        active={page === pageNum}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </Pagination.Item>
                    );
                  })}
                  {totalPages > 5 && <Pagination.Ellipsis disabled />}
                  <Pagination.Next
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                  />
                </Pagination>
              </div>
            )}
          </>
        )}

        <ToastContainer />
      </Container>
      <Footer />
    </>
  );
}

export default SearchResults;
