import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import "../index.css";
import { AuthContext } from "../context/AuthContext";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import API from "../api";
import DigitCounter from "../components/DigitCounter";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Calendar, ChevronDown, ChevronUp } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

import Map from "../components/Map";
const options = {
  timeZone: "Asia/Kolkata",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit"
};
const TXN_STAGES = [
  {id: "st1", st1: "prdct-slct", 
    open: false,
    room: 0 ,
    calOpen: false,
    checkIn :{
      calOpen: false,  
      date: "--"
    }, 
    checkOut: { 
      calOpen: false, 
       date: "--"
    } 
  },
  {id: "st2", st2: "prcd-t-py"},
  {id: "st3", st3: "pymt-mthd"},
  {id: "st4", st4: "rdrct"},
  {id: "st5", st5: "scr-cnnctn"},
  {id: "st6", st6: "dt-gnrtn"},
  {id: "st7", st7: "cnfrm-py"},
  {id: "st8", st8: ["success", "fail", "pending"]}
]


export default function ShowListing() {

  const { currUser } = useContext(AuthContext);
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 1, comment: "" });
  const navigate = useNavigate();
  const [liked, setLiked] = useState({ bool: false, count: null });
  const [ txn, setTXN ] = useState(TXN_STAGES);
const [range, setRange] = useState();
  const containerRef = useRef(null);
  
// console.log(txn);

// console.log(range,"from date picker");

  const fetchListing = async () => {
    try {
      const res = await API.get(`/listings/${id}`);
      setListing(res.data);
      setLiked(res.data.likes || 0);
      setLiked(res.data.likedBy?.includes(currUser?._id) || false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (listing) {
      setLiked(listing.likes || 0);
      setLiked(listing.likedBy?.includes(currUser?._id) || false);
    }
  }, [listing, currUser]);


  const handleEdit = () => {

    if (!currUser) {
      toast.error("You must be logged in to edit!");
      return;
    }


    if (!listing.owner || listing.owner._id !== currUser._id) {
      toast.error("You are not the owner of this. You don't have permission to edit this!", {
        icon: '🚫',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      return;
    }

    navigate(`/listings/${id}/edit`);
  };


  const handleDelete = async () => {

    if (!currUser || (listing.owner._id !== currUser._id)) {
      toast.error("You are not the owner of this. You don't have permission to delete this!", { icon: '🚫' });
      return;
    }

    if (!window.confirm("Are you sure you want to delete this listing?")) return;

    try {
      await API.delete(`/listings/${id}`, {
        withCredentials: true
      });
      toast.success("Listing deleted successfully");
      navigate("/listings");
    } catch (err) {
      toast.error("Error deleting listing");
    }
  };

  useEffect(() => {
    fetchListing();
  }, [id, currUser]);


  useGSAP(() => {
    if (!listing || !containerRef.current) return;

    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power4.out", duration: 1.5 }
      });


      tl.to(".animate-on-load", {
        y: 0,
        opacity: 1,
        stagger: 0.2,
        force3D: true,
        overwrite: "auto",
      });


      if (listing.reviews && listing.reviews.length > 0) {

        gsap.set(".review-card", { opacity: 0, y: 30, scale: 0.98 });

        gsap.to(".review-card", {
          scrollTrigger: {
            trigger: ".review-container",
            start: "top 85%",
            toggleActions: "play none none none",
          },
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          stagger: 0.2,
          ease: "back.out(1.2)",
          overwrite: "auto"
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [listing]);



  const [errors, setErrors] = useState({});

  const validateReview = () => {
    const newErrors = {};
    if (!reviewForm.rating || reviewForm.rating === 0) newErrors.rating = "Please select a star rating";
    if (!reviewForm.comment.trim()) newErrors.comment = "Review cannot be empty";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault(); 
    e.stopPropagation();

    if (!currUser) {
      toast.error("Please login to leave a review");
      return;
    }

    if (!validateReview()) return;

    const loadingToast = toast.loading("Submitting your review...");

    const finalRating = reviewForm.rating === 0 ? 1 : reviewForm.rating;
    const finalReview = { ...reviewForm, rating: finalRating };

    try {
      const res = await API.post(`/listing/${id}/reviews`, { review: finalReview }, {
        withCredentials: true
      }); 
      toast.dismiss(loadingToast);

      if (res.data.message) {
        toast.success(res.data.message, {
          icon: '🚀',
          duration: 4000
        });
      }
      setReviewForm({ rating: 1, comment: "" });
      setErrors({});
      fetchListing();

    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.response?.data?.error || "Error adding review. Please login.");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await API.delete(`/listings/${id}/reviews/${reviewId}`, {
        withCredentials: true
      });
      fetchListing();
      toast.success("Review deleted");
    } catch (err) {
      alert("Cannot delete review");
    }
  };

  const handleST1 = async function(){
    setTXN({
      ...txn,
      st1: "prdct-slct"
    })
  }

  const updateNestedField = (obj, path, value) => {
    const keys = path;
// console.log(obj, path, value);

    const result = { ...obj };
    let current = result;
// console.log("==========", result, current);

    for (let i = 0; i < keys.length - 1; i++) {
      // console.log(current[keys[i]]);
      
      current[keys[i]] = { ...current[keys[i]] };
      // console.log(current[keys[i]], "222222222222");

      current = current[keys[i]];
      // console.log(current[keys[i]], "3333333333");

    }
// console.log(current, "outside loop");

    current[keys[keys.length - 1]] = value;
// console.log(current, "outside loop"), result;

    return result;
  };
  
  // const handleTXNMutation = (id, op, key, newValue) => {
  //   setTXN(prevItems =>
  //     prevItems.map(item => { 
  //       // console.log(item.id, id, op, key,newValue , item.key,item[`${key}`]);

  //       if(item.id === id){
  //         if(op === "digit"){            
  //           return { ...item, [key] : (item[`${key}`] + newValue)}
  //         }else if(op === "open-cal"){
  //           return { ...item, [key]: (!item[`${key}`]) }
  //         }
  //       }else{
  //        return { ...item}
  //       }
  // })
  //   );
  // };

  const handleTXNMutation = (id, op, key, newValue) => {
    console.log(newValue);
    
  setTXN(prevItems =>
    prevItems.map(item => {
      if (item.id !== id) return item;

      const keys = key.split(".");
      // console.log(keys);
      
      const currentValue = keys.reduce(
        (acc, curr) => acc?.[curr],     
        item
      );
      // console.log("Ccccccccccccccccccccccccccccccc", currentValue, item, key, newValue, op);
      

      switch (op) {
        case "digit":
          return updateNestedField( item, keys, currentValue + newValue );

        case "calendar":
          return updateNestedField( item, keys, !currentValue );

        case "set-date":
          newValue.setUTCHours(0,0,0,0);
          return updateNestedField( item, keys, newValue);
  
        case "boolean":
          return {
            ...item,
            [key]: !currentValue
          };
        default:
          return item;
      }
    })
  );
};
  

  const handleRoomsInt = (id, key, op) => {
    setTXN(prev => 
      prev.map(item => 
        item.id === id
          ? { ...item, [key] : item.key + op}
          : item
      )
    )
  }

  if (!listing) {
    return <Loader className="h-screen w-full" />;
  }


  return (
    <div className="max-w-7xl mx-auto px-6 py-8" ref={containerRef}>


      <div className="mb-6 animate-on-load">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2 leading-tight font-heading">{listing.title}</h1>
        <div className="flex items-center gap-4 text-sm font-medium text-gray-800">
          <div className="flex items-center gap-1">
            <i className="fa-solid fa-star text-xs"></i>
            <span>{listing.rating || "New"}</span>
          </div>
          <span className="text-gray-300">•</span>
          <span className="underline decoration-gray-400 underline-offset-2 cursor-pointer">{listing.location}</span>
          <div className="flex justify-center ml-auto align-center">
            <button
              onClick={async () => {
                if (!currUser) return toast.error("Login to like!");

                const newLikedState = !liked.bool;
                setLiked(newLikedState);
                setLiked(prev => newLikedState ? prev + 1 : prev - 1);
                try { await API.post(`/listings/${id}/like`); }
                catch (err) { setLiked(!newLikedState); setLiked(prev => prev - 1); toast.error("Failed"); }
              }}
              className="flex items-center gap-2 text-gray-600 font-semibold hover:bg-gray-100 px-4 py-2 rounded-lg transition"
            >
              <i className={`fa-heart ${liked.bool ? "fa-solid text-rose-500" : "fa-regular"}`}></i>
              <span>{liked.bool ? liked.count + " Likes" : liked.count + " Likes"}</span>
            </button>
          </div>
        </div>
      </div>


      <div className="rounded-2xl overflow-hidden shadow-sm mb-10 animate-on-load aspect-[16/9] md:aspect-[2/1] relative group">
        <img
          src={listing.image?.url || "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          alt={listing.title}
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm uppercase tracking-wide">
          Featured
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 animate-on-load">


        <div className="md:col-span-2">
          <div className="flex justify-between items-center border-b border-gray-200 pb-6">
            <div>
              <h2 className="text-2xl font-bold mb-1"> Hosted by : {listing.owner?.username || "Admin"}</h2>
            </div>
            <div className="h-12 w-12 bg-black text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
              {listing.owner?.username?.charAt(0).toUpperCase() || "A"}
            </div>
          </div>

          <div className="py-8 border-b border-gray-200">
            <h2 className="text-xl font-bold mb-4">About this place</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{listing.description}</p>
          </div>


          <div className="py-8">
            <form onSubmit={handleReviewSubmit} className="mb-10 bg-gray-50 p-6 rounded-xl border border-gray-100">
              <h4 className="font-bold text-lg mb-4">Leave a Review</h4>
              <div className="mb-3">
                <fieldset className="starability-slot">
                  <input type="radio" id="no-rate" className="input-no-rate" name="rating" value="1" checked={reviewForm.rating === 0} onChange={() => { }} aria-label="No rating." />
                  <input type="radio" id="rate1" name="rating" value="1" checked={reviewForm.rating === 1} onChange={() => { setReviewForm({ ...reviewForm, rating: 1 }); if (errors.rating) setErrors({ ...errors, rating: "" }); }} />
                  <label htmlFor="rate1" title="Terrible">1 star</label>
                  <input type="radio" id="rate2" name="rating" value="2" checked={reviewForm.rating === 2} onChange={() => { setReviewForm({ ...reviewForm, rating: 2 }); if (errors.rating) setErrors({ ...errors, rating: "" }); }} />
                  <label htmlFor="rate2" title="Not good">2 stars</label>
                  <input type="radio" id="rate3" name="rating" value="3" checked={reviewForm.rating === 3} onChange={() => { setReviewForm({ ...reviewForm, rating: 3 }); if (errors.rating) setErrors({ ...errors, rating: "" }); }} />
                  <label htmlFor="rate3" title="Average">3 stars</label>
                  <input type="radio" id="rate4" name="rating" value="4" checked={reviewForm.rating === 4} onChange={() => { setReviewForm({ ...reviewForm, rating: 4 }); if (errors.rating) setErrors({ ...errors, rating: "" }); }} />
                  <label htmlFor="rate4" title="Very good">4 stars</label>
                  <input type="radio" id="rate5" name="rating" value="5" checked={reviewForm.rating === 5} onChange={() => { setReviewForm({ ...reviewForm, rating: 5 }); if (errors.rating) setErrors({ ...errors, rating: "" }); }} />
                  <label htmlFor="rate5" title="Amazing">5 stars</label>
                </fieldset>
                {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating}</p>}
              </div>
              <div>
                <textarea
                  className={`w-full border p-3 rounded-lg mb-1 text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none ${errors.comment ? "border-red-500" : "border-gray-200"}`}
                  rows="3"
                  placeholder="Share your experience..."
                  value={reviewForm.comment}
                  onChange={(e) => {
                    setReviewForm({ ...reviewForm, comment: e.target.value });
                    if (errors.comment) setErrors({ ...errors, comment: "" });
                  }}
                ></textarea>
                {errors.comment && <p className="text-red-500 text-xs mb-4">{errors.comment}</p>}
              </div>
              <button className="bg-black text-white px-6 py-2 rounded-lg font-bold text-sm hover:opacity-80 transition mt-2">Submit Review</button>
            </form>

            {listing.reviews && listing.reviews.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                <h3 className="text-xl font-bold">Reviews</h3>
                {listing.reviews.map((r) => (
                  <div key={r._id} className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-xs">{r.author?.username?.[0]?.toUpperCase() || "U"}</div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">@{r.author?.username || "Guest"}</span>
                        <span className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString("en-IN", {
                          day: 'numeric',
                          month: 'short'
                        })}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm mb-2">{r.comment}</p>
                    <div className="flex items-center justify-between">
                      <p className="starability-result scale-[0.6] origin-left" data-rating={r.rating}></p>
                      {currUser && r.author && currUser._id === r.author._id && (
                        <button onClick={() => handleDeleteReview(r._id)} className="text-xs text-red-500 font-bold hover:underline">Delete</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No reviews yet.</p>
            )}
          </div>
          <div className="overflow-hidden h-[650px]">
            <Map listing={listing} />
          </div>
        </div>



        <div className="md:col-span-1 relative">
          <div className="sticky top-28 border border-gray-200 shadow-xl rounded-2xl p-6 bg-white ring-1 ring-black/5">
            <div className="flex justify-between items-end mb-6">

              <div>
                <span className="text-2xl font-bold">₹{listing.price?.toLocaleString("en-IN")}</span>
                <span className="text-gray-600 text-sm"></span>
              </div>

            </div>


            <div className="sticky top-20 w-full flex items-center justify-center backdrop-blur-[1px] font-bold py-3 rounded-lg 
                hover:bg-gradient-to-r from-blue-500 to-rose-600 hover:text-white 
                transition-all "
            >
              <button onClick={() => handleTXNMutation("st1", "boolean", "open")} >
                Reserve
              </button>
            </div>
 
            <div className="text-center text-xs text-gray-500">You won't be charged yet</div>
{console.log(txn[0])
}
            {txn[0].open === true && (
              <div className="flex flex-col gap-4"> 

                <span className="w-full flex flex-row justify-center mt-4 pt-4 gap-2 overflow-x-auto whitespace-nowrap border-t border-gray-400 text-xl font-bold" > 
                  Please reserve <DigitCounter handleRoomInt={handleTXNMutation} roomInt={txn[0].room}/> Rooms
                </span>

                <div className="bg-white rounded-xl border p-4 shadow-sm"> 
                  <div className="flex justify-between text-sm"> 
                    <div className="flex flex-col">
                      <p className="font-xl">Check In</p> 
                      <p className="flex items-center gap-2"> 
                        <Calendar size={14} className="hover:scale-125" 
                          onClick={() => {
                            handleTXNMutation("st1", "calendar", "checkIn.calOpen")
                          }}/> 
                        {txn[0].checkIn.date ? txn[0].checkIn.date.toLocaleString('en-GB', options) : "00 MONTH, 0000"} 
                      </p>
                    </div>

                    <div className="flex flex-col"> 
                      <p className="font-medium">Check Out</p> 
                      <p className="flex items-center gap-2">
                        <Calendar size={14} className="hover:scale-125" onClick={() => {
                          if(txn[0].checkIn.calOpen === true ) return toast.error("Please Save Check In date first.");
                          return handleTXNMutation("st1", "calendar", "checkOut.calOpen")
                        }}/>
                        {txn[0].checkOut.date ? txn[0].checkOut.date.toLocaleString('en-GB', options) : "00 MONTH, 0000"} 
                      </p> 
                    </div> 
                  </div> 


                  { txn[0].checkIn.calOpen === true &&
                   (<div>
                      <DayPicker 
                        mode="single" 
                        selected={txn[0].checkIn.date}
                        onSelect={(date) =>  handleTXNMutation( "st1",  "set-date" , "checkIn.date",  date )} 
                        disabled={{ before: new Date() }} 
                        numberOfMonths={1} pagedNavigation 
                      /> 
                      <button 
                        className="w-full text-black block text-center border-1 border-black-300 py-2 rounded-lg 
                        transition-all duration-300 hover:bg-rose-600 hover:shadow-lg hover:border-white hover:text-white"
                        onClick={() => handleTXNMutation("st1", "calendar", "checkIn.calOpen")}>
                          Save
                        </button>
                   </div>
                  )}

                  { txn[0].checkOut.calOpen === true && txn[0].checkIn.calOpen === false 
                    && (<div>
                      <DayPicker 
                        mode="single" 
                        selected={txn[0].checkOut.date}
                        onSelect={(date) =>  { return handleTXNMutation( "st1",  "set-date" , "checkOut.date",  new Date(date) )}} 
                        disabled={{ before: new Date() }} 
                        numberOfMonths={1} pagedNavigation 
                      /> 
                      <button
                        className="w-full text-black block text-center border-1 border-black-300 py-2 rounded-lg 
                          transition-all duration-300 hover:bg-rose-600 hover:shadow-lg hover:border-white hover:text-white"
                        onClick={() => handleTXNMutation("st1", "calendar", "checkOut.calOpen")}>
                          Save
                        </button>
                      </div>)
                  }
                </div>

                <div>
                  <p className="font-bold mb-4"> Payment Summary</p>
                  <span className="flex justify-between">
                    <p>Total Days </p>
                    <p>RS.some</p>
                  </span>
                  <span className="flex justify-between">
                    <p>Total Rooms </p>
                    <p>RS.some</p>
                  </span>
                  <span className="flex justify-between">
                    <p>GST </p>
                    <p>RS.some</p>
                  </span>
                  <span className="flex justify-between">
                    <p>Some Tax</p>
                    <p>RS.some</p>
                  </span>
                  <span className="flex justify-between border-t mt-4 pt-3 font-bold">
                    <p>Grand Total </p>
                    <p>RS.some</p>
                  </span>
                </div>


                {/* <span className="w-full flex justfiy-center">
                  <span className="w-full flex flex-col justify-center">
                    CHECK IN
                  </span>
                  <span className="w-full flex flex-col justify-center">
                    CHECK OUT
                  </span>
                </span> */}
                {txn[0].open && (
                  <div 
                    className="w-full flex items-center justify-center rounded-lg border-b border-rose-200 hover:shadow-md shadow-rose-200 "
                    onClick={() => handleTXNMutation("st1", "boolean", "open")}
                  >
                    <ChevronUp size={28} /> 
                  </div>
                )}

                <div className="sticky top-20 w-full flex items-center justify-center backdrop-blur-[1px] font-bold py-3 rounded-lg border-[0.5px]
                  hover:bg-gradient-to-r from-blue-500 to-rose-600 hover:text-white [&.is-scrolled]:border-none
                  active:scale-[0.98] 
                  transition-all"
                >
                  <button onClick={() => handleTXNMutation("st1", "boolean", "next")} >
                    Proceed To Pay
                  </button>
                </div>
              </div>
            )}

            {txn.st2 === "prcd-t-py" && (
              <div class="w-full h-fit flex flex-col bg-gray-100 p-4 gap-2">
                <span class="block bg-blue-500 text-white p-2 rounded">Span Item 1</span>
                <span class="block bg-blue-600 text-white p-2 rounded">Span Item 2</span>
                <span class="block bg-blue-700 text-white p-2 rounded">Span Item 3</span>
              </div>
            )}


            
            {/* {currUser && (
              <div className="border-t border-gray-200 mt-4 pt-4 flex gap-2">
                <button onClick={handleEdit} className="flex-1 bg-gray-900 text-white text-sm font-bold py-2 rounded hover:bg-black">Edit</button>
                <button onClick={handleDelete} className="flex-1 bg-white border border-gray-300 text-gray-900 text-sm font-bold py-2 rounded hover:bg-gray-50">Delete</button>
              </div>
            )} */}
          </div>
        </div>

      </div>

    </div >
  );
}