import RenderIconPicker from "./RenderIconPicker";

interface PreIconProps {
  setOpenIcon: (open: false) => void;
  setAnchor: (anchor: undefined) => void;
  handleAccept: (icon: string) => void;
}

const MUI_ICONS = ['Web', 'AltEmail', 'EmailIcon', 'Http', 'Sms', 'VCardPlus', 'Wifi', 'Text', 'Social', 'Twitter',
  'WhatsApp', 'Facebook', 'Instagram', 'LinkedIn', 'Pinterest', 'YouTube', 'Telegram', 'TikTok', 'Quora', 'Snapchat',
  'Twitch', 'Reddit', 'Discord', 'Pdf', 'Copy', 'Audio', 'Video', 'Image', 'Link', 'Bussiness', 'Seat', 'Accessible',
  'About', 'Toilet', 'Child', 'Pets', 'Parking', 'Park', 'Train', 'Bus', 'Taxi', 'Location', 'Bed', 'Restaurant',
  'Smoking', 'Gym', 'Climate', 'Training', 'Shower', 'Health', 'Coupon', 'Phone', 'CellPhone', 'Fax', 'World', 'FundMe',
  'Donation', 'PayLink', 'Crypto', 'QrCode', 'Custom', 'FindMe', 'Inventory', 'Payment', 'Cafe', 'Bar', 'FastFood',
  'LunchDining1', 'Pizza1', 'Cake1', 'SetMeal1', 'SoupKitchen1', 'Drink1', 'Liquor1', 'ShoppingBag1'];

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
