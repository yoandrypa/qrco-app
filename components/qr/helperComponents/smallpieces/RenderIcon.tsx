import dynamic from "next/dynamic";
import { grey } from "@mui/material/colors";

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

type RenderIconProp = {
  icon: string;
  enabled: boolean;
  adjust?: boolean;
  color?: string;
};

export default function RenderIcon({ icon, color, enabled, adjust }: RenderIconProp) {
  const renderIcon = () => {
    switch (icon) {
      case 'copy': { return <ContentCopyIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'phone': { return <PhoneIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'cell': { return <SmartphoneIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'location': { return <LocationOnIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'email': { return <AlternateEmailIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'emailIcon': { return <EmailIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'facebook': { return <FacebookIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} /> }
      case 'sms': { return <SmsOutlinedIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'twitter': { return <TwitterIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} /> }
      case 'vcard': { return <ContactPhoneOutlinedIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'contact':
      case 'vcard+': { return <ContactPhoneIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'web': { return <WebIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'whatsapp': { return <WhatsAppIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'pinterest': { return <PinterestIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'linkedin': { return <LinkedInIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'telegram': { return <TelegramIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'instagram': { return <InstagramIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'youtube': { return <YouTubeIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'wifi': { return <WifiIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'pdf': { return <PictureAsPdfIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'audio': { return <VolumeUpIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'video': { return <MovieIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'gallery':
      case 'image': { return <PhotoIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'business': { return <BusinessIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'health': { return <LocalHospitalIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'seat': { return <ChairIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'accessible': { return <AccessibleIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'toilet': { return <WcIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'restaurant': { return <RestaurantIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'social': { return <ShareIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'child': { return <ChildFriendlyIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'pets': { return <PetsIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'petId': { return <PetsIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'parking': { return <LocalParkingIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'park': { return <ParkIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'train': { return <TrainIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'bus': { return <DirectionsBusIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'taxi': { return <LocalTaxiIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'cafe': { return <LocalCafeIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'bed': { return <HotelIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'smoking': { return <SmokingRoomsIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'bar': { return <LocalBarIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'coupon': { return <ConfirmationNumberIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'fastfood': { return <FastfoodIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'gym': { return <FitnessCenterIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'climate': { return <AcUnitIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'shower': { return <ShowerIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'training': { return <SchoolIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'http': { return <HttpIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'donation': { return <Coffee sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'about': { return <InfoIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'world': { return <PublicIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'link': { return <LinkIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'fundme': { return <VolunteerActivism sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'paylink': { return <CreditCard sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'crypto': { return <CurrencyBitcoinIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      case 'linkedLabel': { return <QrCode sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
      default: { return <TextSnippetOutlinedIcon sx={{ mb: adjust ? '-5px' : 0, color: enabled ? theme => (color || theme.palette.primary.dark) : grey[600] }} />; }
    }
  };

  return (<>{renderIcon()}</>);
};
