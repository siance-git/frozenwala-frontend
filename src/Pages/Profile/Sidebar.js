// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Api from "../Utills/Api";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// // import {akashpicture} from '../../../public/img/gallery/akash.jpeg';

// const Sidebar = ({ activeButton, onButtonClick }) => {
//   const buttons = [
//     { id: 1, label: "My Profile" },
//     { id: 2, label: "Order History" },
//     { id: 3, label: "Log Out" },
//     { id: 4, label: "Wallet Transactions" },
    
//   ];
//   const [name, setName] = useState("");
//   const [photo, setPhoto] = useState("");
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const wallet = localStorage.getItem("wallet")



//   useEffect(() => {
//     const access = localStorage.getItem("access_token");
//     if (!access) {
//       navigate("/login");
//     }
//     const getProfile = async () => {
//       const uid = localStorage.getItem("user_id");

//       try {
//         const response = await Api.get(`api/profile/?user_id=${uid}`);
//         setPhoto(response.data.profile_photo);
//         setName(response.data.name);
//         // toast.success("Profile loaded successfully!");
//       } catch (error) {
//         console.log("Error fetching profile:", error);
//         // Handle error here
//       } finally {
//         setLoading(false);
//       }
//     };

//     getProfile();
//   }, []);

//   return (
//     <div
//       style={{
//         width: "300px",
//         padding: "20px",
//         borderRadius: "10px",
//         boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
//         backgroundColor: "#fff",
//         marginLeft: "20px",
//         marginRight: "20px",
//       }}
//     >
//       {loading ? (
//         <div>Loading...</div>
//       ) : (
//         <>
//           <div style={{ textAlign: "center" }}>
//             <img
//               src={
//                 photo ||
//                 "./img/gallery/akash.jpeg"
//               }
//               alt="Profile"
//               style={{ width: "100px", height: "100px", borderRadius: "50%" }}
//             />
//             <h2 style={{ color: "rgba(6, 6, 6, 1)", margin: "10px 0",fontSize:"1.1rem" }}>{name}</h2>
//           </div>
//           <hr style={{ borderTop: "1px solid #ddd", margin: "20px 0" }} />


//           <div>
//             {buttons.map((button) => (
//               <button
//                 key={button.id}
//                 style={{
//                   display: "block",
//                   width: "100%",
//                   padding: "10px",
//                   textAlign: "left",
//                   border: "none",
//                   borderRadius: "5px",
//                   marginBottom: "10px",
//                   backgroundColor:
//                     button.id === activeButton ? "rgb(255, 152, 0)" : "#eee",
//                   color: button.id === activeButton ? "#fff" : "#333",
//                   cursor: "pointer",
//                   transition: "background-color 0.3s",
//                 }}
//                 onClick={() => onButtonClick(button.id)}
//               >
//                 {button.label}
//               </button>
//             ))}
//           </div>
//           <div
//             style={{
//               marginTop: "20px",
//               display: "flex",
//               gap: "8px",
//               alignItems: "center",
//               padding: "10px 14px",
//               background: "#fff7ed",
//               borderRadius: "10px",
//               border: "1px solid #ffddbc",
//               boxShadow: "0 2px 5px rgba(255, 139, 41, 0.15)",
//               fontSize: "16px",
//               fontWeight: "600",
//               color: "#333",
//               justifyContent: "center",
//             }}
//           >
//             <span>Wallet Balance:</span>
//             <span style={{ color: "#ff7b00" }}>₹{wallet}</span>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Sidebar;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../Utills/Api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Sidebar = ({ activeButton, onButtonClick }) => {
  const buttons = [
    { id: 1, label: "My Profile" },
    { id: 2, label: "Order History" },
    { id: 3, label: "Wallet Transactions" },
    { id: 4, label: "Your QR Code" },
    { id: 5, label: "Log Out" },
  ];

  useEffect(() => {
    const tab = window.location.href.split("?").length > 1 ? window.location.href.split("?")[1].split("=")[1] : null;
    if (tab) {
      onButtonClick(parseInt(tab));
    }
  }, []);
  
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState(localStorage.getItem("wallet") || "0.00");
  const navigate = useNavigate();

  // Fetch wallet data
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

  useEffect(() => {
    const access = localStorage.getItem("access_token");
    if (!access) {
      navigate("/login");
    }
    
    const getProfileAndWallet = async () => {
      const uid = localStorage.getItem("user_id");

      try {
        // Fetch profile data
        const profileResponse = await Api.get(`api/profile/?user_id=${uid}`);
        setPhoto(profileResponse.data.profile_photo);
        setName(profileResponse.data.name);
        
        // Fetch wallet data on initial load
        await fetchWalletData();
        
      } catch (error) {
        console.log("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    getProfileAndWallet();
  }, []);

  // Enhanced button click handler
  const handleButtonClick = async (buttonId) => {
    // Fetch wallet data before changing the active button
    await fetchWalletData();
    
    // Call the original onButtonClick handler
    onButtonClick(buttonId);
  };

  return (
    <div
      style={{
        width: "300px",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#fff",
        marginLeft: "20px",
        marginRight: "20px",
      }}
    >
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div style={{ textAlign: "center" }}>
            <img
              src={
                photo ||
                "./img/gallery/akash.jpeg"
              }
              alt="Profile"
              style={{ width: "100px", height: "100px", borderRadius: "50%" }}
            />
            <h2 style={{ color: "rgba(6, 6, 6, 1)", margin: "10px 0", fontSize: "1.1rem" }}>
              {name}
            </h2>
          </div>
          <hr style={{ borderTop: "1px solid #ddd", margin: "20px 0" }} />

          <div>
            {buttons.map((button) => (
              <button
                key={button.id}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "10px",
                  textAlign: "left",
                  border: "none",
                  borderRadius: "5px",
                  marginBottom: "10px",
                  backgroundColor:
                    button.id === activeButton ? "rgb(255, 152, 0)" : "#eee",
                  color: button.id === activeButton ? "#fff" : "#333",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
                onClick={() => handleButtonClick(button.id)}
              >
                {button.label}
              </button>
            ))}
          </div>
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              gap: "8px",
              alignItems: "center",
              padding: "10px 14px",
              background: "#fff7ed",
              borderRadius: "10px",
              border: "1px solid #ffddbc",
              boxShadow: "0 2px 5px rgba(255, 139, 41, 0.15)",
              fontSize: "16px",
              fontWeight: "600",
              color: "#333",
              justifyContent: "center",
            }}
          >
            <span>Wallet Balance:</span>
            <span style={{ color: "#ff7b00" }}>₹{wallet}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;