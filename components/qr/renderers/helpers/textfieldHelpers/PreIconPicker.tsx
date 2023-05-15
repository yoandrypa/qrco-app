import RenderIconPicker from "./RenderIconPicker";
import {IconsProps} from "./textHandler";

interface PreIconProps {
  setOpenIcon: (open: false) => void;
  setAnchor: (anchor: undefined) => void;
  handleAccept: (icon: string) => void;
}

const MUI_ICONS: IconsProps[] = [{icon: 'Web', alt: 'web,internet,connection,communication,information'},
  {icon: 'AltEmail', name: 'Email', alt: 'email,communication,mail,message'},
  {icon: 'EmailIcon', name: 'Alternative email', alt: 'email,communication,mail,message'},
  {icon: 'Http', name: 'HTTP', alt: 'web,internet,connection,communication,information'},
  {icon: 'Sms', name: 'SMS', alt: 'communication,text,message'},
  {icon: 'VCardPlus', name: 'vCard Plus', alt: 'description,presentation,card'},
  {icon: 'Wifi', alt: 'web,internet,connection,communication'}, {icon: 'Text', alt: 'message,information'},
  {icon: 'Social', alt: 'network,communication,people'}, {icon: 'Twitter', alt: 'network,communication,people'},
  {icon: 'WhatsApp', alt: 'network,communication,people'}, {icon: 'Facebook', alt: 'network,communication,people'},
  {icon: 'Instagram', alt: 'network,communication,people'}, {icon: 'LinkedIn', alt: 'network,communication,people'},
  {icon: 'Pinterest', alt: 'network,communication,people'}, {icon: 'YouTube', alt: 'network,communication,people,video,music'},
  {icon: 'Telegram', alt: 'network,communication,people'}, {icon: 'TikTok', alt: 'network,communication,people,video'},
  {icon: 'Quora', alt: 'network,communication,people'}, {icon: 'Snapchat', alt: 'network,communication,people'},
  {icon: 'Twitch', alt: 'network,communication,people,video'}, {icon: 'Reddit', alt: 'network,communication,people'},
  {icon: 'Discord', alt: 'network,communication,people'}, {icon: 'Pdf', name: 'PDF', alt: 'document,information'},
  {icon: 'Copy', alt: 'document,information'}, {icon: 'Audio', alt: 'music'}, {icon: 'Video', alt: 'music,youtube'},
  {icon: 'Image', alt: 'gallery,photo,landscape,portrait'}, {icon: 'Link', alt: 'web,internet,information'},
  {icon: 'Business', alt: 'details,process,office'}, {icon: 'Seat', name: 'Seats and furniture', alt: 'house,comfort'},
  {icon: 'Accessible', alt: 'comfort,easy,wheelchair,barrier-free,alternative'},
  {icon: 'About', alt: 'information'}, {icon: 'Toilet', name: 'Toilets and restrooms', alt: 'house,comfort'},
  {icon: 'Child', name: 'Children friendly', alt: 'toys,daycare'},
  {icon: 'Pets', name: 'Pets friendly', alt: 'dog,cat,hamster,fish,aquarium'},
  {icon: 'Parking', alt: 'garage,spacing,lot,ticket'},
  {icon: 'Park', name: 'Parks and open spaces', alt: 'green,public,picnic,nature,camping,hiking'},
  {icon: 'Train', alt: 'station,transportation,location'}, {icon: 'Bus', alt: 'station,transportation,location'},
  {icon: 'Taxi', alt: 'station,transportation,location'}, {icon: 'Location', alt: 'address,map,route'},
  {icon: 'Bed', name: 'Hotels and lodging houses', alt: 'rest,sleeping,nap'},
  {icon: 'Restaurant', alt: 'food,service,dinner,lunch,breakfast'},
  {icon: 'Smoking', name: 'Smoking areas', alt: 'cigarette,tobacco,pipe,hookah'},
  {icon: 'Gym', alt: 'sport,fitness,workout,yoga,pilates'},
  {icon: 'Climate', alt: 'ventilation,air,conditioning,fan,filter'},
  {icon: 'Training', alt: 'school,learn,teacher,student,university'},
  {icon: 'Shower', name: 'Showers and bathrooms', alt: 'water,cold,warm,hot,steam,shampoo,soap'},
  {icon: 'Health', name: 'Hospitals and medical clinics', alt: 'medication,doctor,nurse,emergency'},
  {icon: 'Coupon', alt: 'voucher,promo,offer'}, {icon: 'Phone', alt: 'communication,cell,talk,call,dial,voice'},
  {icon: 'CellPhone', name: 'Cell phone', alt: 'communication,talk,call,dial,voice,battery,sim'},
  {icon: 'Fax', alt: 'communication,cell,talk,call,dial,voice'}, {icon: 'World', alt: 'environment,planet,earth'},
  {icon: 'FundMe', name: 'Fund other people', alt: 'money,donation'},
  {icon: 'PayLink', name: 'Credit/debit card', alt: 'money,payment'}, {icon: 'Crypto', alt: 'money'},
  {icon: 'QrCode', name: 'QR Code', alt: 'barcode,scanner'},
  {icon: 'FindMe', name: 'Find a person', alt: 'location,missing'}, {icon: 'Inventory', alt: 'info,location,quantity'},
  {icon: 'Payment', name: 'money'}, {icon: 'Cafe', name: 'Coffee', alt: 'snack,people,meet,espresso,cappucino'},
  {icon: 'Bar', alt: 'cocktail,drink'}, {icon: 'FastFood', name: 'Fast food', alt: 'burger,fries,delivery'},
  {icon: 'LunchDining1', name: 'Lunch and dinner', alt: 'food'}, {icon: 'Pizza1', name: 'Pizza', alt: 'food'},
  {icon: 'Cake1', name: 'Cake', alt: 'food'}, {icon: 'SetMeal1', name: 'Set meal', alt: 'food'},
  {icon: 'SoupKitchen1', name: 'Soaps and stews', alt: 'food'}, {icon: 'Drink1', name: 'Drink', alt: 'food,bar,soft'},
  {icon: 'Liquor1', name: 'Liquor', alt: 'bar'}, {icon: 'ShoppingBag1', name: 'Shopping bag', alt: 'market'}];

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
