import path from 'path';
import axiosDebug from 'axios-debug-log';
import {
  createFilenameByUrl, downloadResources, getAbsoluteUrl, getLinksAndChangeHtml,
  getFilesDirectoryPath, downloadHtml,
} from './utils.js';

axiosDebug({
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

export default (url, destinationFolder = './') => {
  const htmlPath = `${path.join(destinationFolder, createFilenameByUrl(url))}.html`;
  const resourcesPath = path.join(destinationFolder, getFilesDirectoryPath(url));
  return downloadHtml(url, htmlPath)
    .then(() => getLinksAndChangeHtml(htmlPath, resourcesPath))
    .then((parsedLinks) => getAbsoluteUrl(parsedLinks, new URL(url)))
    .then((links) => downloadResources(resourcesPath, links));
};
