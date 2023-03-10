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

type RenderIconProp = {
  icon: string;
  enabled: boolean;
  adjust?: boolean;
  color?: string;
};

export default function RenderIcon({ icon, color, enabled, adjust }: RenderIconProp) {
  const theme = useTheme();
  const renderIcon = () => {
    const sx = { mb: adjust ? '-5px' : 0, color: enabled ? color || theme.palette.primary.dark : grey[600] };
    switch (icon) {
      case 'custom': { return <CustomizeIcon sx={sx} />; }
      case 'copy': { return <ContentCopyIcon sx={sx} />; }
      case 'phone': { return <PhoneIcon sx={sx} />; }
      case 'cell': { return <SmartphoneIcon sx={sx} />; }
      case 'location': { return <LocationOnIcon sx={sx} />; }
      case 'email': { return <AlternateEmailIcon sx={sx} />; }
      case 'emailIcon': { return <EmailIcon sx={sx} />; }
      case 'facebook': { return <FacebookIcon sx={sx} /> }
      case 'sms': { return <SmsOutlinedIcon sx={sx} />; }
      case 'twitter': { return <TwitterIcon sx={sx} /> }
      case 'vcard': { return <ContactPhoneOutlinedIcon sx={sx} />; }
      case 'contact':
      case 'vcard+': { return <ContactPhoneIcon sx={sx} />; }
      case 'web': { return <WebIcon sx={sx} />; }
      case 'whatsapp': { return <WhatsAppIcon sx={sx} />; }
      case 'pinterest': { return <PinterestIcon sx={sx} />; }
      case 'linkedin': { return <LinkedInIcon sx={sx} />; }
      case 'telegram': { return <TelegramIcon sx={sx} />; }
      case 'instagram': { return <InstagramIcon sx={sx} />; }
      case 'youtube': { return <YouTubeIcon sx={sx} />; }
      case 'wifi': { return <WifiIcon sx={sx} />; }
      case 'pdf': { return <PictureAsPdfIcon sx={sx} />; }
      case 'audio': { return <VolumeUpIcon sx={sx} />; }
      case 'video': { return <MovieIcon sx={sx} />; }
      case 'gallery':
      case 'image': { return <PhotoIcon sx={sx} />; }
      case 'business': { return <BusinessIcon sx={sx} />; }
      case 'health': { return <LocalHospitalIcon sx={sx} />; }
      case 'seat': { return <ChairIcon sx={sx} />; }
      case 'accessible': { return <AccessibleIcon sx={sx} />; }
      case 'toilet': { return <WcIcon sx={sx} />; }
      case 'restaurant': { return <RestaurantIcon sx={sx} />; }
      case 'social': { return <ShareIcon sx={sx} />; }
      case 'child': { return <ChildFriendlyIcon sx={sx} />; }
      case 'pets': { return <PetsIcon sx={sx} />; }
      case 'petId': { return <PetsIcon sx={sx} />; }
      case 'parking': { return <LocalParkingIcon sx={sx} />; }
      case 'park': { return <ParkIcon sx={sx} />; }
      case 'train': { return <TrainIcon sx={sx} />; }
      case 'bus': { return <DirectionsBusIcon sx={sx} />; }
      case 'taxi': { return <LocalTaxiIcon sx={sx} />; }
      case 'cafe': { return <LocalCafeIcon sx={sx} />; }
      case 'bed': { return <HotelIcon sx={sx} />; }
      case 'smoking': { return <SmokingRoomsIcon sx={sx} />; }
      case 'bar': { return <LocalBarIcon sx={sx} />; }
      case 'coupon': { return <ConfirmationNumberIcon sx={sx} />; }
      case 'fastfood': { return <FastfoodIcon sx={sx} />; }
      case 'gym': { return <FitnessCenterIcon sx={sx} />; }
      case 'climate': { return <AcUnitIcon sx={sx} />; }
      case 'shower': { return <ShowerIcon sx={sx} />; }
      case 'training': { return <SchoolIcon sx={sx} />; }
      case 'http': { return <HttpIcon sx={sx} />; }
      case 'donation': { return <Coffee sx={sx} />; }
      case 'about': { return <InfoIcon sx={sx} />; }
      case 'world': { return <PublicIcon sx={sx} />; }
      case 'link': { return <LinkIcon sx={sx} />; }
      case 'fundme': { return <VolunteerActivism sx={sx} />; }
      case 'paylink': { return <CreditCard sx={sx} />; }
      case 'crypto': { return <CurrencyBitcoinIcon sx={sx} />; }
      case 'linkedLabel': { return <QrCode sx={sx} />; }
      case 'findMe': {{ return <PersonSearchIcon sx={sx} />; }}
      case 'inventory': { return <InventoryIcon sx={sx} />; }
      default: { return <TextSnippetOutlinedIcon sx={sx} />; }
    }
  };

  return (<>{renderIcon()}</>);
};
