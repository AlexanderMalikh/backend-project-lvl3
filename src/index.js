/* eslint no-unused-expressions: ["error", { "allowTernary": true }] */
const path = require('path');
const url = require('url');
const fs = require('fs').promises;
const axios = require('axios');
const cheerio = require('cheerio');

const createFilenameByUrl = (webPageUrl) => {
  const parts = webPageUrl.replace(/[^A-Za-zА-Яа-яЁё0-9]/g, '-').split('-').slice(3);
  const filename = parts.reduce((acc, item) => (acc === '' ? `${item}` : `${acc}-${item}`), '');
  return filename;
};

const mapp = {
  script: 'script[src]',
  img: 'img[src]',
  link: 'link[href]',
};

const tagsWithResources = ['script', 'img', 'link'];

const parseTags = (pathToHtml) => {
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

const parseURL = (links, webPageUrl) => {
  const parsedURLS = links.filter((link) => new URL(link, webPageUrl).host === webPageUrl.host)
    .map((link) => new URL(link, webPageUrl).href);
  console.log('LINKS_______________________________\n', parsedURLS);

  return parsedURLS;
};
/*
const dowloadLocalResources = (resArr, destionation) => {
  resArr.map((res) => {
    axios.get(res)
      .then((response) => {

        fs.writeFile(destionation, response.data);
      })
      .catch((err) => console.log(err));
    return res;
  });
};
*/
const load = (webPageUrl, destionationFolder = '/../test') => {
  const htmlPath = `${path.join(destionationFolder, createFilenameByUrl(webPageUrl))}.html`;
  const filesPath = `${path.join(destionationFolder, createFilenameByUrl(webPageUrl))}_files`;
  return axios.get(webPageUrl)
    .then((response) => {
      fs.writeFile(htmlPath, response.data);
      fs.mkdir(filesPath);
    })
    .then(() => parseTags(htmlPath))
    .then((parsedLinks) => {
      const localLinks = parseURL(parsedLinks, new URL(webPageUrl));
      // dowloadLocalResources(localLinks, filesPath);
    })
    .catch((error) => console.log(error));
};

module.exports = {
  load,
};
