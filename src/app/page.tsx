"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-700">Loading...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    // Although useEffect handles redirection, returning null or a loading state
    // prevents rendering the page content momentarily before redirection.
    return null; 
  }

  if (session && session.user) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
        <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Welcome, {session.user.email}!
          </h1>
          <p className="text-gray-600 mb-8">
            You have successfully logged in.
          </p>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-150"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  // Fallback for any other unexpected state, though typically covered by above checks.
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <p className="text-xl text-gray-700">An unexpected error occurred.</p>
    </div>
  );
}
