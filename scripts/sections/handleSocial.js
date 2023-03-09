const handler = require('./common');

const handleSocials = item => {
  const custom = [];

  const title = handler(item, ['title', 'about', 'titleAbout', 'descriptionAbout']);
  if (Object.keys(title).length) {
    if (title.title && !title.titleAbout) {
      title.titleAbout = title.title;
      delete title.title;
    }
    if (title.about && !title.descriptionAbout) {
      title.descriptionAbout = title.about;
      delete title.about;
    }
    custom.push({component: 'title', data: title});
  }

  if (item.socials && item.socials.length) {
    custom.push({component: 'socials', data: {socials: item.socials}});
  }

  return custom;
}

module.exports = handleSocials;
