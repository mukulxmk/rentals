import React, { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-hot-toast";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchUserProfile,
//   updateUserProfile,
//   updateUserAvatar,
// } from "../features/users/userSlice";
// import MainLayout from "../components/layout/MainLayout";
import { User, Mail, Calendar, Edit2 } from "lucide-react";
import API from "../api";

const MAX_FILE_SIZE = 3 * 1024 * 1024;

const ProfilePage = () => {
    const { currUser, setCurrUser } = useContext(AuthContext);
//   const dispatch = useDispatch();
//   const { profile, loading } = useSelector((state) => state.user);
//   const { user } = useSelector((state) => state.auth);
    const [ profile, setProfile ] = useState(currUser?.profile || { joined: "", image: "", email: "", fullName: ""})
  const [loading, setLoading ] = useState(false);
  const fileInputRef = useRef(null);

//   useEffect(() => {
//     dispatch(fetchUserProfile());
//   }, [dispatch]);

//   useEffect(() => {
//     if (profile) {
//       setFullName(user?.profile?.fullName || "");
//     }
//   }, [profile, user]);


    const handleAvatarChange = async (e) => {

        const image = e.target.files[0];
        if(!image) toast.error("No image uploaded.")
        console.log("Current image size", image?.size);

        if (image.size > MAX_FILE_SIZE) {
            toast.error("Image size must be less than 2 MB");
            e.target.value = "";
            return;
        }

        const reader = new FileReader();

        reader.onload = async () => {
            const base64 = reader.result;

            setProfile((prev) => ({
                ...prev,
                image: base64,
            })); // Instant Preview

            try {
                const res = await API.patch(
                    "/auth/profile?op=image",
                    { image: base64 }
                );
                console.log(res.data);
                

                setProfile((prev) => ({
                    ...prev,
                    image: `${import.meta.env.VITE_BACKEND_URL}/${res.data.path}`,
                }));

                toast.success("Profile image uploaded successfully");
            } catch (err) {
                toast.error(`${err.response.data.error}` || "Failed to upload image");
            }
        };

        reader.onerror = () => {
            toast.error("Failed to read image");
        };
        
        reader.readAsDataURL(image);
    // if (file) {
    //   dispatch(updateUserAvatar(file));
    // }
    };

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault();
        setProfile({
            ...profile,
            fullName: e.target.value
        })

        try {
            const res = await API.patch("auth/profile?op=name", {
                fullName : profile.fullName
            })
        
            setProfile((prev) => ({
                ...profile,
                fullName : res.data.fullName
            }))

            toast.success("Full Name Updated successfully");
        } catch (err) {
            toast.error(`${err.response.data.error}` || "Cannot update Full Name")
        }

    //     dispatch(updateUserProfile({ fullName }));
    //   };

    //   if (loading && !profile) {
    //     return (
    //         <div className="text-center p-10">Loading Profile...</div>
    //     );
    setLoading(false)
    }
console.log(import.meta.env.VITE_BACKEND_URL ,profile);

console.log(`${import.meta.env.VITE_BACKEND_URL}/${profile.image}`);


  return (
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <div className="md:col-span-1">
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <div className="relative w-32 h-32 mx-auto mb-4">
                        <img
                        src={
                            `${import.meta.env.VITE_BACKEND_URL}/${profile.image}` ||
                            `https://ui-avatars.com/api/?name=${profile.fullName}&background=random&color=fff&size=128`
                        }
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover border-4 border-white shadow-sm"
                        />
                        <button
                        onClick={() => fileInputRef.current.click()}
                        className="absolute bottom-0 right-0 bg-[#FF385C] text-white p-2 rounded-full hover:bg-red-600 transition"
                        >
                            <Edit2 size={16} />
                        </button>
                        <input
                        type="file"
                        ref={fileInputRef}
                        hidden
                        accept="image/*"
                        onChange={handleAvatarChange}
                        />
                    </div>
                    <h2 className="text-xl font-bold flex gap-2 justify-center">
                        <User />
                        {profile?.fullName || 'User'}
                    </h2>
                    <div className="mt-4 space-y-2 text-sm text-gray-600">
                        <p className="flex items-center justify-center">
                        <Mail size={14} className="mr-2" />
                        {profile?.email || "mail" }
                        </p>
                        <p className="flex items-center justify-center">
                        <Calendar size={14} className="mr-2" /> Joined{" "}
                            {currUser ?
                                (new Intl.DateTimeFormat("en-GB", {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                }).format(new Date(profile.joined)))
                                : "DATE" 
                            }
                        </p>
                    </div>
                </div>
            </div>

            <div className="md:col-span-2">
                <div className="bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6">Edit Your Profile</h1>
                <form 
                  onSubmit={handleSubmit} 
                className="space-y-4">
                    <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Full Name
                    </label>
                    <input
                        type="text"
                        value={profile.fullName}
                        onChange={(e) =>
                            setProfile({
                            ...profile,
                            fullName: e.target.value,
                        })}
                        className="w-full mt-1 p-2 border rounded-md"
                    />
                    </div>
                    <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#FF385C] text-white font-bold py-3 rounded-lg hover:bg-red-600 transition disabled:bg-red-300"
                    >
                    {loading ? "Saving..." : "Save Changes"}
                    </button>
                </form>
                </div>
            </div>

        </div>
      </div>
  );
};

export default ProfilePage;
