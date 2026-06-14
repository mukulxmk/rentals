
import React, { useState, useEffect } from "react";
import API from "../api";

export default function StateFilter({ selectedState, onStateChange }) {
    const [states, setStates] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        API.get("/listings/states")
            .then((res) => setStates(["All States", ...res.data]))
            .catch((err) => console.error("Failed to load states", err));
    }, []);

    return (
        <div className="relative inline-block w-64">
            <label className="block text-sm font-medium text-gray-700 mb-1 pl-1">
                Filter by State
            </label>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-white border border-gray-300 px-4 py-3 rounded-xl shadow-sm flex justify-between items-center hover:border-black transition-colors"
            >
                <span className={`font-medium ${selectedState === 'All States' ? 'text-gray-500' : 'text-black'}`}>
                    {selectedState}
                </span>
                <svg
                    className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-2xl max-h-80 overflow-y-auto">
                    {states.map((state) => (
                        <div
                            key={state}
                            onClick={() => {
                                onStateChange(state);
                                setIsOpen(false);
                            }}
                            className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors text-sm font-medium ${selectedState === state ? "bg-gray-100 text-black" : "text-gray-600"
                                }`}
                        >
                            {state}
                        </div>
                    ))}
                </div>
            )}

            {isOpen && (
                <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
            )}
        </div>
    );
}
