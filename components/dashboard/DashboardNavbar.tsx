"use client";

import Image from "next/image";
import Link from "next/link";

interface DashboardNavbarProps {
  userName: string | null;
  avatarUrl: string | null;
}

export default function DashboardNavbar({
  userName,
  avatarUrl,
}: DashboardNavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="flex items-center">
          <Image
            src="/UrLinkLogo2.svg"
            alt="URLink Logo"
            width={160}
            height={40}
            className="h-15 w-auto"
          />
        </Link>

        <div className="flex items-center gap-3">
          {userName && (
            <Link href="/dashboard/settings" className="text-md font-medium text-slate-700 hover:text-slate-900 transition-colors">
              {userName}
            </Link>
          )}
          <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-200 border border-slate-300">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <span className="text-xs text-slate-500">
                  {userName?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

