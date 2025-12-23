import React from "react";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import "./HowItWorks.css";

const steps = [
  {
    img: "/img/gallery/location.png",
    title: "Select location",
    text: "Choose the location where your food will be delivered.",
  },
  {
    img: "/img/gallery/order.png",
    title: "Choose order",
    text: "Check over hundreds of menus to pick your favorite food.",
  },
  {
    img: "/img/gallery/pay.png",
    title: "Pay advanced",
    text: "It's quick, safe, and simple. Select several methods of payment.",
  },
  {
    img: "/img/gallery/meals.png",
    title: "Enjoy meals",
    text: "Food is made and delivered directly to your home.",
  },
];

const HowItWorks = () => {
  return (
    <section className="how-it-works-section py-5">
      <div className="container text-center">
        {/* ✅ Animated heading */}
        <motion.h5
          className="fw-bold text-danger fs-3 fs-lg-5 lh-sm mb-5"
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          How does it work
        </motion.h5>

        <div className="row justify-content-center">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="col-12 col-sm-6 col-md-3 mb-4 d-flex justify-content-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="how-card text-center p-4"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <img
                  className="shadow-icon mb-3"
                  src={step.img}
                  alt={step.title}
                  height="100"
                />
                <h5 className="fw-bold mt-3">{step.title}</h5>
                <p className="text-muted mb-0">{step.text}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
