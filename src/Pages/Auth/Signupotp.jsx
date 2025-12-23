import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Spinner from "../../Spinner"; // same structure as loginotp
import "./Signupotp.css"; // 👈 add this new CSS file

function Signupotp() {
  const location = useLocation();
  const navigate = useNavigate();
  const { name, phone } = location.state || {};
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef([]);

  // Focus on first OTP input when component mounts
  useEffect(() => {
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value.slice(-1);
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < otp.length - 1) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const otpValue = otp.join("");

    if (otpValue.length < 6) {
      toast.error("Please enter complete OTP!");
      return;
    }

    try {
      setLoading(true);
      const body = {
        otp_value: Number(otpValue),
        phone_number: Number(phone),
        name: name,
      };

      const response = await axios.post(
        "https://backend.frozenwala.com/register/",
        body
      );

      setLoading(false);
      console.log("after signup",response.data.data);

      if (response.data.status === "success") {
        localStorage.setItem("user_id", response.data.user_id);
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("referral_code", response.data.referral_code);
        localStorage.setItem("name", response.data.name);
        localStorage.setItem("wallet", response.data.wallet);
        toast.success("Signup successful!");
        navigate("/", { replace: true });
        window.location.reload();
      } else {
        toast.error("Invalid OTP, please try again!");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong. Try again!");
      console.error(error);
    }
  };

  const handleResend = () => {
    // toast.info("OTP resent successfully!");
    navigate("/signup", { state: { name, phone } });
  };

  return (
    <div className="signupotp-page">
      {/* 🔝 Navbar */}
      <Navbar expand="lg" bg="light" fixed="top" className="shadow-sm">
        <Container>
          <Navbar.Brand
            className="d-flex align-items-center"
            onClick={() => navigate("/")}
            style={{ height: "50px", cursor: "pointer" }}
          >
            <img
              src="/img/gallery/Frozenwala.png"
              alt="logo"
              className="logo-img"
            />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="navbarSupportedContent" />
          <Navbar.Collapse
            id="navbarSupportedContent"
            className="justify-content-end"
          >
            <Nav>
              <Button
                variant="outline-warning"
                className="fw-semibold text-dark"
                onClick={() => navigate("/about")}
              >
                <i className="fas fa-user me-2"></i> About Us
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* 🔢 OTP FORM */}
      <form className="otp-form" onSubmit={handleSubmit}>
        <h3 className="text-center mb-3">Verify Your Account</h3>
        <p className="text-muted mb-3">
          Enter the OTP sent to <strong>{phone}</strong>
        </p>

        <div className="otp-inputs">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="otp-box"
            />
          ))}
        </div>

        <button type="submit" disabled={loading} className="verify-btn">
          {loading ? <Spinner /> : "Verify & Signup"}
        </button>

        <div className="resend-section">
          <span>Didn’t receive OTP?</span>
          <button
            type="button"
            className="btn btn-link p-0 resend-link"
            onClick={handleResend}
          >
            Resend
          </button>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
}

export default Signupotp;
