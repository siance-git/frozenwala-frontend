import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Home/Navbar";
import ParentComponent from "./Home/Parent";
import Adv from "./Home/Adv";
import Footer from "./Home/Footer";
import Special from "./Home/Special";
import SignupModal from "./Auth/Overlay.jsx";
import Carousel from "react-bootstrap/Carousel";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";

function Home() {
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(true);
  const [uid, setUid] = useState(null);
  const [access, setAccess] = useState(null);
  const [index, setIndex] = useState(0);
  const [banners, setBanners] = useState([]);
  const [loadingBanners, setLoadingBanners] = useState(true);
  const [bannerError, setBannerError] = useState(null);
  const [advertisements, setAdvertisements] = useState([]);
  const [loadingAds, setLoadingAds] = useState(true);
  const [adError, setAdError] = useState(null);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const refRestCart = () => setRefresh(!refresh);

  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSignup(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const storedUid = localStorage.getItem("user_id");
    const storedAccess = localStorage.getItem("access_token");

    if (!storedUid || !storedAccess) {
      // navigate("/login");
    } else {
      setUid(storedUid);
      setAccess(storedAccess);
    }
  }, [navigate]);

  // Fetch banners
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoadingBanners(true);
        const response = await axios.get("https://backend.frozenwala.com/api/banners/");

        const activeBanners = response.data.filter(
          (banner) => banner.status === true
        );

        const formattedBanners = activeBanners.map((banner) => ({
          id: banner.id,
          image: banner.add_photo,
          title: banner.title,
          description: banner.description,
          originalData: banner,
        }));

        setBanners(formattedBanners);
        setBannerError(null);
      } catch (err) {
        console.error("Failed to fetch banners:", err);
        setBannerError("Failed to load banners. Please try again later.");
      } finally {
        setLoadingBanners(false);
      }
    };

    fetchBanners();
  }, []);

  // Fetch advertisements
  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        setLoadingAds(true);
        const response = await axios.get(`https://backend.frozenwala.com/api/adds/`);

        // Filter only active advertisements with status: true
        const activeAds = response.data.filter((ad) => ad.status === true);

        const formattedAds = activeAds.map((ad) => ({
          id: ad.id,
          image: ad.add_photo,
          title: ad.title,
          description: ad.description,
          created_at: ad.created_at,
          category: ad.category,
          originalData: ad,
        }));

        setAdvertisements(formattedAds);
        setAdError(null);
      } catch (err) {
        console.error("Failed to fetch advertisements:", err);
        setAdError("Failed to load advertisements.");
      } finally {
        setLoadingAds(false);
      }
    };

    fetchAdvertisements();
  }, []);

  // Slider settings for advertisement carousel
  const adSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
        }
      }
    ]
  };

  return (
    <div>
      <main className="main" id="top">
        {!access && (
          <SignupModal show={showSignup} onClose={() => setShowSignup(false)} />
        )}
        <Navbar refreshCart={refresh} />

        {/* Banner Carousel */}
        <div className="banner-carousel-container">
          {loadingBanners ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading banners...</span>
              </div>
              <p className="mt-2">Loading banners...</p>
            </div>
          ) : bannerError ? (
            <div className="alert alert-warning text-center" role="alert">
              {bannerError}
            </div>
          ) : (
            <Carousel
              activeIndex={index}
              onSelect={handleSelect}
              interval={3000}
              fade
              indicators={banners.length > 1}
              controls={banners.length > 1}
            >
              {banners.map((slide, idx) => (
                <Carousel.Item key={slide.id || idx}>
                  <img
                    className="d-block w-100 banner-image"
                    src={slide.image}
                    alt={`Banner ${idx + 1}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/img/gallery/banner1.jpg"; // Fallback image
                    }}
                    style={{
                      height: "500px",
                      objectFit: "cover",
                      width: "100%",
                    }}
                  />

                  <Carousel.Caption className="banner-caption text-center">
                    <h2 className="banner-text">{slide.description}</h2>
                  </Carousel.Caption>
                </Carousel.Item>
              ))}
            </Carousel>
          )}
        </div>

        <ParentComponent refRestCart={refRestCart} uid={uid} advertisements={advertisements} loadingAds={loadingAds} adError={adError} adSettings={adSettings} />

        <Adv />

        <Special access={access} uid={uid} />

        <section className="py-0">
          <div
            className="bg-holder"
            style={{
              backgroundImage: "url(/img/gallery/cta-two-bg.png)",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          ></div>

          <div className="container">
            <div className="row flex-center">
              <div className="col-xxl-9 py-7 text-center">
                <h1 className="fw-bold mb-4 text-white fs-6">
                  Are you ready to order <br />
                  with the best deals?{" "}
                </h1>
                <a className="btn btn-danger" href="/menu">
                  {" "}
                  PROCEED TO ORDER<i className="fas fa-chevron-right ms-2"></i>
                </a>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}

export default Home;