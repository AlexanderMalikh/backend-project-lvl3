const axios = require('axios');
const path = require('path');
const fs = require('fs').promises;
const cheerio = require('cheerio');
const debug = require('debug')('page-loader:utils');


const tags = {
  script: 'src',
  img: 'src',
  link: 'href',
};

const createFilenameByUrl = (url, ext = '') => {
  const parts = url.replace('https://', '')
    .replace(ext, '')
    .replace(/[^A-Za-zА-Яа-яЁё0-9]/g, '-')
    .split('-');
  const filename = parts.reduce((acc, item) => (acc === '' ? `${item}` : `${acc}-${item}`), '');
  return filename;
};

const isLocal = (url) => new URL(url, 'https://example.com').origin === 'https://example.com';

const getFilesDirectoryPath = (url) => `${createFilenameByUrl(url)}_files`;

const getFilename = (url) => {
  const { pathname } = new URL(url, 'https://example.com');
  const filename = pathname.split('/').filter((symb) => symb !== '').join('-');
  return filename === '' ? 'main.html' : filename;
};

const getAbsoluteUrl = (links, webPageUrl) => {
  debug('parsing local links for absolute urls');
  const localLinks = links.filter((link) => isLocal(link));
  debug('LOCAL LINKS\n', localLinks);
  const parsedURLS = localLinks.map((link) => new URL(link, webPageUrl).href);
  debug('ABSOLUTE URLS\n', parsedURLS);
  return parsedURLS;
};

const getLinksAndChangeHtml = (htmlPath, resourcesPath) => {
  debug('parsing html for local links and transforming HTML-page');
  return fs.readFile(htmlPath, 'utf-8')
    .then((data) => {
      const $ = cheerio.load(data);
      const linksArr = [];
      Object.keys(tags).map((tag) => $(tag).each((i, el) => {
        const link = $(el).attr(tags[tag]);
        if (link && isLocal(link)) {
          $(el).attr(`${tags[tag]}`, `${path.join(resourcesPath, getFilename(link))}`);
          linksArr.push(link);
        } else if (link) {
          linksArr.push(link);
        }
      }));
      fs.writeFile(htmlPath, $.html());
      return linksArr;
    });
};

const downloadHtml = (url, destination) => axios.get(url)
  .catch((error) => {
    if (error.response) {
      throw new Error(`${url} Request failed with status code ${error.response.status}`);
    } else {
      throw new Error(`${url} Request was made but no response was recieved`);
    }
  })
  .then((response) => fs.writeFile(destination, response.data, 'utf-8'));

const downloadResources = (destination, linksArr) => {
  debug('downloading resources');
  fs.mkdir(destination)
    .catch((err) => {
      console.error(err.message);
    });
  linksArr.map((link) => axios({
    method: 'get',
    url: link,
    responseType: 'arraybuffer',
  })
    .then((data) => {
      fs.writeFile(path.join(destination, getFilename(link)), data.data)
        .catch((err) => console.error(err.message));
    }));
};

module.exports = {
  createFilenameByUrl,
  downloadResources,
  getFilesDirectoryPath,
  getAbsoluteUrl,
  getFilename,
  getLinksAndChangeHtml,
  downloadHtml,
};
