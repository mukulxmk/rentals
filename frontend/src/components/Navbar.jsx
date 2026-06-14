import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import toast from "react-hot-toast";
gsap.registerPlugin(ScrollTrigger);
import API from "../api";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currUser, setCurrUser } = useContext(AuthContext);
  const navRef = useRef(null);
  const sidebarRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {

      navigate(`/?state=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };


  useGSAP(() => {
    gsap.to(navRef.current, {
      scrollTrigger: {
        trigger: document.body,
        start: "top -10",
        end: "top -100",
        scrub: true,
      },
      backgroundColor: "rgba(31, 41, 55, 0.6)",
      backdropFilter: "blur(15px)",
      height: "70px",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)",
    });
  }, { scope: navRef });


  useGSAP(() => {
    if (isMenuOpen) {

      gsap.to(sidebarRef.current, {
        x: 0,
        duration: 0.6,
        ease: "expo.out",
      });


      gsap.fromTo(".sidebar-link",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "back.out(1.7)", delay: 0.2 }
      );
    } else {

      gsap.to(sidebarRef.current, {
        x: "100%",
        duration: 0.5,
        ease: "power3.in",
      });
    }
  }, [isMenuOpen]);



  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await API.get("/auth/logout", { withCredentials: true });
      setCurrUser(null);
      setIsMenuOpen(false);
      setIsUserDropdownOpen(false);
      toast.success("Logged out. See you soon!", { icon: '🚶' });
      navigate("/");
    } catch (e) {
      toast.error("Logout failed.");
    }
  };

  return (
    <>

      <nav ref={navRef} className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md py-3 h-20 transition-all duration-300 border-b border-gray-200/50 shadow-sm">
        <div className="container mx-auto px-6 flex items-center justify-between h-full">

          <Link to="/" className="flex flex-row items-center justify-center gap-2 group">
            <div className="text-rose-500 text-3xl transition-transform duration-300 group-hover:rotate-[360deg] group-hover:scale-110">
              <i className="fa-regular fa-compass"></i>
            </div>
            <span className="text-rose-500 font-extrabold text-2xl tracking-tight font-heading">WanderList</span>
          </Link>


          <div className="hidden md:flex items-center bg-white border border-gray-200 rounded-full py-2.5 px-4 shadow-sm hover:shadow-md transition-shadow duration-300 gap-3 w-[360px] focus-within:ring-2 focus-within:ring-rose-100 focus-within:border-rose-300">
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 bg-transparent outline-none text-sm font-medium text-gray-700 placeholder-gray-400"
            />
            <div
              onClick={handleSearch}
              className="bg-rose-500 p-3 flex justify-center items-center rounded-full text-white cursor-pointer hover:bg-rose-600 active:scale-95 transition-all duration-200 shadow-rose-200/50 shadow-lg"
            >
              <i className="fa-solid fa-magnifying-glass text-xs"></i>
            </div>
          </div>

          <div className="hidden md:flex gap-4 font-semibold text-sm items-center">
            <div
              onClick={() => {
                if (!currUser) {
                  toast.error("Please login to add a destination!");
                  navigate("/login");
                } else {
                  navigate("/listings/new");
                }
              }}
              className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-full hover:bg-gray-100 transition-all duration-200 cursor-pointer"
            >
              Add Destination
            </div>

            {!currUser ? (
              <>
                <Link to="/login" state={{ from: location.pathname }} className="group text-gray-700 hover:text-gray-900 font-medium px-4 py-2 transition text-sm flex items-center gap-1">
                  <span>Log in</span>
                  <div className="w-0 translate-x-full opacity-0 transition-all duration-200 group-hover:w-4 group-hover:translate-x-0 group-hover:opacity-100 overflow-hidden">
                    <i className="fa-solid fa-arrow-right-long text-xs"></i>
                  </div>
                </Link>
                <Link to="/signup" state={{ from: location.pathname }}
                  className="group bg-gray-900 text-white font-semibold py-2 px-5 rounded-full hover:bg-black hover:scale-105 active:scale-95 transition-all shadow-lg shadow-gray-200 flex items-center gap-2">
                  <span>Sign up</span>
                  <div className="w-0 translate-x-full opacity-0 transition-all duration-200 group-hover:w-4 group-hover:translate-x-0 group-hover:opacity-100 overflow-hidden">
                    <i className="fa-solid fa-arrow-right text-xs"></i>
                  </div>
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-4">
                {currUser.role === "admin" && (
                  <Link to="/admin" className="text-xs font-bold bg-rose-100 text-rose-600 px-3 py-1 rounded-full uppercase tracking-wider hover:bg-rose-200 transition">
                    Admin
                  </Link>
                )}


                <div className="relative">
                  <div
                    className="flex items-center gap-3 border border-gray-200 pl-2 pr-4 py-1.5 rounded-full hover:shadow-md transition cursor-pointer bg-white"
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    title="User Menu"
                  >
                    <div className="bg-gray-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-xs">
                      {/* {currUser.username.charAt(0).toUpperCase()} */}
                    </div>
                    <span className="text-gray-700 font-medium">{currUser.username}</span>
                  </div>


                  {isUserDropdownOpen && (
                    <>

                      <div className="fixed inset-0 z-[55] cursor-default" onClick={() => setIsUserDropdownOpen(false)}></div>

                      <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-200">

                        <div className="px-4 py-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
                          <div className="bg-gray-800 text-white w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
                            {currUser.username.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-800 text-sm">{currUser.username}</span>
                            <span className="text-xs text-gray-500">Member</span>
                          </div>
                        </div>


                        <button
                          onClick={() => { handleLogout(); }}
                          className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-rose-50 transition-colors flex items-center gap-2 font-medium cursor-pointer"
                        >
                          <i className="fa-solid fa-arrow-right-from-bracket"></i>
                          Log out
                        </button>
                      </div>
                    </>
                  )}
                </div>

              </div>
            )}
          </div>


          <button onClick={() => setIsMenuOpen(true)} className="md:hidden text-2xl text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-all">
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>
      </nav >


      <div
        ref={sidebarRef}
        className="fixed top-0 rounded-l-xl right-0 h-full w-[300px] bg-gray-900/50 backdrop-blur-2xl z-[100] translate-x-full md:hidden flex flex-col p-8 border-l border-white/10 shadow-[-20px_0_30px_rgba(0,0,0,0.3)]"
      >

        <button onClick={() => setIsMenuOpen(false)} className="self-end text-3xl text-white/70 hover:text-orange-500 mb-10 transition-colors">
          <i className="fa-solid fa-xmark"></i>
        </button>


        <div className="flex flex-col gap-4">
          <Link to="/" onClick={() => setIsMenuOpen(false)}
            className="sidebar-link text-white text-xl font-bold p-3 hover:bg-white/10 hover:translate-x-5 transition-all duration-300 rounded hover:border hover:text-white hover:shadow-black">
            Home
          </Link>
          <Link to="/listings/new" onClick={() => setIsMenuOpen(false)}
            className="sidebar-link text-white text-xl font-bold p-3 hover:bg-white/10 hover:translate-x-5 transition-all duration-300 rounded hover:border hover:text-white hover:shadow-black">
            Add New Destination
          </Link>


          <div className="h-[1px] bg-white/10 my-4 sidebar-link"></div>

          {!currUser ? (
            <>
              <Link to="/signup" state={{ from: location.pathname }} onClick={() => setIsMenuOpen(false)}
                className="sidebar-link text-white/80 text-lg font-medium p-3 rounded-xl hover:bg-white/10 hover:text-white transition-all">
                Signup
              </Link>
              <Link to="/login" state={{ from: location.pathname }} onClick={() => setIsMenuOpen(false)}
                className="sidebar-link text-white bg-orange-600 text-center py-4 rounded shadow-lg font-bold mt-4 hover:bg-orange-700 hover:scale-[1.02] active:scale-95 transition-all">
                Login
              </Link>
            </>
          ) : (
            <div className="flex flex-col gap-6 sidebar-link">
              <div>
                <i className="fa-solid fa-user text-orange-400"></i>
                <span className="text-orange-400 font-medium text-lg px-3 uppercase"><b>{currUser.username}</b></span>
              </div>
              {currUser && currUser.role === "admin" && (
                <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="bg-green-600/80 hover:bg-green-600 text-white py-4 rounded font-bold shadow-lg transition-all active:scale-95 text-center">
                  Admin Panel
                </Link>
              )}
              <button onClick={handleLogout}
                className="bg-red-600/80 hover:bg-red-600 text-white py-4 rounded font-bold shadow-lg transition-all active:scale-95 cursor-pointer">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>


      {
        isMenuOpen && (
          <div onClick={() => setIsMenuOpen(false)} className="fixed inset-0 bg-black/40 z-[90] backdrop-blur-sm md:hidden"></div>
        )
      }
    </>
  );
}