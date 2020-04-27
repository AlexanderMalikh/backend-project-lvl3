"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = require("fs");

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createFilenameByUrl = url => {
  const parts = url.replace(/[^A-Za-zА-Яа-яЁё]/g, '-').split('-').slice(3);
  const filename = parts.reduce((acc, item) => acc === '' ? `${item}` : `${acc}-${item}`, '');
  return `${filename}.html`;
};

const load = (url, destionationFolder) => {
  return _axios.default.get(url).then(response => {
    _fs.promises.writeFile(`${destionationFolder}/${createFilenameByUrl(url)}`, response, 'utf-8');
  }).catch(error => console.log(error));
};

var _default = load;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJjcmVhdGVGaWxlbmFtZUJ5VXJsIiwidXJsIiwicGFydHMiLCJyZXBsYWNlIiwic3BsaXQiLCJzbGljZSIsImZpbGVuYW1lIiwicmVkdWNlIiwiYWNjIiwiaXRlbSIsImxvYWQiLCJkZXN0aW9uYXRpb25Gb2xkZXIiLCJheGlvcyIsImdldCIsInRoZW4iLCJyZXNwb25zZSIsImZzIiwid3JpdGVGaWxlIiwiY2F0Y2giLCJlcnJvciIsImNvbnNvbGUiLCJsb2ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7OztBQUVBLE1BQU1BLG1CQUFtQixHQUFJQyxHQUFELElBQVM7QUFDbkMsUUFBTUMsS0FBSyxHQUFHRCxHQUFHLENBQUNFLE9BQUosQ0FBWSxvQkFBWixFQUFrQyxHQUFsQyxFQUF1Q0MsS0FBdkMsQ0FBNkMsR0FBN0MsRUFBa0RDLEtBQWxELENBQXdELENBQXhELENBQWQ7QUFDQSxRQUFNQyxRQUFRLEdBQUdKLEtBQUssQ0FBQ0ssTUFBTixDQUFhLENBQUNDLEdBQUQsRUFBTUMsSUFBTixLQUFnQkQsR0FBRyxLQUFLLEVBQVIsR0FBYyxHQUFFQyxJQUFLLEVBQXJCLEdBQTBCLEdBQUVELEdBQUksSUFBR0MsSUFBSyxFQUFyRSxFQUF5RSxFQUF6RSxDQUFqQjtBQUNBLFNBQVEsR0FBRUgsUUFBUyxPQUFuQjtBQUNELENBSkQ7O0FBTUEsTUFBTUksSUFBSSxHQUFHLENBQUNULEdBQUQsRUFBTVUsa0JBQU4sS0FBNkI7QUFDeEMsU0FBT0MsZUFBTUMsR0FBTixDQUFVWixHQUFWLEVBQ0phLElBREksQ0FDRUMsUUFBRCxJQUFjO0FBQ2xCQyxpQkFBR0MsU0FBSCxDQUFjLEdBQUVOLGtCQUFtQixJQUFHWCxtQkFBbUIsQ0FBQ0MsR0FBRCxDQUFNLEVBQS9ELEVBQWtFYyxRQUFsRSxFQUE0RSxPQUE1RTtBQUNELEdBSEksRUFJSkcsS0FKSSxDQUlHQyxLQUFELElBQVdDLE9BQU8sQ0FBQ0MsR0FBUixDQUFZRixLQUFaLENBSmIsQ0FBUDtBQUtELENBTkQ7O2VBT2VULEkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBwcm9taXNlcyBhcyBmcyB9IGZyb20gJ2ZzJztcbmltcG9ydCBheGlvcyBmcm9tICdheGlvcyc7XG5cbmNvbnN0IGNyZWF0ZUZpbGVuYW1lQnlVcmwgPSAodXJsKSA9PiB7XG4gIGNvbnN0IHBhcnRzID0gdXJsLnJlcGxhY2UoL1teQS1aYS160JAt0K/QsC3Rj9CB0ZFdL2csICctJykuc3BsaXQoJy0nKS5zbGljZSgzKTtcbiAgY29uc3QgZmlsZW5hbWUgPSBwYXJ0cy5yZWR1Y2UoKGFjYywgaXRlbSkgPT4gKGFjYyA9PT0gJycgPyBgJHtpdGVtfWAgOiBgJHthY2N9LSR7aXRlbX1gKSwgJycpO1xuICByZXR1cm4gYCR7ZmlsZW5hbWV9Lmh0bWxgO1xufTtcblxuY29uc3QgbG9hZCA9ICh1cmwsIGRlc3Rpb25hdGlvbkZvbGRlcikgPT4ge1xuICByZXR1cm4gYXhpb3MuZ2V0KHVybClcbiAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIGZzLndyaXRlRmlsZShgJHtkZXN0aW9uYXRpb25Gb2xkZXJ9LyR7Y3JlYXRlRmlsZW5hbWVCeVVybCh1cmwpfWAsIHJlc3BvbnNlLCAndXRmLTgnKTtcbiAgICB9KVxuICAgIC5jYXRjaCgoZXJyb3IpID0+IGNvbnNvbGUubG9nKGVycm9yKSk7XG59O1xuZXhwb3J0IGRlZmF1bHQgbG9hZDtcbiJdfQ==