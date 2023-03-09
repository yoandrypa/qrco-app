const handler = require('./common');

const handleLinks = item => {
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

  if (item.links && item.links.length) {
    custom.push({component: 'links', data: {links: item.links}});
  }

  if (item.socials && item.socials.length) {
    custom.push({component: 'socials', data: {socials: item.socials}});
  }

  return custom;
}

module.exports = handleLinks;
