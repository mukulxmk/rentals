import { Link } from'react-router-dom'

export default function UserMenu({
  currUser,
  handleLogout,
  setIsUserDropdownOpen
}) {
  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={() => setIsUserDropdownOpen(false)}
      />

      <div
        className="
          absolute
          right-0
          top-full
          mt-2
          w-[90vw]
          max-w-[280px]
          bg-white
          rounded-xl
          shadow-xl
          border
          border-gray-100
          overflow-hidden
          z-50
        "
      >
        <div className="flex flex-col py-1">
          <Link
            to="/profile"
            onClick={() => setIsUserDropdownOpen(false)}
          >
            <div className="px-4 py-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50">
              <div className="bg-gray-800 text-white w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold">
                {currUser?.username?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <div className="flex flex-col min-w-0">
                <span className="font-bold text-gray-800 text-sm truncate">
                  {currUser?.username || "User"}
                </span>

                <span className="text-xs text-gray-500">
                  Member
                </span>
              </div>
            </div>
          </Link>

          <Link
            to="/my-bookings"
            className="px-4 py-3 text-sm hover:bg-gray-100"
            onClick={() => setIsUserDropdownOpen(false)}
          >
            My Bookings
          </Link>

          <Link
            to="/my-listings"
            className="px-4 py-3 text-sm hover:bg-gray-100"
            onClick={() => setIsUserDropdownOpen(false)}
          >
            Host Dashboard
          </Link>

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
          >
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            Log out
          </button>
        </div>
      </div>
    </>
  );
}