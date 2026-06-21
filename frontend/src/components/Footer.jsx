import { useState, useRef } from 'react';

export function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);
  const intervalRef = useRef(null);

  function handleStart() {
    setStartTime(Date.now());
    setNow(Date.now());

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 10);
  }

  function handleStop() {
    clearInterval(intervalRef.current);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) ;
  }

  return (
    <>
      <h1>Time passed: {secondsPassed.toFixed(9)}</h1>
      <button onClick={handleStart}>
        Start
      </button>
      <button onClick={handleStop}>
        Stop
      </button>
    </>
  );
}


export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t py-8 mt-12">
      <div className="container mx-auto px-4 text-center gap-4">
        <div className="flex justify-center gap-4 mb-2">
       
        <a href="https://www.instagram.com/dheer1j_" target="_blank" rel="noopener noreferrer">
          <i className="fa-brands fa-instagram hover:text-pink-600 cursor-pointer transition-colors text-xl"></i>
        </a>
        <a href="https://www.linkedin.com/in/dheeraj-kumar-prajapati-8bb545224/" target="_blank" rel="noopener noreferrer">
          <i className="fa-brands fa-linkedin hover:text-blue-700 cursor-pointer transition-colors text-xl"></i>
        </a>
        </div>

        <div>
          <Stopwatch/>
        </div>

        <p className="text-gray-600 text-sm">&copy; WanderList Private Limited</p>
        <div className="flex justify-center gap-4 text-sm mt-2 underline text-gray-500">
          <a href="#">Privacy</a> <a href="#">Terms</a> <a href="#">Details</a>
        </div>
      </div>
    </footer>
  );
}
