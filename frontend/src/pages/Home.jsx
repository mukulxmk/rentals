import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import ListingCard from "../components/ListingCard";
import API from "../api";
import StateFilter from "../components/StateFilter";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Loader from "../components/Loader";


export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [selectedState, setSelectedState] = useState("All States");
  const [page, setPage] = useState(1);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);


  const INITIAL_LIMIT = 48;
  const LOAD_MORE_LIMIT = 24;

  useEffect(() => {
    const stateParam = searchParams.get('state');
    if (stateParam) {
      if (selectedState !== stateParam) setSelectedState(stateParam);
    } else {

      if (selectedState !== "All States") {
        setSelectedState("All States");

      }
    }
  }, [searchParams]);

  const handleStateChange = (newState) => {
    if (newState === "All States") {
      setSearchParams({});
    } else {
      setSearchParams({ state: newState });
    }
  };

  useEffect(() => {

    setListings([]);
    setPage(1);
    setOffset(0);
    setHasMore(true);
    fetchListings(0, selectedState, true);
  }, [selectedState]);

  const fetchListings = async (currentOffset, stateFilter, isReset = false) => {

    if (loading && !isReset) return;

    setLoading(true);
    try {
      const limit = isReset ? INITIAL_LIMIT : LOAD_MORE_LIMIT;
      const stateQuery = stateFilter === "All States" ? "" : `&state=${encodeURIComponent(stateFilter)}`;


      const res = await API.get(`/listings?offset=${currentOffset}&limit=${limit}${stateQuery}`);

      const newListings = res.data;

      setListings(prev => isReset ? newListings : [...prev, ...newListings]);
      setHasMore(newListings.length === limit);

      if (!isReset) {
        setOffset(prev => prev + limit);
      } else {
        setOffset(limit);
      }

      setLoading(false);

    } catch (err) {
      console.error("API Failed, using mock data", err);
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchListings(offset, selectedState, false);
    }
  };

  const gridRef = useRef(null);
  const animatedIds = useRef(new Set());

  useGSAP(() => {
    if (listings.length > 0) {
      const items = gsap.utils.toArray(".listing-card-item");


      items.forEach((item) => {
        const id = item.dataset.id;
        if (id && !animatedIds.current.has(id)) {
          gsap.set(item, { y: 50, opacity: 0, scale: 0.95 });
        }
      });

      ScrollTrigger.batch(".listing-card-item", {
        start: "top 90%",
        interval: 0.15,
        onEnter: (batch) => {

          const toAnimate = batch.filter(el => !animatedIds.current.has(el.dataset.id));

          if (toAnimate.length > 0) {

            toAnimate.forEach(el => animatedIds.current.add(el.dataset.id));

            gsap.to(toAnimate, {
              opacity: 1,
              y: 0,
              scale: 1,
              stagger: 0.15,
              duration: 0.8,
              ease: "power3.out",
              overwrite: true
            });
          }
        },
        onLeaveBack: (batch) => {

          gsap.set(batch, { opacity: 0, y: 50, scale: 0.95, overwrite: true });

          batch.forEach(el => animatedIds.current.delete(el.dataset.id));
        }
      });
    }
  }, { scope: gridRef, dependencies: [listings] });




  return (
    <>
      <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4 mt-10">

        <div className="flex flex-col gap-4 mb-8">
          <StateFilter
            selectedState={selectedState}
            onStateChange={handleStateChange}
          />
        </div>

        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
          {listings.map((l) => (
            <div key={l._id} data-id={l._id} className="listing-card-item">
              <ListingCard listing={l} />
            </div>
          ))}

          {listings.length === 0 && !loading && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
              <i className="fa-regular fa-face-frown-open text-4xl mb-3 text-gray-300"></i>
              <p className="text-lg font-medium">No destinations found in {selectedState}.</p>
              <button onClick={() => handleStateChange("All States")} className="mt-4 text-rose-500 hover:underline font-semibold">Clear Filters</button>
            </div>
          )}
        </div>

        {loading && <Loader className={listings.length > 0 ? "py-10" : "h-[70vh]"} />}


        {!loading && hasMore && listings.length > 0 && (
          <div className="flex justify-center py-10">
            <button
              onClick={handleLoadMore}
              className="bg-white border hover:bg-black hover:text-white border-black text-black font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-sm hover:shadow-lg active:scale-95 cursor-pointer"
            >
              Show More
            </button>
          </div>
        )}

        {!hasMore && listings.length > 0 && (
          <div className="py-10 text-center text-gray-400 text-sm">
            You've reached the end of the list.
          </div>
        )}
      </div>
    </>
  );
};