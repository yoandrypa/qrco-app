import {
  BackgroundType,
  CornersAndDotsType,
  CustomType,
  DataType,
  FramesType,
  OptionsType
} from "../../components/qr/types/types";
import {bannerImg, mainImg} from "./previewFiles";
import {handleDesignerString} from "./helpers";
import {initialData} from "./data";

export const previewQRGenerator = (dataInfo: DataType, selected: string, omit?: boolean, isDetailsView?: boolean) => {
  let proceed = true;

  const data = structuredClone(dataInfo) as any;
  if (selected === 'custom' && !data.custom?.length) {
    data.custom = [{component: 'title'}, {component: 'presentation'}, {component: 'organization'}, {component: 'address'},
      {component: 'links'}, {component: 'socials'}, {component: 'phones'}];
  }
  const custom = data?.custom || [];

  const possibles = ['hideHeadLine', 'centerHeadLine', 'topSpacing', 'bottomSpacing', 'customFont', 'hideHeadLineIcon',
    'headlineFont', 'headlineFontSize', 'headLineFontStyle', 'socialsOnlyIcons', 'linksOnlyLinks', 'extras', 'sectionArrangement'];
  custom.every((x: CustomType) => {
    const elements = x.data || {}; // @ts-ignore
    if (Object.keys(x.data || {}).length !== possibles.filter(possible => elements[possible] !== undefined).length) {
      proceed = false;
      return false;
    }
    return true;
  });

  const obj = {...data, qrType: selected};

  if (proceed) {
    if (data.layout !== 'empty') {
      if (!data.foregndImg && !omit) {
        obj.foregndImg = mainImg;
      }

      if (!data.backgndImg) {
        obj.backgndImg = bannerImg;
      }
    }

    custom.forEach((x: CustomType) => {
      const hideHeadLine = x.data?.hideHeadLine
      const centerHeadLine = x.data?.centerHeadLine;
      const topSpacing = x.data?.topSpacing;
      const bottomSpacing = x.data?.bottomSpacing;
      const customFont = x.data?.customFont;
      const headlineFont = x.data?.headlineFont;
      const headlineFontSize = x.data?.headlineFontSize;
      const headLineFontStyle = x.data?.headLineFontStyle;
      const hideHeadLineIcon = x.data?.hideHeadLineIcon;
      const socialsOnlyIcons = x.data?.socialsOnlyIcons;
      const linksOnlyLinks = x.data?.linksOnlyLinks;
      const sectionArrangement = x.data?.sectionArrangement;
      const extras = x.data?.extras;

      switch (x.component) {
        case 'address': {
          x.data = {
            address: 'Our Address ST 12345',
            address2: 'Address line 2',
            city: 'Our City',
            zip: '12345',
            state: 'Our State',
            country: 'Our Country'
          };
          break;
        }
        case 'action': {
          x.data = {urlOptionLabel: "View menu", urlOptionLink: "https://www.marysfood.com/menu"};
          break;
        }
        case 'socials': {
          x.data = {
            socials: [{network: 'twitter', value: 'twitter_account'}, {network: 'facebook', value: 'facebook_account'}],
            socialsOnlyIcons: selected === 'link'
          };
          break;
        }
        case 'easiness': {
          x.data = {easiness: {wifi: true, accessible: true, health: true}};
          break;
        }
        case 'opening': {
          x.data = {
            openingTime: {
              thu: [{"ini": "1000", "end": "2200"}],
              fri: [{"ini": "1000", "end": "2200"}],
              sun: [{"ini": "1000", "end": "2300"}],
              tue: [{"ini": "1000", "end": "2200"}],
              wed: [{"ini": "1000", "end": "2200"}],
              sat: [{"ini": "1000", "end": "2300"}]
            }
          };
          break;
        }
        case 'company': {
          x.data = {
            company: 'Sample Company Name',
            title: 'Title for the Company',
            subtitle: 'Subtitle for the Company',
            companyWebSite: 'https://www.example.com',
            companyEmail: 'mybusinessemail@email.com',
            contact: 'Contact Name',
            companyPhone: '+1234567890',
            companyCell: '+1234567890',
            companyFax: '+1234567890',
            about: 'This is a brief description to the company'
          };
          break;
        }
        case 'presentation': {
          const obj = {prefix: 'Sir', firstName: 'Name', lastName: 'Lastname'} as any;
          if (['petId', 'vcard+', 'findMe'].includes(selected)) {
            obj.includeExtraInfo = true;
            obj.cell = '+1234567890';
            obj.phone = '+1234567890';
            obj.fax = '+1234567890';
            obj.email = 'myemail@email.com';
            obj.web = 'https://www.example.com';
            obj.address = 'Our Address ST 12345';
            obj.address2 = 'Address line 2';
            obj.city = 'Our City';
            obj.zip = '12345';
            obj.state = 'Our State';
            obj.country = 'Our Country';
          }
          x.data = obj;
          break;
        }
        case 'sku': {
          x.data = {sku: "COF1234EA", quantity: 7};
          break;
        }
        case 'title': {
          x.data = {titleAbout: 'This is the sample title', descriptionAbout: 'This is the sample description'};
          break;
        }
        case 'organization': {
          x.data = {organization: 'My organization', position: 'My position'};
          break;
        }
        case 'phones': {
          x.data = {cell: "+1234567890", phone: "+1234567890", fax: "+1234567890"};
          break;
        }
        case 'links': {
          x.data = {
            links: [
              {label: 'My website', link: 'https://www.example.com'},
              {label: 'My blog', link: 'https://www.example.com'},
              {label: 'My portfolio', link: 'https://www.example.com'}
            ]
          };
          break;
        }
        case 'pdf': {
          x.data = {
            files: [{
              name: 'Photoshop for beginners NEW22.pdf', // @ts-ignore
              Key: 'pdfs/Photoshop for beginners NEW22.pdf'
            }],
            isSample: true
          };
          break;
        }
        case 'gallery': {
          x.data = {
            files: [ // @ts-ignore
              {name: "0land.jpg", Key: "galleries/0land.jpg"}, {name: "1land.jpg", Key: "galleries/1land.jpg"}, // @ts-ignore
              {name: "2land.jpg", Key: "galleries/2land.jpg"}, {name: "3land.jpg", Key: "galleries/3land.jpg"}
            ],
            isSample: true
          };
          break;
        }
        case 'audio': {
          x.data = { // @ts-ignore
            files: [{name: "audio.mp3", Key: "audios/Luerod Bounce - Will i am (Orchrestral mix)mp3.mp3"}],
            isSample: true
          };
          break;
        }
        case 'video': {
          x.data = { // @ts-ignore
            files: [{name: 'video.mp4', Key: 'videos/Facebook 0330478876988862(MP4).mp4'}],
            isSample: true
          };
          break;
        }
        case 'tags': {
          x.data = {tags: ['Painting', 'Clocks', 'Cars', 'Pets']};
          break;
        }
        case "petId": {
          x.data = {
            petBreed: "Pug",
            petYearOfBirth: "2019",
            petGender: "male",
            petName: "Fido"
          };
          break;
        }
        case 'keyvalue': {
          x.data = {
            keyValues: [
              {value: "To hear music", key: "Hobby"},
              {value: "Real Madrid", key: "Team"},
              {value: "Baseball", key: "Game"},
              {value: "Down the stairs, first door at left", key: "Location"}
            ]
          };
          break;
        }
        case 'couponInfo': {
          x.data = {
            company: "Uniq Electronics",
            title: "Get a 100% discount",
            description: "100% discount in purchases over 100 USD",
            badge: "10% OFF",
            urlOptionLabel: "Buy & get a discount",
            urlOptionLink: "https://unicelectronics.com/shop"
          };
          break;
        }
        case 'couponData': {
          x.data = {name: "SALES_10_OFF", text: "The coupon applies only in purchases over 100 USD", data: "1669834040000"};
          break;
        }
      }

      if (x.data) {
        if (hideHeadLine !== undefined) {x.data.hideHeadLine = hideHeadLine;}
        if (centerHeadLine !== undefined) {x.data.centerHeadLine = centerHeadLine;}
        if (topSpacing !== undefined) {x.data.topSpacing = topSpacing;}
        if (bottomSpacing !== undefined) {x.data.bottomSpacing = bottomSpacing;}
        if (customFont !== undefined) {x.data.customFont = customFont;}
        if (headlineFont !== undefined) {x.data.headlineFont = headlineFont;}
        if (headlineFontSize !== undefined) {x.data.headlineFontSize = headlineFontSize;}
        if (headLineFontStyle !== undefined) {x.data.headLineFontStyle = headLineFontStyle;}
        if (hideHeadLineIcon !== undefined) {x.data.hideHeadLineIcon = hideHeadLineIcon;}
        if (socialsOnlyIcons !== undefined) {x.data.hideHeadLineIcon = socialsOnlyIcons;}
        if (linksOnlyLinks !== undefined) {x.data.hideHeadLineIcon = linksOnlyLinks;}
        if (sectionArrangement !== undefined) {x.data.sectionArrangement = sectionArrangement;}
        if (extras !== undefined) {x.data.extras = extras;}
      }
    });
  }

  if (isDetailsView) {
    if (obj.userId) { delete obj.userId; }
    if (obj.qrOptionsId) { delete obj.qrOptionsId; }
  }

  return obj;
}

export const getOptionsForPreview = (data: any, options: OptionsType, background: BackgroundType, frame: FramesType,
                                  cornersData: CornersAndDotsType, dotsData: CornersAndDotsType, selected?: string) => {
  const opts = {...options, background, frame, corners: cornersData, cornersDot: dotsData};
  if (!data?.isDynamic) {
    opts.data = handleDesignerString(selected || '', data || {...initialData});
    if (!opts.data.length) {
      opts.data = selected === 'web' ? 'https://www.example.com' : 'Example';
    }
  }
  return opts;
}
