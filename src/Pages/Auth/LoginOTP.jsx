import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Spinner from "../../Spinner";

function LoginOTP() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  let location = useLocation();
  let { phone } = location.state;

  // Focus on first OTP input when component mounts
  useEffect(() => {
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value.slice(-1); // only last digit
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
      toast.error("Enter complete OTP!");
      return;
    }

    try {
      setLoading(true);
      const body = {
        otp_value: Number(otpValue),
        phone_number: Number(phone),
      };
      const response = await axios.post(
        "https://backend.frozenwala.com/login/",
        body
      );
      setLoading(false);
      localStorage.setItem("user_id", response.data.user_id);
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("referral_code", response.data.referral_code);
      localStorage.setItem("name", response.data.name);
      localStorage.setItem("wallet", response.data.wallet);
      toast.success("Login successfully!");
      navigate("/", { replace: true });
      window.location.reload();
    } catch (error) {
      setLoading(false);
      toast.error("Invalid OTP");
      console.error(error);
    }
  };

  const handleResend = () => {
    toast.info("OTP Resent!");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#FFB30E",
        padding: "20px",
      }}
    >
      {/* ✅ Navbar */}
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
              style={{ width: "100px", margin: "0px" }}
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

      {/* ✅ OTP Form */}
      <form
        onSubmit={handleSubmit}
        className="otp-form"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: "400px",
          padding: "25px 20px",
          borderRadius: "10px",
          boxShadow: "0px 5px 15px rgba(0,0,0,0.1)",
          backgroundColor: "#F9FAFD",
          marginTop: "100px",
        }}
      >
        <h3 className="text-center mb-3 text-dark">Enter One Time Password</h3>
        <p className="text-muted mb-3 text-center">
          OTP sent to <strong>{phone}</strong>
        </p>

        {/* 🔢 OTP Input Boxes */}
        <div
          className="otp-container"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "20px",
          }}
        >
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="otp-input"
              style={{
                width: "45px",
                height: "50px",
                fontSize: "22px",
                fontWeight: "bold",
                textAlign: "center",
                borderRadius: "8px",
                border: "2px solid #F17228",
                outline: "none",
                background: "#fff",
                color: "#F17228",
                transition: "0.3s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#ff9100")}
              onBlur={(e) => (e.target.style.borderColor = "#F17228")}
            />
          ))}
        </div>

        {/* ✅ Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: "#F17228",
            color: "white",
            padding: "10px 25px",
            border: "none",
            borderRadius: "8px",
            fontWeight: "600",
            fontSize: "16px",
            cursor: "pointer",
            width: "100%",
            height: "45px",
          }}
        >
          {loading ? <Spinner /> : "Submit"}
        </button>

        {/* ✅ Resend Section */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "15px",
            flexWrap: "wrap",
          }}
        >
          <span className="me-1">Didn’t receive OTP?</span>
          <button
            type="button"
            className="btn btn-link p-0"
            style={{ color: "#F17228", fontWeight: "600" }}
            onClick={handleResend}
          >
            Resend
          </button>
        </div>
      </form>

      <ToastContainer />

      {/* ✅ Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .otp-form {
            width: 90%;
            padding: 20px;
            margin-top: 80px;
          }
          .otp-container input {
            width: 40px !important;
            height: 45px !important;
            font-size: 18px !important;
          }
        }

        @media (max-width: 480px) {
          .otp-form {
            width: 100%;
            padding: 15px;
            border-radius: 8px;
          }
          .otp-container {
            gap: 8px;
          }
          .otp-container input {
            width: 38px !important;
            height: 42px !important;
            font-size: 16px !important;
          }
          h3 {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default LoginOTP;
