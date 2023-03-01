const handler = require('./common');

const handleVcard = item => {
  const custom = [];

  const presentation = handler(item, ['prefix', 'firstName', 'lastName', 'cell', 'phone', 'fax', 'email', 'web', 'address',
    'address2', 'city', 'zip', 'state', 'country']);

  if (Object.keys(presentation).length) {
    const newData = {
      component: 'presentation',
      data: presentation
    };

    if (['cell', 'phone', 'fax', 'email', 'web', 'address',
      'address2', 'city', 'zip', 'state', 'country'].some(x => Object.keys(presentation).includes(x))) {
      newData.data.includeExtraInfo = true;
    }
    custom.push(newData);
  }

  const organization = handler(item, ['organization', 'position']);
  if (Object.keys(organization).length) {
    custom.push({component: 'organization', data: organization});
  }

  if (item.socials && item.socials.length) {
    const socials = [];

    for (let i = 0, l = item.socials.length; i < l; i += 1) {
      socials.push(item.socials[i]);
    }

    custom.push({
      component: 'socials',
      data: { socials }
    });
  }

  return custom;
}

module.exports = handleVcard;
