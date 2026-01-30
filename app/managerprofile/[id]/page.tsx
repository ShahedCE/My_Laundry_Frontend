'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";


type Manager = {
  id: number;
  fullname: string;
  email: string;
  phone: string;
  address: string;
  profile_picture: string;
  status: string;
  created_at: string;
  updatedAt?: string;
};

export default function ManagerProfile() {
  const [manager, setManager] = useState<Manager | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchManager = async () => {
      try {
        const token = localStorage.getItem("token");
        const userString = localStorage.getItem("user");

        if (!token || !userString) {
          router.push("/login");
          return;
        }

        const user = JSON.parse(userString);
        if (user.role !== "manager") {
          router.push("/login"); // only manager can access
          return;
        }

        // Fetch manager profile by user ID
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/manager/managerprofile/${user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setManager(res.data);

      } catch (err: any) {
        console.error("Error fetching manager:", err);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchManager();
  }, [router]);

  if (loading) return <p className="p-6 text-gray-600">Loading profile...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!manager) return <p className="p-6 text-gray-500">Profile not found</p>;

return (
  <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex justify-center items-start py-12 px-4">
    <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-500 h-28 relative flex items-center justify-center">
        <h1 className=" font-extrabold text-blue-700 text-4xl md-10">My Profile</h1>
      </div>

      {/* Profile Content */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 p-8">
        
        {/* Profile Picture */}
        <div className="relative -mt-16 md:mt-0">
          <img
            src={
              manager.profile_picture
                ? `${process.env.NEXT_PUBLIC_API_ENDPOINT}/uploads/manager/${manager.profile_picture}`
                : "/default-profile.png"
            }
            alt={manager.fullname}
            className="w-36 h-36 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-lg"
          />
          <span className="absolute bottom-2 right-2 w-4 h-4 rounded-full bg-green-500 border-2 border-white"></span>
        </div>

        {/* Info Section */}
        <div className="flex-1 space-y-4 md:space-y-6">
          
          {/* Full Name */}
          <div className="flex items-center gap-2">
            <span className="text-blue-600 text-lg">👤</span>
            <div>
              <h2 className="text-gray-500 font-semibold text-sm uppercase">Full Name</h2>
              <p className="text-xl font-bold text-gray-900">{manager.fullname}</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-2">
            <span className="text-green-500 text-lg">✉️</span>
            <div>
              <h2 className="text-gray-500 font-semibold text-sm uppercase">Email</h2>
              <p className="text-gray-800">{manager.email}</p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-2">
            <span className="text-purple-500 text-lg">📞</span>
            <div>
              <h2 className="text-gray-500 font-semibold text-sm uppercase">Phone</h2>
              <p className="text-gray-800">{manager.phone}</p>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-center gap-2">
            <span className="text-orange-500 text-lg">🏠</span>
            <div>
              <h2 className="text-gray-500 font-semibold text-sm uppercase">Address</h2>
              <p className="text-gray-800">{manager.address}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => router.push(`/managerprofile/editprofile/${manager.id}`)}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-xl shadow-md transition"
            >
              Edit Profile
            </button>
            <button
              onClick={() => router.push("/customer")}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-2 rounded-xl shadow-md transition"
            >
              Back
            </button>
          </div>

        </div>
      </div>
    </div>
  </div>
);


}
