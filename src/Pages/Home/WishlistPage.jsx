import React, { useEffect, useState } from "react";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import logo from "../../Frozenwala.png";
import Navber from "./Navbar"
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(saved);
  }, []);
   const navigate = useNavigate();

  const removeFromWishlist = (id) => {
   
    const updated = wishlist.filter((item) => item.id !== id);
    localStorage.setItem("wishlist", JSON.stringify(updated));
    setWishlist(updated);
    window.dispatchEvent(new Event("wishlistUpdated"));
    toast.info("Item removed from wishlist");
  };

  // if (wishlist.length === 0)
  //   return (
      // <Container className="text-center my-5">
      //   <h4>Your wishlist is empty ❤️</h4>
      //   <Button
      //     variant="primary"
      //     className="mt-3"
      //     onClick={() => navigate("/")}
      //   >
      //     Go Shopping
      //   </Button>
      // </Container>
  //   );

  return (
    <>
    <Navber/>
        <Container className="pt-5" style={{marginTop: "55px"}}>
        
        
      <div style={{display: "flex", alignItems: "baseline", gap: "15px"}}>
        <button
          onClick={() => navigate(-1)}
          className="back-btn"
          style={{height: "35px", width: "35px"}}
        >
          <FiArrowLeft />
          <span className="back-text">Back</span>
        </button>
      <h3 className="mb-4">My Wishlist ❤️</h3>
      </div>
      <Row>
        {wishlist && wishlist.length > 0 ? wishlist.map((product) => (
          <Col md={3} sm={6} xs={12} key={product.id} className="mb-4">
            <Card className="h-100 shadow-sm border-0">
              <Card.Img
                variant="top"
                src={product.item_photo || logo}
                alt={product.title}
                style={{
                  height: "180px",
                  objectFit: "cover",
                  borderTopLeftRadius: "0.5rem",
                  borderTopRightRadius: "0.5rem",
                }}
              />

              <Card.Body className="d-flex flex-column justify-content-between">
                {/* ✅ Fixed height title area */}
                <div
                  style={{
                    minHeight: "48px",
                    maxHeight: "48px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontWeight: "600",
                    fontSize: "1rem",
                    color: "#333",
                  }}
                >
                  {product.title}
                </div>

                <Card.Text className="fw-semibold mt-2 ">
                  <span className="text-danger">₹{product.item_new_price}</span>
                  <span className="old-price" style={{ textDecoration: 'line-through', color: '#999', fontSize: '18px', marginLeft: '10px' }}>₹{product.item_old_price}</span>
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
                </Card.Text>

                <div className="d-flex justify-content-between align-items-center mt-auto p-0">
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() =>
                      navigate(`/products/${product.id}`)
                    }
                  >
                    Details
                  </Button>

                  <Button
                    variant="outline-danger"
                    size="sm"
                    style={{ color: "black" }}
                    onClick={() => removeFromWishlist(product.id)}
                  >
                    Remove
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        )) : (
          <Container className="text-center my-5">
        <h4>Your wishlist is empty ❤️</h4>
        <Button
          variant="primary"
          className="mt-3"
          onClick={() => navigate("/")}
        >
          Go Shopping
        </Button>
      </Container>
        )}
      </Row>
    </Container>
    <Footer/>
    </>

  );
};

export default WishlistPage;
