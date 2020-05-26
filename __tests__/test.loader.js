/**
 * @jest-environment node
 */
const debug = require('debug')('page-loader:tests');
const nock = require('nock');
const path = require('path');
const os = require('os');
const fs = require('fs').promises;
const { load } = require('../src/index');
// const { getLinksAndChangeHtml } = require('../src/utils.js');

const getFixturePath = (filename) => path.join(__dirname, '__fixtures__', filename);

let tempDirName = '';

beforeEach(async () => {
  tempDirName = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
});

test('http requests are ok', async () => {
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
  await load('https://ru.hexlet.io/my', tempDirName);
  const stat = await fs.lstat(path.join(tempDirName, 'ru-hexlet-io-my.html'));
  expect(stat.isFile()).toBe(true);
});
test('files directory created', async () => {
  const nockData = await fs.readFile(getFixturePath('htmlWithRes.html'), 'utf-8');
  const testScript = await fs.readFile(getFixturePath('img.svg'), 'utf-8');
  nock('https://ru.hexlet.io')
    .log(console.log)
    .get('/my')
    .reply(200, nockData)
    .get('/img/img.svg')
    .reply(200, testScript);
  await load('https://ru.hexlet.io/my', tempDirName);
  const stat = await fs.lstat(path.join(tempDirName, 'ru-hexlet-io-my_files'));
  expect(stat.isDirectory()).toBe(true);
});
/*
test('resources are downloaded', async () => {
  const nockData = await fs.readFile(getFixturePath('htmlWithRes.html'), 'utf-8');
  const testImg = await fs.readFile(getFixturePath('img.svg'), 'utf-8');
  nock('https://ru.hexlet.io')
    .log(console.log)
    .get('/my')
    .reply(200, nockData)
    .get('/img/img.svg')
    .reply(200, testImg);
  await load('https://ru.hexlet.io/my', tempDirName);
  const stat = await fs.lstat(path.join(tempDirName, 'ru-hexlet-io-my_files', 'img-img.svg'));
  expect(stat.isFile()).toBe(true);
});
*/
