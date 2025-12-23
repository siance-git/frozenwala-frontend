
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Api from "../Utills/Api";
import "./OrderDetails.css"; // 👈 External CSS file

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [previousPrice, setPreviousPrice] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [delivery, setDelivery] = useState("");
  const [statusText, setStatusText] = useState("");
  const [products, setProducts] = useState([]);
  const [wallet, setWallet] = useState(0);

  useEffect(() => {
    const getHistory = async () => {
      try {
        const response = await Api.get(`api/invoice/?order_id=${orderId}`);
        console.log("data in summery page : ",response.data);
        const orderDetails = response.data.order_details[0];
        setAddress(orderDetails.address);
        setCity(orderDetails.city);
        setName(orderDetails.newname);
        setDiscount(orderDetails.discounted_price);
        setDelivery(orderDetails.delivery_price);
        setState(orderDetails.state);
        setZip(orderDetails.zip_code);
        setPreviousPrice(orderDetails.previous_price);
        setStatusText(orderDetails.status);
        setTotalPrice(orderDetails.total_price);
        setProducts(response.data.products);
        setWallet(orderDetails.wallet);
      } catch (error) {
        console.log("Error fetching:", error);
      }
    };
    getHistory();
  }, [orderId]);

  const generatePDF = async () => {
    try {
      const config = {
        headers: { Accept: "application/pdf" },
        responseType: "blob",
      };
      const response = await Api.get(`api/generate_invoice/?order_id=${orderId}`, config);
      console.log("pdf data : ",response.data);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.log("Error fetching pdf:", error);
    }
  };

  const getStatusColor = (status) => {
   
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

  const { text, color } = getStatusColor(statusText);

  return (
    <div className="order-wrapper">
              <button
          onClick={() => navigate("/profile/?tab=2")}
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
      <motion.div
        className="order-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="order-header">
          <h1>Order Summary</h1>
          <span>#{orderId}</span>
        </div>

        <motion.div
          className="order-status"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p style={{textAlign:"start"}}>
            This order was <span style={{ color }}>{text}</span>
          </p>
        </motion.div>

        <div className="order-customer">
          <p className="from-title">From</p>
          <p className="store-name">Frozenwala</p>
          {/* <p>{name}</p> */}
          <p>
            {address}- {name}
          </p>
        </div>

        <motion.div
          className="bill-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2>Bill Details</h2>
          <div className="bill-list">
            {products.map((item, index) => (
              <div key={index} className="bill-item">
                <p>{item.name} × {item.item_quantity}</p>
                <p>₹{item.item_new_price}</p>
              </div>
            ))}
          </div>

          <hr />
          <div className="bill-summary">
            <p>Total Items Price</p><p>₹{previousPrice}</p>
          </div>
          <div className="bill-summary">
            <p>Wallet</p><p>- ₹{wallet}</p>
          </div>
          <div className="bill-summary">
            <p>Delivery Partner Fee</p><p>₹{delivery}</p>
          </div>
          <div className="bill-summary">
            <p>Discount Applied</p><p>- ₹{discount}</p>
          </div>
          <hr />
          <div className="bill-total">
            <p>Payable Amount</p><p>₹{totalPrice}</p>
          </div>
        </motion.div>

        <motion.div className="btn-container" whileHover={{ scale: 1.05 }}>
          <button onClick={generatePDF}>Generate Invoice</button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OrderDetails;
