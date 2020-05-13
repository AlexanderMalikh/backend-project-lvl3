import nock from 'nock';
import path from 'path';
import os from 'os';
import { promises as fs } from 'fs';
import load from '../src/index';

const getFixturePath = (filename) => path.join(__dirname, '__fixtures__', filename);

let tempDirName = '';

beforeEach(async () => {
  tempDirName = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
});

test('loader', async () => {
  console.log(tempDirName);
  const nockData = await fs.readFile(getFixturePath('nock'), 'utf-8');
  const scope = nock('https://ru.hexlet.io')
    .get('/my')
    .reply(200, nockData);
  load('https://ru.hexlet.io/my', tempDirName).then(() => expect(scope.isDone()).toBe(true));
});
