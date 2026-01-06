import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Api from "../Utills/Api";
import "./OrderDetails.css";
import html2pdf from "html2pdf.js";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
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
  const [orderDate, setOrderDate] = useState("");
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [sellerAddress, setSellerAddress] = useState({});
  const [totalSaved, setTotalSaved] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);

  const [totalGstAmount, setTotalGstAmount] = useState(0);

  // GST Calculation
  const taxableAmount = totalPrice - totalGstAmount;

  useEffect(() => {
    const getHistory = async () => {
      try {
        const response = await Api.get(`api/invoice/?order_id=${orderId}`);
        const orderDetails = response.data?.order_details?.[0] || {};

        setAddress(orderDetails.address || "");
        setCity(orderDetails.city || "");
        setName(orderDetails.newname || "");
        setPhone(orderDetails.phone || "");
        setDiscount(Number(orderDetails.discounted_price) || 0);
        setDelivery(Number(orderDetails.delivery_price) || 0);
        setState(orderDetails.state || "");
        setZip(orderDetails.zip_code || "");
        setPreviousPrice(Number(orderDetails.previous_price) || 0);
        setStatusText(orderDetails.status || "");
        setTotalPrice(Number(orderDetails.total_price) || 0);
        setWallet(Number(orderDetails.wallet) || 0);
        setProducts(response.data?.products || []);

        setTotalQuantity(response.data?.products?.reduce((acc, item) => acc + item.item_quantity, 0) || 0);

        setTotalGstAmount(response.data?.products?.reduce((acc, item) => acc + item.gst_price, 0) || 0);
        setOrderDate(orderDetails.order_date || "");

        setSellerAddress(orderDetails?.seller_address || {});

        const totalDiscount =
          response.data?.products?.reduce((acc, item) => {
            const oldPrice = item.item_old_price ?? 0;
            const newPrice = item.item_new_price ?? 0;
            const qty = item.item_quantity ?? 1;

            return acc + (oldPrice - newPrice) * qty;
          }, 0) || 0;
        setTotalSaved((Number(orderDetails.discounted_price) || 0) + totalDiscount);
        const totalProductsPrice =
          response.data?.products?.reduce((acc, item) => {
            const oldPrice = item.item_old_price ?? 0;
            const qty = item.item_quantity ?? 1;

            return acc + oldPrice * qty;
          }, 0) || 0;
        setFinalTotal(totalProductsPrice + Number(orderDetails.delivery_price));
      } catch (error) {
        console.log("Error fetching:", error);
      }
    };

    getHistory();
  }, [orderId]);

  const generatePDF = async () => {
    const element = document.getElementById("orderContainer");

    html2pdf()
      .from(element)
      .set({
        margin: 10,
        filename: `invoice_${orderId}.pdf`,
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .save();
    // try {
    //   const config = {
    //     headers: { Accept: "application/pdf" },
    //     responseType: "blob",
    //   };
    //   const response = await Api.get(
    //     `api/generate_invoice/?order_id=${orderId}`,
    //     config
    //   );
    //   const url = window.URL.createObjectURL(new Blob([response.data]));
    //   const link = document.createElement("a");
    //   link.href = url;
    //   link.setAttribute("download", `invoice_${orderId}.pdf`);
    //   document.body.appendChild(link);
    //   link.click();
    // } catch (error) {
    //   console.log("Error fetching pdf:", error);
    // }
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
        id="orderContainer"
        className="order-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="receipt-container">
          {/* Header */}
          <div className="receipt-header">
            <div className="company-logo text-center">
              <img src="/img/gallery/Frozenwala1.png" />
            </div>
            <div className="receipt-brand">{sellerAddress?.newname || "-"}</div>
            {/* <div className="receipt-company">(MEGASFROZEN GOODS PVT. LTD.)</div> */}
            <div className="receipt-company" style={{width: "300px"}}>{sellerAddress?.address || "-"},</div>
            <div className="receipt-company">{sellerAddress?.city && sellerAddress?.state && sellerAddress?.country && `${sellerAddress?.city}, ${sellerAddress?.state}, ${sellerAddress?.country}` || "-"}</div>
            <div className="receipt-contact">
              Contact: <span>{sellerAddress?.phone || "-"}</span>
            </div>
            {sellerAddress?.gstn && <div className="receipt-contact">
              GSTIN: <span>{sellerAddress?.gstn}</span>
            </div>}
          </div>

          {/* Invoice Details */}
          <div className="invoice-details">
            <div className="invoice-row">
              <span>Inv No: {orderId || "-"}</span>
              <span>Date: {orderDate || "-"}</span>
            </div>
            <div>Customer Name: {name || "-"}</div>
            <div>Contact No: {phone || "-"}</div>
          </div>

          {/* Items Table */}
          <div className="items-table">
            {/* Table Header */}
            <div className="table-header">
              <div className="col-product">Product Name</div>
              <div className="col-rate">Rate</div>
              <div className="col-gst">GST %</div>
              <div className="col-qty">Qty</div>
              <div className="col-amount">Amount</div>
            </div>

            {/* Table Body */}
            {products.map((product, index) => (
              <div key={index} className="table-row">
                <div className="col-product">{product.name}</div>
                <div className="col-rate">₹{product.item_old_price.toFixed(2)}</div>
                <div className="col-rate">₹{product.gst_price.toFixed(2)}</div>
                <div className="col-qty">{product.item_quantity.toFixed(2)}</div>
                <div className="col-amount">₹{product.product_order_price.toFixed(2)}</div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="totals-section">
            <div className="total-row">
              <span>Total Qty: {totalQuantity?.toFixed(2)}</span>
              <span>Total: ₹{finalTotal?.toFixed(2)}</span>
            </div>
            <div className="final-total-row">
              {delivery > 0 && <div>Delivery charges: ₹{delivery?.toFixed(2)}</div>}
              {wallet > 0 && <div>Wallet use: ₹{wallet?.toFixed(2)}</div>}
              {discount > 0 && <div>Coupon Discount: ₹{discount?.toFixed(2)}</div>}
              <div>Total saved: ₹{(totalSaved).toFixed(2)}</div>
            </div>
            <div className="total-main">Total Pay: ₹{totalPrice?.toFixed(2)}</div>
          </div>

          {/* Tax Information */}
          <div className="tax-section">
            <div className="tax-title">Tax Information</div>
            <div className="tax-table">
              <div className="tax-header">
                <div className="tax-col">Taxable</div>
                <div className="tax-col">CGST</div>
                <div className="tax-col">SGST</div>
                <div className="tax-col">Total GST</div>
              </div>
              <div className="tax-row">
                <div className="tax-col">₹{taxableAmount.toFixed(2) || 0}</div>
                <div className="tax-col">₹{(totalGstAmount / 2).toFixed(2) || 0}</div>
                <div className="tax-col">₹{(totalGstAmount / 2).toFixed(2) || 0}</div>
                <div className="tax-col">₹{totalGstAmount.toFixed(2) || 0}</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      <motion.div id="generateInvoice" className="btn-container" whileHover={{ scale: 1.05 }}>
        <button onClick={generatePDF}>Generate Invoice</button>
      </motion.div>
    </div>
  );
};

export default OrderDetails;
