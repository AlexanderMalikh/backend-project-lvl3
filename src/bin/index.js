#!/usr/bin/env node
import { promises as fs } from 'fs';
import axios from 'axios';

export default (url) => {
  return axios.get(url)
    .then((response) => {
      fs.writeFile('./answer', response);
    })
    .catch((error) => console.log(error));
};
