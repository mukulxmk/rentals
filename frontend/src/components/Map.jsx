import React, { useEffect, useRef, useState } from "react"; 
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function Map({ listing }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  
  
  const [activeMode, setActiveMode] = useState("streets");

  const coordinates = listing.geometry?.coordinates || [77.2088, 28.6139];
  const apiKey = "M1LNNNx0kDDfOSwKpFSf"; 

  const styles = {
    streets: `https://api.maptiler.com/maps/streets-v2/style.json?key=${apiKey}`,
    satellite: `https://api.maptiler.com/maps/satellite/style.json?key=${apiKey}`,
    hybrid: `https://api.maptiler.com/maps/hybrid/style.json?key=${apiKey}`,
  };

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: styles.streets,
      center: coordinates,
      zoom: 6,
      trackResize: true
    });
    

    map.current.addControl(new maplibregl.NavigationControl(), "top-right");

    const addMarker = () => {

      const el = document.createElement('div');
        el.className = 'custom-marker';
        
        
        el.innerHTML = `
          <div class="bg-black rounded-full h-7 w-7 flex justify-center items-center" >
          <i class="fa-solid fa-house fa-lg" style="color: #ffffff"></i>
          </div>
        `;

      const popup = new maplibregl.Popup({ offset: 25 })
          .setHTML(`<h4><b>${listing.location.toUpperCase()}</b></h4><p>Exact location provided after booking</p>`);

          new maplibregl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat(coordinates)
          .setPopup(popup
          )
          .addTo(map.current);
    };

  

    map.current.on('style.load', () => {
      addMarker();
      map.current.resize(); 
    });

    map.current.on('load', () => {
      map.current.resize();
      map.current.flyTo({
        center: coordinates,
        zoom: 12,
        speed: 1.2,
        curve: 1.42,
        essential: true 
      });
    });



    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [listing, coordinates]);


  const changeStyle = (mode) => {
    if (map.current) {
      map.current.setStyle(styles[mode]);
      setActiveMode(mode); 
    }
  };

 
  const getBtnClass = (mode) => {
    const baseClass = "px-4 py-1.5 text-sm font-semibold transition border";
    const activeClass = "bg-gray-800 text-white border-gray-800 shadow-md";
    const inactiveClass = "bg-white text-gray-800 border-gray-300 hover:bg-gray-800 hover:text-white";
    
    return `${baseClass} ${activeMode === mode ? activeClass : inactiveClass}`;
  };

  return (
    <div className="mt-8 mb-8">
      <h3 className="text-2xl font-bold text-gray-800">Where you'll be: </h3>
      <h2 className="text-2xl mb-4 text-gray-800 capitalize">{listing.location}</h2>
      
      
      <div className="flex mb-4">
        <button 
          onClick={() => changeStyle("streets")}
          className={getBtnClass("streets")}
        >
          Streets
        </button>
        
        <button 
          onClick={() => changeStyle("satellite")}
          className={getBtnClass("satellite")}
        >
          Satellite
        </button>
        
        <button 
          onClick={() => changeStyle("hybrid")}
          className={getBtnClass("hybrid")}
        >
          Hybrid
        </button>
      </div>

      <div 
        ref={mapContainer} 
        className="h-[450px] w-full rounded-2xl shadow-md border border-gray-200 relative overflow-hidden" 
      />
    </div>
  );
}