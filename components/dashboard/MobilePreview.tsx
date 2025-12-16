import Image from "next/image";
import { getIcon } from "@/constants/icons";

interface IconLink {
  id: string;
  platform: string;
  url: string;
  orderIndex: number;
  isActive: boolean;
}

interface MobilePreviewProps {
  avatarUrl: string | null;
  pageName: string;
  username: string | null;
  intro: string;
  iconLinks?: IconLink[];
}

export default function MobilePreview({
  avatarUrl,
  pageName,
  username,
  intro,
  iconLinks = [],
}: MobilePreviewProps) {
  return (
    <div className="w-full overflow-hidden max-w-lg rounded-4xl px-4 py-6 flex items-center justify-center">
      <div className="w-full max-w-[400px] aspect-9/16 rounded-4xl bg-white px-8 py-10 overflow-y-auto border border-slate-200">
        <div className="flex flex-col items-center">
          {/* Avatar */}
          <div className="mb-4 h-28 w-28 overflow-hidden rounded-full bg-slate-200">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>

          {/* Name */}
          <p className="w-full text-center text-2xl font-semibold px-4 py-2 wrap-break-word">
            {pageName || username}
          </p>

          {/* Bio */}
          {intro && (
            <div className="w-full rounded-xl px-4 py-2 text-md text-center text-slate-600 wrap-break-word">
              {intro}
            </div>
          )}

          {/* Social Links */}
          {iconLinks.length > 0 && (
            <div className="flex flex-wrap justify-center">
              {iconLinks
                .filter(link => link.isActive)
                .sort((a, b) => a.orderIndex - b.orderIndex)
                .map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-12 w-13 items-center justify-center rounded-full text-slate-800 transition hover:text-black"
                  >
                    {getIcon(link.platform)}
                  </a>
                ))}
            </div>
          )}

          {/* Branding */}
          <div className="mt-10 flex justify-center">
            <Image
              src="/UrLinkLogo2.svg"
              alt="URLink Logo"
              width={110}
              height={30}
              className="opacity-80"
            />
          </div>
        </div>
      </div>
    </div>
  );
}