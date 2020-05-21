const cheerio = require('cheerio');
const fs = require('fs').promises;

const tagsWithResources = ['script[src]', 'img[src]', 'link[href]'];

const mapp = {
  script: 'src',
  img: 'src',
  link: 'href',
};

const parseURL = (links, webPageUrl) => {
  let parsedURLS = links.filter((link) => new URL(link, webPageUrl).host === webPageUrl.host);
  console.log('LOCAL LINKS_________________________\n', parsedURLS);
  parsedURLS = parsedURLS.map((link) => new URL(link, webPageUrl).href);
  console.log('LINKS_______________________________\n', parsedURLS);
  return parsedURLS;
};

const parseTags = (pathToHtml) => fs.readFile(pathToHtml, 'utf-8')
  .then((data) => {
    const $ = cheerio.load(data);
    const linksArr = [];
    tagsWithResources.map((tag) => $(`${tag}`).each((_i, el) => {
      linksArr.push($(el).attr(mapp[el.tagName]));
    }));
    return linksArr;
  })
  .catch((err) => console.log(err));

module.exports = {
  parseURL,
  parseTags,
};
