/* eslint no-unused-expressions: ["error", { "allowTernary": true }] */
const path = require('path');
const url = require('url');
const fs = require('fs').promises;
const axios = require('axios');
const cheerio = require('cheerio');

const createFilenameByUrl = (webPageUrl) => {
  const parts = webPageUrl.replace(/[^A-Za-zА-Яа-яЁё0-9]/g, '-').split('-').slice(3);
  const filename = parts.reduce((acc, item) => (acc === '' ? `${item}` : `${acc}-${item}`), '');
  return `${filename}.html`;
};

const mapp = {
  script: 'script[src]',
  img: 'img[src]',
  link: 'link[href]',
};

const tagsWithResources = ['script', 'img', 'link'];


const parseLinks = (pathToHtml) => {
  const linksArr = [];
  return fs.readFile(pathToHtml, 'utf-8')
    .then((data) => {
      const $ = cheerio.load(data);
      tagsWithResources.map((tag) => {
        $(`${mapp[tag]}`).each((i, el) => {
          tag === 'link' ? linksArr.push($(el).attr('href')) : linksArr.push($(el).attr('src'));
        });
        return tag;
      });
      return linksArr;
    })
    .catch((err) => console.log(err));
};

const transformRelativeLinksToAbsoluteUrls = (links, host) => {
  const relativeLinks = links.filter((link) => !link.startsWith('https://') && !link.startsWith('//'));
  console.log('LINKS_______________________________\n', links);
  console.log('RELATIVE LINKS______________________\n', relativeLinks);
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
      const tmp = transformRelativeLinksToAbsoluteUrls(parsedLinks, new URL(webPageUrl).href);
    })
    .catch((error) => console.log(error));
};

module.exports = {
  load,
};
