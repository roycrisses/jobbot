"use client";

import { signOut } from "next-auth/react";

export default function Header() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
      <div className="flex-1" />
      <div className="flex items-center space-x-4">
        <button
          onClick={() => signOut()}
          className="text-sm font-medium text-gray-700 hover:text-black transition-colors"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
