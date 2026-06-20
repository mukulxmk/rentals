import { useState } from 'react';

export default function BecomeHostForm(){
    const [formData, setFormData ] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        profilePicture: "",
        bio: "",
        address: { line1: "", line2: "", city: "", state: "", country: "", pincode: "" },
        identity: [{ type: "", documentUrl: "", status:  "pending"}]
    })

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

    const ID_TYPES = [
        "Aadhaar",
        "Driving License",
        "Passport",
        "Voter ID",
    ];

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white border rounded shadow-md my-10">
        <h2 className="text-3xl font-bold mb-8 text-center">Create your Host Profile</h2>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

                <div className="flex flex-col gap-2">
                <label htmlFor="title" className="font-semibold">Title:</label>
                <input
                    type="text"
                    className={getInputClasses("firstName")}
                    placeholder="Enter First Name"
                    onChange={(e) => {
                    setListing({ ...listing, firstName: e.target.value });
                    if (errors.title) setErrors({ ...errors, firstName: "" });
                    }}
                />
                {errors.firstName && <p className="text-red-500 text-xs italic">{errors.firstName}</p>}
                </div>


                <div className="flex flex-col gap-2">
                <label htmlFor="lastName" className="font-semibold">:</label>
                <textarea
                    className={getInputClasses("lastName")}
                    placeholder="Last Name"
                    onChange={(e) => {
                    setListing({ ...listing, lastName: e.target.value });
                    if (errors.lastName) setErrors({ ...errors, lastName: "" });
                    }}
                ></textarea>
                {errors.lastName && <p className="text-red-500 text-xs italic">{errors.lastName}</p>}
                
                </div>

                <div className="flex flex-col gap-2">
                <label htmlFor="phone" className="font-semibold">:</label>
                <textarea
                    className={getInputClasses("phone")}
                    placeholder="Last Name"
                    onChange={(e) => {
                    setListing({ ...listing, phone: e.target.value });
                    if (errors.phone) setErrors({ ...errors, phone: "" });
                    }}
                ></textarea>
                {errors.phone && <p className="text-red-500 text-xs italic">{errors.phone}</p>}
                </div>

                             <div className="flex flex-col gap-2">
                <label htmlFor="email" className="font-semibold">:</label>
                <textarea
                    className={getInputClasses("email")}
                    placeholder="Last Name"
                    onChange={(e) => {
                    setListing({ ...listing, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: "" });
                    }}
                ></textarea>
                {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
                </div>


                <div className="flex flex-col gap-2">
                <label htmlFor="profilePicture" className="font-semibold">Profile Picture:</label>
                <input
                    type="file"
                    className={getInputClasses("profilePicture")}
                    onChange={(e) => {
                    setImage(e.target.files[0]);
                    if (errors.profilePicture) setErrors({ ...errors, profilePicture: "" });
                    }}
                />
                {errors.profilePicture && <p className="text-red-500 text-xs italic">{errors.profilePicture}</p>}
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
    )
}