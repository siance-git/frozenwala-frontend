import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../Profile/Sidebar";
import MainContent from "../Profile/MainContent";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Footer";
import { FiArrowLeft } from "react-icons/fi";
import Api from "../Utills/Api";

const App = () => {
  const {id} = useParams();
  const [activeButton, setActiveButton] = useState(id ? parseInt(id) : 1);
  const navigate = useNavigate();
  const location = useLocation();
  const [wallet, setWallet] = useState(localStorage.getItem("wallet") || "0.00");

  const handleButtonClick = (buttonId) => {
    setActiveButton(buttonId);
  };

  const fetchWalletData = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        throw new Error("User ID not found");
      }
      
      const response = await Api.get(`api/wallet/?user_id=${userId}`);
      const walletValue = response.data?.wallet_value || 0;
      
      // Update state and localStorage
      setWallet(walletValue.toString());
      localStorage.setItem("wallet", walletValue.toString());
      console.log("Wallet updated:", walletValue);
      
    } catch (error) {
      console.error("Error fetching wallet:", error);
      // Keep existing wallet value on error
    }
  };

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBack = () => {
    const previousPath = sessionStorage.getItem("previousPath");

    if (previousPath?.startsWith("/orderdetails")) {
      navigate("/");
    } else {
      navigate(-1);
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{marginTop: '30px'}}>
        <main className="main" id="top" style={{ paddingTop: "60px" }}>
          <div style={{ display: "flex" }}>
            <Sidebar
              activeButton={activeButton}
              onButtonClick={handleButtonClick}
              fetchWalletData={fetchWalletData}
              wallet={wallet}
            />
            <button
                      onClick={handleBack}
                      className="back-btn"
                    >
                      <FiArrowLeft />
                      <span className="back-text">Back</span>
                    </button>
            <MainContent activeButton={activeButton} fetchMyWalletData={fetchWalletData} wallet={wallet} />
          </div>
          <Footer />
        </main>
      </div>
     
    </div>
  );
};

export default App;
