import React, { useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function NotFound() {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.from(".animate-404", {
      y: 80,
      opacity: 0,
      duration: 1.2,
      ease: "expo.out",
    })
    .from(".animate-sub", {
      y: 30,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    }, "-=0.8")
    .from(".animate-btn", {
      y: 20,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2, 
      ease: "power2.out"
    }, "-=0.5");
  }, { scope: containerRef });

  return (
   
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[100] bg-black text-white flex flex-col items-center justify-center overflow-hidden selection:bg-white selection:text-black"
    >
      
      
      <div className="absolute bottom-[-5%] w-[140%] h-[35%] border-t border-white/10 rounded-[100%] pointer-events-none"></div>

      
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        
        
        <h1 className="animate-404 text-[10rem] md:text-[18rem] font-medium tracking-tighter leading-none mb-4">
          404
        </h1>

        <p className="animate-sub text-gray-500 text-lg md:text-xl font-light mb-16 tracking-wide italic">
          It seems you got a little bit lost
        </p>

        
        <div className="flex flex-row gap-12 md:gap-20">
          
          
          <button 
            onClick={() => navigate(-1)} 
            className="animate-btn group flex flex-col items-center gap-4 cursor-pointer outline-none"
          >
            <div className="w-14 h-14 border border-white/20 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
              <i className="fa-solid fa-arrow-left text-xl"></i>
            </div>
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-500 group-hover:text-white transition-colors">
              Go back
            </span>
          </button>

          
          <Link 
            to="/" 
            className="animate-btn group flex flex-col items-center gap-4 cursor-pointer outline-none"
          >
            <div className="w-14 h-14 border border-white/20 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
              <i className="fa-solid fa-house text-xl"></i>
            </div>
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-500 group-hover:text-white transition-colors">
              Go Home
            </span>
          </Link>

        </div>
      </div>

      
      <div className="absolute bottom-10 text-[9px] uppercase tracking-[0.5em] text-gray-700">
        Error Code: Routing_Failure_04
      </div>
    </div>
  );
}