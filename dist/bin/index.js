#!/usr/bin/env node
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

const load = url => {
  return _axios.default.get(url).then(response => {
    _fs.promises.writeFile(`${__dirname}/${createFilenameByUrl(url)}`, response.data, 'utf-8');
  }).catch(error => console.log(error));
}; // load('https://ru.hexlet.io/courses/regexp');


var _default = load;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9iaW4vaW5kZXguanMiXSwibmFtZXMiOlsiY3JlYXRlRmlsZW5hbWVCeVVybCIsInVybCIsInBhcnRzIiwicmVwbGFjZSIsInNwbGl0Iiwic2xpY2UiLCJmaWxlbmFtZSIsInJlZHVjZSIsImFjYyIsIml0ZW0iLCJsb2FkIiwiYXhpb3MiLCJnZXQiLCJ0aGVuIiwicmVzcG9uc2UiLCJmcyIsIndyaXRlRmlsZSIsIl9fZGlybmFtZSIsImRhdGEiLCJjYXRjaCIsImVycm9yIiwiY29uc29sZSIsImxvZyJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7O0FBQ0E7O0FBQ0E7Ozs7QUFFQSxNQUFNQSxtQkFBbUIsR0FBSUMsR0FBRCxJQUFTO0FBQ25DLFFBQU1DLEtBQUssR0FBR0QsR0FBRyxDQUFDRSxPQUFKLENBQVksb0JBQVosRUFBa0MsR0FBbEMsRUFBdUNDLEtBQXZDLENBQTZDLEdBQTdDLEVBQWtEQyxLQUFsRCxDQUF3RCxDQUF4RCxDQUFkO0FBQ0EsUUFBTUMsUUFBUSxHQUFHSixLQUFLLENBQUNLLE1BQU4sQ0FBYSxDQUFDQyxHQUFELEVBQU1DLElBQU4sS0FBZ0JELEdBQUcsS0FBSyxFQUFSLEdBQWMsR0FBRUMsSUFBSyxFQUFyQixHQUEwQixHQUFFRCxHQUFJLElBQUdDLElBQUssRUFBckUsRUFBeUUsRUFBekUsQ0FBakI7QUFDQSxTQUFRLEdBQUVILFFBQVMsT0FBbkI7QUFDRCxDQUpEOztBQU1BLE1BQU1JLElBQUksR0FBSVQsR0FBRCxJQUFTO0FBQ3BCLFNBQU9VLGVBQU1DLEdBQU4sQ0FBVVgsR0FBVixFQUNKWSxJQURJLENBQ0VDLFFBQUQsSUFBYztBQUNsQkMsaUJBQUdDLFNBQUgsQ0FBYyxHQUFFQyxTQUFVLElBQUdqQixtQkFBbUIsQ0FBQ0MsR0FBRCxDQUFNLEVBQXRELEVBQXlEYSxRQUFRLENBQUNJLElBQWxFLEVBQXdFLE9BQXhFO0FBQ0QsR0FISSxFQUlKQyxLQUpJLENBSUdDLEtBQUQsSUFBV0MsT0FBTyxDQUFDQyxHQUFSLENBQVlGLEtBQVosQ0FKYixDQUFQO0FBS0QsQ0FORCxDLENBT0E7OztlQUNlVixJIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuaW1wb3J0IHsgcHJvbWlzZXMgYXMgZnMgfSBmcm9tICdmcyc7XG5pbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnO1xuXG5jb25zdCBjcmVhdGVGaWxlbmFtZUJ5VXJsID0gKHVybCkgPT4ge1xuICBjb25zdCBwYXJ0cyA9IHVybC5yZXBsYWNlKC9bXkEtWmEtetCQLdCv0LAt0Y/QgdGRXS9nLCAnLScpLnNwbGl0KCctJykuc2xpY2UoMyk7XG4gIGNvbnN0IGZpbGVuYW1lID0gcGFydHMucmVkdWNlKChhY2MsIGl0ZW0pID0+IChhY2MgPT09ICcnID8gYCR7aXRlbX1gIDogYCR7YWNjfS0ke2l0ZW19YCksICcnKTtcbiAgcmV0dXJuIGAke2ZpbGVuYW1lfS5odG1sYDtcbn07XG5cbmNvbnN0IGxvYWQgPSAodXJsKSA9PiB7XG4gIHJldHVybiBheGlvcy5nZXQodXJsKVxuICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgZnMud3JpdGVGaWxlKGAke19fZGlybmFtZX0vJHtjcmVhdGVGaWxlbmFtZUJ5VXJsKHVybCl9YCwgcmVzcG9uc2UuZGF0YSwgJ3V0Zi04Jyk7XG4gICAgfSlcbiAgICAuY2F0Y2goKGVycm9yKSA9PiBjb25zb2xlLmxvZyhlcnJvcikpO1xufTtcbi8vIGxvYWQoJ2h0dHBzOi8vcnUuaGV4bGV0LmlvL2NvdXJzZXMvcmVnZXhwJyk7XG5leHBvcnQgZGVmYXVsdCBsb2FkO1xuIl19