import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../Utills/Api";
import { motion, AnimatePresence } from "framer-motion";

const OrderHistory = () => {
  const navigate = useNavigate();
  const [historyData, setHistoryData] = useState([]);

  const getHistory = async () => {
    try {
      const uid = localStorage.getItem("user_id");
      const response = await Api.get(`api/orders/?user_id=${uid}`);
      console.log("response from order history: ",response.data)
      setHistoryData(response.data);
    } catch (error) {
      console.log("Error fetching history:", error);
    }
  };

  useEffect(() => {
    getHistory();
  }, []);

  const handleButton = (order) => {
    const { order_id } = order;
    navigate(`/orderdetails/${order_id}/`);
  };

  const getStatusDetails = (status) => {
    switch (status) {
      case "1":
        return { text: "Pending", color: "#FF9800" };
      case "2":
        return { text: "Confirm", color: "#03A9F4" };
      case "3":
        return { text: "Picked Up", color: "#4CAF50" };
      case "4":
        return { text: "Delivered", color: "#8BC34A" };
      case "5":
        return { text: "Cancel", color: "#F44336" };
      case "6":
        return { text: "Return Request", color: "#9E9E9E" };
      default:
        return { text: "Accepted", color: "#9C27B0" };
    }
  };

  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh", padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            backgroundColor: "#fff",
            borderRadius: "10px",
            border: "1px solid #FF9800",
            padding: "8px 16px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          👈 Go Back
        </button>
        <h1 style={{ flex: 1, textAlign: "center", fontSize: "1.5rem", margin: "10px 0" }}>
          Order History
        </h1>
        <div style={{ width: "100px" }}></div>
      </div>

      {historyData.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            marginTop: "50px",
            fontSize: "1.2rem",
            color: "#888",
          }}
        >
          No history available
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          <AnimatePresence>
            {historyData.map((order) => {
              const { text: statusText, color } = getStatusDetails(order.status);

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ scale: 1.02, boxShadow: "0 8px 20px rgba(0,0,0,0.2)" }}
                  transition={{ duration: 0.3 }}
                  onClick={() => handleButton(order)}
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: "12px",
                    padding: "15px",
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src='/img/gallery/Frozenwala.png'
                    alt="logo"
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "12px",
                      objectFit: "cover",
                      marginRight: "15px",
                      flexShrink: 0,
                    }}
                  />
                  <div
                    style={{
                      flex: 1,
                      minWidth: "200px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "200px",
                      }}
                    >
                      Order ID: {order.order_id}
                    </span>
                    <p style={{ fontSize: "12px", color: "#80869A" }}>{order.created_at}</p>
                    <p style={{ fontSize: "14px", fontWeight: "bold", color: "#333" }}>
                      ₹{order.total_price}
                    </p>
                  </div>
                  <span
                    style={{
                      padding: "5px 10px",
                      borderRadius: "8px",
                      backgroundColor: color + "33", // light background
                      color: color,
                      fontWeight: "600",
                      fontSize: "12px",
                      flexShrink: 0,
                    }}
                  >
                    {statusText}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
