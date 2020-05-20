/**
 * @jest-environment node
 */

const nock = require('nock');
const path = require('path');
const os = require('os');
const fs = require('fs').promises;
const load = require('../src/index');

const getFixturePath = (filename) => path.join(__dirname, '__fixtures__', filename);

let tempDirName = '';

beforeEach(async () => {
  tempDirName = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
});

test('http requests is ok', async () => {
  const nockData = await fs.readFile(getFixturePath('nock'), 'utf-8');
  const scope = nock('https://ru.hexlet.io')
    .get('/my')
    .reply(200, nockData);
  await load('https://ru.hexlet.io/my', tempDirName);
  expect(scope.isDone()).toBe(true);
});

test('html file created', async () => {
  const nockData = await fs.readFile(getFixturePath('nock'), 'utf-8');
  nock('https://ru.hexlet.io')
    .get('/my')
    .reply(200, nockData);
  await load('https://ru.hexlet.io/my', tempDirName);
  const stat = await fs.lstat(path.join(tempDirName, 'ru-hexlet-io-my.html'));
  return expect(stat.isFile()).toBe(true);
});
