import { ReactNode } from "react";
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaYoutube, 
  FaSoundcloud, 
  FaSpotify,
  FaEnvelope
} from "react-icons/fa";

interface SocialIconProps {
  networkName: string;
  size?: number;
}

export default function SocialIcon({ networkName, size = 24 }: SocialIconProps) {
  const getIconByNetwork = (network: string): ReactNode => {
    switch (network.toLowerCase()) {
      case 'facebook':
        return <FaFacebook size={size} />;
      case 'twitter':
        return <FaTwitter size={size} />;
      case 'instagram':
        return <FaInstagram size={size} />;
      case 'youtube':
        return <FaYoutube size={size} />;
      case 'soundcloud':
        return <FaSoundcloud size={size} />;
      case 'spotify':
        return <FaSpotify size={size} />;
      case 'email':
        return <FaEnvelope size={size} />;
      default:
        return <FaEnvelope size={size} />;
    }
  };
  
  return (
    <div className="social-icon">
      {getIconByNetwork(networkName)}
    </div>
  );
}
