import { useEffect, useState } from "react";
import axios from "axios";
import API from "../api";
import Loader from "../components/Loader";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("listings");
  const [data, setData] = useState({ listings: [], reviews: [] });
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);


  const fetchData = async () => {
    try {

      const [s, l, r] = await Promise.all([
        API.get("/admin/stats", { withCredentials: true }),
        API.get("/admin/pending", { withCredentials: true }),
        API.get("/admin/pending-reviews", { withCredentials: true })
      ]);
      setStats(s.data);
      setData({ listings: l.data, reviews: r.data });
    } catch (err) {
      console.error("Fetch Error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const handleAction = async (id, action, isReview = false) => {

    const url = `/admin/${isReview ? 'reviews/' : ''}${action}/${id}`;

    try {
      if (action === 'approve') {
        await API.patch(url, {}, { withCredentials: true });
      } else {
        await API.delete(url, { withCredentials: true });
      }

      alert(`${isReview ? 'Review' : 'Listing'} ${action}d successfully!`);
      fetchData();
    } catch (err) {
      console.error("Action Error:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Action failed. Check console for details.");
    }
  };

  const handleApproveAll = async () => {
    if (!window.confirm("Approve ALL pending listings?")) return;
    try {
      await API.patch("/admin/approve-all", {}, { withCredentials: true });
      alert("All listings approved!");
      fetchData();
    } catch (err) {
      alert("Error approving all");
    }
  };

  if (loading) {
    return <Loader className="h-screen w-full" />;
  }
  return (
    <div className="max-w-6xl mx-auto p-6 mt-20">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-black text-gray-900">Admin Control</h1>
        <div className="flex gap-4">
          <button
            onClick={handleApproveAll}
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shadow-md transition-transform active:scale-95"
          >
            Approve All Listings
          </button>
          <button onClick={fetchData} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 w-10 h-10 flex items-center justify-center">
            <i className="fa-solid fa-rotate-right"></i>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 shadow-sm">
          <p className="text-xs font-bold text-blue-500 uppercase tracking-widest">Total Listings</p>
          <p className="text-3xl font-black text-blue-900">{stats?.listings?.total || 0}</p>
        </div>
        <div className="p-6 bg-orange-50 rounded-3xl border border-orange-100 shadow-sm">
          <p className="text-xs font-bold text-orange-500 uppercase tracking-widest">Pending Listings</p>
          <p className="text-3xl font-black text-orange-900">{stats?.listings?.pending || 0}</p>
        </div>
        <div className="p-6 bg-purple-50 rounded-3xl border border-purple-100 shadow-sm">
          <p className="text-xs font-bold text-purple-500 uppercase tracking-widest">Pending Reviews</p>
          <p className="text-3xl font-black text-purple-900">{stats?.reviews?.pending || 0}</p>
        </div>
      </div>


      <div className="flex bg-gray-100 p-1 rounded-2xl w-fit mb-8">
        <button
          onClick={() => setActiveTab("listings")}
          className={`px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'listings' ? 'bg-white text-black shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Listings ({data.listings.length})
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'reviews' ? 'bg-white text-black shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Reviews ({data.reviews.length})
        </button>
      </div>


      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="p-6 text-sm font-bold text-gray-400 uppercase tracking-wider">Content Info</th>
              <th className="p-6 text-sm font-bold text-gray-400 uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {(activeTab === "listings" ? data.listings : data.reviews).length > 0 ? (
              (activeTab === "listings" ? data.listings : data.reviews).map(item => (
                <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      {item.image?.url && <img src={item.image.url} className="w-12 h-12 rounded-xl object-cover" alt="" />}
                      <div>
                        <p className="font-bold text-gray-900 text-lg">{item.title || `Review by ${item.author?.username || 'User'}`}</p>
                        <p className="text-sm text-gray-500 italic">{item.location || item.comment}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleAction(item._id, 'approve', activeTab === 'reviews')}
                        className="bg-green-600 text-white px-6 py-2.5 rounded-xl text-xs font-black hover:bg-green-700 transition-transform active:scale-95"
                      >
                        APPROVE
                      </button>
                      <button
                        onClick={() => handleAction(item._id, 'reject', activeTab === 'reviews')}
                        className="bg-red-50 text-red-600 px-6 py-2.5 rounded-xl text-xs font-black hover:bg-red-100 transition-transform active:scale-95"
                      >
                        REJECT
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="p-20 text-center text-gray-400 font-medium italic">
                  No pending {activeTab} to review at the moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}