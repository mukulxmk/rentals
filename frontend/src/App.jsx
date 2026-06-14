import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from 'react-hot-toast';

const Home = lazy(() => import("./pages/Home"));
const ShowListing = lazy(() => import("./pages/ShowListing"));
const NewListing = lazy(() => import("./pages/NewListing"));
const EditListing = lazy(() => import("./pages/EditListing"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));


import Loader from "./components/Loader";

const PageLoader = () => (
  <Loader className="h-[70vh]" />
);

export default function App() {

  const isNotFound = !["/", "/listings", "/signup", "/login"].includes(location.pathname) &&
    !location.pathname.startsWith("/listings/");


  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '12px'
          }
        }}
      />
      <div className="flex flex-col min-h-screen">

        {!isNotFound && <Navbar />}
        <main className="container mx-auto px-4 py-8 flex-grow pt-25">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/listings" element={<Home />} />

              <Route path="/listings/:id" element={<ShowListing />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/listings/new" element={
                <ProtectedRoute>
                  <NewListing />
                </ProtectedRoute>
              } />

              <Route path="/listings/:id/edit" element={
                <ProtectedRoute>
                  <EditListing />
                </ProtectedRoute>
              } />


              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        {!isNotFound && <Footer />}
      </div>
    </BrowserRouter>
  );
}