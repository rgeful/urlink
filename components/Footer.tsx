import Image from "next/image";
export default function Footer() {
    return (
<footer className="w-full py-6 mt-20">
      <div className="max-w-4xl lg:max-w-[1394px] mx-auto px-4 sm:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <Image
                    src="/UrLinkLogo2.svg"
                    alt="URLink Logo"
                    width={160}
                    height={40}
                    className="rounded-2xl hidden md:block"
                  />
        <div className="flex gap-4">
          <a href="/terms" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Terms of Service</a>
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} - All rights reserved.</p>
        </div>
      </div>
    </footer>
    );
}           