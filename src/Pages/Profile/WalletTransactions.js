// WalletTransactions.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import Api from "../Utills/Api";

const WalletTransactions = ({fetchMyWalletData, wallet}) => {
  const navigate = useNavigate();
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [benefits, setBenefits] = useState([]);
  const [benefitLoading, setBenefitLoading] = useState(false);
  const [selectedBenefit, setSelectedBenefit] = useState(null);
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });
  const [error, setError] = useState(null);

  const getWalletBenefits = async () => {
    try {
      setBenefitLoading(true);
      const res = await Api.get("api/wallet-benefits/");
      if (res.data.status) {
        setBenefits(res.data.data || []);
      }
    } catch (e) {
      console.log("Error loading benefits", e);
    } finally {
      setBenefitLoading(false);
    }
  };

  useEffect(() => {
    getWalletBenefits();
  }, []);
  

  // Fetch wallet transactions from API
  const getWalletTransactions = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const userId = localStorage.getItem("user_id");
      const response = await Api.get(
        `api/wallet/transactions/?user_id=${userId}&page=${page}&limit=${pagination.limit}`
      );
      
      console.log("Response from wallet transactions: ", response.data);
      
      if (response.data.status) {
        setTransactions(response.data.data || []);
        setPagination({
          page: response.data.page,
          limit: response.data.limit,
          total: response.data.total,
          pages: response.data.pages
        });
      } else {
        setError("Failed to fetch transactions");
      }
    } catch (error) {
      console.log("Error fetching wallet transactions:", error);
      setError("Unable to load transactions. Please try again.");
      
      // Fallback to mock data for demonstration
      setTransactions(mockTransactions);
      setPagination({
        page: 1,
        limit: 10,
        total: 2,
        pages: 1
      });
    } finally {
      setLoading(false);
    }
  };

  // Mock data for demonstration (based on your API response)
  const mockTransactions = [
    {
      id: 12,
      transaction_id: 168,
      opening_bal: 133.0,
      credit_bal: 0.0,
      debit_bal: 100.0,
      closing_bal: 33.0,
      transaction_type: "Order Payment",
      created_at: "2025-12-08 08:38:54"
    },
    {
      id: 11,
      transaction_id: 163,
      opening_bal: 233.0,
      credit_bal: 0.0,
      debit_bal: 100.0,
      closing_bal: 133.0,
      transaction_type: "Wallet Top-up",
      created_at: "2025-12-07 14:22:10"
    },
    {
      id: 10,
      transaction_id: 159,
      opening_bal: 333.0,
      credit_bal: 100.0,
      debit_bal: 0.0,
      closing_bal: 433.0,
      transaction_type: "Refund",
      created_at: "2025-12-06 11:15:30"
    },
    {
      id: 9,
      transaction_id: 155,
      opening_bal: 233.0,
      credit_bal: 100.0,
      debit_bal: 0.0,
      closing_bal: 333.0,
      transaction_type: "Wallet Top-up",
      created_at: "2025-12-05 16:45:22"
    },
    {
      id: 8,
      transaction_id: 152,
      opening_bal: 183.0,
      credit_bal: 0.0,
      debit_bal: 50.0,
      closing_bal: 133.0,
      transaction_type: "Order Payment",
      created_at: "2025-12-04 09:30:15"
    }
  ];

  useEffect(() => {
    getWalletTransactions();
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      getWalletTransactions(newPage);
    }
  };

  const getTransactionTypeDetails = (type) => {
    switch (type) {
      case "Order Payment":
        return { 
          text: "Order Payment", 
          color: "#F44336",
          icon: "🛒"
        };
      case "Wallet Top-up":
        return { 
          text: "Wallet Top-up", 
          color: "#4CAF50",
          icon: "💰"
        };
      case "Refund":
        return { 
          text: "Refund", 
          color: "#2196F3",
          icon: "↩️"
        };
      default:
        return { 
          text: type, 
          color: "#9C27B0",
          icon: "📝"
        };
    }
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }) + ' • ' + date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate wallet summary
  const calculateSummary = () => {
    const totalCredits = transactions.reduce((sum, t) => sum + t.credit_bal, 0);
    const totalDebits = transactions.reduce((sum, t) => sum + t.debit_bal, 0);
    const currentBalance = transactions.length > 0 ? transactions[0].closing_bal : 0;
    
    return { totalCredits, totalDebits, currentBalance };
  };

  const summary = calculateSummary();

  const handleAddMoney = async () => {
    let addAmount = 0;
    try{
      addAmount = parseInt(amount);
    }
    catch(error){
      console.error("Invalid amount")
      alert("Invalid amount!")
      return;
    }

    const selected_benefit = benefits.filter((b) => b.add_amount === addAmount)[0];

    try {
      const response = await Api.post("api/wallet-order/", { 
        user_id: localStorage.getItem("user_id"), 
        amount: addAmount
      });

      if (!response.data.status) return alert("Failed to create order");

      const options = {
        key: "rzp_test_enEwAJBwuY35MP",
        amount: response.data.amount,
        currency: "INR",
        name: "Frozenwala",
        description: "Wallet Top-up",
        order_id: response.data.order_id,
        handler: async function (paymentResult) {
          console.log("paymentResult>>>", paymentResult);
          // This is called on successful payment
          try {
            console.log("selected_benefit>>>>>", selected_benefit)
            const verify = await Api.post("api/verify-wallet-order/", {
              razorpay_payment_id: paymentResult.razorpay_payment_id,
              razorpay_order_id: paymentResult.razorpay_order_id,
              razorpay_signature: paymentResult.razorpay_signature,
              user_id: localStorage.getItem("user_id"),
              amount: addAmount,
              benefit_id: selected_benefit?.id || null,
            });

            if (verify.data.status) {
              alert("Wallet credited successfully!");
              getWalletTransactions(); // refresh balance
              setAmount("");
              setShowAddMoney(false);
              fetchMyWalletData()
            } else {
              alert("Payment failed, please try again.");
            }
          } catch (err) {
            console.error(err);
            alert("Payment failed, please try again.");
          }
        },
        prefill: {
          name: "Test User",
          email: "test@example.com"
        },
        theme: {
          color: "#FF6B35"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment failed, please try again.");
    }
  };

  return (
    <div style={{ 
      backgroundColor: "#f5f5f5", 
      minHeight: "100vh", 
      padding: "20px",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: "25px",
        }}
      >
        {/* <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            border: "2px solid #FF6B35",
            padding: "10px 20px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 2px 8px rgba(255, 107, 53, 0.1)"
          }}
        >
          ← Go Back
        </motion.button> */}
        
        <h1 style={{ 
          flex: 1, 
          textAlign: "center", 
          fontSize: "1.8rem", 
          margin: "10px 0",
          fontWeight: "700",
          background: "linear-gradient(135deg, #FF6B35 0%, #FF8E53 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          Wallet Transactions
        </h1>
        
        <div style={{ width: "100px" }}></div>
      </div>

      {/* Wallet Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginBottom: "30px"
        }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddMoney(true)}
          style={{
            background: "linear-gradient(135deg, #4CAF50, #66BB6A)",
            color: "#fff",
            border: "none",
            padding: "12px 20px",
            borderRadius: "14px",
            fontWeight: "700",
            cursor: "pointer",
            boxShadow: "0 6px 20px rgba(76,175,80,0.35)"
          }}
        >
          + Add Money
        </motion.button>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            backgroundColor: "#fff",
            borderRadius: "16px",
            padding: "20px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            borderLeft: "5px solid #4CAF50"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              backgroundColor: "#E8F5E9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "12px"
            }}>
              <span style={{ fontSize: "20px" }}>💰</span>
            </div>
            <span style={{ fontSize: "14px", color: "#666" }}>Current Balance</span>
          </div>
          <h3 style={{ fontSize: "28px", fontWeight: "700", color: "#2E7D32", margin: "0" }}>
            ₹{wallet}
          </h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            backgroundColor: "#fff",
            borderRadius: "16px",
            padding: "20px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            borderLeft: "5px solid #2196F3"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              backgroundColor: "#E3F2FD",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "12px"
            }}>
              <span style={{ fontSize: "20px" }}>⬆️</span>
            </div>
            <span style={{ fontSize: "14px", color: "#666" }}>Total Credits</span>
          </div>
          <h3 style={{ fontSize: "28px", fontWeight: "700", color: "#1565C0", margin: "0" }}>
            {formatCurrency(summary.totalCredits)}
          </h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            backgroundColor: "#fff",
            borderRadius: "16px",
            padding: "20px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            borderLeft: "5px solid #F44336"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              backgroundColor: "#FFEBEE",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "12px"
            }}>
              <span style={{ fontSize: "20px" }}>⬇️</span>
            </div>
            <span style={{ fontSize: "14px", color: "#666" }}>Total Debits</span>
          </div>
          <h3 style={{ fontSize: "28px", fontWeight: "700", color: "#C62828", margin: "0" }}>
            {formatCurrency(summary.totalDebits)}
          </h3>
        </motion.div>
      </div>

      {/* Transactions List */}
      {loading ? (
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px"
        }}>
          <div style={{
            width: "50px",
            height: "50px",
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #FF6B35",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }}></div>
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      ) : error ? (
        <div
          style={{
            textAlign: "center",
            marginTop: "50px",
            padding: "40px",
            backgroundColor: "#fff",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
          }}
        >
          <div style={{ fontSize: "60px", marginBottom: "20px" }}>⚠️</div>
          <h3 style={{ fontSize: "20px", color: "#F44336", marginBottom: "10px" }}>
            {error}
          </h3>
          <p style={{ color: "#666", marginBottom: "20px" }}>
            Please check your connection and try again
          </p>
          <button
            onClick={() => getWalletTransactions()}
            style={{
              backgroundColor: "#FF6B35",
              color: "#fff",
              border: "none",
              padding: "12px 24px",
              borderRadius: "10px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Retry
          </button>
        </div>
      ) : transactions.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            marginTop: "50px",
            padding: "40px",
            backgroundColor: "#fff",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
          }}
        >
          <div style={{ fontSize: "60px", marginBottom: "20px" }}>💳</div>
          <h3 style={{ fontSize: "20px", color: "#666", marginBottom: "10px" }}>
            No transactions yet
          </h3>
          <p style={{ color: "#888" }}>
            Your wallet transactions will appear here
          </p>
        </div>
      ) : (
        <>
          <div style={{
            backgroundColor: "#fff",
            borderRadius: "16px",
            padding: "20px",
            marginBottom: "20px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
          }}>
            <h3 style={{ 
              fontSize: "18px", 
              fontWeight: "600", 
              color: "#333",
              marginBottom: "20px"
            }}>
              Recent Transactions ({transactions.length})
            </h3>
            
            <AnimatePresence>
              {transactions.map((transaction, index) => {
                const { text: typeText, color, icon } = getTransactionTypeDetails(transaction.transaction_type);
                
                return (
                  <motion.div
                    key={transaction.id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ 
                      scale: 1.01, 
                      boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                      backgroundColor: "#fafafa"
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "18px",
                      borderBottom: index < transactions.length - 1 ? "1px solid #eee" : "none",
                      cursor: "pointer",
                      borderRadius: "12px",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "12px",
                        backgroundColor: color + "20",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "20px"
                      }}>
                        {icon}
                      </div>
                      
                      <div>
                        <div style={{ 
                          fontSize: "16px", 
                          fontWeight: "600", 
                          color: "#333",
                          marginBottom: "4px"
                        }}>
                          {typeText}
                        </div>
                        <div style={{ 
                          fontSize: "12px", 
                          color: "#888",
                          marginBottom: "4px"
                        }}>
                          ID: {transaction.transaction_id}
                        </div>
                        <div style={{ fontSize: "12px", color: "#aaa" }}>
                          {formatDate(transaction.created_at)}
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ textAlign: "right" }}>
                      <div style={{
                        fontSize: "18px",
                        fontWeight: "700",
                        color: transaction.credit_bal > 0 ? "#4CAF50" : "#F44336",
                        marginBottom: "4px"
                      }}>
                        {transaction.credit_bal > 0 ? "+" : "-"}
                        {formatCurrency(transaction.credit_bal > 0 ? transaction.credit_bal : transaction.debit_bal)}
                      </div>
                      <div style={{ 
                        fontSize: "12px", 
                        color: "#666",
                        display: "flex",
                        gap: "8px"
                      }}>
                        <span>Opening: {formatCurrency(transaction.opening_bal)}</span>
                        <span>•</span>
                        <span>Closing: {formatCurrency(transaction.closing_bal)}</span>
                        {transaction.wallet_benefit && <span>Extra: {formatCurrency(transaction.wallet_benefit)}</span>}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              marginTop: "30px"
            }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                style={{
                  backgroundColor: pagination.page === 1 ? "#f0f0f0" : "#fff",
                  color: pagination.page === 1 ? "#aaa" : "#333",
                  border: "1px solid #ddd",
                  padding: "10px 20px",
                  borderRadius: "10px",
                  cursor: pagination.page === 1 ? "not-allowed" : "pointer",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                ← Previous
              </motion.button>
              
              <div style={{
                display: "flex",
                gap: "5px"
              }}>
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(pagination.pages - 4, pagination.page - 2)) + i;
                  if (pageNum > pagination.pages) return null;
                  
                  return (
                    <motion.button
                      key={pageNum}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePageChange(pageNum)}
                      style={{
                        backgroundColor: pagination.page === pageNum ? "#FF6B35" : "#fff",
                        color: pagination.page === pageNum ? "#fff" : "#333",
                        border: "1px solid #ddd",
                        width: "40px",
                        height: "40px",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontWeight: "600"
                      }}
                    >
                      {pageNum}
                    </motion.button>
                  );
                })}
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                style={{
                  backgroundColor: pagination.page === pagination.pages ? "#f0f0f0" : "#fff",
                  color: pagination.page === pagination.pages ? "#aaa" : "#333",
                  border: "1px solid #ddd",
                  padding: "10px 20px",
                  borderRadius: "10px",
                  cursor: pagination.page === pagination.pages ? "not-allowed" : "pointer",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                Next →
              </motion.button>
            </div>
          )}
        </>
      )}

      <AnimatePresence>
        {showAddMoney && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 120 }}
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              background: "#fff",
              borderTopLeftRadius: "24px",
              borderTopRightRadius: "24px",
              padding: "24px",
              boxShadow: "0 -10px 40px rgba(0,0,0,0.15)",
              zIndex: 999
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "700" }}>Add Money</h3>
              <motion.button
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowAddMoney(false)}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  backgroundColor: "#f5f5f5",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <FiX size={20} color="#333" />
              </motion.button>
            </div>

            {/* Amount Input */}
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{
                width: "100%",
                marginTop: "16px",
                padding: "14px",
                fontSize: "18px",
                borderRadius: "12px",
                border: "2px solid #eee",
                outline: "none"
              }}
            />

            {/* Wallet Benefits */}
            <h4 style={{ margin: "20px 0 10px", fontWeight: "600" }}>
              Best Offers for You 🎉
            </h4>

            <div style={{ display: "grid", gap: "12px", maxHeight: "260px", overflowY: "auto", overflowX: "hidden" }}>
              {benefits && benefits.length > 0 ? benefits.map((b) => (
                <motion.div
                  key={b.id}
                  // whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedBenefit(b);
                    setAmount(b.add_amount);
                  }}
                  style={{
                    padding: "14px",
                    borderRadius: "14px",
                    border: selectedBenefit?.id === b.id
                      ? "2px solid #4CAF50"
                      : "1px solid #eee",
                    background: "#f9f9f9",
                    cursor: "pointer"
                  }}
                >
                  <div style={{ fontWeight: "700" }}>
                    Add ₹{b.add_amount} & get ₹{b.benefit_amount} bonus
                  </div>

                  {b.influencer && (
                    <div style={{ fontSize: "12px", color: "#FF6B35" }}>
                      Influencer Offer • Valid {b.influencer_valid_days} days
                    </div>
                  )}

                  <div
                    style={{ fontSize: "12px", color: "#777" }}
                    dangerouslySetInnerHTML={{ __html: b.description }}
                  />
                </motion.div>
              ))
              :
              <div className="text-center">No offers found</div>
            }
            </div>

            {/* Proceed Button */}
            <motion.button
              // whileHover={{ scale: 1.05 }}
              onClick={handleAddMoney}
              whileTap={{ scale: 0.95 }}
              disabled={!amount}
              style={{
                width: "100%",
                marginTop: "20px",
                padding: "16px",
                fontSize: "16px",
                fontWeight: "700",
                borderRadius: "14px",
                background: "#FF6B35",
                color: "#fff",
                border: "none",
                cursor: "pointer"
              }}
            >
              Proceed to Pay ₹{amount}
            </motion.button>
          </motion.div>
        )}
        </AnimatePresence>
    </div>
  );
};

export default WalletTransactions;