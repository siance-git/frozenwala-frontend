import React, { useEffect } from "react";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Footer";
import AOS from "aos";
import "aos/dist/aos.css";

function Career() {
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

      {/* === HERO SECTION === */}
      <section className="py-6 bg-light text-center" style={{marginTop: "25px"}}>
        <div className="container" data-aos="fade-up">
          <h2 className="fw-bold text-uppercase mb-3" style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)" }}>
            Careers
          </h2>
          <p className="lead text-muted mb-2" style={{ fontSize: "clamp(1rem, 1.5vw, 1.2rem)" }}>
            Join the <strong>Frozenwala</strong> family!
          </p>
          <p className="text-secondary mx-auto" style={{ maxWidth: "750px", fontSize: "clamp(0.95rem, 1.3vw, 1.1rem)" }}>
            We are always looking for passionate individuals who want to grow in the dynamic frozen food industry.
            If you are creative, dedicated, and believe in quality, we’d love to have you onboard.
          </p>
        </div>
      </section>

      {/* === OPENINGS SECTION === */}
      <section className="py-5">
        <div className="container">
          <h3 className="fw-bold text-center mb-5" data-aos="fade-up" style={{ fontSize: "clamp(1.3rem, 2vw, 1.8rem)" }}>
            Current Openings
          </h3>

          <div className="row justify-content-center">
            {/* Job Card 1 */}
            <div className="col-md-5 mb-4" data-aos="fade-right">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body text-center">
                  <h5 className="fw-bold mb-2" style={{ fontSize: "clamp(1.1rem, 1.6vw, 1.3rem)" }}>
                    Sales Executive (All India)
                  </h5>
                  <p className="text-muted mb-4" style={{ fontSize: "clamp(0.9rem, 1.3vw, 1rem)" }}>
                    Seeking energetic individuals to expand our national sales
                    network and strengthen client relationships.
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      (window.location.href =
                        "mailto:megasfrozengoods@gmail.com?subject=Application for Sales Executive")
                    }
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>

            {/* Job Card 2 */}
            <div className="col-md-5 mb-4" data-aos="fade-left">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body text-center">
                  <h5 className="fw-bold mb-2" style={{ fontSize: "clamp(1.1rem, 1.6vw, 1.3rem)" }}>
                    Digital Marketing Executive
                  </h5>
                  <p className="text-muted mb-4" style={{ fontSize: "clamp(0.9rem, 1.3vw, 1rem)" }}>
                    Join our marketing team to enhance brand visibility,
                    run campaigns, and engage audiences online.
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      (window.location.href =
                        "mailto:megasfrozengoods@gmail.com?subject=Application for Digital Marketing Executive")
                    }
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="text-center mt-5" data-aos="zoom-in">
            <h5 className="fw-bold mb-2" style={{ fontSize: "18px" }}>
              📩 Send your resume to:
            </h5>
            <a
              href="mailto:megasfrozengoods@gmail.com"
              className="fs-1 text-decoration-none"
              style={{ color: "#007bff", fontSize: "18px" }}
            >
              megasfrozengoods@gmail.com
            </a>
          </div>
        </div>
      </section>

      {/* === CALL TO ACTION === */}
      <section className="py-5 bg-primary text-white text-center">
        <div className="container" data-aos="fade-up">
          <h3 className="fw-bold mb-3" style={{ fontSize: "clamp(1.3rem, 2vw, 1.8rem)" }}>
            Be part of something cool!
          </h3>
          <p
            className="mb-4"
            style={{ maxWidth: "700px", margin: "0 auto", fontSize: "clamp(0.95rem, 1.3vw, 1.1rem)" }}
          >
            Work with a brand that’s redefining frozen foods across India. Your
            journey starts here.
          </p>
          <a
            href="mailto:megasfrozengoods@gmail.com"
            className="btn btn-light fw-bold px-4 text-primary"
          >
            Join Now
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Career;
