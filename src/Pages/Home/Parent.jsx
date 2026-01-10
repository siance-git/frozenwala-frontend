import React, { useEffect, useState } from 'react';
import Product from './Product';
import Popular from './Popular';
import DealsOfTheDay from './DealsOfTheDay.jsx';
import Recommended from './Recommended.jsx';
import Slider from "react-slick";
import axios from 'axios';
import { useWishlist } from "../../contexts/WishlistContext";

function ParentComponent({refRestCart,uid, advertisements, loadingAds, adError, adSettings}) {
  const [categoryCounts, setCategoryCounts] = useState({});
  const { products, setProducts } = useWishlist();

  const getProducts = async (categoryId) => {
    try {
      const response = await axios.get(
        `https://backend.frozenwala.com/api/auth/category/product-all/?category_id=${categoryId}`
      );
      setProducts(response.data);
      setCategoryCounts((prev) => ({
        ...prev,
        [categoryId]: response.data.length,
      }));
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const getAllProducts = async () => {
    try {
      const response = await axios.get(
        `https://backend.frozenwala.com/api/auth/product-all/`
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching all products:", error);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <div>
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
      <Product refreshCart={refRestCart} getProducts={getProducts} getAllProducts={getAllProducts} products={products} categoryCounts={categoryCounts} />
    </div>
  );
}

export default ParentComponent;