import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
import OrderHistory from "./Pages/Profile/OrderHistory.js";
import Career from "./Pages/Footer.js/Career.jsx";
import Blog from "./Pages/Footer.js/Blog.jsx";
import SearchResults from "./Pages/Home/SearchResults.jsx";
import WishlistPage from "./Pages/Home/WishlistPage.jsx";
import ProductDetails from "./Pages/Extra/ProductDetails.jsx";
import { Demo } from "./Pages/Demo.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
         {/* <Route path="/demo" element={<Demo />} /> */}
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/loginotp" element={<LoginOTP />} />
        <Route path="/signupotp" element={<Signupotp />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/products" element={<Product />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<CartDetails />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orderdone" element={<OrderDone />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/orderdetails/:orderId" element={<OrderDetails />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/refund" element={<Refund />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/career" element={<Career />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/wishlist" element={<WishlistPage />} />

      </Routes>
    </Router>
  );
}
export default App;
