import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../api";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";


export default function Signup() {

  const { setCurrUser } = useContext(AuthContext);

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const location = useLocation();
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();


  const validateForm = () => {
    let newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Enter username";
    if (!formData.email.trim()) newErrors.email = "Enter valid Email";
    if (!formData.password.trim()) newErrors.password = "Enter password";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getInputClasses = (fieldName) => {
    const baseClasses = "border-b-2 px-8 py-3 outline-none transition-all duration-300 w-full ";

    if (errors[fieldName]) {
      return `${baseClasses} border-red-500`;
    }

    if (isSubmitted && !errors[fieldName]) {
      return `${baseClasses} border-green-500`;
    }

    return `${baseClasses} focus:border-b-blue-500 border-gray-300`;
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    setIsSubmitted(true);
    if (!validateForm()) return;

    const loadingToast = toast.loading("Adding credentials...");
    try {
      const res = await API.post("/auth/signup", formData);
      if (res.data.user) {
        setCurrUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        toast.dismiss(loadingToast);
      }

      toast.success(`Welcome ${res.data.user.username}!`, { icon: '👋' });

      const from = location.state?.from;
      const redirectUrl = (from === "/login" || from === "/signup" || !from)
        ? "/listings"
        : from;

      navigate(redirectUrl, { replace: true });


    } catch (err) {
      toast.dismiss(loadingToast);


      const errorMsg = err.response?.data?.error || "Signup failed. Please try again.";
      toast.error(errorMsg);
      console.error("Signup process error:", err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-10 bg-white rounded shadow-lg border border-gray-300">
      <h2 className="text-3xl text-center font-bold mb-8">Join Wanderlist</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="relative group">
          <User className={`absolute left-0 top-3 transition-colors duration-300 ${errors.username ? "text-red-500" : "text-gray-400 group-focus-within:text-blue-500"}`} size={20} />
          <input type="text"
            id="username"
            placeholder="Enter Username"
            value={formData.username} className={getInputClasses("username")} onChange={(e) => {
              setFormData({ ...formData, username: e.target.value });
              if (errors.username) setErrors({ ...errors, username: "" });
            }}
          />
          {errors.username && <p className="text-red-500 text-xs">{errors.username}</p>}
        </div>

        <div className="relative group">
          <Mail className={`absolute left-0 top-3 transition-colors duration-300 ${errors.email ? "text-red-500" : "text-gray-400 group-focus-within:text-blue-500"}`} size={20} />
          <input type="email" id="email"
            placeholder="Enter your Email"
            value={formData.email} className={getInputClasses("email")} onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              if (errors.email) setErrors({ ...errors, email: "" });
            }}
          />
          {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}

        </div>
        <div className="relative group">
          <Lock className={`absolute left-0 top-3 transition-colors duration-300 ${errors.password ? "text-red-500" : "text-gray-400 group-focus-within:text-blue-500"}`} size={20} />
          <input type={showPassword ? "text" : "password"}
            placeholder="Enter your Password"
            id="password" className={`${getInputClasses("password")} pr-10`} onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
              if (errors.password) setErrors({ ...errors, password: "" });
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 top-3 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}

        </div>
        <button className=" text-white mt-8 font-bold py-6 transition shadow-lg shadow-gray-500 hover:scale-110 hover:shadow-green-200 group relative inline-flex h-10 items-center text-sm justify-center overflow-hidden rounded bg-gray-900 hover:bg-green-800 px-6 "><span>Create
          Account</span><div class="w-0 translate-x-full pl-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:translate-x-0 group-hover:pl-1 group-hover:opacity-100"><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"><path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg></div></button>

      </form>
    </div>
  );
}