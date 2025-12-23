import React, { useEffect } from "react";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Footer";
import AOS from "aos";
import "aos/dist/aos.css";

function TermsAndConditions() {
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
            Terms & Conditions
          </h2>
          <p
            className="text-secondary mx-auto"
            style={{
              maxWidth: "800px",
              fontSize: "clamp(0.95rem, 1.3vw, 1.1rem)",
            }}
          >
            Please read these Terms & Conditions carefully before using our
            website or services.
          </p>
        </div>
      </section>

      {/* === MAIN CONTENT === */}
      <section className="py-5">
        <div className="container" data-aos="fade-up">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4 p-md-5">
              <p
                className="text-muted"
                style={{ fontSize: "clamp(0.95rem, 1.3vw, 1.05rem)" }}
              >
                By accessing or using{" "}
                <a
                  href="https://www.frozenwala.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary text-decoration-none fw-semibold"
                >
                  www.frozenwala.com
                </a>
                , you agree to comply with our terms of service. If you do not
                agree with any part of these terms, please refrain from using
                the website or placing an order.
              </p>

              <ul
                className="list-unstyled mt-4"
                style={{ fontSize: "clamp(0.95rem, 1.3vw, 1.05rem)" }}
              >
                <li className="mb-3">
                  🔹 All content, trademarks, and products are the property of{" "}
                  <strong>MegasFrozen Goods Pvt. Ltd.</strong>
                </li>

                <li className="mb-3">
                  🔹 Products, prices, and offers may change without prior
                  notice.
                </li>

                <li className="mb-3">
                  🔹 Users are requested to ensure accurate delivery details
                  during purchase. Frozenwala will not be responsible for
                  incorrect or incomplete addresses.
                </li>

                <li className="mb-3">
                  🔹 Frozenwala reserves the right to cancel or modify any order
                  in case of unforeseen circumstances such as product
                  unavailability, logistics issues, or policy violations.
                </li>

                <li className="mb-3">
                  🔹 By placing an order, users acknowledge that they have read,
                  understood, and agreed to all the above terms.
                </li>
              </ul>

              <p
                className="mt-4 fw-semibold"
                style={{ fontSize: "clamp(1rem, 1.4vw, 1.1rem)" }}
              >
                For any questions or concerns, please contact us at{" "}
                <a
                  href="mailto:megasfrozengoods@gmail.com"
                  className="text-primary text-decoration-none"
                >
                  megasfrozengoods@gmail.com
                </a>
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
            Your Trust, Our Responsibility
          </h3>
          <p
            className="mb-4"
            style={{
              maxWidth: "700px",
              margin: "0 auto",
              fontSize: "clamp(0.95rem, 1.3vw, 1.1rem)",
            }}
          >
            We are committed to maintaining transparency and trust with our
            valued customers. Thank you for choosing Frozenwala!
          </p>
          <a
            href="https://www.frozenwala.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-light fw-bold px-4 text-primary"
          >
            Back to Home
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default TermsAndConditions;
