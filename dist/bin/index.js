#!/usr/bin/env node
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = require("fs");

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = url => {
  return _axios.default.get(url).then(response => {
    _fs.promises.writeFile('./answer', response);
  }).catch(error => console.log(error));
};

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9iaW4vaW5kZXguanMiXSwibmFtZXMiOlsidXJsIiwiYXhpb3MiLCJnZXQiLCJ0aGVuIiwicmVzcG9uc2UiLCJmcyIsIndyaXRlRmlsZSIsImNhdGNoIiwiZXJyb3IiLCJjb25zb2xlIiwibG9nIl0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7QUFDQTs7QUFDQTs7OztlQUVnQkEsR0FBRCxJQUFTO0FBQ3RCLFNBQU9DLGVBQU1DLEdBQU4sQ0FBVUYsR0FBVixFQUNKRyxJQURJLENBQ0VDLFFBQUQsSUFBYztBQUNsQkMsaUJBQUdDLFNBQUgsQ0FBYSxVQUFiLEVBQXlCRixRQUF6QjtBQUNELEdBSEksRUFJSkcsS0FKSSxDQUlHQyxLQUFELElBQVdDLE9BQU8sQ0FBQ0MsR0FBUixDQUFZRixLQUFaLENBSmIsQ0FBUDtBQUtELEMiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG5pbXBvcnQgeyBwcm9taXNlcyBhcyBmcyB9IGZyb20gJ2ZzJztcbmltcG9ydCBheGlvcyBmcm9tICdheGlvcyc7XG5cbmV4cG9ydCBkZWZhdWx0ICh1cmwpID0+IHtcbiAgcmV0dXJuIGF4aW9zLmdldCh1cmwpXG4gICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICBmcy53cml0ZUZpbGUoJy4vYW5zd2VyJywgcmVzcG9uc2UpO1xuICAgIH0pXG4gICAgLmNhdGNoKChlcnJvcikgPT4gY29uc29sZS5sb2coZXJyb3IpKTtcbn07XG4iXX0=