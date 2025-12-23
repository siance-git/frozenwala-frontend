import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../Profile/Sidebar";
import MainContent from "../Profile/MainContent";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Footer";
import { FiArrowLeft } from "react-icons/fi";

const App = () => {
  const {id} = useParams();
  const [activeButton, setActiveButton] = useState(id ? parseInt(id) : 1);
  const navigate = useNavigate();

  const handleButtonClick = (buttonId) => {
    setActiveButton(buttonId);
  };

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <Navbar />
      <div style={{marginTop: '30px'}}>
        <main className="main" id="top" style={{ paddingTop: "60px" }}>
          <div style={{ display: "flex" }}>
            <Sidebar
              activeButton={activeButton}
              onButtonClick={handleButtonClick}
            />
            <button
                      onClick={() => navigate(-1)}
                      className="back-btn"
                    >
                      <FiArrowLeft />
                      <span className="back-text">Back</span>
                    </button>
            <MainContent activeButton={activeButton} />
          </div>
          <Footer />
        </main>
      </div>
     
    </div>
  );
};

export default App;
