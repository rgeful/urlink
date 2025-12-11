export default function Hero() {
    return (
<section className="px-4 sm:px-8 md:px-16 lg:px-64 py-20 sm:py-32 md:py-44 grid gap-8 sm:gap-12 lg:grid-cols-2 items-center">
        <div className="space-y-4 sm:space-y-6">
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
              <a
                href="/signup"
                className="hidden sm:block px-6 py-2 rounded-full bg-[#111] text-white text-sm font-medium hover:bg-black transition-colors ml-2 shrink-0"
              >
                create UrLink
              </a>
            </div>

            <a
              href="/signup"
              className="sm:hidden w-full px-4 py-2 rounded-full bg-gray-950 text-white text-xs font-medium hover:bg-gray-900 transition-colors text-center"
            >
              create UrLink
            </a>
          </div>
        </div>
      </section>
    );
}