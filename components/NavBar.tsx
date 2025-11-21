import Image from "next/image";

export default function NavBar() {
    return (
      <header className="flex items-center justify-between px-4 sm:px-8 md:px-16 lg:px-64 xl:px-84 py-3 md:py-0.5">
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
          <a href="/login" className="px-3 py-2 sm:px-6 sm:py-3 rounded-full border border-gray-300 hover:border-gray-400 transition-colors text-sm sm:text-base">
            login
          </a>
          <a href="/signup" className="px-3 py-2 sm:px-6 sm:py-3 rounded-full bg-gray-950 text-white hover:bg-gray-900 transition-colors text-sm sm:text-base">
            sign up
          </a>
        </div>
      </header>
    );
  }