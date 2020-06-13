import debug from 'debug';
import nock from 'nock';
import path from 'path';
import os from 'os';
import { promises as fs } from 'fs';
import load from '../src';
import { __dirname } from '../src/utils.js';

const getFixturePath = (filename) => path.join(__dirname, '__fixtures__', filename);

let tempDirName = '';

beforeEach(async () => {
  tempDirName = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
});

test('Should load HTML-page with resources', async () => {
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
  nock('https://abc.xyz')
    .log(debug)
    .get('/a')
    .reply(404);
  await expect(load('https://abc.xyz/a', tempDirName)).rejects.toThrow('Request failed with status code 404');
});

test('Should generate ENOENT error', async () => {
  nock('https://example.com/')
    .log(debug)
    .get('/a')
    .reply(200, '<html></html');
  await expect(load('https://example.com/a', path.join(tempDirName, 'any'))).rejects.toThrow('ENOENT');
});
