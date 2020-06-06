import axios from 'axios';
import path from 'path';
import { promises as fs } from 'fs';
import cheerio from 'cheerio';
import debug from 'debug';
import Listr from 'listr';

const tags = {
  script: 'src',
  img: 'src',
  link: 'href',
};

const log = debug('page-loader:utils');

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
  const filename = pathname.split('/').filter((el) => el !== '').join('-');
  return filename === '' ? 'main.html' : filename;
};

const downloadHtml = (url, destination) => axios.get(url)
  .then((response) => fs.writeFile(destination, response.data, 'utf-8'));

const getLinksAndChangeHtml = (htmlPath, resourcesPath) => {
  log('parsing html for local links and transforming HTML-page');
  const linksArr = [];
  return fs.readFile(htmlPath, 'utf-8')
    .then((data) => {
      const $ = cheerio.load(data);
      Object.keys(tags).map((tag) => $(tag).each((i, el) => {
        const link = $(el).attr(tags[tag]);
        if (link && isLocal(link)) {
          $(el).attr(`${tags[tag]}`, `${path.join(resourcesPath, getFilename(link))}`);
          linksArr.push(link);
        } else if (link) {
          linksArr.push(link);
        }
      }));
      return $;
    })
    .then(($) => {
      fs.writeFile(htmlPath, $.html());
      return linksArr;
    });
};

const getAbsoluteUrl = (links, webPageUrl) => {
  log('parsing local links for absolute urls');
  const localLinks = links.filter((link) => isLocal(link));
  const parsedURLS = localLinks.map((link) => new URL(link, webPageUrl).href);
  return parsedURLS;
};

const downloadResources = (destination, linksArr) => {
  log('downloading resources');
  fs.mkdir(destination);
  const dowloadPromise = (link) => {
    axios({
      method: 'get',
      url: link,
      responseType: 'arraybuffer',
    })
      .then((data) => {
        new Listr([{
          title: `Downloading ${link}`,
          task: () => {
            fs.writeFile(path.join(destination, getFilename(link)), data.data)
              .catch((err) => console.error(err.message));
          },
        }]).run();
      });
  };
  Promise.allSettled(linksArr.map((link) => dowloadPromise(link)));
};

export {
  createFilenameByUrl,
  downloadResources,
  getFilesDirectoryPath,
  getAbsoluteUrl,
  getFilename,
  getLinksAndChangeHtml,
  downloadHtml,
};
