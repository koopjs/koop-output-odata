const parser = require('odata-parser')
const querystring = require('query-string')
const translations = require('./translations')

module.exports = function odataToEsri (queryParams) {
  if (!Object.keys(queryParams).length) return queryParams
  // Convert the query back to a querystring (parsing library expects that format) and parse it
  const str = querystring.stringify(queryParams, { encode: false })
  const ast = parser.parse(str)
  const esriQuery = {}

  console.log(queryParams, ast)

  // Loop through translations and apply those appropriate into a new query object
  translations.forEach(function (translation) {
    if (ast[translation.odata] !== undefined) {
      esriQuery[translation.esri] = translation.translate(ast[translation.odata])
    }
  })
  // console.log(esriQuery);
  return esriQuery
}
