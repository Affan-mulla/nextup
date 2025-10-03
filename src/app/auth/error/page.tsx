"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ErrorPage() {
  // const searchParams = useSearchParams();
  // const error = searchParams.get("error");

  const message =" Something went wrong. Please try again.";

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white px-4">
      <div className="max-w-md w-full bg-neutral-900 rounded-2xl shadow-lg p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">⚠️ Authentication Error</h1>
        <p className="text-neutral-300 mb-6">{message}</p>

        <Link
          href="/auth/signin"
          className="inline-block px-6 py-2 rounded-xl bg-white text-neutral-900 font-semibold hover:bg-neutral-200 transition"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
