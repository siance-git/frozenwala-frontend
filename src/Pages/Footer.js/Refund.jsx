import React, { useEffect } from "react";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Footer";
import AOS from "aos";
import "aos/dist/aos.css";

function Refund() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <Navbar />

      {/* === HEADER SECTION === */}
      <section className="bg-light text-center" style={{    paddingTop: "100px"}}>
        <div className="container" data-aos="fade-up">
          <h2
            className="fw-bold text-uppercase mb-3"
            style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)" }}
          >
            Refund & Cancellation Policy
          </h2>
          <p
            className="text-secondary mx-auto"
            style={{
              maxWidth: "800px",
              fontSize: "clamp(0.95rem, 1.3vw, 1.1rem)",
            }}
          >
            Please read our refund and cancellation policy carefully before
            making a purchase on Frozenwala.
          </p>
        </div>
      </section>

      {/* === MAIN CONTENT SECTION === */}
      <section className="py-5">
        <div className="container" data-aos="fade-up">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4 p-md-5">
              <p
                className="text-muted"
                style={{ fontSize: "clamp(0.95rem, 1.3vw, 1.05rem)" }}
              >
                We take utmost care to ensure product quality and timely
                delivery. However, as our products are perishable frozen goods,
                <strong> returns and refunds are not applicable once
                delivered.</strong>
              </p>

              <h4
                className="fw-bold mt-4 mb-3 text-primary"
                style={{ fontSize: "clamp(1.1rem, 1.6vw, 1.3rem)" }}
              >
                Cancellation Policy
              </h4>
              <p
                className="text-muted"
                style={{ fontSize: "clamp(0.95rem, 1.3vw, 1.05rem)" }}
              >
                Cancellations are only accepted before dispatch of the product.
                Once an order has been dispatched, cancellation requests will
                not be entertained. Please ensure your order details are correct
                before confirming your purchase.
              </p>

              <h4
                className="fw-bold mt-4 mb-3 text-primary"
                style={{ fontSize: "clamp(1.1rem, 1.6vw, 1.3rem)" }}
              >
                Damaged or Incorrect Delivery
              </h4>
              <p
                className="text-muted"
                style={{ fontSize: "clamp(0.95rem, 1.3vw, 1.05rem)" }}
              >
                In case of damaged or incorrect delivery, please contact our
                support team within <strong>24 hours</strong> of receipt at{" "}
                <a
                  href="mailto:support@frozenwala.com"
                  className="text-primary text-decoration-none"
                >
                  support@frozenwala.com
                </a>{" "}
                and include clear photos of the issue. Our team will review the
                case and assist you promptly.
              </p>

              <h4
                className="fw-bold mt-4 mb-3 text-primary"
                style={{ fontSize: "clamp(1.1rem, 1.6vw, 1.3rem)" }}
              >
                Refund Process
              </h4>
              <p
                className="text-muted mb-0"
                style={{ fontSize: "clamp(0.95rem, 1.3vw, 1.05rem)" }}
              >
                Approved refunds will be processed within{" "}
                <strong>7 working days</strong> to the original mode of payment
                or adjusted in your next order, depending on the situation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* === CALL TO ACTION SECTION === */}
      <section className="py-5 bg-primary text-white text-center">
        <div className="container" data-aos="zoom-in">
          <h3
            className="fw-bold mb-3"
            style={{ fontSize: "clamp(1.3rem, 2vw, 1.8rem)" }}
          >
            Your Satisfaction, Our Commitment
          </h3>
          <p
            className="mb-4"
            style={{
              maxWidth: "700px",
              margin: "0 auto",
              fontSize: "clamp(0.95rem, 1.3vw, 1.1rem)",
            }}
          >
            At Frozenwala, we prioritize your trust and experience. For any
            concerns, please reach out to our support team — we’re here to help!
          </p>
          <a
            href="mailto:support@frozenwala.com"
            className="btn btn-light fw-bold px-4 text-primary"
          >
            Contact Support
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Refund;
