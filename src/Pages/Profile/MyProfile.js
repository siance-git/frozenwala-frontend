import React, { useState, useEffect } from "react";
import Api from "../Utills/Api";
import { motion } from "framer-motion";

const MyProfile = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [photo, setPhoto] = useState("");
  const referral_code = localStorage.getItem("referral_code");
  const referralLink = referral_code
  ? ` https://frozenwala.com/signup?referral_code=${referral_code}`
  : "No referral code assigned";

  useEffect(() => {
    const getProfile = async () => {
      const uid = localStorage.getItem("user_id");
      
      try {
        const response = await Api.get(`api/profile/?user_id=${uid}`);
        //  localStorage.setItem("wallet", response.data.walet);
        setPhoto(response.data.profile_photo);
        setEmail(response.data.email);
        setName(response.data.name);
        setPhone(response.data.phone_number);
        setLocation(response.data.bio);
      } catch (error) {
        console.log("Error fetching profile:", error);
      }
    };
    getProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const uid = localStorage.getItem("user_id");
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("user_id", uid);
      formData.append("email", email);
      formData.append("phone_number", phone);
      formData.append("bio", location);
      if (profileImage) formData.append("profile_photo", profileImage);

      const response = await Api.post(`api/profile/`, formData);
      console.log("Profile updated:", response.data);
      window.location.reload();
    } catch (error) {
      console.log("Error updating profile:", error.response?.data);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "20px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: "100%",
          maxWidth: "800px",
          padding: "30px",
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#F17228",
            marginBottom: "20px",
            fontSize: "1.8rem",
            fontWeight: "bold",
          }}
        >
          My Profile
        </h2>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <img
            src={profileImage ? URL.createObjectURL(profileImage) : photo || "/img/gallery/akash.jpeg"}
            alt="Profile"
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid #F17228",
              transition: "0.3s",
            }}
          />
        </div>
        {/* Referral Link Section */}
<div style={{ textAlign: "center", marginBottom: "20px" }}>
  <label
    style={{
      fontWeight: "600",
      color: "#F17228",
      marginBottom: "6px",
      display: "block",
      fontSize: "1rem",
    }}
  >
    Your Referral Link:
  </label>

  <div
    style={{
      display: "flex",
      gap: "8px",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <input
      type="text"
      value={referralLink}
      readOnly
      style={{
        width: "70%",
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #ddd",
        textAlign: "center",
        fontSize: "0.9rem",
        background: "#fff",
      }}
    />

    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => {
        navigator.clipboard.writeText(referralLink);
        alert("Referral link copied ✅");
      }}
      style={{
        background: "#F17228",
        border: "none",
        padding: "10px 14px",
        borderRadius: "8px",
        cursor: "pointer",
        color: "#fff",
        fontSize: "0.9rem",
        fontWeight: "600",
      }}
    >
      Copy Link
    </motion.button>
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => {
        navigator.clipboard.writeText(referral_code);
        alert("Referral code copied ✅");
      }}
      style={{
        background: "#F17228",
        border: "none",
        padding: "10px 14px",
        borderRadius: "8px",
        cursor: "pointer",
        color: "#fff",
        fontSize: "0.9rem",
        fontWeight: "600",
      }}
    >
      Copy Code
    </motion.button>
  </div>
</div>


        <form onSubmit={handleSubmit}>
          {[
            { label: "Name", value: name, setter: setName, type: "text" },
            { label: "Email", value: email, setter: setEmail, type: "email" },
            { label: "Phone", value: phone, setter: setPhone, type: "text", disabled: true },
            { label: "Location", value: location, setter: setLocation, type: "text" },
          ].map((field) => (
            <motion.div
              key={field.label}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              style={{ marginBottom: "15px" }}
            >
              <label
                style={{
                  fontWeight: "600",
                  color: "#F17228",
                  marginBottom: "5px",
                  display: "block",
                  fontSize: "1rem",
                }}
              >
                {field.label}:
              </label>
              <input
                type={field.type}
                value={field.value}
                disabled={field.disabled}
                onChange={(e) => field.setter(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  fontSize: "1rem",
                  transition: "0.3s",
                }}
              />
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            style={{ marginBottom: "20px" }}
          >
            <label
              style={{
                fontWeight: "600",
                color: "#F17228",
                marginBottom: "5px",
                display: "block",
                fontSize: "1rem",
              }}
            >
              Profile Picture:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfileImage(e.target.files[0])}
            />
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "#e65c00" }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "1rem",
              fontWeight: "600",
              backgroundColor: "#F17228",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
          >
            Save
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default MyProfile;
