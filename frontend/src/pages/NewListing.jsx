import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../api";

export default function NewListing() {
  const [listing, setListing] = useState({ title: "", description: "", price: "", location: "", country: "",state:"", });
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry", "Chandigarh", "Andaman and Nicobar Islands", "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep"
  ].sort();


  const validateForm = () => {
    let newErrors = {};
    if (!listing.title.trim()) newErrors.title = "Enter a valid title";
    if (!listing.description.trim()) newErrors.description = "Enter a short description";
    if (!image) newErrors.image = "Upload an image";
    if (!listing.price) newErrors.price = "Enter a valid price";
    if (!listing.country.trim()) newErrors.country = "Enter a valid country name";
    if (!listing.state.trim()) newErrors.state = "Select a state";
    if (!listing.location.trim()) newErrors.location = "Enter a valid location";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const getInputClasses = (fieldName) => {
    const baseClasses = "border p-4 rounded outline-none transition-all duration-300 w-full";

    if (errors[fieldName]) {
      return `${baseClasses} border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50`;
    }

    if (isSubmitted && !errors[fieldName]) {
      return `${baseClasses} border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)] focus:ring-2 focus:ring-green-500 bg-green-50`;
    }

    return `${baseClasses} focus:ring-2 focus:ring-blue-500 border-gray-300`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitted(true);


    if (!validateForm()) return;


    const loadingToast = toast.loading("Uploading your destination...");

    const formData = new FormData();
    formData.append("listing[image]", image);
    Object.keys(listing).forEach((key) => {
      formData.append(`listing[${key}]`, listing[key]);
    });

    try {
      await API.post("/listings", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true
      });
      toast.dismiss(loadingToast);

      toast.success("Submitted! It will be live after admin approval.", {
        duration: 4000,
        icon: '⏳'
      });

      navigate("/listings");
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Failed to add destination. Please login to add new destionation.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white border rounded shadow-md my-10">
      <h2 className="text-3xl font-bold mb-8 text-center">Add New Destination</h2>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="font-semibold">Title:</label>
          <input
            type="text"
            className={getInputClasses("title")}
            placeholder="Enter title"
            onChange={(e) => {
              setListing({ ...listing, title: e.target.value });
              if (errors.title) setErrors({ ...errors, title: "" });
            }}
          />
          {errors.title && <p className="text-red-500 text-xs italic">{errors.title}</p>}
        </div>


        <div className="flex flex-col gap-2">
          <label htmlFor="description" className="font-semibold">Description:</label>
          <textarea
            className={getInputClasses("description")}
            placeholder="Description"
            onChange={(e) => {
              setListing({ ...listing, description: e.target.value });
              if (errors.description) setErrors({ ...errors, description: "" });
            }}
          ></textarea>
          {errors.description && <p className="text-red-500 text-xs italic">{errors.description}</p>}
        </div>


        <div className="flex flex-col gap-2">
          <label htmlFor="image" className="font-semibold">Upload Image:</label>
          <input
            type="file"
            className={getInputClasses("image")}
            onChange={(e) => {
              setImage(e.target.files[0]);
              if (errors.image) setErrors({ ...errors, image: "" });
            }}
          />
          {errors.image && <p className="text-red-500 text-xs italic">{errors.image}</p>}
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="price" className="font-semibold">Price:</label>
            <input
              type="number"
              className={getInputClasses("price")}
              placeholder="Enter price"
              onChange={(e) => {
                setListing({ ...listing, price: e.target.value });
                if (errors.price) setErrors({ ...errors, price: "" });
              }}
            />
            {errors.price && <p className="text-red-500 text-xs italic">{errors.price}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="country" className="font-semibold">Country:</label>
            <input
              type="text"
              className={getInputClasses("country")}
              placeholder="Enter country"
              onChange={(e) => {
                setListing({ ...listing, country: e.target.value });
                if (errors.country) setErrors({ ...errors, country: "" });
              }}
            />
            {errors.country && <p className="text-red-500 text-xs italic">{errors.country}</p>}
          </div>
        </div>


        <div className="flex flex-col gap-2">
          <label htmlFor="location" className="font-semibold">Location:</label>
          <input
            type="text"
            className={getInputClasses("location")}
            placeholder="Enter location"
            onChange={(e) => {
              setListing({ ...listing, location: e.target.value });
              if (errors.location) setErrors({ ...errors, location: "" });
            }}
          />
          {errors.location && <p className="text-red-500 text-xs italic">{errors.location}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="state" className="font-semibold">State (India):</label>
          <select
            className={getInputClasses("state") + " bg-white"}
            value={listing.state || ""}
            onChange={(e) => {
              setListing({ ...listing, state: e.target.value });
              if (errors.state) setErrors({ ...errors, state: "" });
            }}
          >
            <option value="">Select a State</option>
            {indianStates.map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
          {errors.state && <p className="text-red-500 text-xs italic">{errors.state}</p>}
        </div>



        <button className="text-white font-bold py-6 transition shadow-lg shadow-gray-500 hover:scale-105 hover:shadow-green-200 group relative inline-flex h-12 items-center text-sm justify-center overflow-hidden roundedl bg-gray-900 hover:bg-green-800 px-6 mt-4">
          <span>Add Destination</span>
          <div className="w-0 translate-x-full pl-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:translate-x-0 group-hover:pl-1 group-hover:opacity-100">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"><path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
          </div>
        </button>
      </form>
    </div>
  );
}