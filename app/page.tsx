import Image from "next/image";
import NavBar from "../components/NavBar";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">

      <NavBar />
      <section className="px-8 py-16 grid gap-12 lg:grid-cols-2 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            More than just a link, <br /> it&apos;s your social home.
          </h1>
          <p className="text-gray-600 max-w-md">
            URLink lets creators share all their links, posts, and followers in one clean,
            social-style profile.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="flex items-center border border-gray-400 rounded-full px-4 py-2 flex-1">
              <span className="text-gray-400 text-sm mr-2">urlink.app/</span>
              <input
                className="flex-1 outline-none text-sm"
                placeholder="yourname"
              />
            </div>
            <a
              href="/signup"
              className="px-6 py-2 rounded-full bg-black text-white text-sm font-medium"
            >
              Create UrLink
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}