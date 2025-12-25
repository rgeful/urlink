"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="sticky top-4 z-50 flex justify-center px-4">
      <header
        className={`
          w-full 
          max-w-4xl lg:max-w-[1394px]
          flex items-center justify-between 
          px-4 sm:px-8 py-3 
          transition-all duration-300
          ${scrolled ? "rounded-full bg-white/80 backdrop-blur shadow-lg" : ""}
        `}
      >
        <div className="flex items-center gap-2">
          <Image
            src="/UrlinkLogo.svg"
            alt="URLink Logo"
            width={160}
            height={40}
            className="rounded-2xl w-16 h-auto md:hidden"
          />
          <Image
            src="/UrLinkLogo2.svg"
            alt="URLink Logo"
            width={160}
            height={40}
            className="rounded-2xl hidden md:block"
          />
        </div>

        <div className="flex gap-2 sm:gap-3">
          <Link
            href="/login"
            className="px-3 py-2 sm:px-6 sm:py-3 rounded-full border border-gray-300 hover:border-gray-400 transition-colors text-sm sm:text-base"
          >
            login
          </Link>
          <Link
            href="/signup"
            className="px-3 py-2 sm:px-6 sm:py-3 rounded-full bg-[#111] text-white hover:bg-black transition-colors text-sm sm:text-base"
          >
            sign up
          </Link>
        </div>
      </header>
    </div>
  );
}
