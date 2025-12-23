import React, { useEffect } from "react";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Footer";
import AOS from "aos";
import "aos/dist/aos.css";

function Privacy() {
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
            Privacy Policy
          </h2>
          <p
            className="text-secondary mx-auto"
            style={{
              maxWidth: "800px",
              fontSize: "clamp(0.95rem, 1.3vw, 1.1rem)",
            }}
          >
            We value your trust and are committed to protecting your personal
            information.
          </p>
        </div>
      </section>

      {/* === MAIN CONTENT === */}
      <section className="py-5">
        <div className="container" data-aos="fade-up">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4 p-md-5">
              <p
                className="text-muted mb-4"
                style={{ fontSize: "clamp(0.95rem, 1.3vw, 1.05rem)" }}
              >
                Your privacy is important to us.{" "}
                <strong>MegasFrozen Goods Pvt. Ltd.</strong> collects only the
                necessary personal information required to process your orders
                and enhance your shopping experience.
              </p>

              <h4
                className="fw-bold text-primary mb-3"
                style={{ fontSize: "clamp(1.1rem, 1.6vw, 1.3rem)" }}
              >
                Data Usage & Protection
              </h4>
              <p
                className="text-muted mb-4"
                style={{ fontSize: "clamp(0.95rem, 1.3vw, 1.05rem)" }}
              >
                We never sell, rent, or share your data with third parties,
                except where required by law or when essential for fulfilling
                your order (such as with delivery partners or payment gateways).
              </p>

              <h4
                className="fw-bold text-primary mb-3"
                style={{ fontSize: "clamp(1.1rem, 1.6vw, 1.3rem)" }}
              >
                Secure Transactions
              </h4>
              <p
                className="text-muted mb-4"
                style={{ fontSize: "clamp(0.95rem, 1.3vw, 1.05rem)" }}
              >
                All online transactions made on{" "}
                <a
                  href="https://www.frozenwala.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary text-decoration-none"
                >
                  www.frozenwala.com
                </a>{" "}
                are processed through secure payment gateways and encryption
                methods to ensure your financial data remains safe and
                confidential.
              </p>

              <h4
                className="fw-bold text-primary mb-3"
                style={{ fontSize: "clamp(1.1rem, 1.6vw, 1.3rem)" }}
              >
                Your Rights
              </h4>
              <p
                className="text-muted mb-4"
                style={{ fontSize: "clamp(0.95rem, 1.3vw, 1.05rem)" }}
              >
                You may request information on how your data is used or ask for
                its correction or removal at any time. We maintain complete
                transparency regarding how your data is collected and handled.
              </p>

              <h4
                className="fw-bold text-primary mb-3"
                style={{ fontSize: "clamp(1.1rem, 1.6vw, 1.3rem)" }}
              >
                Contact for Privacy Concerns
              </h4>
              <p
                className="text-muted"
                style={{ fontSize: "clamp(0.95rem, 1.3vw, 1.05rem)" }}
              >
                For any questions or requests related to your data or privacy,
                please contact our team at:{" "}
                <a
                  href="mailto:megasfrozengoods@gmail.com"
                  className="text-primary text-decoration-none fw-semibold"
                >
                  megasfrozengoods@gmail.com
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* === CALL TO ACTION === */}
      <section className="py-5 bg-primary text-white text-center">
        <div className="container" data-aos="zoom-in">
          <h3
            className="fw-bold mb-3"
            style={{ fontSize: "clamp(1.3rem, 2vw, 1.8rem)" }}
          >
            Your Data, Our Responsibility
          </h3>
          <p
            className="mb-4"
            style={{
              maxWidth: "700px",
              margin: "0 auto",
              fontSize: "clamp(0.95rem, 1.3vw, 1.1rem)",
            }}
          >
            At Frozenwala, we are committed to keeping your information safe,
            private, and used only for the purpose of serving you better.
          </p>
          <a
            href="mailto:megasfrozengoods@gmail.com"
            className="btn btn-light fw-bold px-4 text-primary"
          >
            Contact Us
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Privacy;
