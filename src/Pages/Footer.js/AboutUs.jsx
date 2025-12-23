import React, { useEffect } from 'react';
import Navbar from '../Home/Navbar';
import Footer from '../Home/Footer';

function AboutUs() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <Navbar />
      <section className="py-5 overflow-hidden" id="home">
        <div className="container mt-5" id="dish_list">
          <div className="row h-100">
            <div className="col-lg-8 mx-auto text-center mb-5">
              <h2 className="fw-bold fs-2 fs-lg-4 lh-sm mb-3 text-uppercase">
                About Us
              </h2>
              <p className="text-muted">
                At <strong>Frozenwala</strong>, a brand of <strong>MegasFrozen Goods Pvt. Ltd.</strong>, we are passionate about delivering delicious, high-quality frozen food that makes life easier and tastier. 
                Founded with the vision to bring freshness, convenience, and authentic taste to every kitchen, we specialize in a wide range of frozen snacks, parathas, ready-to-cook kebabs, samosas, spring rolls, and more.
              </p>
              <p className="text-muted">
                Our state-of-the-art facilities follow the highest standards of hygiene and safety, ensuring every product retains its original flavor, nutrition, and freshness. 
                We believe in innovation, consistency, and customer satisfaction — making Frozenwala your trusted partner for quality frozen foods.
              </p>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="row mt-4">
            <div className="col-md-6 mb-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <h4 className="fw-bold mb-3">Our Mission</h4>
                  <p>
                    To serve convenient, hygienic, and flavourful frozen foods to every household, ensuring quality and trust in every bite.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <h4 className="fw-bold mb-3">Our Vision</h4>
                  <p>
                    To be India’s most loved frozen food brand by combining taste, quality, and affordability.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="row mt-5">
            <div className="col-lg-8 mx-auto text-center mb-4">
              <h3 className="fw-bold">Our Team</h3>
              <p className="text-muted">
                Behind every Frozenwala product is a dedicated team that believes in excellence. 
                From food technologists and production experts to marketing professionals and logistics coordinators, our team works together to ensure top-notch quality and timely delivery.
              </p>
            </div>

            <div className="col-md-10 mx-auto">
              <div className="card shadow-sm border-0 mb-4">
                <div className="card-body">
                  <h5 className="fw-bold text-primary">Leadership</h5>
                  <p><strong>Mr. Sarfaraz Batliwala & Mr. Rizwan Nakhwa</strong> – Managing Directors</p>
                  <p>A visionary leadership duo with years of experience in the frozen food industry.</p>
                </div>
              </div>

              <div className="card shadow-sm border-0 mb-4">
                <div className="card-body">
                  <h5 className="fw-bold text-primary">Accounts & Administration</h5>
                  <p><strong>Mr. Abdul Majid</strong> – Cash Counter In-Charge</p>
                  <p>Ensures smooth and accurate financial transactions with transparency and efficiency.</p>
                  <p><strong>Ms. Sumaiya Shaikh</strong> – Accounts Executive</p>
                  <p>Manages company accounts, billing, and financial reporting with precision and reliability.</p>
                </div>
              </div>

              <div className="card shadow-sm border-0 mb-4">
                <div className="card-body">
                  <h5 className="fw-bold text-primary">📦 Stores & Inventory</h5>
                  <p><strong>Mr. Salman Shaikh</strong> – Store Supervisor / Stock In-Charge</p>
                  <p>Oversees stock management, storage, and dispatch operations efficiently.</p>
                  <p><strong>Mr. Zakir Shaikh</strong> – Assistant Store Supervisor</p>
                  <p>Supports warehouse operations and maintains proper inventory flow.</p>
                </div>
              </div>

              <div className="card shadow-sm border-0 mb-4">
                <div className="card-body">
                  <h5 className="fw-bold text-primary">🚚 Dispatch & Billing</h5>
                  <p><strong>Ms. Ganga Gupta</strong> – Dispatches / Orders</p>
                  <p>Ensures accurate wholesale billing and smooth dispatch coordination.</p>
                  <p><strong>Ms. Aarti Chauhan</strong> – Counter Billing Executive</p>
                  <p><strong>Ms. Humaira Shaikh</strong> – Counter Billing Executive</p>
                </div>
              </div>

              <div className="card shadow-sm border-0 mb-5">
                <div className="card-body">
                  <h5 className="fw-bold text-primary">🛍️ Counter Sales Team</h5>
                  <p>
                    Our front-line team ensures customers receive quick service, accurate billing, and a pleasant shopping experience.
                  </p>
                  <ul className="list-unstyled">
                    <li>• Ms. Saba Shaikh</li>
                    <li>• Ms. Rukhsar Khan</li>
                    <li>• Ms. Mehazabeen</li>
                    <li>• Ms. Misba Ansari</li>
                    <li>• Ms. Bushra Saudagar</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
      <Footer />
    </div>
  );
}

export default AboutUs;
