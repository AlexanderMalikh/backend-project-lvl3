/**
 * @jest-environment node
 */

const nock = require('nock');
const path = require('path');
const os = require('os');
const fs = require('fs').promises;
const { load } = require('../src/index');
const { getLinksAndChangeHtml } = require('../src/utils.js');

const getFixturePath = (filename) => path.join(__dirname, '__fixtures__', filename);

let tempDirName = '';

beforeEach(async () => {
  tempDirName = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
});

test('http requests is ok', async () => {
  const nockData = await fs.readFile(getFixturePath('emptyHtml.html'), 'utf-8');
  const scope = nock('https://ru.hexlet.io')
    .get('/my')
    .reply(200, nockData);
  await load('https://ru.hexlet.io/my', tempDirName);
  expect(scope.isDone()).toBe(true);
});

test('html file created', async () => {
  const nockData = await fs.readFile(getFixturePath('htmlWithRes.html'), 'utf-8');
  const testScript = await fs.readFile(getFixturePath('img.svg'), 'utf-8');
  nock('https://ru.hexlet.io')
    .log(console.log)
    .get('/my')
    .reply(200, nockData)
    .get('/img/img.svg')
    .reply(200, testScript);
  return load('https://ru.hexlet.io/my', tempDirName)
    .then(() => fs.lstat(path.join(tempDirName, 'ru-hexlet-io-my.html')))
    .then((stat) => expect(stat.isFile()).toBe(true))
    .catch((err) => console.log(err));
});

/*
test('transfrom links', async () => {
 getLinksAndChangeHtml('/home/alexander/Hexlet Projects/page loader/__tests__/__fixtures__/simpleHtml.html', '/home/alexander/Hexlet Projects/page loader/__tests__/__fixtures__');
});
*/
