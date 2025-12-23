import React, { useState } from 'react';
import Menu from './Menu';
import Product from './Product';
import Popular from './Popular';
import DealsOfTheDay from './DealsOfTheDay.jsx';
import Recommended from './Recommended.jsx';
import Slider from "react-slick";

function ParentComponent({refRestCart,uid, advertisements, loadingAds, adError, adSettings}) {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };
  const access = localStorage.getItem("access_token");

  return (
    <div>
   {/* {access && <Recommended refreshCart={refRestCart} access={access} uid={uid}/>}   
   {access && <DealsOfTheDay refreshCart={refRestCart} access={access} uid={uid}/>}   
   {access && <Popular refreshCart={refRestCart} access={access} uid={uid}/>}    */}
  <Recommended refreshCart={refRestCart}  uid={uid}/>  
  <DealsOfTheDay refreshCart={refRestCart}  uid={uid}/>  
  <Popular refreshCart={refRestCart}  uid={uid}/> 
  {advertisements.length > 0 && (
            <div className="container" style={{width:"100%", maxWidth:"100%"}}>
              <div className="row justify-content-center" style={{width:"100%"}}>
                <div className="col-12 col-lg-10 col-xl-8" style={{width:"100%"}}>
                 
                  {loadingAds ? (
                    <div className="text-center py-3">
                      <div
                        className="spinner-border spinner-border-sm text-secondary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading ads...</span>
                      </div>
                    </div>
                  ) : adError ? (
                    <div className="alert alert-warning text-center" role="alert">
                      {adError}
                    </div>
                  ) : (
                    <div className="advertisement-slider-container" style={{width:"100%"}}>
                      <Slider {...adSettings}>
                        {advertisements.map((ad) => (
                          <div key={ad.id} className="px-2"style={{width:"100%"}}>
                            <div className="ad-slide" style={{width:"100%"}}>
                              <img
                                src={ad.image}
                                alt={ad.title || "Advertisement"}
                                className="img-fluid rounded"
                                style={{
                                  height: "300px",
                                  objectFit: "cover",
                                  width: "100%",
                                  borderRadius: "10px",
                                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                                }}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "/img/gallery/default-ad.jpg";
                                }}
                              />
                            
                            </div>
                          </div>
                        ))}
                      </Slider>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
      {/* <Menu onSelectCategory={handleCategorySelect} access={access} uid={uid}/> */}
      <Product categoryId={selectedCategoryId} refreshCart={refRestCart}  uid={uid} />
    </div>
  );
}

export default ParentComponent;