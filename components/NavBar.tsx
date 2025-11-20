import Image from "next/image";

export default function NavBar() {
    return (
      <header className="flex items-center justify-between px-24 py-6">
        <div className="flex items-center gap-2">
          <Image
            src="/UrlinkLogo.svg"
            alt="URLink Logo"
            width={160}
            height={40}
            className="rounded-2xl md:hidden"
          />
          <Image
            src="/UrLinkLogo2.svg"
            alt="URLink Logo"
            width={160}
            height={40}
            className="rounded-2xl hidden md:block"
          />
        </div>
        <div className="flex gap-3">
          <a href="/login" className="px-6 py-3 rounded-full border border-gray-300 hover:border-gray-400 transition-colors">
            login
          </a>
          <a href="/signup" className="px-6 py-3 rounded-full bg-black text-white hover:bg-gray-900 transition-colors">
            get started
          </a>
        </div>
      </header>
    );
  }