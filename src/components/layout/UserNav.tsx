"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { User, LogOut } from "lucide-react";

export function UserNav() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="text-sm text-muted-foreground">Loading...</div>;
  }

  if (status === "authenticated" && session.user) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/settings" className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity">
          {session.user.image ? (
            <img 
              src={session.user.image} 
              alt={session.user.name || "User"} 
              className="h-8 w-8 rounded-full ring-1 ring-border"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center ring-1 ring-border">
              <User className="h-4 w-4" />
            </div>
          )}
          <span className="font-medium hidden md:block">{session.user.name}</span>
        </Link>
        <button
          onClick={() => signOut()}
          className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-1"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn()}
      className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
    >
      Sign In
    </button>
  );
}
