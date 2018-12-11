'use strict'

const { Buffer } = require('buffer')

const COMMENTS = [
  // Valid
  '//# sourceMappingURL=file.js',
  '/* # sourceMappingURL=file.js */',
  '   //# sourceMappingURL=file.js',
  '// #sourceMappingURL=file.js',
  '/*# sourceMappingURL=file.js */',
  '/* # sourceMappingURL=file.js*/',
  '/*# sourceMappingURL=file.js*/',
  '//@ sourceMappingURL=file.js',
  '//#sourceMappingURL=file.js',
  '//# sourceMappingUrl=file.js',
  '//# sourceMappingURL = file.js',
  '//# sourceMappingURL=/',
  '//# sourceMappingURL=http://www.domain.com/path',
  '//# sourceMappingURL=file.js   ',
  '/* # sourceMappingURL=file.js */   ',
  Buffer.from('//# sourceMappingURL=file.js '),

  // Valid multiline
  'Before\n//# sourceMappingURL=file.js',
  'Before\r\n//# sourceMappingURL=file.js',
  '//# sourceMappingURL=file.js\nAfter',
  '//# sourceMappingURL=file.js\r\nAfter',
  '//# sourceMappingURL=file.js\n//# sourceMappingURL=two.js',

  // Valid data URI
  '//# sourceMappingURL=data:application/json;charset=utf-8;base64,e30=',
  '//# sourceMappingURL=data:;charset=utf-8;base64,e30=',
  '//# sourceMappingURL=data:application/json;base64,e30=',

  // Invalid URI
  '//# sourceMappingURL=http://',

  // Invalid charset/format
  '//# sourceMappingURL=data:invalid_mime;charset=utf-8;base64,e30=',
  '//# sourceMappingURL=data:charset=utf-8;base64,e30=',
  '//# sourceMappingURL=data:application/json;charset=ascii;base64,e30=',

  // Invalid base64
  '//# sourceMappingURL=data:application/json;charset=utf-8;base64,invalid_base64',

  // Invalid
  true,
  '///# sourceMappingURL=file.js',
  '.  //# sourceMappingURL=file.js',
  '//# sourceMappingURL',
  '//# sourceMappingURL=',
  '//# sourceMappingURL=http://www.domain.com/not percent encoded',
  '/* # sourceMappingURL=file*/.js */',
  '//# sourceMappingURL=file.js  .',
]

module.exports = {
  COMMENTS,
}
