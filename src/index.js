const path = require('path');
const fs = require('fs').promises;
const axios = require('axios');
require('axios-debug-log')({
  request(debug, config) {
    debug(`Request with ${config.headers['content-type']}`);
  },
  response(debug, response) {
    debug(
      `Response with ${response.headers['content-type']}`,
      `from ${response.config.url}`,
    );
  },
  error(debug, error) {
    debug('Boom', error);
  },
});

const {
  createFilenameByUrl, downloadResources, getAbsoluteUrl, getLinksAndChangeHtml,
  getFilesDirectoryPath,
} = require('./utils');

const load = (url, destinationFolder = '/../test') => {
  const htmlPath = `${path.join(destinationFolder, createFilenameByUrl(url))}.html`;
  const resourcesPath = path.join(destinationFolder, getFilesDirectoryPath(url));
  return axios.get(url)
    .then((response) => fs.writeFile(htmlPath, response.data, 'utf-8'))
    .then(() => getLinksAndChangeHtml(htmlPath, resourcesPath))
    .then((parsedLinks) => getAbsoluteUrl(parsedLinks, new URL(url)))
    .then((links) => downloadResources(resourcesPath, links))
    .catch((err) => console.log(err));
};
module.exports = {
  load,
};
