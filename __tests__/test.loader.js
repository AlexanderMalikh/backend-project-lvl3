/**
 * @jest-environment node
 */
const debug = require('debug')('tests');
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

test('HTTP requests are ok', async () => {
  debug('cheking if http req working');
  const nockData = await fs.readFile(getFixturePath('emptyHtml.html'), 'utf-8');
  const scope = nock('https://ru.hexlet.io')
    .get('/my')
    .reply(200, nockData);
  await load('https://ru.hexlet.io/my', tempDirName);
  expect(scope.isDone()).toBe(true);
});

test('HTML file created', async () => {
  debug('cheking if html downloaded');
  const nockData = await fs.readFile(getFixturePath('emptyHtml.html'), 'utf-8');
  nock('https://ru.hexlet.io')
    .log(debug)
    .get('/my')
    .reply(200, nockData);
  await load('https://ru.hexlet.io/my', tempDirName);
  const stat = await fs.lstat(path.join(tempDirName, 'ru-hexlet-io-my.html'));
  expect(stat.isFile()).toBe(true);
});

test('Resources directory created', async () => {
  debug('cheking if resources directory is created');
  const nockData = await fs.readFile(getFixturePath('htmlWithRes.html'), 'utf-8');
  const testScript = await fs.readFile(getFixturePath('img.svg'), 'utf-8');
  nock('https://ru.hexlet.io')
    .log(debug)
    .get('/my')
    .reply(200, nockData)
    .get('/img.svg')
    .reply(200, testScript);
  await load('https://ru.hexlet.io/my', tempDirName);
  const stat = await fs.lstat(path.join(tempDirName, 'ru-hexlet-io-my_files'));
  expect(stat.isDirectory()).toBe(true);
});

test('resources are downloaded', async () => {
  const nockData = await fs.readFile(getFixturePath('htmlWithRes.html'), 'utf-8');
  const testImg = await fs.readFile(getFixturePath('img.svg'), 'utf-8');
  nock('https://ru.hexlet.io')
    .log(console.log)
    .get('/my')
    .reply(200, nockData)
    .get('/img.svg')
    .reply(200, testImg);
  await load('https://ru.hexlet.io/my', tempDirName);
  const stat = await fs.lstat(path.join(tempDirName, 'ru-hexlet-io-my_files', 'img.svg'));
  expect(stat.isFile()).toBe(true);
});

test('Should generate 404 error', async () => {
  debug('cheking errors');
  nock('https://abc.xyz')
    .log(debug)
    .get('/a')
    .reply(404);
  await expect(load('https://abc.xyz/a', tempDirName)).rejects.toThrow('https://abc.xyz/a Request failed with status code 404');
});

test('Should generate ENOENT error', async () => {
  nock('https://example.com/')
    .get('/a')
    .reply(200, '<html><p></html');
  await expect(load('https://example.com/a', path.join(tempDirName, 'any'))).rejects.toThrow('ENOENT');
});
