// // MainContent.js

// import React from "react";
// import MyProfile from "./MyProfile";
// import Logout from "./Logout";
// import OrderHistory from "./OrderHistory";

// const MainContent = ({ activeButton }) => {
//   const accessToken = localStorage.getItem('access_token');
//   console.log("accessToken : ",accessToken)
//   const getPageContent = () => {
//     switch (activeButton) {
//       case 1:
//         return <div><MyProfile/></div>;
//       case 2:
//         return <div><OrderHistory/></div>;
//       case 3:
//         return <div><Logout/></div>;
//       default:
//         return <div><MyProfile/></div>;
//     }
//   };

//   return <div style={{ flexGrow: 1, padding: "20px" }}>{getPageContent()}</div>;
// };

// export default MainContent;

// MainContent.js
// import React from "react";
// import MyProfile from "./MyProfile";
// import Logout from "./Logout";
// import OrderHistory from "./OrderHistory";
// import WalletTransactions from "./WalletTransactions";

// const MainContent = ({ activeButton }) => {
//   const getPageContent = () => {
//     switch (activeButton) {
//       case 1:
//         return <div><MyProfile/></div>;
//       case 2:
//         return <div><OrderHistory/></div>;
//       case 4:
//         return <div><WalletTransactions/></div>;
//       case 3:
//         return <div><Logout/></div>;
//       default:
//         return <div><MyProfile/></div>;
//     }
//   };

//   return <div style={{ flexGrow: 1, padding: "20px" }}>{getPageContent()}</div>;
// };

// export default MainContent;

import React, { useState, useEffect } from "react";
import MyProfile from "./MyProfile";
import Logout from "./Logout";
import OrderHistory from "./OrderHistory";
import WalletTransactions from "./WalletTransactions";
import UserQRCode from "./UserQRCode";
import api, { walletApi } from "../Utills/Api"; // Import wallet API

const MainContent = ({ activeButton }) => {
  const [walletData, setWalletData] = useState(null);
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletError, setWalletError] = useState(null);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      setWalletLoading(true);
      setWalletError(null);
      
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        throw new Error("User ID not found");
      }
 const data = await api.get(`api/wallet/?user_id=${userId}`);
      
      // Store in localStorage
      if (data && data.wallet_value !== undefined) {
        localStorage.setItem("wallet", data.wallet_value.toString());
        console.log("Wallet value stored in localStorage:", data.wallet_value);
      }
      
      setWalletData(data);
    } catch (error) {
      console.error("Error fetching wallet:", error);
      setWalletError(error.message);
      
      // Set default data for demo
      setWalletData({
        wallet_value: 2.0,
        last_updated: new Date().toISOString()
      });
    } finally {
      setWalletLoading(false);
    }
  };

  // Function to pass wallet data to components
  const getWalletProps = () => ({
    walletBalance: walletData?.wallet_value || 0,
    walletLoading,
    walletError,
    refreshWallet: fetchWalletData,
    walletData
  });

  const getPageContent = () => {
    switch (activeButton) {
      case 1:
        return (
          <div>
            <MyProfile 
              walletBalance={walletData?.wallet_value} 
              walletLoading={walletLoading}
            />
          </div>
        );
      case 2:
        return (
          <div>
            <OrderHistory />
          </div>
        );
      case 3:
        return (
          <div>
            <WalletTransactions {...getWalletProps()} />
          </div>
        );
      case 4:
        return (
          <div>
            <UserQRCode />
          </div>
        );
      case 5:
        return (
          <div>
            <Logout />
          </div>
        );
      default:
        return (
          <div>
            <MyProfile 
              walletBalance={walletData?.wallet_value} 
              walletLoading={walletLoading}
            />
          </div>
        );
    }
  };


  return <div style={{ flexGrow: 1, padding: "20px" }}>{getPageContent()}</div>;
};

export default MainContent;