import nock from 'nock';
import path from 'path';
import { promises as fs } from 'fs';
import load from '../src/bin/index';

const getFixturePath = (filename) => path.join(__dirname, '__fixtures__', filename);

test('loader', async () => {
  const nockData = await fs.readFile(getFixturePath('nock'), 'utf-8');
  const scope = nock('https://ru.hexlet.io')
    .get('/my')
    .reply(200, nockData);
  load('https://ru.hexlet.io/my').then(() => expect(scope.isDone()).toBe(true));
});
