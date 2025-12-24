import { 
  FaGithub, 
  FaTwitter,
  FaTiktok,
  FaTelegram, 
  FaInstagram,
  FaYoutube,
  FaWhatsapp, 
  FaLinkedin,
  FaSnapchat, 
  FaGlobe 
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export type IconKey = "github" | "twitter" | "tiktok" | "telegram" | "instagram" | "youtube" | "whatsapp" | "linkedin" | "snapchat" | "email" | "website";

export const ICON_MAP: Record<IconKey, React.ReactNode> = {
  github: <FaGithub size={24} className="text-white" />,
  twitter: <FaTwitter size={24} className="text-white" />,
  tiktok: <FaTiktok size={24} className="text-white" />,
  telegram: <FaTelegram size={24} className="text-white" />,
  instagram: <FaInstagram size={24} className="text-white" />,
  youtube: <FaYoutube size={24} className="text-white" />,
  whatsapp: <FaWhatsapp size={24} className="text-white" />,
  linkedin: <FaLinkedin size={24} className="text-white" />,
  snapchat: <FaSnapchat size={24} className="text-white" />,
  email: <MdEmail size={24} className="text-white" />,
  website: <FaGlobe size={24} className="text-white" />,
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
  { label: "Snapchat", value: "snapchat" },
  { label: "Email", value: "email" },
  { label: "Website", value: "website" },
];