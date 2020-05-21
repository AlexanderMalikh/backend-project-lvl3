const path = require('path');
const fs = require('fs').promises;
const axios = require('axios');
const { parseTags, parseURL } = require('./parsers.js');

const createFilenameByUrl = (webPageUrl, ext = '') => {
  const parts = webPageUrl.replace('https://', '')
    .replace(ext, '')
    .replace(/[^A-Za-zА-Яа-яЁё0-9]/g, '-')
    .split('-');
  const filename = parts.reduce((acc, item) => (acc === '' ? `${item}` : `${acc}-${item}`), '');
  return filename;
};

const getFilenameExtensionFromUrl = (url) => {
  const tmp = url.substr(1 + url.lastIndexOf('/'));
  const file = tmp.split('?')[0].split('#')[0];
  let ext = '';

  if (file.lastIndexOf('.') === -1) {
    ext = '.html';
  } else ext = file.substr(file.lastIndexOf('.') + 1);

  const filename = createFilenameByUrl(new URL(url).pathname, ext);
  console.log(filename, ext);
  return `${filename}.${ext}`;
};

const dowloadLocalResources = (urlsArr, destination) => {
  urlsArr.map((url) => {
    axios.get(url)
      .then((response) => {
        const filename = getFilenameExtensionFromUrl(url);
        fs.writeFile(path.join(destination, filename), response.data);
      })
      .catch((err) => console.log(err));
    return url;
  });
};

const load = (webPageUrl, destinationFolder = '/../test') => {
  const htmlPath = `${path.join(destinationFolder, createFilenameByUrl(webPageUrl))}.html`;
  const filesPath = `${path.join(destinationFolder, createFilenameByUrl(webPageUrl))}_files`;
  return axios({
    method: 'get',
    url: webPageUrl,
  })
    .then((response) => {
      fs.writeFile(htmlPath, response.data, 'utf-8');
      fs.mkdir(filesPath);
    })
    .then(() => parseTags(htmlPath))
    .then((parsedLinks) => {
      const localLinks = parseURL(parsedLinks, new URL(webPageUrl));
      dowloadLocalResources(localLinks, filesPath);
    })
    .catch((error) => console.log(error));
};

module.exports = {
  load,
};
