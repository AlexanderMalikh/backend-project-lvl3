import path from 'path';
import { promises as fs } from 'fs';
import axios from 'axios';
import cheerio from 'cheerio';
import url from 'url';

const createFilenameByUrl = (webPageUrl) => {
  const parts = webPageUrl.replace(/[^A-Za-zА-Яа-яЁё0-9]/g, '-').split('-').slice(3);
  const filename = parts.reduce((acc, item) => (acc === '' ? `${item}` : `${acc}-${item}`), '');
  return `${filename}.html`;
};

const parseLinks = (pathToHtml) => {
  const linksArr = [];
  return fs.readFile(pathToHtml, 'utf-8')
    .then((data) => {
      const $ = cheerio.load(data);

      const links = $('link[href]');
      const scripts = $('script[src]');
      const imgs = $('img[src]');

      links.each((i, el) => {
        linksArr.push($(el).attr('href'));
      });

      scripts.each((i, el) => {
        linksArr.push($(el).attr('src'));
      });

      imgs.each((i, el) => {
        linksArr.push($(el).attr('src'));
      });
      return linksArr;
    })
    .catch((err) => console.log(err));
};

// dlya downloada local resyrsov
const transformRelativeLinksToAbsoluteUrls = (links, host) => {
  const relativeLinks = links.filter((link) => !link.startsWith('https://') && !link.startsWith('//'));
  console.log(relativeLinks);
  const relativeUrls = relativeLinks.map((link) => new URL(link, host));
  return relativeUrls;
};

const load = (webPageUrl, destionationFolder = '/../test') => {
  const resultingFilePath = path.join(destionationFolder, createFilenameByUrl(webPageUrl));
  return axios.get(webPageUrl)
    .then((response) => {
      fs.writeFile(resultingFilePath, response.data);
    })
    .then(() => parseLinks(resultingFilePath))
    .then((parsedLinks) => {
      // console.log('parsed links\n', parsedLinks);
      const tmp = transformRelativeLinksToAbsoluteUrls(parsedLinks, new URL(webPageUrl).href);
      console.log(tmp);
    })
    .catch((error) => console.log(error));
};


export default load;
