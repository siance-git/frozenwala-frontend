import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

const UserQRCode = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [copied, setCopied] = useState(false);
  const qrCanvasRef = useRef(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("user_id");
      const userName = localStorage.getItem("user_name") || "User";
      
      if (!userId) {
        throw new Error("User ID not found");
      }

      setUserData({
        id: userId,
        name: userName,
        referralCode: `REF${userId}${Math.random().toString(36).substr(2, 5).toUpperCase()}`
      });

      // Generate QR code using qr-server API
      const referralUrl = `${window.location.origin}?referral=${userId}`;
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(referralUrl)}`;
      setQrCodeUrl(qrUrl);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUserData({
        id: "1",
        name: "User",
        referralCode: "REF0000000"
      });
      // Fallback QR code
      const referralUrl = `${window.location.origin}?referral=1`;
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(referralUrl)}`;
      setQrCodeUrl(qrUrl);
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;

    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = `${userData?.name || "profile"}-qr-code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyReferralCode = () => {
    if (userData?.referralCode) {
      navigator.clipboard.writeText(userData.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}?referral=${userData?.id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "400px"
      }}>
        <div style={{
          width: "50px",
          height: "50px",
          border: "4px solid #f3f3f3",
          borderTop: "4px solid #FF6B35",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }}>
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "100%", margin: "0 auto" }}>
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
        flexWrap: "wrap",
        gap: "20px"
      }}>
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
          Your Profile QR Code
        </h1>
      </div>

      {/* Main Content */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "30px",
        marginBottom: "30px"
      }}>
        {/* QR Code Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            backgroundColor: "#fff",
            borderRadius: "16px",
            padding: "30px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <div style={{
            fontSize: "14px",
            fontWeight: "600",
            color: "#666",
            marginBottom: "20px"
          }}>
            Share Your Profile
          </div>

          {qrCodeUrl && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              style={{
                width: "300px",
                height: "300px",
                borderRadius: "12px",
                border: "3px solid #FF6B35",
                padding: "10px",
                backgroundColor: "#fff",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden"
              }}
            >
              <img
                src={qrCodeUrl}
                alt="User QR Code"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain"
                }}
              />
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={downloadQRCode}
            style={{
              backgroundColor: "#FF6B35",
              color: "#fff",
              border: "none",
              padding: "14px 20px",
              borderRadius: "10px",
              fontWeight: "600",
              fontSize: "16px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              boxShadow: "0 4px 12px rgba(255, 107, 53, 0.3)",
              transition: "all 0.3s ease"
            }}
          >
            Download Your Profile QR Code
          </motion.button>
        </motion.div>
      </div>

      {/* How It Works Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          backgroundColor: "#fff",
          borderRadius: "16px",
          padding: "30px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <h3 style={{
          fontSize: "18px",
          fontWeight: "700",
          color: "#333",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <span style={{ fontSize: "24px" }}>📱</span>
          How It Works
        </h3>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px"
        }}>
          <div style={{
            padding: "20px",
            backgroundColor: "#F5F5F5",
            borderRadius: "12px",
            borderLeft: "4px solid #FF6B35"
          }}>
            <h4 style={{
              fontSize: "16px",
              fontWeight: "700",
              color: "#FF6B35",
              marginBottom: "10px"
            }}>
              1. Share Your QR Code
            </h4>
            <p style={{
              fontSize: "14px",
              color: "#666",
              margin: "0",
              lineHeight: "1.6"
            }}>
              Download and share your QR code with friends and family on social media, messaging apps, or via email.
            </p>
          </div>

          <div style={{
            padding: "20px",
            backgroundColor: "#F5F5F5",
            borderRadius: "12px",
            borderLeft: "4px solid #2196F3"
          }}>
            <h4 style={{
              fontSize: "16px",
              fontWeight: "700",
              color: "#2196F3",
              marginBottom: "10px"
            }}>
              2. Friends Scan The Code
            </h4>
            <p style={{
              fontSize: "14px",
              color: "#666",
              margin: "0",
              lineHeight: "1.6"
            }}>
              When your friends scan the QR code, they will be redirected to your referral link with a unique referral code.
            </p>
          </div>

          <div style={{
            padding: "20px",
            backgroundColor: "#F5F5F5",
            borderRadius: "12px",
            borderLeft: "4px solid #4CAF50"
          }}>
            <h4 style={{
              fontSize: "16px",
              fontWeight: "700",
              color: "#4CAF50",
              marginBottom: "10px"
            }}>
              3. Get Rewards
            </h4>
            <p style={{
              fontSize: "14px",
              color: "#666",
              margin: "0",
              lineHeight: "1.6"
            }}>
              Earn rewards and credits when your friends sign up using your referral code. The more friends you refer, the more you earn!
            </p>
          </div>
        </div>
      </motion.div>

      {/* Benefits Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{
          backgroundColor: "linear-gradient(135deg, #FF6B35 0%, #FF8E53 100%)",
          backgroundImage: "linear-gradient(135deg, #FF6B35 0%, #FF8E53 100%)",
          borderRadius: "16px",
          padding: "30px",
          boxShadow: "0 4px 20px rgba(255, 107, 53, 0.2)",
          marginTop: "30px",
          color: "#fff"
        }}
      >
        <h3 style={{
          fontSize: "18px",
          fontWeight: "700",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <span style={{ fontSize: "24px" }}>🎁</span>
          Benefits of Referral
        </h3>

        <ul style={{
          listStyle: "none",
          padding: "0",
          margin: "0",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "15px"
        }}>
          <li style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "14px"
          }}>
            <span style={{ fontSize: "18px" }}>✓</span>
            Earn wallet credits for each successful referral
          </li>
          <li style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "14px"
          }}>
            <span style={{ fontSize: "18px" }}>✓</span>
            Help your friends get started
          </li>
          <li style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "14px"
          }}>
            <span style={{ fontSize: "18px" }}>✓</span>
            Easy sharing with QR code
          </li>
          <li style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "14px"
          }}>
            <span style={{ fontSize: "18px" }}>✓</span>
            Track your referrals in wallet
          </li>
        </ul>
      </motion.div>
    </div>
  );
};

export default UserQRCode;
