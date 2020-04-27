import { promises as fs } from 'fs';
import axios from 'axios';

const createFilenameByUrl = (url) => {
  const parts = url.replace(/[^A-Za-zА-Яа-яЁё]/g, '-').split('-').slice(3);
  const filename = parts.reduce((acc, item) => (acc === '' ? `${item}` : `${acc}-${item}`), '');
  return `${filename}.html`;
};

const load = (url, destionationFolder) => {
  return axios.get(url)
    .then((response) => {
      fs.writeFile(`${destionationFolder}/${createFilenameByUrl(url)}`, response.data, 'utf-8');
    })
    .catch((error) => console.log(error));
};
export default load;
