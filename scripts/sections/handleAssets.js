const handler = require('./common');

const handleAssets = (item, component) => {
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

  if (item.files && item.files.length) {
    custom.push({component, data: {files: item.files}});
  }

  return custom;
}

module.exports = handleAssets;
