"use client";

import axios from "axios";
import { Console } from "console";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { z } from "zod";
import { UserContext } from "../context/UserContext";

const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Username / Email / Phone is required")
    .refine((val) => {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      const isPhone = /^01\d{9}$/.test(val); // BD phone
      const isName = val.length >= 3;

      return isEmail || isPhone || isName;
    }, {
      message: "Enter valid Email, Phone number, or Username",
    }),

  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {

  const {setUser} = useContext(UserContext)!; //can be null
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    document.title = "Login | Doctor Laundry";
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = loginSchema.safeParse({ identifier, password });

    if (!result.success) {
      setError(result.error.issues[0].message);
      setSuccess("");
      return;
    }

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_ENDPOINT + "/auth/login",
        result.data,
        { headers: { "Content-Type": "application/json" } }
      );

  //set token and userinfo with role
    // backend should return { token: "..." }
      // Save token for future requests
     const { access_token, user } = response.data;

localStorage.setItem('token', access_token);
localStorage.setItem('user', JSON.stringify(user)); // ✅ full user save

      setUser(user);
      setError("");
      setSuccess("Login successful!");
      

      // role based redirect
      if (user?.role == "admin") router.push("/dashboard/admin");
      else if (user?.role == "manager") router.push("/customer");
      else router.push("/orders");

    } catch (err: any) {
      setSuccess("");
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block font-medium">
              Username / Email / Phone
            </label>
            <input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {error && <p className="text-red-600 font-bold">{error}</p>}
          {success && <p className="text-green-600 font-bold">{success}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-4">
          New here?{" "}
          <Link href="./signup/customer_signup" className="text-green-600">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
