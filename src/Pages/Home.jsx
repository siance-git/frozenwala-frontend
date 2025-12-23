// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Offers from "./Home/Offers";
// import How from "./Home/How";
// import Popular from "./Home/Popular";
// import Menu from "./Home/Menu";
// import Navbar from "./Home/Navbar";
// import Product from "./Home/Product";
// import ParentComponent from "./Home/Parent";
// import Adv from "./Home/Adv";
// import Footer from "./Home/Footer";
// import Special from "./Home/Special";
// import SignupModal from "./Auth/Overlay.jsx";
// import Slider from "react-slick";
// import Carousel from 'react-bootstrap/Carousel';
// // import ExampleCarouselImage from 'components/ExampleCarouselImage';

// function Home() {
//   const navigate = useNavigate();

//   const [activeTab, setActiveTab] = useState("Delivery");
//   const [refresh, setRefresh] = useState(true)
//   const [uid, setUid] = useState(null);
//   const [access, setAccess] = useState(null);
//     const [index, setIndex] = useState(0);

//   const handleSelect = (selectedIndex) => {
//     setIndex(selectedIndex);
//   };

//   const refRestCart = () => setRefresh(!refresh);

//   const handleTabClick = (tabName) => {
//     setActiveTab(tabName);
//   };
//   const [showSignup, setShowSignup] = useState(false);

//   useEffect(() => {
//     // show after 1 second when page renders
//     const timer = setTimeout(() => {
//       setShowSignup(true);
//     }, 3000);

//     return () => clearTimeout(timer); // cleanup
//   }, []);

//   useEffect(() => {
//     const storedUid = localStorage.getItem("user_id");
//     const storedAccess = localStorage.getItem("access_token");

//     if (!storedUid || !storedAccess) {
//       // navigate("/login");
//     } else {
//       setUid(storedUid);
//       setAccess(storedAccess);
//     }
//   }, [navigate]);

//   const settings = {
//     infinite: true,
//     speed: 800,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 4000,
//     arrows: false,
//     pauseOnHover: false,
//   };

//   const slides = [
//     {
//       id: 1,
//       image: "/img/gallery/banner1.jpg",
//       title: "Delicious Meals Delivered to You",
//       subtitle: "Find your favorite dishes — up to 50% off!",
//     },
//     {
//       id: 2,
//       image: "/img/gallery/banner2.jpeg",
//       title: "Fresh & Frozen Made Easy",
//       subtitle: "Order online and get it at your doorstep.",
//     },
//     {
//       id: 3,
//       image: "/img/gallery/banner2.jpeg",
//       title: "Celebrate Parties with Frozenwala",
//       subtitle: "Fast, affordable, and full of flavor & Taste the Difference Today",
//     },
//   ];

//   return (
//     <div>
//       <main className="main" id="top">
//         {!access && <SignupModal show={showSignup} onClose={() => setShowSignup(false)} />}
//         <Navbar refreshCart={refresh} />

//   <div className="banner-carousel-container">
//       <Carousel activeIndex={index} onSelect={handleSelect} interval={3000} fade>
//         {slides.map((slide, idx) => (
//           <Carousel.Item key={idx}>
//             <img
//               className="d-block w-100 banner-image"
//               src={slide.image}
//               alt={`slide-${idx}`}
//             />

//             {/* ✅ Centered text overlay */}
//             <Carousel.Caption className="banner-caption text-center">
//               <h2 className="banner-title">{slide.title}</h2>
//               <p className="banner-text">{slide.description}</p>
//             </Carousel.Caption>
//           </Carousel.Item>
//         ))}
//       </Carousel>
//     </div>

//         {/* <How /> */}

//         {<ParentComponent refRestCart={refRestCart} uid={uid} />}

//         <Adv />

//         <Special access={access} uid={uid} />

//         <section className="py-0">
//           <div
//             className="bg-holder"
//             style={{
//               backgroundImage: "url(/img/gallery/cta-two-bg.png)",
//               backgroundPosition: "center",
//               backgroundSize: "cover",
//             }}
//           ></div>

//           <div className="container">
//             <div className="row flex-center">
//               <div className="col-xxl-9 py-7 text-center">
//                 <h1 className="fw-bold mb-4 text-white fs-6">
//                   Are you ready to order <br />
//                   with the best deals?{" "}
//                 </h1>
//                 <a className="btn btn-danger" href="/menu" >
//                   {" "}
//                   PROCEED TO ORDER<i className="fas fa-chevron-right ms-2"></i>
//                 </a>
//               </div>
//             </div>
//           </div>
//         </section>

//         <Footer />
//       </main>
//     </div>
//   );
// }
// export default Home;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Offers from "./Home/Offers";
import How from "./Home/How";
import Popular from "./Home/Popular";
import Menu from "./Home/Menu";
import Navbar from "./Home/Navbar";
import Product from "./Home/Product";
import ParentComponent from "./Home/Parent";
import Adv from "./Home/Adv";
import Footer from "./Home/Footer";
import Special from "./Home/Special";
import SignupModal from "./Auth/Overlay.jsx";
import Slider from "react-slick";
import Carousel from "react-bootstrap/Carousel";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import api from "./Utills/Api.js";
import axios from "axios";

function Home() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Delivery");
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

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

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

  // Slider settings for banner carousel
  const bannerSettings = {
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    pauseOnHover: false,
  };

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

        {/* Advertisements Slider - Below Banner */}
        {/* {advertisements.length > 0 && (
          <div className="container" style={{width:"100%", maxWidth:"100%"}}>
            <div className="row justify-content-center" style={{width:"100%"}}>
              <div className="col-12 col-lg-10 col-xl-8" style={{width:"100%"}}>
               
                {loadingAds ? (
                  <div className="text-center py-3">
                    <div
                      className="spinner-border spinner-border-sm text-secondary"
                      role="status"
                    >
                      <span className="visually-hidden">Loading ads...</span>
                    </div>
                  </div>
                ) : adError ? (
                  <div className="alert alert-warning text-center" role="alert">
                    {adError}
                  </div>
                ) : (
                  <div className="advertisement-slider-container" style={{width:"100%"}}>
                    <Slider {...adSettings}>
                      {advertisements.map((ad) => (
                        <div key={ad.id} className="px-2"style={{width:"100%"}}>
                          <div className="ad-slide" style={{width:"100%"}}>
                            <img
                              src={ad.image}
                              alt={ad.title || "Advertisement"}
                              className="img-fluid rounded"
                              style={{
                                height: "300px",
                                objectFit: "cover",
                                width: "100%",
                                borderRadius: "10px",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                              }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/img/gallery/default-ad.jpg";
                              }}
                            />
                          
                          </div>
                        </div>
                      ))}
                    </Slider>
                  </div>
                )}
              </div>
            </div>
          </div>
        )} */}

        {/* <How /> */}

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