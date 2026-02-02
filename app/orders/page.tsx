'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LocationMap from '../components/home/map';

type UserType = {
  id: number;
  role: string;
  phone?: string;
  email?: string;
};

export default function OrdersPage() {
  const router = useRouter();

  const [user, setUser] = useState<UserType | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    service: 'Laundry',
    date: '',
    time: '',
    address: '',
    instructions: '',
    phone: '',
    email: '',
    paymentMethod: 'Cash',
    totalAmount: 0,
  });

  const [showMap, setShowMap] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // 🔐 Load auth info
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (!savedToken || !savedUser) {
      router.push('/login?redirect=/orders');
      return;
    }

    setToken(savedToken);
    setUser(JSON.parse(savedUser));
  }, [router]);

  // 🧾 Handle input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalAmount' ? Number(value) : value,
    }));
  };

  // 📍 Map confirm
  const handleLocationConfirm = (coords: { lat: number; lng: number }) => {
    setFormData(prev => ({
      ...prev,
      address: `${coords.lat.toFixed(6)},${coords.lng.toFixed(6)}`,
    }));
    setShowMap(false);
  };

  // 🚀 Submit order
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token || !user) {
      router.push('/login?redirect=/orders');
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/orders/placeorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          customerId: user.role === 'customer' ? user.id : null,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Order failed');
      }

      setMessage('✅ Order placed successfully!');
      setFormData({
        service: 'Laundry',
        date: '',
        time: '',
        address: '',
        instructions: '',
        phone: '',
        email: '',
        paymentMethod: 'Cash',
        totalAmount: 0,
      });

      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      setMessage('❌ ' + err.message);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 flex justify-center items-center p-4">
      <div className="bg-black text-white w-full max-w-md p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Laundry Service Order
        </h2>

        {message && (
          <div className="mb-4 text-center font-semibold">{message}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            name="service"
            value={formData.service}
            onChange={handleChange}
            className="w-full bg-gray-800 p-2 rounded"
          >
            <option>Laundry</option>
            <option>Wash</option>
            <option>Iron</option>
            <option>Dry Clean</option>
          </select>

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full bg-gray-800 p-2 rounded"
          />

          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            className="w-full bg-gray-800 p-2 rounded"
          />

          <div className="flex gap-2">
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Pickup address"
              required
              className="flex-1 bg-gray-800 p-2 rounded"
            />
            <button
              type="button"
              onClick={() => setShowMap(true)}
              className="bg-indigo-600 px-3 rounded"
            >
              Map
            </button>
          </div>

          <textarea
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            placeholder="Special instructions"
            className="w-full bg-gray-800 p-2 rounded"
          />

          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="w-full bg-gray-800 p-2 rounded"
          />

          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full bg-gray-800 p-2 rounded"
          />

          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="w-full bg-gray-800 p-2 rounded"
          >
            <option>Cash</option>
            <option>Card</option>
            <option>Online</option>
          </select>

          <input
            type="number"
            name="totalAmount"
            value={formData.totalAmount}
            onChange={handleChange}
            className="w-full bg-gray-800 p-2 rounded"
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 py-2 rounded hover:bg-indigo-700"
          >
            Place Order
          </button>
        </form>
      </div>

      {showMap && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
          <div className="bg-white w-[500px] h-[600px] p-4 rounded">
            <LocationMap onConfirm={handleLocationConfirm} />
            <button
              onClick={() => setShowMap(false)}
              className="mt-3 w-full bg-gray-300 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
