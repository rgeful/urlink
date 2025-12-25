import Link from "next/link";
import Image from "next/image";

export default function SignupButton() {
  return (
    <Link
      href="/signup"
      className="flex items-center gap-3 bg-slate-100 text-white px-4 py-2.5 rounded-full shadow-md hover:bg-slate-200 transition-colors w-fit"
    >
      <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0">
        <Image
          src="/UrlinkLogo.svg"
          alt="UrLink Logo"
          width={100}
          height={100}
          className="h-10 w-auto"
          priority
        />
      </div>
      <span className="text-sm text-black font-medium whitespace-nowrap">create urlink</span>
    </Link>
  );
}

