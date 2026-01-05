import "./App.css";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Home from "./Pages/Home";
import Login from "./Pages/Auth/Login";
import "./assets/css/theme.css";
import Signup from "./Pages/Auth/Signup";
import LoginOTP from "./Pages/Auth/LoginOTP";
import Signupotp from "./Pages/Auth/Signupotp";
import Product from "./Pages/Home/Product";
import Menu from "./Pages/Home/Menu";
import Profile from "./Pages/Extra/Profile";
import CartDetails from "./Pages/Cart/CartDetails";
import Checkout from "./Pages/Cart/Checkout";
import OrderDetails from "./Pages/Extra/OrderDetails";
import Terms from "./Pages/Footer.js/Terms";
import Privacy from "./Pages/Footer.js/Privacy";
import Refund from "./Pages/Footer.js/Refund";
import AboutUs from "./Pages/Footer.js/AboutUs";
import OrderDone from "./Pages/Profile/OrderDone.jsx";
import Career from "./Pages/Footer.js/Career.jsx";
import Blog from "./Pages/Footer.js/Blog.jsx";
import SearchResults from "./Pages/Home/SearchResults.jsx";
import WishlistPage from "./Pages/Home/WishlistPage.jsx";
import ProductDetails from "./Pages/Extra/ProductDetails.jsx";
import { WishlistProvider } from './contexts/WishlistContext';
import { useLocation } from "react-router-dom";

const AuthRedirect = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  return children;
};

const RequireAuth = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return children;
};

const RouteTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const prevPath = sessionStorage.getItem("currentPath");
    if (prevPath) {
      sessionStorage.setItem("previousPath", prevPath);
    }
    sessionStorage.setItem("currentPath", location.pathname);
  }, [location]);

  return null;
};

function App() {
  return (
    <WishlistProvider>
    <Router>
      <RouteTracker />
      <Routes>
        <Route path="/" element={<Home />} />
         {/* <Route path="/demo" element={<Demo />} /> */}
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<AuthRedirect><Login /></AuthRedirect>} />
        <Route path="/signup" element={<AuthRedirect><Signup /></AuthRedirect>} />
        <Route path="/loginotp" element={<AuthRedirect><LoginOTP /></AuthRedirect>} />
        <Route path="/signupotp" element={<AuthRedirect><Signupotp /></AuthRedirect>} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/products" element={<Product />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
        <Route path="/cart" element={<RequireAuth><CartDetails /></RequireAuth>} />
        <Route path="/checkout" element={<RequireAuth><Checkout /></RequireAuth>} />
        <Route path="/orderdone" element={<RequireAuth><OrderDone /></RequireAuth>} />
        <Route path="/profile/:id" element={<RequireAuth><Profile /></RequireAuth>} />
        <Route path="/orderdetails/:orderId" element={<RequireAuth><OrderDetails /></RequireAuth>} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/refund" element={<Refund />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/career" element={<Career />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/wishlist" element={<WishlistPage />} />

      </Routes>
    </Router>
    </WishlistProvider>
  );
}
export default App;
