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

const tags = {
  script: 'src',
  img: 'src',
  link: 'href',
};

const log = debug('page-loader:utils');

const createFilenameByUrl = (url) => {
  const parts = url.replace('https://', '')
    .replace(/[\W]{1}$/g, '')
    .replace(/[\W]/g, '-');
  return parts;
};

const isLocal = (link, url) => {
  const originalHost = new URL(url).origin;
  return new URL(link, originalHost).origin === originalHost;
};

const getFilesDirectoryPath = (url) => `${createFilenameByUrl(url)}_files`;

const getFilename = (url) => {
  const { pathname } = new URL(url, 'https://example.com');
  const filename = pathname.split('/').filter((el) => el !== '').join('-');
  return filename === '' ? 'index.html' : filename;
};

const downloadHtml = (url, htmlPath) => axios.get(url)
  .then((response) => fs.writeFile(htmlPath, response.data, 'utf-8'));

const getLinksAndChangeHtml = (html, url) => {
  log('parsing html for local links and transforming HTML-page');
  const links = [];
  const $ = cheerio.load(html);
  Object.keys(tags).map((tag) => $(tag).each((i, el) => {
    const link = $(el).attr(tags[tag]);
    if (link && isLocal(link, url)) {
      $(el).attr(`${tags[tag]}`, `${path.join(getFilesDirectoryPath(url), getFilename(link))}`);
      links.push(link);
    }
  }));
  return { links, newHtml: $.html() };
};

const getAbsoluteUrls = (links, url) => {
  log('parsing local links for absolute urls');
  return links.map((link) => new URL(link, url).href);
};

const downloadResources = (links, resourcesPath) => {
  log('downloading resources');
  return fs.mkdir(resourcesPath).then(() => {
    links.forEach((link) => {
      new Listr([{
        title: `Downloading ${link}`,
        task: () => axios({
          method: 'get',
          url: link,
          responseType: 'arraybuffer',
        })
          .then((data) => fs.writeFile(path.join(resourcesPath, getFilename(link)), data.data)),
      }], { concurrent: true, exitOnError: false }).run();
    });
  });
};

export default (url, destinationFolder) => {
  const htmlPath = `${path.join(destinationFolder, createFilenameByUrl(url))}.html`;
  const resourcesPath = path.join(destinationFolder, getFilesDirectoryPath(url));
  return downloadHtml(url, htmlPath)
    .then(() => fs.readFile(htmlPath, 'utf-8'))
    .then((html) => getLinksAndChangeHtml(html, url))
    .then(({ links, newHtml }) => fs.writeFile(htmlPath, newHtml).then(() => links))
    .then((links) => getAbsoluteUrls(links, url))
    .then((urls) => downloadResources(urls, resourcesPath));
};
