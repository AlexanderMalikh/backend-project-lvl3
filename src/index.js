const path = require('path');
const fs = require('fs').promises;
const axios = require('axios');
const {
  createFilenameByUrl, downloadResources, getAbsoluteUrl, getLinksAndChangeHtml, getFilesDirectoryPath,
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
