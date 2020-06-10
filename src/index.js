import axios from 'axios';
import path from 'path';
import { promises as fs } from 'fs';
import cheerio from 'cheerio';
import debug from 'debug';
import Listr from 'listr';
import axiosDebug from 'axios-debug-log';

axiosDebug({
  request(deb, config) {
    deb(`Request with ${config.headers['content-type']}`);
  },
  response(deb, response) {
    deb(
      `Response with ${response.headers['content-type']}`,
      `from ${response.config.url}`,
    );
  },
});

let html = '';
let resources = '';
const links = [];

const tags = {
  script: 'src',
  img: 'src',
  link: 'href',
};

const log = debug('page-loader:utils');

const createFilenameByUrl = (url) => {
  const parts = url.replace('https://', '')
    .replace(/[^A-Za-zА-Яа-яЁё0-9]/g, '-')
    .split('-');
  const filename = parts.reduce((acc, item) => (acc === '' ? `${item}` : `${acc}-${item}`), '');
  return filename;
};

const isLocal = (url) => new URL(url, 'https://example.com').origin === 'https://example.com';

const getFilesDirectoryPath = (url) => `${createFilenameByUrl(url)}_files`;

const getFilename = (url) => {
  const { pathname } = new URL(url, 'https://example.com');
  const filename = pathname.split('/').filter((el) => el !== '').join('-');
  return filename === '' ? 'main.html' : filename;
};

const downloadHtml = (url) => axios.get(url)
  .then((response) => fs.writeFile(html, response.data, 'utf-8'));

const getLinksAndChangeHtml = () => {
  log('parsing html for local links and transforming HTML-page');
  return fs.readFile(html, 'utf-8')
    .then((data) => {
      const $ = cheerio.load(data);
      Object.keys(tags).map((tag) => $(tag).each((i, el) => {
        const link = $(el).attr(tags[tag]);
        if (link && isLocal(link)) {
          $(el).attr(`${tags[tag]}`, `${path.join(resources, getFilename(link))}`);
          links.push(link);
        } else if (link) {
          links.push(link);
        }
      }));
      return $;
    })
    .then(($) => {
      fs.writeFile(html, $.html());
    });
};

const getAbsoluteUrl = (webPageUrl) => {
  log('parsing local links for absolute urls');
  const localLinks = links.filter((link) => isLocal(link));
  const parsedURLS = localLinks.map((link) => new URL(link, webPageUrl).href);
  return parsedURLS;
};

const downloadResources = (linksArr) => {
  log('downloading resources');
  fs.mkdir(resources);
  new Listr([{
    title: 'Downloading resources: ',
    task: () => {
      linksArr.forEach((link) => {
        new Listr([{
          title: `${link}`,
          task: () => axios({
            method: 'get',
            url: link,
            responseType: 'arraybuffer',
          })
            .then((data) => fs.writeFile(path.join(resources, getFilename(link)), data.data)),
        }], { concurrent: true }).run();
      });
    },
  }]).run();
};

export default (url, destinationFolder = './') => {
  html = `${path.join(destinationFolder, createFilenameByUrl(url))}.html`;
  resources = path.join(destinationFolder, getFilesDirectoryPath(url));
  return downloadHtml(url)
    .then(() => getLinksAndChangeHtml())
    .then(() => getAbsoluteUrl(new URL(url)))
    .then((urls) => downloadResources(urls));
};
