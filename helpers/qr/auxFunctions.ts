import {CustomType, DataType} from "../../components/qr/types/types";
import {bannerImg, mainImg} from "./previewFiles";

export const previewQRGenerator = (dataInfo: DataType, selected: string, omit?: boolean) => {
  let proceed = true;

  const data = structuredClone(dataInfo) as any;
  const custom = data?.custom || [];

  custom.every((x: CustomType) => {
    const numbItems = Object.keys(x.data || {}).length;
    if ((numbItems === 1 && !(x.data?.hideHeadLine || x.data?.centerHeadLine)) || (numbItems === 2 && !x.data?.hideHeadLine && !x.data?.centerHeadLine)) {
      proceed = false;
      return false;
    }
    return true;
  });

  const obj = {...data, qrType: selected};

  if (proceed) {
    if (!data.foregndImg && !omit) {
      obj.foregndImg = mainImg;
    }

    if (!data.backgndImg) {
      obj.backgndImg = bannerImg;
    }

    if (selected === 'custom') {
      data.custom = [
        {
          component: 'title',
          data: {titleAbout: 'This is the sample title', descriptionAbout: 'This is the sample description'}
        },
        {
          component: 'presentation', name: 'Custom section name',
          data: {prefix: 'Sir', firstName: 'Name', lastName: 'Lastname'}
        },
        {
          component: 'address', name: 'A custom address info',
          data: {address: 'Our Address ST 12345', city: 'Our City', zip: '12345', state: 'Our State', country: 'Our Country'}
        },
        {
          component: 'phones',
          data: {cell: '+1234567890', phone: '+1234567890', fax: '+1234567890'}
        },
        {
          component: 'socials',
          data: {
            socials: [{network: 'twitter', value: 'twitter_account'}, {network: 'facebook', value: 'facebook_account'}]
          }
        }
      ];
    } else {
      custom.forEach((x: CustomType) => {
        switch (x.component) {
          case 'address': {
            x.data = {
              address: 'Our Address ST 12345',
              address2: 'Address line 2',
              city: 'Our City',
              zip: '12345',
              state: 'Our State',
              country: 'Our Country'
            }
            break;
          }
          case 'socials': {
            x.data = {
              socials: [
                {network: 'twitter', value: 'twitter_account'}, {network: 'facebook', value: 'facebook_account'}
              ]
            }
            break;
          }
          case 'easiness': {
            x.data = {
              easiness: {wifi: true, accessible: true, health: true}
            }
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
            }
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
            const obj = {
              prefix: 'Sir',
              firstName: 'Name',
              lastName: 'Lastname'
            } as any;
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
            x.data = { sku: "COF1234EA", quantity: 7 }
            break;
          }
          case 'title': {
            x.data = {
              titleAbout: 'This is the sample title', descriptionAbout: 'This is the sample description'
            }
            break;
          }
          case 'links': {
            x.data = {
              links: [
                {label: 'My website', link: 'https://www.example.com'}, {
                  label: 'My blog',
                  link: 'https://www.example.com'
                },
                {label: 'My portfolio', link: 'https://www.example.com'}
              ]
            }
            break;
          }
          case 'pdf': {
            x.data = {
              files: [{
                name: 'Photoshop for beginners NEW22.pdf', // @ts-ignore
                Key: 'pdfs/Photoshop for beginners NEW22.pdf'
              }]
            }
            break;
          }
          case 'gallery': {
            x.data = {
              files: [ // @ts-ignore
                {name: "0land.jpg", Key: "galleries/0land.jpg"}, {name: "1land.jpg", Key: "galleries/1land.jpg"}, // @ts-ignore
                {name: "2land.jpg", Key: "galleries/2land.jpg"}, {name: "3land.jpg", Key: "galleries/3land.jpg"}
              ]
            }
            break;
          }
          case 'audio': {
            x.data = {
              files: [{ // @ts-ignore
                name: "audio.mp3", Key: "audios/Luerod Bounce - Will i am (Orchrestral mix)mp3.mp3"
              }]
            }
            break;
          }
          case 'video': {
            x.data = {
              files: [{ // @ts-ignore
                name: 'video.mp4', Key: 'videos/Facebook 0330478876988862(MP4).mp4'
              }]
            }
            break;
          }
          case 'tags': {
            x.data = {tags: ['Painting', 'Clocks', 'Cars', 'Pets']}
            break;
          }
          case "petId": {
            x.data = {
              petBreed: "Pug",
              petYearOfBirth: "2019",
              petGender: "male",
              petName: "Fido"
            }
            break;
          }
          case 'keyvalue': {
            x.data = {
              keyValues: [
                { value: "To hear music", key: "Hobby" },
                { value: "Real Madrid", key: "Team" },
                { value: "Baseball", key: "Game" },
                { value: "Down the stairs, first door at left", key: "Location" }
              ]
            }
            break;
          }
          case 'couponInfo': {
            x.data = {
              company: "Unic Electronics",
              title: "Get a 100% discount",
              description: "100% discount in purchases over 100 USD",
              badge: "10% OFF",
              urlOptionLabel: "Buy & get a discount",
              urlOptionLink: "https://unicelectronics.com/shop"
            }
            break;
          }
          case 'couponData': {
            x.data = {
              name: "SALES_10_OFF",
              text: "The coupon applies only in purchases over 100 USD",
              data: "1669834040000"
            }
            break;
          }
        }
      });
    }
  }

  return obj;
}
