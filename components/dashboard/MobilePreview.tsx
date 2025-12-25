import { getIcon } from "@/constants/icons";
import { IconLink } from "./SocialLinks";
import { Link as CustomLink } from "./CustomLinks";
import { FaExternalLinkAlt } from "react-icons/fa";
import Link from "next/link";

interface MobilePreviewProps {
  avatarUrl: string | null;
  pageName: string;
  username: string | null;
  intro: string;
  iconLinks?: IconLink[];
  links?: CustomLink[];
  cardColor?: string;
  textColor?: string;
  onLinkClick?: (linkId: string) => void;
  fullScreen?: boolean;
  showExternalLink?: boolean;
}

function ProfileContent({
  avatarUrl,
  pageName,
  username,
  intro,
  iconLinks,
  links,
  textColor,
  onLinkClick,
}: {
  avatarUrl: string | null;
  pageName: string;
  username: string | null;
  intro: string;
  iconLinks: IconLink[];
  links: CustomLink[];
  textColor: string;
  onLinkClick?: (linkId: string) => void;
}) {
  return (
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
      <p 
        className="w-full text-center text-2xl font-semibold px-4 wrap-break-word"
        style={{ color: textColor }}
      >
        {pageName || username || ""}
      </p>

      {/* Bio */}
      {intro && (
        <div 
          className="w-full rounded-xl px-4 py-2 text-md text-center wrap-break-word"
          style={{ color: textColor }}
        >
          {intro}
        </div>
      )}

      {/* Social Links */}
      {iconLinks.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {iconLinks
            .filter(link => link.isActive)
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition hover:opacity-80"
              >
                {getIcon(link.platform)}
              </a>
            ))}
        </div>
      )}

      {/* Custom Links */}
      {links.length > 0 && (
        <div className="w-full space-y-3 mt-4">
          {links
            .filter(link => link.isActive)
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onLinkClick?.(link.id)}
                className="flex items-center justify-center w-full rounded-xl border border-gray-300 px-4 py-3 text-center transition bg-white hover:shadow-sm"
              >
                <div className="flex-1 min-w-0">
                  <div 
                    className="font-semibold text-slate-900 text-center"
                    style={{ color: textColor === "#ffffff" ? "#000000" : textColor }}
                  >
                    {link.title}
                  </div>
                  {link.subtitle && (
                    <div 
                      className="text-sm text-slate-600 text-center mt-0.5"
                      style={{ color: textColor === "#ffffff" ? "#4b5563" : textColor, opacity: 0.8 }}
                    >
                      {link.subtitle}
                    </div>
                  )}
                </div>
              </a>
            ))}
        </div>
      )}
    </div>
  );
}

export default function MobilePreview({
  avatarUrl,
  pageName,
  username,
  intro,
  iconLinks = [],
  links = [],
  cardColor = "#ffffff",
  textColor = "#000000",
  onLinkClick,
  fullScreen = false,
  showExternalLink = false,
}: MobilePreviewProps) {
  const content = (
    <ProfileContent
      avatarUrl={avatarUrl}
      pageName={pageName}
      username={username}
      intro={intro}
      iconLinks={iconLinks}
      links={links}
      textColor={textColor}
      onLinkClick={onLinkClick}
    />
  );

  if (fullScreen) {
    return (
      <div className="w-full h-full overflow-y-auto px-6 py-8" style={{ backgroundColor: cardColor }}>
        {content}
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden max-w-lg rounded-4xl px-4 py-6 flex items-center justify-center">
      <div 
        className="w-full max-w-[400px] min-w-[300px] aspect-[9/16] rounded-4xl px-8 py-10 overflow-y-auto border border-slate-300 shadow-md relative"
        style={{ backgroundColor: cardColor }}
      >
        {username && showExternalLink && (
          <Link
            href={`/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-4 right-4 p-2 rounded-full bg-black/10 hover:bg-black/20 transition-colors"
            style={{ color: textColor }}
          >
            <FaExternalLinkAlt size={16} />
          </Link>
        )}
        {content}
      </div>
    </div>
  );
}