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
    .replace(/[^A-Za-zА-Яа-яЁё0-9]{1}$/g, '')
    .replace(/[^A-Za-zА-Яа-яЁё0-9]/g, '-');
  return parts;
};

const isLocal = (url) => new URL(url, 'https://example.com').origin === 'https://example.com';

const getFilesDirectoryPath = (url) => `${createFilenameByUrl(url)}_files`;

const getFilename = (url) => {
  const { pathname } = new URL(url, 'https://example.com');
  const filename = pathname.split('/').filter((el) => el !== '').join('-');
  return filename === '' ? 'main.html' : filename;
};

const downloadHtml = (url, htmlPath) => axios.get(url)
  .then((response) => fs.writeFile(htmlPath, response.data, 'utf-8'));

const getLinksAndChangeHtml = (htmlPath, host) => {
  log('parsing html for local links and transforming HTML-page');
  const links = [];
  return fs.readFile(htmlPath, 'utf-8')
    .then((data) => {
      const $ = cheerio.load(data);
      Object.keys(tags).map((tag) => $(tag).each((i, el) => {
        const link = $(el).attr(tags[tag]);
        if (link && isLocal(link)) {
          $(el).attr(`${tags[tag]}`, `${path.join(getFilesDirectoryPath(host), getFilename(link))}`);
          links.push(link);
        }
      }));
      return $;
    })
    .then(($) => {
      fs.writeFile(htmlPath, $.html());
      return links;
    });
};

const getAbsoluteUrls = (links, url) => {
  log('parsing local links for absolute urls');
  return links.map((link) => new URL(link, url).href);
};

const downloadResources = (linksArr, resourcesPath) => {
  log('downloading resources');
  fs.mkdir(resourcesPath);
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
            .then((data) => fs.writeFile(path.join(resourcesPath, getFilename(link)), data.data)),
        }], { concurrent: true }).run();
      });
    },
  }]).run();
};

export default (url, destinationFolder) => {
  const htmlPath = `${path.join(destinationFolder, createFilenameByUrl(url))}.html`;
  const resourcesPath = path.join(destinationFolder, getFilesDirectoryPath(url));
  return downloadHtml(url, htmlPath)
    .then(() => getLinksAndChangeHtml(htmlPath, url))
    .then((links) => getAbsoluteUrls(links, new URL(url)))
    .then((urls) => downloadResources(urls, resourcesPath));
};
