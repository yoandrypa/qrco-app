import RenderIconPicker from "./RenderIconPicker";
import {IconsProps} from "./textHandler";

interface PreIconProps {
  setOpenIcon: (open: false) => void;
  setAnchor: (anchor: undefined) => void;
  handleAccept: (icon: string) => void;
}

const MUI_ICONS: IconsProps[] = [{icon: 'Web'}, {icon: 'AltEmail', name: 'Email'},
  {icon: 'EmailIcon', name: 'Alternative email'}, {icon: 'Http', name: 'HTTP'}, {icon: 'Sms', name: 'SMS'},
  {icon: 'VCardPlus', name: 'vCard Plus'}, {icon: 'Wifi'}, {icon: 'Text'}, {icon: 'Social'}, {icon: 'Twitter'},
  {icon: 'WhatsApp'}, {icon: 'Facebook'}, {icon: 'Instagram'}, {icon: 'LinkedIn'}, {icon: 'Pinterest'},
  {icon: 'YouTube'}, {icon: 'Telegram'}, {icon: 'TikTok'}, {icon: 'Quora'}, {icon: 'Snapchat'}, {icon: 'Twitch'},
  {icon: 'Reddit'}, {icon: 'Discord'}, {icon: 'Pdf', name: 'PDF'}, {icon: 'Copy'}, {icon: 'Audio'}, {icon: 'Video'},
  {icon: 'Image'}, {icon: 'Link'}, {icon: 'Bussiness'}, {icon: 'Seat', name: 'Seats and furniture'},
  {icon: 'Accessible'}, {icon: 'About'}, {icon: 'Toilet', name: 'Toilets and restrooms'},
  {icon: 'Child', name: 'Children friendly'}, {icon: 'Pets', name: 'Pets friendly'}, {icon: 'Parking'},
  {icon: 'Park', name: 'Parks and open spaces'}, {icon: 'Train'}, {icon: 'Bus'}, {icon: 'Taxi'}, {icon: 'Location'},
  {icon: 'Bed', name: 'Hotels and lodging houses'}, {icon: 'Restaurant'}, {icon: 'Smoking', name: 'Smoking areas'},
  {icon: 'Gym'}, {icon: 'Climate'}, {icon: 'Training'}, {icon: 'Shower', name: 'Showers and bathrooms'},
  {icon: 'Health', name: 'Hospitals and medical clinics'}, {icon: 'Coupon'}, {icon: 'Phone'},
  {icon: 'CellPhone', name: 'Cell phone'}, {icon: 'Fax'}, {icon: 'World'}, {icon: 'FundMe', name: 'Fund other people'},
  {icon: 'PayLink', name: 'Credit/debit card'}, {icon: 'Crypto'}, {icon: 'QrCode', name: 'QR Code'},
  {icon: 'FindMe', name: 'Find a person'}, {icon: 'Inventory'}, {icon: 'Payment'}, {icon: 'Cafe', name: 'Coffee'},
  {icon: 'Bar'}, {icon: 'FastFood', name: 'Fast food'}, {icon: 'LunchDining1', name: 'Lunch and dinner'},
  {icon: 'Pizza1', name: 'Pizza'}, {icon: 'Cake1', name: 'Cake'}, {icon: 'SetMeal1', name: 'Set meal'},
  {icon: 'SoupKitchen1', name: 'Soaps and stews'}, {icon: 'Drink1', name: 'Drink'}, {icon: 'Liquor1', name: 'Liquor'},
  {icon: 'ShoppingBag1', name: 'Shopping bag'}];

export default function PreIconPicker({setOpenIcon, setAnchor, handleAccept}: PreIconProps) {
  return (
    <RenderIconPicker
      handleAccept={handleAccept}
      handleClose={() => {
        setOpenIcon(false);
        setAnchor(undefined);
      }}
      icons={MUI_ICONS}
    />
  );
}
