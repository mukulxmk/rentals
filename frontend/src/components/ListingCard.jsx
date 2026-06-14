import { useRef, useState, useContext } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import toast from "react-hot-toast";
import API from "../api";
import { AuthContext } from "../context/AuthContext";

import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ListingCard({ listing }) {
  const cardRef = useRef(null);
  const imgRef = useRef(null);
  const wholeCardRef = useRef(null);


  const { currUser } = useContext(AuthContext);
  const [likeCount, setLikeCount] = useState(listing.likes || 0);
  const [isLiked, setIsLiked] = useState(listing.likedBy?.includes(currUser?._id) || false);


  const handleMouseEnter = () => {

    gsap.to(wholeCardRef.current, {
      scale: 1.08,
      duration: 0.8,
      ease: "power4.out",
      overwrite: "auto"
    });


    gsap.to(imgRef.current, {
      scale: 1.15,
      duration: 0.01,
      ease: "power4.out",
      overwrite: "auto"
    });
  };


  const handleMouseLeave = () => {

    gsap.to(wholeCardRef.current, {
      scale: 1,
      duration: 0.8,
      ease: "power4.out",
      overwrite: "auto"
    });


    gsap.to(imgRef.current, {
      scale: 1,
      duration: 0.01,
      rotation: 0,
      ease: "power4.out",
      overwrite: "auto"
    });
  };
  const getOptimizedUrl = (url) => {
    if (!url) return "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60";

    
    if (url.includes("images.unsplash.com")) {
      return `${url}&w=400&q=70`;
    }

 
    if (url.includes("cloudinary.com") && url.includes("/upload/")) {
      return url.replace("/upload/", "/upload/w_300,f_auto,q_auto/");
    }

    return url;
  };

  return (
    <div ref={cardRef} className="relative group cursor-pointer">
      <div className="absolute top-3 right-3 z-10 flex flex-col items-center">
        <button
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!currUser) {
              return toast.error("Please login to like!");
            }

            const newLikedState = !isLiked;
            setIsLiked(newLikedState);
            setLikeCount(prev => newLikedState ? prev + 1 : prev - 1);

            try {
              const res = await API.post(`/listings/${listing._id}/like`);
              setLikeCount(res.data.likes);
              setIsLiked(res.data.isLiked);
            } catch (err) {
              console.error("Failed to like", err);

              setIsLiked(!newLikedState);
              setLikeCount(prev => !newLikedState ? prev + 1 : prev - 1);
              toast.error(`Failed: ${err.response?.data?.error || err.message}`);
            }
          }}
          className="bg-white/60 p-2 rounded-full backdrop-blur-sm hover:scale-110 transition-transform active:scale-95 hover:bg-white"
        >
          <i className={`fa-heart text-xl ${isLiked ? "fa-solid text-rose-500" : "fa-regular text-gray-800/70"}`}></i>
        </button>

        {likeCount > 0 && <span className="text-[8px] font-bold text-white bg-black/40 px-1.5 py-0.5 rounded-full mt-1 backdrop-blur-sm">{likeCount}</span>}
      </div>

      <Link
        to={`/listings/${listing._id}`}
        className="block mb-6 outline-none"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={wholeCardRef}
          className="flex flex-col gap-2 bg-transparent"
        >

          <div className="w-full relative overflow-hidden rounded-xl aspect-[20/19] bg-gray-200">
            <img
              ref={imgRef}
              src={getOptimizedUrl(listing.images && listing.images.length > 0 ? listing.images[0].url : listing.image?.url)}
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
              loading="lazy"
              alt={listing.title}
            />
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded shadow-sm text-xs font-bold text-gray-800">
              {listing.categories?.[0] ? listing.categories[0].replace("-", " ") : "Guest Favorite"}
            </div>
          </div>


          <div className="mt-1">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-gray-900 group-hover:text-rose-500 transition-colors truncate pr-2 font-heading text-lg">
                {listing.title}
              </h3>
              <div className="flex items-center gap-1">
                <i className="fa-solid fa-star text-[10px] text-black"></i>
                <span className="text-sm text-black">{listing.rating || "4.87"}</span>
              </div>
            </div>
            <p className="text-gray-500 text-[14px] truncate">{listing.location}</p>
            <div className="flex items-baseline mt-1 gap-1">
              <span className="font-semibold text-gray-900 text-[15px]">
                ₹{listing.price?.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}