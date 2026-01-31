"use client";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";

// Use an interface with optional children
interface AdminLayoutProps {
  children?: ReactNode; // optional to satisfy Next.js types
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-blue-950 via-blue-800 to-indigo-700 text-white p-6 flex flex-col">
        <h2 className="text-3xl font-extrabold mb-10 tracking-wide">Admin Panel</h2>
        <nav className="flex-1">
          <ul className="space-y-4">
            <li>
              <button
                onClick={() => router.push("/dashboard/admin")}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-black transition-all duration-200 w-full"
              >
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => router.push("/managers")}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-black transition-all duration-200 w-full"
              >
                All Managers
              </button>
            </li>
            <li>
              <button
                onClick={() => router.push("/settings")}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-black transition-all duration-200 w-full"
              >
                Settings
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-5 p-10">
        <div className="bg-white p-6 rounded-2xl shadow">{children}</div>
      </main>
    </div>
  );
}
