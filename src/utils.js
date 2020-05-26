const axios = require('axios');
const path = require('path');
const fs = require('fs').promises;
const cheerio = require('cheerio');
const b = require('debug')('page-loader:getAbsoluteUrl');
const c = require('debug')('page-loader:getLinksAndChangeHTML');
const d = require('debug')('page-loader:downloadResources');

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
  b('parsing local links for absolute urls');
  let parsedURLS = links.filter((link) => isLocal(link));
  b('LOCAL LINKS\n', parsedURLS);
  parsedURLS = parsedURLS.map((link) => new URL(link, webPageUrl).href);
  b('URLS\n', parsedURLS);
  return parsedURLS;
};

const getLinksAndChangeHtml = (htmlPath, resourcesPath) => {
  c('parsing html for local links and transforming HTML-page');
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
    })
    .catch((err) => console.log(err));
};

const downloadResources = (destination, linksArr) => {
  d('downloading resources');
  fs.mkdir(destination)
    .catch((err) => d(err));
  linksArr.map((link) => axios({
    method: 'get',
    url: link,
    responseType: 'arraybuffer',
  })
    .then((data) => {
      fs.writeFile(path.join(destination, getFilename(link)), data.data)
        .catch((err) => console.log(err));
    })
    .catch((err) => d(err)));
};

module.exports = {
  createFilenameByUrl,
  downloadResources,
  getFilesDirectoryPath,
  getAbsoluteUrl,
  getFilename,
  getLinksAndChangeHtml,
};
