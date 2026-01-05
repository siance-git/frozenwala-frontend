import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../Pages/Utills/Api';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [itemsPage, setItemsPage] = useState(1);

  const toggleWishlist = async (item) => {
    try{
        setWishlistLoading(true);
        const accessToken = localStorage.getItem("access_token");

        if (accessToken){
            const response = await api.post('api/wishlist/', {
                item_id: item.id
            });

            if (!wishlist.some(wishlistItem => wishlistItem && wishlistItem.item && wishlistItem.item.id === item.id)) {
                setWishlist(prev => [...prev, { item }]);
                //   toast.success("Item added to wishlist");
            }
            else{
                setWishlist(prev => prev.filter(wishlistItem => wishlistItem && wishlistItem.item && wishlistItem.item.id !== item.id));
                // toast.info("Item removed from wishlist");
            }
        }
        else{
            // For non-logged-in users, manage wishlist in localStorage
            const savedWishlist = localStorage.getItem("wishlist");
            let localWishlist = savedWishlist ? JSON.parse(savedWishlist) : [];
            const exists = localWishlist.some(wishlistItem => wishlistItem && wishlistItem.item && wishlistItem.item.id === item.id);

            if (exists) {
                localWishlist = localWishlist.filter(wishlistItem => wishlistItem && wishlistItem.item && wishlistItem.item.id !== item.id);
                // toast.info("Item removed from wishlist");
            } else {
                localWishlist.push({ item });
                // toast.success("Item added to wishlist");
            }
            localStorage.setItem("wishlist", JSON.stringify(localWishlist));
            setWishlist(localWishlist);
        }
    }
    catch(err){
        console.error("Error toggling wishlist item:", err);
        // toast.error("An error occurred while updating the wishlist");
    }
    finally{
        setWishlistLoading(false);
    }
  };

  
  const fetchWishlist = async () => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      localStorage.removeItem("wishlist");
      try {
        const wishlistRes = await api.get("api/wishlist/");
        setWishlist(wishlistRes.data);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      }
    }
    else{
        const savedWishlist = localStorage.getItem("wishlist");
        if (savedWishlist) {
            setWishlist(JSON.parse(savedWishlist));
        }
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <WishlistContext.Provider value={{ 
      wishlist, 
      toggleWishlist, 
      wishlistLoading,
      itemsPage,
      setItemsPage
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};