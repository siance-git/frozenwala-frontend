import React, { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Api from "../Utills/Api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaHeart } from "react-icons/fa";
import { FaUser } from "react-icons/fa";

import axios from "axios"
import {
  Navbar as BsNavbar,
  Nav,
  Container,
  Button,
  Form,
  FormControl,
  InputGroup,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useWishlist } from "../../contexts/WishlistContext";

function NavbarComponent({ refreshCart }) {
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartValue, setCartValue] = useState(0);
  const [name, setName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false); // ✅ fix toggle issue

  // 🧍 Get user profile
  useEffect(() => {
    const fetchProfile = async () => {
      const userId = localStorage.getItem("user_id");
      if (!userId) return setIsLoggedIn(false);

      try {
        const response = await Api.get(`api/profile/?user_id=${userId}`);
        setName(response.data.name);
        setIsLoggedIn(true);
      } catch (error) {
        console.log("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  // 🛒 Cart count
  const getCartNumber = async () => {
    const uid = localStorage.getItem("user_id");
    if (!uid) return;
    try {
      const response = await Api.get(`api/unique-product-count/?user_id=${uid}`);
      setCartValue(parseInt(response.data.unique_product_count));
    } catch (error) {
      console.error("Error fetching cart value:", error);
    }
  };

  useEffect(() => {
    getCartNumber();
  }, [refreshCart]);

  // 👤 Profile/Login
  const handleClick = () => {
    setExpanded(false);
    navigate(isLoggedIn ? "/profile" : "/login");
  };

  // 🛒 Cart
  const handleClickCart = () => {
    setExpanded(false);
    navigate(isLoggedIn ? "/cart" : "/login");
  };

  // 🔍 Handle Search
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.warning("Please enter a search term!");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `https://backend.frozenwala.com/api/product/search/?q=${searchQuery
        }&page=1&page_size=16`
      );
      console.log("search response: ", response.data)
      navigate("/search", {
        state: { results: response.data.results, query: searchQuery },
      });
      setExpanded(false);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("No Result Found!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BsNavbar
        expand="lg"
        bg="light"
        fixed="top"
        className="shadow-sm"
        expanded={expanded}
        onToggle={(isExpanded) => setExpanded(isExpanded)}
      // ✅ fixes toggle error
      >
        <Container>
          <BsNavbar.Brand
            onClick={() => {
              navigate("/");
              setExpanded(false);
            }}
            className="d-flex align-items-center cursor-pointer"
            style={{ cursor: "pointer",flexDirection:"column" }}
          >
            <img
              src="/img/gallery/Frozenwala1.png"
              alt="logo"
              style={{ height: "40px", width: "100px" }}
              className="d-inline-block"
            />
            <span style={{fontSize:"1rem",fontWeight:"600",fontFamily:"Playwrite US Trad Guides, cursive",color:"tomato"}}>Are You Hungry?</span>
          </BsNavbar.Brand>

          <BsNavbar.Toggle aria-controls="navbarSupportedContent" />
<BsNavbar.Collapse
  id="navbarSupportedContent"
  className="justify-content-between glass-nav"
>
  {/* 🔍 Animated Search Bar */}
  <Form
    className="d-flex mx-auto my-2 modern-search"
    onSubmit={handleSearchSubmit}
    style={{ maxWidth: "700px", width: "100%" }}
  >
    <InputGroup>
      <FormControl
        type="search"
        placeholder="Search for products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <Button
        variant="warning"
        type="submit"
        disabled={loading}
        className="search-btn"
      >
        {loading ? "Searching..." : "Search"}
      </Button>
    </InputGroup>
  </Form>

  {/* 👤 User + Cart + Wishlist */}
  <Nav className="d-flex align-items-center gap-2">
    
    {/* Profile Button */}
    <Button
      variant="white"
      className="border-0 d-flex align-items-center gap-2 position-relative profile-btn"
      onClick={handleClick}
      style={{
        padding: "6px 12px",
        borderRadius: "30px",
        background: "white",
        boxShadow: "0 0 8px rgba(0,0,0,0.1)"
      }}
    >
      <div
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          background: "#f4f4f4",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 0 5px rgba(0,0,0,0.1)"
        }}
        className="profile-icon"
      >
        <FaUser size={16} color="#333" />
      </div>

      <span
        style={{
          color: isLoggedIn ? "#0a0a0aff" : "#444",
          fontWeight: 600,
          fontSize: "0.9rem"
        }}
      >
        {isLoggedIn ? `Hi, ${name.split(" ")[0]}` : "Login"}
      </span>
    </Button>

    {/* Wishlist */}
    <Button
      variant="white"
      className="text-danger border-0 position-relative icon-btn"
      onClick={() => {
        setExpanded(false);
        navigate("/wishlist");
      }}
      style={{ padding: "3px" }}
    >
      <FaHeart fontSize="20px" />
      {wishlist && wishlist.length > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
        style={{ fontSize: "0.7rem" }}
      >
        {wishlist.length}
      </span>}
    </Button>

    {/* Cart */}
    <Button
      variant="white"
      className="text-warning border-0 position-relative icon-btn"
      onClick={handleClickCart}
      style={{ padding: "4px" }}
    >
      <FaShoppingCart fontSize="1.4rem" />
      {cartValue > 0 && <span
        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
        style={{ fontSize: "0.65rem", padding: "4px 6px" }}
      >
        {cartValue}
      </span>}
    </Button>
  </Nav>
</BsNavbar.Collapse>

        </Container>
      </BsNavbar>
      <ToastContainer />
    </>
  );
}

export default NavbarComponent;
