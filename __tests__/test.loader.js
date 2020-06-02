/**
 * @jest-environment node
 */
const debug = require('debug')('tests');
const nock = require('nock');
const path = require('path');
const os = require('os');
const fs = require('fs').promises;
const { load } = require('../src/index');

const getFixturePath = (filename) => path.join(__dirname, '__fixtures__', filename);

let tempDirName = '';

beforeEach(async () => {
  tempDirName = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
});

test('Should load HTML-page with resources', async () => {
  debug('cheking if HTML is loaded with resources');

  const nockData = await fs.readFile(getFixturePath('htmlWithRes.html'), 'utf-8');
  const img = await fs.readFile(getFixturePath('img.svg'), 'utf-8');
  const scope = nock('https://ru.hexlet.io')
    .log(debug)
    .get('/my')
    .reply(200, nockData)
    .get('/img.svg')
    .reply(200, img);
  await load('https://ru.hexlet.io/my', tempDirName);
  const page = await fs.lstat(path.join(tempDirName, 'ru-hexlet-io-my.html'));
  const resourcesFolder = await fs.lstat(path.join(tempDirName, 'ru-hexlet-io-my_files'));
  const downloadedImg = await fs.lstat(path.join(tempDirName, 'ru-hexlet-io-my_files', 'img.svg'));

  expect(scope.isDone()).toBe(true);
  expect(page.isFile()).toBe(true);
  expect(resourcesFolder.isDirectory()).toBe(true);
  expect(downloadedImg.isFile()).toBe(true);
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
    .log(debug)
    .get('/a')
    .reply(200, '<html></html');
  await expect(load('https://example.com/a', path.join(tempDirName, 'any'))).rejects.toThrow('ENOENT');
});

/*
test('HTTP requests are ok', async () => {
  debug('cheking if http req working');
  const scope = nock('https://ru.hexlet.io')
    .get('/my')
    .reply(200, '<html></html>');
  await load('https://ru.hexlet.io/my', tempDirName);
});

test('HTML file created', async () => {
  debug('cheking if html downloaded');
  nock('https://ru.hexlet.io')
    .log(debug)
    .get('/my')
    .reply(200, '<html></html>');
  await load('https://ru.hexlet.io/my', tempDirName);
  const stat = await fs.lstat(path.join(tempDirName, 'ru-hexlet-io-my.html'));
  expect(stat.isFile()).toBe(true);
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
*/
