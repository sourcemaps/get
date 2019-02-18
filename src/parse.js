'use strict'

const assert = require('assert')
// TODO: use global object once dropping support for Node.js <=9
// eslint-disable-next-line no-shadow, node/prefer-global/url
const { URL } = require('url')

const {
  Base64: { decode: decodeBase64 },
} = require('js-base64')

const { COMMENT_REGEXP, parseComment } = require('./regexp')
const { stringifyContent } = require('./stringify')

// Parse the source map comment from a file's content.
// Returns `{ url, multiline }` if source map is another file (URL or path).
// Returns `{ sourcemap, multiline }` if source map is inline (data URI).
// `multiline` is a boolean indicating whether the comment uses `//` or `/*`
// comment style.
// Returns `undefined` if none found.
// Either return `undefined` or throw an error if source map comment is invalid.
const parse = function(fileContent) {
  const fileContentA = stringifyContent({ fileContent })

  const parts = COMMENT_REGEXP.exec(fileContentA)

  // Either no source map comment or comment has invalid syntax
  if (parts === null) {
    return
  }

  const { multiline, mime, charset, base64Content, url } = parseComment({
    parts,
  })

  if (url !== undefined) {
    return parseUrlComment({ url, multiline })
  }

  return parseDataUriComment({ multiline, mime, charset, base64Content })
}

// When the source map comment uses an external URI
const parseUrlComment = function({ url, multiline }) {
  validateUrl({ url })
  return { url, multiline }
}

const validateUrl = function({ url }) {
  try {
    // eslint-disable-next-line no-new
    new URL(url, 'http://localhost')
  } catch (error) {
    throw new Error(`Source map's URL '${url}' is invalid`)
  }
}

// When the source map comment uses a data URI
const parseDataUriComment = function({
  multiline,
  mime,
  charset,
  base64Content,
}) {
  // Source map specification only allows JSON and UTF-8
  assert(
    [undefined, 'application/json', 'text/json'].includes(mime),
    `Source map's MIME type must be 'application/json' not '${mime}'`,
  )
  assert(
    [undefined, 'utf-8', 'utf8'].includes(charset),
    `Source map's charset must be 'utf-8' not '${charset}'`,
  )

  // This never throws
  const content = decodeBase64(base64Content)

  const sourcemap = parseJson({ content })
  return { sourcemap, multiline }
}

const parseJson = function({ content }) {
  try {
    return JSON.parse(content)
  } catch (error) {
    // Invalid Base64 is usually still parsed, then fails here
    throw new Error("Source map's data URI contains invalid JSON or base64")
  }
}

module.exports = {
  parse,
}
