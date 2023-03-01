const handler = require('./common');

const handleBusiness = item => {
  const custom = [];

  const business = handler(item, ['company', 'title', 'subtitle', 'companyWebSite', 'companyEmail', 'contact',
    'about', 'companyCell', 'companyPhone', 'companyFax']);
  if (Object.keys(business).length) {
    custom.push({component: 'company', data: business});
  }

  const actionBtn = handler(item, ['urlOptionLabel', 'urlOptionLabel']);
  if (Object.keys(actionBtn).length) {
    custom.push({component: 'action', data: actionBtn});
  }

  const address = handler(item, ['address', 'address2', 'city', 'zip', 'state', 'country']);
  if (Object.keys(address).length) {
    custom.push({component: 'address', data: address});
  }

  if (Object.keys(item.openingTime || {}).length) {
    custom.push({component: 'opening', data: {openingTime: item.openingTime}});
  }

  if (Object.keys(item.easiness || {}).length) {
    custom.push({component: 'easiness', data: {easiness: item.easiness}});
  }

  if (item.socials && item.socials.length) {
    custom.push({component: 'socials', data: {socials: item.socials}});
  }

  return custom;
}

module.exports = handleBusiness;
