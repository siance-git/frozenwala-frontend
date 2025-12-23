import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Spinner from "../../Spinner";

function Login() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const phoneInputRef = useRef(null);

  // Focus on phone input when component mounts
  useEffect(() => {
    if (phoneInputRef.current) {
      phoneInputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!phone.trim()) {
      toast.error("Enter Phone Number");
      return;
    } else if (phone.trim().length !== 10 || !/^\d+$/.test(phone.trim())) {
      toast.error("Phone number must be 10 digits");
      return;
    }

    try {
      setLoading(true);
      const body = { phone_number: phone };

      const response = await axios.post(
        "https://backend.frozenwala.com/api/login-send_sms/",
        body
      );

      setLoading(false);

      if (response.data.status === "success") {
        toast.success("OTP sent successfully!");
        // alert("Please remember this OTP for login: " + response.data.otp);
        const nextNav = window.location.href.split("?")[window.location.href.split("?").length - 1];
        navigate(`/loginotp/${nextNav && nextNav.includes("next") ? "?next=" + nextNav.replaceAll("next=", "") : ""}`, { state: { phone } });
        setPhone("");
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.error || "Something went wrong");
    }
  };

  const handleSignup = () => navigate("/signup");

  return (
    <div className="login-page">
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
          {/* <Navbar.Collapse
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
          </Navbar.Collapse> */}
        </Container>
      </Navbar>

      {/* 🔢 Login FORM */}
      <form onSubmit={handleSubmit} className="login-form">
        <h3 className="text-center mb-3">Login</h3>
        <p className="text-muted mb-3 text-center">
          Enter your registered phone number
        </p>

        <input
          ref={phoneInputRef}
          type="tel"
          placeholder="Enter your 10-digit phone number"
          inputMode="numeric"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="form-control text-center mb-3"
          style={{
            height: "45px",
            borderRadius: "8px",
            border: "2px solid #F17228",
            fontSize: "16px",
          }}
        />

        <button
          type="submit"
          disabled={loading}
          className="verify-btn"
        >
          {loading ? <Spinner /> : "Submit"}
        </button>

        <div className="resend-section">
          <span>Don’t have an account?</span>
          <button
            type="button"
            className="btn btn-link p-0 ms-1"
            style={{ color: "#F17228", fontWeight: "600" }}
            onClick={handleSignup}
          >
            Signup
          </button>
        </div>
      </form>

      <ToastContainer />

      {/* ✅ Inline Responsive CSS */}
      <style>{`
        body {
          background-color: #FFB30E;
        }

        .login-page {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #FFB30E;
          padding: 20px;
        }

        .logo-img {
          width: 100px;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 90%;
          max-width: 400px;
          padding: 30px 25px;
          border-radius: 10px;
          box-shadow: 0px 5px 15px rgba(0,0,0,0.1);
          background-color: #F9FAFD;
          margin-top: 80px;
        }

        .verify-btn {
          background-color: #F17228;
          color: white;
          padding: 10px 25px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          width: 100%;
          height: 45px;
          transition: background 0.3s;
        }

        .verify-btn:hover {
          background-color: #ff9100;
        }

        .resend-section {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 15px;
          flex-wrap: wrap;
        }

        /* ✅ Responsive Adjustments */
        @media (max-width: 768px) {
          .login-form {
            padding: 20px;
          }
          .logo-img {
            width: 80px;
          }
        }

        @media (max-width: 480px) {
          .login-form {
            padding: 15px;
            border-radius: 8px;
          }
          .login-form h3 {
            font-size: 1.2rem;
          }
          .login-form input {
            height: 40px;
            font-size: 14px;
          }
          .verify-btn {
            font-size: 14px;
            height: 40px;
          }
          .logo-img {
            width: 70px;
          }
        }
      `}</style>
    </div>
  );
}

export default Login;
