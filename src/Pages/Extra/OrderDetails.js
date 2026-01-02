
// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { motion } from "framer-motion";
// import Api from "../Utills/Api";
// import "./OrderDetails.css"; // 👈 External CSS file

// const OrderDetails = () => {
//   const { orderId } = useParams();
//   const navigate = useNavigate();

//   const [name, setName] = useState("");
//   const [address, setAddress] = useState("");
//   const [city, setCity] = useState("");
//   const [state, setState] = useState("");
//   const [zip, setZip] = useState("");
//   const [previousPrice, setPreviousPrice] = useState("");
//   const [totalPrice, setTotalPrice] = useState("");
//   const [discount, setDiscount] = useState("");
//   const [delivery, setDelivery] = useState("");
//   const [statusText, setStatusText] = useState("");
//   const [products, setProducts] = useState([]);
//   const [wallet, setWallet] = useState(0);

//   useEffect(() => {
//     const getHistory = async () => {
//       try {
//         const response = await Api.get(`api/invoice/?order_id=${orderId}`);
//         console.log("data in summery page : ",response.data);
//         const orderDetails = response.data.order_details[0];
//         setAddress(orderDetails.address);
//         setCity(orderDetails.city);
//         setName(orderDetails.newname);
//         setDiscount(orderDetails.discounted_price);
//         setDelivery(orderDetails.delivery_price);
//         setState(orderDetails.state);
//         setZip(orderDetails.zip_code);
//         setPreviousPrice(orderDetails.previous_price);
//         setStatusText(orderDetails.status);
//         setTotalPrice(orderDetails.total_price);
//         setProducts(response.data.products);
//         setWallet(orderDetails.wallet);
//       } catch (error) {
//         console.log("Error fetching:", error);
//       }
//     };
//     getHistory();
//   }, [orderId]);

//   const generatePDF = async () => {
//     try {
//       const config = {
//         headers: { Accept: "application/pdf" },
//         responseType: "blob",
//       };
//       const response = await Api.get(`api/generate_invoice/?order_id=${orderId}`, config);
//       console.log("pdf data : ",response.data);
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", `invoice_${orderId}.pdf`);
//       document.body.appendChild(link);
//       link.click();
//     } catch (error) {
//       console.log("Error fetching pdf:", error);
//     }
//   };

//   const getStatusColor = (status) => {
   
//     switch (status) {
//       case "1":
//         return { text: "Pending", color: "#FF9800" };
//       case "2":
//         return { text: "Confirm", color: "#03A9F4" };
//       case "3":
//         return { text: "Picked Up", color: "#4CAF50" };
//       case "4":
//         return { text: "Delivered", color: "#8BC34A" };
//       case "5":
//         return { text: "Cancel", color: "#F44336" };
//       case "6":
//         return { text: "Return Request", color: "#9E9E9E" };
//       default:
//         return { text: "Accepted", color: "#9C27B0" };
//     }
    
//   };

//   const { text, color } = getStatusColor(statusText);

//   return (
//     <div className="order-wrapper">
//               <button
//           onClick={() => navigate("/profile/?tab=2")}
//           style={{
//             backgroundColor: "#fff",
//             borderRadius: "10px",
//             border: "1px solid #FF9800",
//             padding: "8px 16px",
//             cursor: "pointer",
//             fontWeight: "bold",
//           }}
//         >
//           👈 Go Back
//         </button>
//       <motion.div
//         className="order-container"
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//       >
//         <div className="order-header">
//           <h1>Order Summary</h1>
//           <span>#{orderId}</span>
//         </div>

//         <motion.div
//           className="order-status"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.3 }}
//         >
//           <p style={{textAlign:"start"}}>
//             This order was <span style={{ color }}>{text}</span>
//           </p>
//         </motion.div>

//         <div className="order-customer">
//           <p className="from-title">From</p>
//           <p className="store-name">Frozenwala</p>
//           {/* <p>{name}</p> */}
//           <p>
//             {address}- {name}
//           </p>
//         </div>

//         <motion.div
//           className="bill-section"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.4 }}
//         >
//           <h2>Bill Details</h2>
//           <div className="bill-list">
//             {products.map((item, index) => (
//               <div key={index} className="bill-item">
//                 <p>{item.name} × {item.item_quantity}</p>
//                 <p>₹{item.item_new_price}</p>
//               </div>
//             ))}
//           </div>

//           <hr />
//           <div className="bill-summary">
//             <p>Total Items Price</p><p>₹{previousPrice}</p>
//           </div>
//           <div className="bill-summary">
//             <p>Wallet</p><p>- ₹{wallet}</p>
//           </div>
//           <div className="bill-summary">
//             <p>Delivery Partner Fee</p><p>₹{delivery}</p>
//           </div>
//           <div className="bill-summary">
//             <p>Discount Applied</p><p>- ₹{discount}</p>
//           </div>
//           <hr />
//           <div className="bill-total">
//             <p>Payable Amount</p><p>₹{totalPrice}</p>
//           </div>
//         </motion.div>

//         <motion.div className="btn-container" whileHover={{ scale: 1.05 }}>
//           <button onClick={generatePDF}>Generate Invoice</button>
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// };

// export default OrderDetails;


import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Api from "../Utills/Api";
import "./OrderDetails.css";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [previousPrice, setPreviousPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [delivery, setDelivery] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [products, setProducts] = useState([]);
  const [wallet, setWallet] = useState(0);

  // dummy invoice meta (fallback)
  const invoiceNo = `INV-${orderId || "0001"}`;
  const invoiceDate = new Date().toLocaleDateString();
  const [gstNumber, setGstNumber] = useState("");
  const sellerPhone = "+91 9876543210";
  const sellerAddress = "Frozenwala Pvt. Ltd., Mumbai, Maharashtra";

  const [gstRate, setGstRate] = useState(0);
  const [cgstAmount, setCgstAmount] = useState(0);
  const [sgstAmount, setSgstAmount] = useState(0);
  const [totalGstAmount, setTotalGstAmount] = useState(0);
  // const [taxableAmount, setTaxableAmount] = useState(0);

  // GST Calculation
  const taxableAmount = totalPrice - totalGstAmount;
  // const totalGST = Number(totalPrice) - taxableAmount;
  // const cgst = totalGST / 2;
  // const sgst = totalGST / 2;

  useEffect(() => {
    const getHistory = async () => {
      try {
        const response = await Api.get(`api/invoice/?order_id=${orderId}`);
        const orderDetails = response.data?.order_details?.[0] || {};

        setAddress(orderDetails.address || "");
        setCity(orderDetails.city || "");
        setName(orderDetails.newname || "");
        setDiscount(orderDetails.discounted_price || 0);
        setDelivery(orderDetails.delivery_price || 0);
        setState(orderDetails.state || "");
        setZip(orderDetails.zip_code || "");
        setPreviousPrice(orderDetails.previous_price || 0);
        setStatusText(orderDetails.status || "");
        setTotalPrice(orderDetails.total_price || 0);
        setWallet(orderDetails.wallet || 0);
        setProducts(response.data?.products || []);

        setGstRate(orderDetails.gst_rate || 0);
        setCgstAmount(orderDetails.cgst_amount || 0);
        setSgstAmount(orderDetails.sgst_amount || 0);
        setTotalGstAmount(orderDetails.total_gst || 0);
        setGstNumber(orderDetails.gstn || "");
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
      const response = await Api.get(
        `api/generate_invoice/?order_id=${orderId}`,
        config
      );
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
        {/* INVOICE HEADER */}
        <div className="order-header">
          <h1>Invoice</h1>
          <span>{invoiceNo}</span>
        </div>

        {/* SELLER DETAILS */}
        <div className="invoice-box">
          <h3>Seller Details</h3>
          <p><strong>Frozenwala</strong></p>
          <p>{sellerAddress}</p>
          {gstNumber && <p>GSTIN: {gstNumber || "-"}</p>}
          <p>Phone: {sellerPhone}</p>
          <p>Date: {invoiceDate}</p>
        </div>

        {/* CUSTOMER DETAILS */}
        <div className="invoice-box">
          <h3>Bill To</h3>
          <p>{name || "Customer"}</p>
          <p>{address} {city} {zip}</p>
        </div>

        {/* STATUS */}
        <motion.div className="order-status">
          <p>
            Order Status: <span style={{ color }}>{text}</span>
          </p>
        </motion.div>

        {/* PRODUCT LIST */}
        <motion.div className="bill-section">
          <h2>Bill Details</h2>

          <div className="bill-table">
            <div className="bill-head">
              <p>Item</p>
              <p>Qty</p>
              <p>Rate</p>
              <p>Total</p>
            </div>

            {products.map((item, index) => (
              <div key={index} className="bill-row">
                <p>{item.name}</p>
                <p>{item.item_quantity}</p>
                <p>₹{item.item_new_price}</p>
                <p>₹{item.item_new_price * item.item_quantity}</p>
              </div>
            ))}
          </div>

          <hr />

          {/* TAX SECTION */}
          <div className="bill-summary">
            <p>Taxable Amount</p>
            <p>₹{taxableAmount.toFixed(2)}</p>
          </div>
          {gstRate > 0 && 
            <>
              <div className="bill-summary">
                <p>CGST ({gstRate/2}%)</p>
                <p>₹{cgstAmount.toFixed(2)}</p>
              </div>
              <div className="bill-summary">
                <p>SGST ({gstRate/2}%)</p>
                <p>₹{sgstAmount.toFixed(2)}</p>
              </div>
              <div className="bill-summary">
                <p>Total GST</p>
                <p>₹{totalGstAmount.toFixed(2)}</p>
              </div>
            </>
          }

          {/* EXISTING FIELDS */}
          <div className="bill-summary">
            <p>Wallet</p><p>- ₹{wallet}</p>
          </div>
          <div className="bill-summary">
            <p>Delivery Fee</p><p>₹{delivery}</p>
          </div>
          <div className="bill-summary">
            <p>Discount Applied</p><p>- ₹{discount}</p>
          </div>

          <hr />

          <div className="bill-total">
            <p>Grand Total</p>
            <p>₹{totalPrice}</p>
          </div>

          <p style={{marginTop: 10, fontSize: 12, opacity: .7}}>
            This is a system-generated invoice.
          </p>
        </motion.div>

        <motion.div className="btn-container" whileHover={{ scale: 1.05 }}>
          <button onClick={generatePDF}>Generate Invoice</button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OrderDetails;
