// FullScreenOverlay.jsx
import React from "react";
import "./Overlay.css"; // Import the CSS file for styling

const FullScreenOverlay = ({ show, onClose, onSignup }) => {
  if (!show) return null;
onSignup = () => {
    window.location.href = "/signup";
  };

  return (
     <div className="signupcard-overlay-wrapper">
      <div className="signupcard-overlay-backdrop" onClick={onClose}></div>

      <div className="signupcard-overlay-card">
        <button className="signupcard-overlay-close" onClick={onClose}>
          ✕
        </button>
        <h2 className="signupcard-overlay-title">Join Us Today!</h2>
        <p className="signupcard-overlay-text">
          Sign up now to see our amazing product and get exclusive access to offers and updates.
        </p>
        <button className="signupcard-overlay-button" onClick={onSignup}>
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default FullScreenOverlay;
