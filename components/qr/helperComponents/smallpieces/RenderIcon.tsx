import dynamic from "next/dynamic";
import { grey } from "@mui/material/colors";
import {useTheme} from "@mui/system";

const WebIcon = dynamic(() => import('@mui/icons-material/Web'));
const AlternateEmailIcon = dynamic(() => import('@mui/icons-material/AlternateEmail'));
const SmsOutlinedIcon = dynamic(() => import('@mui/icons-material/SmsOutlined'));
const ContactPhoneOutlinedIcon = dynamic(() => import('@mui/icons-material/ContactPhoneOutlined'));
const ContactPhoneIcon = dynamic(() => import('@mui/icons-material/ContactPhone'));
const WifiIcon = dynamic(() => import('@mui/icons-material/Wifi'));
const TwitterIcon = dynamic(() => import('@mui/icons-material/Twitter'));
const TextSnippetOutlinedIcon = dynamic(() => import('@mui/icons-material/TextSnippetOutlined'));
const WhatsAppIcon = dynamic(() => import('@mui/icons-material/WhatsApp'));
const FacebookIcon = dynamic(() => import('@mui/icons-material/Facebook'));
const PictureAsPdfIcon = dynamic(() => import('@mui/icons-material/PictureAsPdf'));
const InstagramIcon = dynamic(() => import('@mui/icons-material/Instagram'));
const VolumeUpIcon = dynamic(() => import('@mui/icons-material/VolumeUp'));
const LinkIcon = dynamic(() => import('@mui/icons-material/Link'));
const PhotoIcon = dynamic(() => import('@mui/icons-material/Photo'));
const LinkedInIcon = dynamic(() => import('@mui/icons-material/LinkedIn'));
const PinterestIcon = dynamic(() => import('@mui/icons-material/Pinterest'));
const YouTubeIcon = dynamic(() => import('@mui/icons-material/YouTube'));
const TelegramIcon = dynamic(() => import('@mui/icons-material/Telegram'));
const BusinessIcon = dynamic(() => import('@mui/icons-material/Business'));
const MovieIcon = dynamic(() => import('@mui/icons-material/Movie'));
const ChairIcon = dynamic(() => import('@mui/icons-material/Chair'));
const AccessibleIcon = dynamic(() => import('@mui/icons-material/Accessible'));
const InfoIcon = dynamic(() => import('@mui/icons-material/Info'));
const WcIcon = dynamic(() => import('@mui/icons-material/Wc'));
const RestaurantIcon = dynamic(() => import('@mui/icons-material/Restaurant'));
const ChildFriendlyIcon = dynamic(() => import('@mui/icons-material/ChildFriendly'));
const ContentCopyIcon = dynamic(() => import('@mui/icons-material/ContentCopy'));
const EmailIcon = dynamic(() => import('@mui/icons-material/Email'));
const PetsIcon = dynamic(() => import('@mui/icons-material/Pets'));
const LocalParkingIcon = dynamic(() => import('@mui/icons-material/LocalParking'));
const ParkIcon = dynamic(() => import('@mui/icons-material/Park'));
const FaxIcon = dynamic(() => import('@mui/icons-material/Fax'));
const TrainIcon = dynamic(() => import('@mui/icons-material/Train'));
const DirectionsBusIcon = dynamic(() => import('@mui/icons-material/DirectionsBus'));
const LocalTaxiIcon = dynamic(() => import('@mui/icons-material/LocalTaxi'));
const LocalCafeIcon = dynamic(() => import('@mui/icons-material/LocalCafe'));
const HotelIcon = dynamic(() => import('@mui/icons-material/Hotel'));
const SmokingRoomsIcon = dynamic(() => import('@mui/icons-material/SmokingRooms'));
const LocalBarIcon = dynamic(() => import('@mui/icons-material/LocalBar'));
const FastfoodIcon = dynamic(() => import('@mui/icons-material/Fastfood'));
const FitnessCenterIcon = dynamic(() => import('@mui/icons-material/FitnessCenter'));
const AcUnitIcon = dynamic(() => import('@mui/icons-material/AcUnit'));
const SchoolIcon = dynamic(() => import('@mui/icons-material/School'));
const ShowerIcon = dynamic(() => import('@mui/icons-material/Shower'));
const LocalHospitalIcon = dynamic(() => import('@mui/icons-material/LocalHospital'));
const ConfirmationNumberIcon = dynamic(() => import('@mui/icons-material/ConfirmationNumber'));
const ShareIcon = dynamic(() => import('@mui/icons-material/Share'));
const LocationOnIcon = dynamic(() => import('@mui/icons-material/LocationOn'));
const PhoneIcon = dynamic(() => import('@mui/icons-material/Phone'));
const SmartphoneIcon = dynamic(() => import('@mui/icons-material/Smartphone'));
const HttpIcon = dynamic(() => import('@mui/icons-material/Http'));
const PublicIcon = dynamic(() => import('@mui/icons-material/Public'));
const VolunteerActivism = dynamic(() => import('@mui/icons-material/VolunteerActivism'));
const Coffee = dynamic(() => import('@mui/icons-material/Coffee'));
const CreditCard = dynamic(() => import('@mui/icons-material/CreditCard'));
const CurrencyBitcoinIcon = dynamic(() => import('@mui/icons-material/CurrencyBitcoin'));
const QrCode = dynamic(() => import('@mui/icons-material/QrCode'));
const CustomizeIcon = dynamic(() => import('@mui/icons-material/DashboardCustomize'));
const PersonSearchIcon = dynamic(() => import('@mui/icons-material/PersonSearch'));
const InventoryIcon = dynamic(() => import('@mui/icons-material/Inventory'));
const RedditIcon = dynamic(() => import('@mui/icons-material/Reddit'));
const TikTokIcon = dynamic(() => import("../TikTokIcon"));
const QuoraIcon = dynamic(() => import("../QuoraIcon"));
const Snapchat = dynamic(() => import("../Snapchat"));
const Twitch = dynamic(() => import("../Twitch"));
const DiscordIcon = dynamic(() => import("../DiscordIcon"));

type RenderIconProp = {
  icon: string;
  enabled: boolean;
  color?: string;
  sx?: Object;
};

export default function RenderIcon({ icon, color, enabled, sx }: RenderIconProp) {
  const theme = useTheme();

  const renderIcon = () => {
    const sxStyling = { ...sx, color: enabled ? color || theme.palette.primary.dark : grey[600] };
    switch (icon) {
      case 'custom': { return <CustomizeIcon sx={sxStyling} />; }
      case 'copy': { return <ContentCopyIcon sx={sxStyling} />; }
      case 'companyPhone':
      case 'phone': { return <PhoneIcon sx={sxStyling} />; }
      case 'companyCell':
      case 'cell': { return <SmartphoneIcon sx={sxStyling} />; }
      case 'companyFax':
      case 'fax': { return <FaxIcon sx={sxStyling} />; }
      case 'location': { return <LocationOnIcon sx={sxStyling} />; }
      case 'email': { return <AlternateEmailIcon sx={sxStyling} />; }
      case 'emailIcon': { return <EmailIcon sx={sxStyling} />; }
      case 'facebook': { return <FacebookIcon sx={sxStyling} /> }
      case 'sms': { return <SmsOutlinedIcon sx={sxStyling} />; }
      case 'twitter': { return <TwitterIcon sx={sxStyling} /> }
      case 'vcard': { return <ContactPhoneOutlinedIcon sx={sxStyling} />; }
      case 'contact':
      case 'vcard+': { return <ContactPhoneIcon sx={sxStyling} />; }
      case 'web': { return <WebIcon sx={sxStyling} />; }
      case 'whatsapp': { return <WhatsAppIcon sx={sxStyling} />; }
      case 'pinterest': { return <PinterestIcon sx={sxStyling} />; }
      case 'linkedin': { return <LinkedInIcon sx={sxStyling} />; }
      case 'telegram': { return <TelegramIcon sx={sxStyling} />; }
      case 'instagram': { return <InstagramIcon sx={sxStyling} />; }
      case 'youtube': { return <YouTubeIcon sx={sxStyling} />; }
      case 'wifi': { return <WifiIcon sx={sxStyling} />; }
      case 'pdf': { return <PictureAsPdfIcon sx={sxStyling} />; }
      case 'audio': { return <VolumeUpIcon sx={sxStyling} />; }
      case 'video': { return <MovieIcon sx={sxStyling} />; }
      case 'gallery':
      case 'image': { return <PhotoIcon sx={sxStyling} />; }
      case 'business': { return <BusinessIcon sx={sxStyling} />; }
      case 'health': { return <LocalHospitalIcon sx={sxStyling} />; }
      case 'seat': { return <ChairIcon sx={sxStyling} />; }
      case 'accessible': { return <AccessibleIcon sx={sxStyling} />; }
      case 'toilet': { return <WcIcon sx={sxStyling} />; }
      case 'restaurant': { return <RestaurantIcon sx={sxStyling} />; }
      case 'social': { return <ShareIcon sx={sxStyling} />; }
      case 'child': { return <ChildFriendlyIcon sx={sxStyling} />; }
      case 'pets': { return <PetsIcon sx={sxStyling} />; }
      case 'petId': { return <PetsIcon sx={sxStyling} />; }
      case 'parking': { return <LocalParkingIcon sx={sxStyling} />; }
      case 'park': { return <ParkIcon sx={sxStyling} />; }
      case 'train': { return <TrainIcon sx={sxStyling} />; }
      case 'bus': { return <DirectionsBusIcon sx={sxStyling} />; }
      case 'taxi': { return <LocalTaxiIcon sx={sxStyling} />; }
      case 'cafe': { return <LocalCafeIcon sx={sxStyling} />; }
      case 'bed': { return <HotelIcon sx={sxStyling} />; }
      case 'smoking': { return <SmokingRoomsIcon sx={sxStyling} />; }
      case 'bar': { return <LocalBarIcon sx={sxStyling} />; }
      case 'coupon': { return <ConfirmationNumberIcon sx={sxStyling} />; }
      case 'fastfood': { return <FastfoodIcon sx={sxStyling} />; }
      case 'gym': { return <FitnessCenterIcon sx={sxStyling} />; }
      case 'climate': { return <AcUnitIcon sx={sxStyling} />; }
      case 'shower': { return <ShowerIcon sx={sxStyling} />; }
      case 'training': { return <SchoolIcon sx={sxStyling} />; }
      case 'http': { return <HttpIcon sx={sxStyling} />; }
      case 'donation': { return <Coffee sx={sxStyling} />; }
      case 'about': { return <InfoIcon sx={sxStyling} />; }
      case 'world': { return <PublicIcon sx={sxStyling} />; }
      case 'link': { return <LinkIcon sx={sxStyling} />; }
      case 'fundme': { return <VolunteerActivism sx={sxStyling} />; }
      case 'paylink': { return <CreditCard sx={sxStyling} />; }
      case 'crypto': { return <CurrencyBitcoinIcon sx={sxStyling} />; }
      case 'linkedLabel': { return <QrCode sx={sxStyling} />; }
      case 'findMe': { return <PersonSearchIcon sx={sxStyling} />; }
      case 'inventory': { return <InventoryIcon sx={sxStyling} />; }
      case 'reddit': { return <RedditIcon sx={sxStyling} />; }
      case 'tiktok': { return <TikTokIcon sx={sxStyling} />; }
      case 'quora': { return <QuoraIcon sx={sxStyling} />; }
      case 'snapchat': { return <Snapchat sx={sxStyling} />; }
      case 'twitch': { return <Twitch sx={sxStyling} />; }
      case 'discord': { return <DiscordIcon sx={sxStyling} />; }
      default: { return <TextSnippetOutlinedIcon sx={sxStyling} />; }
    }
  };

  return renderIcon();
};
