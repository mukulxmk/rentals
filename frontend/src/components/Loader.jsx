const Loader = ({ className = "h-screen" }) => {
    return (
        <div className={`flex flex-col justify-center items-center ${className}`}>
            <dotlottie-player
                src="/Trail-loading.lottie"
                background="transparent"
                speed="1"
                style={{ width: '100px', height: '100px' }}
                loop
                autoplay
            ></dotlottie-player>
            <p style={{ fontFamily: '"Funnel Display", sans-serif' }} className="mt-2 text-2xl font-medium text-gray-900 dark:text-gray-900 tracking-wide">
                Loading...
            </p>
        </div>
    );
};

export default Loader;
