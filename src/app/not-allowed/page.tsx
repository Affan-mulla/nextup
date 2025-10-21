// src/app/not-allowed/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotAllowedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white px-4">
      <h1 className="text-4xl font-bold mb-4">🚫 Access Denied</h1>
      <p className="text-lg text-gray-400 mb-8">
        You don&apos;t have permission to view this page.
      </p>
      <Link href="/feed">
        <Button variant="default" className="rounded-2xl px-6">
          Go Back Home
        </Button>
      </Link>
    </div>
  );
}
