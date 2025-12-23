import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation } from "react-router-dom";


function Signup() {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
const location = useLocation();
const queryParams = new URLSearchParams(location.search);
const referral_from_url = queryParams.get("referral_code");
const influencer_from_url = queryParams.get("influencer_code");

const [referralCode, setReferralCode] = useState(referral_from_url || "");
const[influencer_code,setInfluencer_code]=useState(influencer_from_url ||"")
console.log("Referral Code from URL:", referral_from_url);

  const nameInputRef = useRef(null);

  // Focus on name input when component mounts
  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim() || !phone.trim()) {
      toast.error("Please enter your Name and Phone Number!, im akash");
      return;
    } else if (phone.trim().length !== 10 || !/^\d+$/.test(phone.trim())) {
      toast.error("Phone number must be 10 digits!");
      return;
    }

    try {
      const body = {
        phone_number: Number(phone),
        name: name,
        referral_code:referralCode,
        influencer_code:influencer_code
      };
      console.log("Body:___",body)

      const response = await axios.post(
        "https://backend.frozenwala.com/api/send_sms/",
        body
      );
console.log(response.data)
      if (response.data.status === "success") {
        toast.success("OTP sent successfully!");
        // alert("Please remember this OTP for signup: " + response.data.otp);
        navigate("/signupotp", { state: { name, phone } });
        setPhone("");
        setName("");
      } else {
        toast.info("User already exists. Please login.");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Please try again later.");
    }
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

      {/* ✅ Signup Form */}
      <form
        onSubmit={handleSubmit}
        className="signup-form"
        style={{
          display: "flex",
          flexDirection: "column",
          
          width: "100%",
          maxWidth: "400px",
          padding: "25px 20px",
          borderRadius: "10px",
          boxShadow: "0px 5px 15px rgba(0,0,0,0.1)",
          backgroundColor: "#F9FAFD",
          marginTop: "100px",
        }}
      >
        <h3 className="text-center mb-3 text-dark">Create an Account</h3>
        <p className="text-muted mb-3 text-center">
          Please enter your details to continue
        </p>

        {/* 🧍‍♂️ Name Input */}
        <input
          ref={nameInputRef}
          type="text"
          placeholder="Enter your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-control mb-3"
          style={{
            height: "45px",
            borderRadius: "8px",
            border: "2px solid #F17228",
            fontSize: "16px",
            
          }}
        />

        {/* 📱 Phone Input */}
        <input
          type="tel"
          placeholder="Enter your 10-digit Phone Number"
          inputMode="numeric"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="form-control mb-3"
          style={{
            height: "45px",
            borderRadius: "8px",
            border: "2px solid #F17228",
            fontSize: "16px",
            
          }}
        />
        {/* 🎁 Referral Code Input */}
        {/* <input
          type="text"
          placeholder="Referral Code (Optional)"
          value={referralCode || influencer_code}
          onChange={(e) => setReferralCode(e.target.value)}
          className="form-control mb-3"
          style={{
            height: "45px",
            borderRadius: "8px",
            border: "2px solid #F17228",
            fontSize: "16px",
            
          }}
        /> */}


        {/* ✅ Submit Button */}
        <button
          type="submit"
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
          Submit
        </button>

        {/* ✅ Login Link */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "15px",
            flexWrap: "wrap",
          }}
        >
          <span>Already have an account?</span>
          <button
            type="button"
            className="btn btn-link p-0 ms-1"
            style={{ color: "#F17228", fontWeight: "600" }}
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </form>

      <ToastContainer />

      {/* ✅ Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .signup-form {
            width: 90%;
            padding: 20px;
            margin-top: 80px;
          }
        }

        @media (max-width: 480px) {
          .signup-form {
            width: 100%;
            padding: 15px;
            border-radius: 8px;
          }
          .signup-form input {
            height: 40px !important;
            font-size: 14px !important;
          }
          .signup-form button {
            font-size: 14px !important;
            height: 40px !important;
          }
          h3 {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Signup;
