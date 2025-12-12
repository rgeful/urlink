import { 
  FaGithub, 
  FaTwitter,
  FaTiktok,
  FaTelegram, 
  FaInstagram,
  FaYoutube,
  FaWhatsapp, 
  FaLinkedin, 
  FaGlobe 
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export type IconKey = "github" | "twitter" | "tiktok" | "telegram" | "instagram" | "youtube" | "whatsapp" | "linkedin" | "email" | "website";

export const ICON_MAP: Record<IconKey, React.ReactNode> = {
  github: <FaGithub size={36} />,
  twitter: <FaTwitter size={36} />,
  tiktok: <FaTiktok size={36} />,
  telegram: <FaTelegram size={36} />,
  instagram: <FaInstagram size={36} />,
  youtube: <FaYoutube size={36} />,
  whatsapp: <FaWhatsapp size={36} />,
  linkedin: <FaLinkedin size={36} />,
  email: <MdEmail size={36} />,
  website: <FaGlobe size={36} />,
};

export const getIcon = (key: string) => {
  return ICON_MAP[key as IconKey] || ICON_MAP["website"];
};

export const AVAILABLE_ICONS = [
  { label: "GitHub", value: "github" },
  { label: "Twitter", value: "twitter" },
  { label: "TikTok", value: "tiktok" },
  { label: "Telegram", value: "telegram" },
  { label: "Instagram", value: "instagram" },
  { label: "YouTube", value: "youtube" },
  { label: "WhatsApp", value: "whatsapp" },
  { label: "LinkedIn", value: "linkedin" },
  { label: "Email", value: "email" },
  { label: "Website", value: "website" },
];