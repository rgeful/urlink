import Image from "next/image";
import Link from "next/link";

export default function Hero() {
    return (
<section className="px-4 sm:px-8 md:px-16 lg:px-64 pt-4 sm:pt-8 md:pt-12 pb-20 sm:pb-32 md:pb-44 grid gap-8 sm:gap-12 lg:grid-cols-2 items-center">
        <div className="lg:order-1 order-2 space-y-4 sm:space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight">
            a beautiful home <br /> for your online presence
          </h1>
          <p className="text-gray-600 max-w-md text-sm, sm:text-base">
            UrLink lets everyone share all their links, posts, and followers in one clean,
            social-style profile
          </p>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="flex items-center border border-gray-300 rounded-full px-3 sm:px-4 py-2 sm:py-2 w-full max-w-2xl">
              <span className="text-gray-400 text-xs sm:text-sm mr-0.5 whitespace-nowrap">urlink.app/</span>
              <input
                className="flex-1 outline-none text-xs sm:text-sm min-w-0"
                placeholder="urname"
              />
              <Link
                href="/signup"
                className="hidden sm:block px-6 py-2 rounded-full bg-[#111] text-white text-sm font-medium hover:bg-black transition-colors ml-2 shrink-0"
              >
                create UrLink
              </Link>
            </div>

            <Link
              href="/signup"
              className="sm:hidden w-full px-4 py-2 rounded-full bg-gray-950 text-white text-xs font-medium hover:bg-gray-900 transition-colors text-center"
            >
              create UrLink
            </Link>
          </div>
        </div>

        <div className="lg:order-2 order-1">
          <Image
            src="/visual4.jpg"
            alt="UrLink Preview"
            width={1000}
            height={1000}
            className="w-full h-auto rounded-2xl"
            priority
          />
        </div>
      </section>
    );
}