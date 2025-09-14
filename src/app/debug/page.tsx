"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function DebugPage() {
  const { data: session, status } = useSession();

  return (
    <div>
      <p>Status: {status}</p>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      {status === "unauthenticated" && (
        <button onClick={() => signIn("github")}>Sign in with GitHub</button>
      )}
      {status === "authenticated" && (
        <button onClick={() => signOut()}>Sign out</button>
      )}
    </div>
  );
}
