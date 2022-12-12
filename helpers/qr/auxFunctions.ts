import {DataType} from "../../components/qr/types/types";

export const previewQRGenerator = (data: DataType, selected: string) => {
  let sum = 0;

  if (data.qrName) { sum += 1; }
  if (data.isDynamic) { sum += 1; }
  if (data.files !== undefined && !data.files.length) { sum += 1; }

  const obj = {...data, qrType: selected};

  if (Object.keys(data).length <= sum) {
    const populate = (item: string, value: any): void => { // @ts-ignore
      if (obj[item] === undefined) { // @ts-ignore
        obj[item] = value;
      }
    };

    const genAddress = () => {
      populate('address', 'Our Address ST 12345');
      populate('city', 'Our City');
      populate('zip', '12345');
      populate('state', 'Our State');
      populate('country', 'Our Country');
    };

    const genSocials = () => {
      populate('socials', [
        {network: 'twitter', value: 'twitter_account'}, {network: 'facebook', value: 'facebook_account'}
      ]);
    };

    if (selected === 'business') {
      populate('company', 'Sample Company Name');
      populate('title', 'Title for the Company');
      populate('subtitle', 'Subtitle for the Company');
      populate('web', 'https://www.example.com');
      populate('email', 'mybusinessemail@email.com');
      populate('contact', 'Contact Name');
      populate('phone', '5551234567890');
      populate('about', 'This is a brief description to the company');
      populate('urlOptionLabel', 'Our website');
      populate('urlOptionLink', 'https://www.example.com');
      genAddress();
      populate('openingTime', {wed: [{ini: '0830', end: '1800'}], fri: [{ini: '0830', end: '1800'}]});
      populate('easiness', {wifi: true, accessible: true, health: true});
      genSocials();
    } else if (selected === 'vcard+') {
      populate('prefix', 'Sir');
      populate('firstName', 'Name');
      populate('lastName', 'Lastname');
      populate('cell', '5551234567890');
      populate('phone', '5551234567890');
      populate('fax', '5551234567890');
      populate('organization', 'Sample Organization');
      populate('position', 'Position at Sample Organization');
      genAddress();
      populate('email', 'myemail@email.com');
      populate('web', 'https://www.example.com');
      genSocials();
    } else if (selected === 'social') {
      populate('title', 'Sample Social Networks');
      populate('about', 'This is a brief description for the social networks');
      populate('socials', [
        {network: 'twitter', value: 'twitter_account'}, {network: 'facebook', value: 'facebook_account'},
        {network: 'telegram', value: 'telegram_account'}, {network: 'youtube', value: 'youtube_account'},
        {network: 'whatsapp', value: '1234567890'}
      ]);
    } else if (selected === 'link') {
      populate('title', 'Sample Links');
      populate('about', 'This is a brief description for the links');
      populate('links', [
        {label: 'My website', link: 'https://www.example.com'}, {label: 'My blog', link: 'https://www.example.com'},
        {label: 'My portfolio', link: 'https://www.example.com'}
      ]);
      genSocials();
    } else if (selected === 'coupon') {
      populate('company', 'Sample Company');
      populate('title', 'Title of the Coupon');
      populate('about', 'This is just a brief description for the Coupon, or whatever you\'d like to say');
      populate('prefix', 'Badge');
      populate('urlOptionLabel', 'Link to a website');
      populate('urlOptionLink', 'https://www.example.com');
      populate('name', 'CouponCode');
      populate('value', '1669934672000');
      populate('text', 'Wanna add some terms and conditions? No problem! You can set them here.');
      genAddress();
    } else if (selected === 'gallery') {
      if (obj.files !== undefined) { delete obj.files; }
      populate('title', 'Title of the Gallery');
      populate('about', 'A description for your images gallery');
      populate('isSample', true);
      populate('files', [
        {name: "0land.jpg", Key: "galleries/0land.jpg"}, {name: "1land.jpg", Key: "galleries/1land.jpg"},
        {name: "2land.jpg", Key: "galleries/2land.jpg"}, {name: "3land.jpg", Key: "galleries/3land.jpg"},
        {name: "4land.jpg", Key: "galleries/4land.jpg"}
      ]);
    }
  }
  return obj;
}
