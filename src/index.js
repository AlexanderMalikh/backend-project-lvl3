
import path from 'path';
import { promises as fs } from 'fs';
import axios from 'axios';

const createFilenameByUrl = (url) => {
  const parts = url.replace(/[^A-Za-zА-Яа-яЁё0-9]/g, '-').split('-').slice(3);
  const filename = parts.reduce((acc, item) => (acc === '' ? `${item}` : `${acc}-${item}`), '');
  return `${filename}.html`;
};

const load = (url, destionationFolder) => {
  return axios.get(url)
    .then((response) => {
      fs.writeFile(path.join(destionationFolder, createFilenameByUrl(url)), response.data);
    })
    .catch((error) => console.log(error));
};
export default load;
