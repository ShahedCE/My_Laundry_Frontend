'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { LoginFormData, loginSchema } from '../../../lib/validation/login.schema';
import { UserContext } from '../../context/UserContext';

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/'; // default home

const context = useContext(UserContext);
if (!context) return null; // or show error
const { setUser } = context;


  const {register,handleSubmit, formState: { errors },} = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/authentication/login`,
        data
      );

      const { token, message, customerId } = response.data;

      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('customerId', customerId.toString());
      localStorage.setItem('user', JSON.stringify({  id: customerId, phone: data.phone, role: 'customer', full_name: '' }));

      // Update Context
// Assuming 'customerId' comes from backend:
setUser({
  id: customerId,       // map customerId to id
  full_name: '',        //  can be fetch later or leave empty
  phone: data.phone,
  role: 'customer',     // must include role
});

      setServerMessage(message);

      // Redirect back to page user wanted
      router.push(redirectUrl);
    } catch (error: any) {
      setServerMessage(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

      {serverMessage && (
        <p
          className={`mb-4 text-sm ${
            serverMessage.toLowerCase().includes('success')
              ? 'text-green-600'
              : 'text-red-600'
          }`}
        >
          {serverMessage}
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">Mobile Number</label>
          <input
            type="tel"
            {...register('phone')}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            {...register('password')}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
