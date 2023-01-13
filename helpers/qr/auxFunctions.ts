import {DataType} from "../../components/qr/types/types";
import {bannerImg, mainImg} from "./previewFiles";

export const previewQRGenerator = (data: DataType, selected: string, omit?: boolean) => {
  let sum = 0;

  const items = ['qrName', 'isDynamic', 'backgroundColor', 'backgroundType', 'backgroundDirection', 'backgroundColorRight',
  'primary', 'secondary', 'backgndImg', 'foregndImg', 'foregndImgType', 'globalFont', 'buttonsFont', 'titlesFont',
  'messagesFont', 'titlesFontSize', 'messagesFontSize', 'buttonsFontSize', 'subtitlesFontSize', 'subtitlesFont',
  'titlesFontStyle', 'subtitlesFontStyle', 'messagesFontStyle', 'buttonsFontStyle', 'globalFontColor', 'buttonShape',
  'buttonBack', 'buttonBackColor', 'buttonBorders', 'layout', 'index'];

  Object.keys(data).forEach(x => {  // @ts-ignore
    if (items.some((item: string) => x === item)) { sum += 1; }
  });

  if (data.files !== undefined && data.files.length === 0) { sum += 1; }
  if (data.socials !== undefined && data.socials.length === 0) { sum += 1; }
  if (selected === 'link' && data.links) { sum += 1; }

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

    const cleanAssets = () => {
      if (obj.files !== undefined) { delete obj.files; }
      populate('isSample', true);
    };

    if (!data.foregndImg && !omit) {
      obj.foregndImg = mainImg;
    }

    if (!data.backgndImg) {
      obj.backgndImg = bannerImg;
    }

    if (selected === 'business') {
      populate('company', 'Sample Company Name');
      populate('title', 'Title for the Company');
      populate('subtitle', 'Subtitle for the Company');
      populate('companyWebSite', 'https://www.example.com');
      populate('companyEmail', 'mybusinessemail@email.com');
      populate('contact', 'Contact Name');
      populate('companyPhone', '+1234567890');
      populate('companyCell', '+1234567890');
      populate('companyFax', '+1234567890');
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
      populate('cell', '+1234567890');
      populate('phone', '+1234567890');
      populate('fax', '+1234567890');
      populate('organization', 'Sample Organization');
      populate('position', 'Position at Sample Organization');
      genAddress();
      populate('email', 'myemail@email.com');
      populate('web', 'https://www.example.com');
      genSocials();
    } else if (selected === 'social') {
      populate('titleAbout', 'Sample Social Networks');
      populate('descriptionAbout', 'This is a brief description for the social networks');
      populate('socials', [
        {network: 'twitter', value: 'twitter_account'}, {network: 'facebook', value: 'facebook_account'},
        {network: 'telegram', value: 'telegram_account'}, {network: 'youtube', value: 'youtube_account'},
        {network: 'whatsapp', value: '1234567890'}
      ]);
    } else if (selected === 'link') {
      populate('titleAbout', 'Sample Links');
      populate('descriptionAbout', 'This is a brief description for the links');
      delete obj.links;
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
      cleanAssets();
      populate('titleAbout', 'Title of the Gallery');
      populate('descriptionAbout', 'A description for your images gallery');
      populate('files', [
        {name: "0land.jpg", Key: "galleries/0land.jpg"}, {name: "1land.jpg", Key: "galleries/1land.jpg"},
        {name: "2land.jpg", Key: "galleries/2land.jpg"}, {name: "3land.jpg", Key: "galleries/3land.jpg"}
      ]);
    } else if (selected === 'audio') {
      cleanAssets();
      populate('titleAbout', 'Title for the Audio Album');
      populate('descriptionAbout', 'A description for your audios');
      populate('files', [{
        ETag: '"25c1051320d50a1607e60c2ad8804e5a"',
        Key: "audios/Luerod Bounce - Will i am (Orchrestral mix)mp3.mp3"
      }]);
    } else if (selected === 'pdf') {
      cleanAssets();
      populate('titleAbout', 'PDFs around us!');
      populate('descriptionAbout', 'Describe your pdfs files!');
      populate('files', [{
        name: 'Photoshop for beginners NEW22.pdf',
        Key: 'pdfs/Photoshop for beginners NEW22.pdf'
      }]);
    } else if (selected === 'video') {
      cleanAssets();
      populate('titleAbout', 'Videos Sample');
      populate('descriptionAbout', 'Description for your video files!');
      populate('files', [{
        ETag: '"7ead95e45c3545b88ec3c1721c2a0921"',
        Key: 'videos/Facebook 0330478876988862(MP4).mp4'
      }]);
    }else if ( selected ==='petId'){
      cleanAssets();
      populate('petName', 'Fido');
      populate('petBreed', 'Pug');
      populate('petGender', 'Male');
      populate('Country', 'USA');
      populate('city', 'New York');
      populate('otherDetails', {
        "heading": "Details",
        "items": [
          {
            "value": "Ball",
            "label": "Favorite Toy"
          }
        ]
      });
      populate('headingTextText', 'Fido is a 3 year old Pug. He is very friendly and loves to play with his ball.');
      populate('headingText', 'About');
      populate('phone', '+54543434')
      populate('urls',{
        "heading": "Fido personal Links",
        "items": [
          {
            "value": "fido.store.com",
            "label": "Store"
          }
        ]
      });
      populate('contactTitle', 'Owner Info');
      populate('petYearOfBirth', '2020')
      populate('state', "NY")
      populate('name', 'Rick Daniels Gonzalez')
      populate('address1', '1234 Main St');
      populate('email', 'fido@gmail.com');
      populate('zip', '91500');
    }
  }
  return obj;
}
