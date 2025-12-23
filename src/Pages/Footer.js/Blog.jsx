import React, { useEffect } from "react";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Footer";
import AOS from "aos";
import "aos/dist/aos.css";

function Blog() {
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
          <h2
            className="fw-bold text-uppercase mb-3"
            style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)" }}
          >
            Blog
          </h2>
          <p
            className="lead text-muted mb-2"
            style={{ fontSize: "clamp(1rem, 1.5vw, 1.2rem)" }}
          >
            Stay updated with the latest trends, recipes, and insights from the
            world of frozen foods.
          </p>
          <p
            className="text-secondary mx-auto"
            style={{
              maxWidth: "750px",
              fontSize: "clamp(0.95rem, 1.3vw, 1.1rem)",
            }}
          >
            Explore our blog for expert tips, inspiring stories, and the best
            ways to enjoy <strong>Frozenwala</strong> products every day.
          </p>
        </div>
      </section>

      {/* === BLOG CATEGORIES SECTION === */}
      <section className="py-5">
        <div className="container">
          <div className="row text-center justify-content-center">
            {/* Card 1 */}
            <div className="col-md-5 col-lg-3 mb-4" data-aos="fade-up">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h5
                    className="fw-bold mb-2 text-primary"
                    style={{ fontSize: "clamp(1.1rem, 1.6vw, 1.3rem)" }}
                  >
                    🍳 Easy Cooking Tips
                  </h5>
                  <p
                    className="text-muted"
                    style={{ fontSize: "clamp(0.9rem, 1.3vw, 1rem)" }}
                  >
                    Discover quick and tasty recipes using Frozenwala snacks,
                    parathas, kebabs, and more.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="col-md-5 col-lg-3 mb-4" data-aos="fade-up" data-aos-delay="100">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h5
                    className="fw-bold mb-2 text-primary"
                    style={{ fontSize: "clamp(1.1rem, 1.6vw, 1.3rem)" }}
                  >
                    🏭 Behind-the-Scenes
                  </h5>
                  <p
                    className="text-muted"
                    style={{ fontSize: "clamp(0.9rem, 1.3vw, 1rem)" }}
                  >
                    Get a glimpse of our production process, innovation, and
                    dedication to quality at Frozenwala.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="col-md-5 col-lg-3 mb-4" data-aos="fade-up" data-aos-delay="200">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h5
                    className="fw-bold mb-2 text-primary"
                    style={{ fontSize: "clamp(1.1rem, 1.6vw, 1.3rem)" }}
                  >
                    🥗 Nutrition & Storage
                  </h5>
                  <p
                    className="text-muted"
                    style={{ fontSize: "clamp(0.9rem, 1.3vw, 1rem)" }}
                  >
                    Learn about nutritional benefits and smart storage practices
                    for frozen food lovers.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="col-md-5 col-lg-3 mb-4" data-aos="fade-up" data-aos-delay="300">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h5
                    className="fw-bold mb-2 text-primary"
                    style={{ fontSize: "clamp(1.1rem, 1.6vw, 1.3rem)" }}
                  >
                    📰 News & Events
                  </h5>
                  <p
                    className="text-muted"
                    style={{ fontSize: "clamp(0.9rem, 1.3vw, 1rem)" }}
                  >
                    Stay informed about Frozenwala’s latest product launches,
                    promotions, and community events.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Visit Blog Section */}
          <div className="text-center mt-5" data-aos="zoom-in">
            <h5
              className="fw-bold mb-3"
              style={{ fontSize: "clamp(1.1rem, 1.6vw, 1.3rem)" }}
            >
              📰 Visit our blog for more:
            </h5>
            <a
              href="https://www.frozenwala.com/blog"
              target="_blank"
              rel="noopener noreferrer"
              className="fs-5 text-decoration-none"
              style={{
                color: "#007bff",
                fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
                wordBreak: "break-word",
              }}
            >
              www.frozenwala.com/blog
            </a>
          </div>
        </div>
      </section>

      {/* === CALL TO ACTION === */}
      <section className="py-5 bg-primary text-white text-center">
        <div className="container" data-aos="fade-up">
          <h3
            className="fw-bold mb-3"
            style={{ fontSize: "clamp(1.3rem, 2vw, 1.8rem)" }}
          >
            Explore, Learn & Stay Inspired
          </h3>
          <p
            className="mb-4"
            style={{
              maxWidth: "700px",
              margin: "0 auto",
              fontSize: "clamp(0.95rem, 1.3vw, 1.1rem)",
            }}
          >
            Whether you're a food enthusiast or a busy home chef, our blog is
            your go-to source for all things Frozenwala.
          </p>
          <a
            href="https://www.frozenwala.com/blog"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-light fw-bold px-4 text-primary"
          >
            Visit Blog
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Blog;
