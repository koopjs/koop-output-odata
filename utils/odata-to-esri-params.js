const odataParser = require('odata-parser')
const querystring = require('query-string')
const esriTranslator = require('./esri-translations-lookup')

module.exports = function odataToEsri (queryParams) {
  if (!Object.keys(queryParams).length) return queryParams
  // Convert the query back to a querystring (parsing library expects that format) and parse it
  const str = querystring.stringify(queryParams, { encode: false })
  const ast = odataParser.parse(str)
  const esriQuery = {}

  // Loop through translations and apply those appropriate into a new query object
  Object.keys(ast).forEach(key => {
    if(esriTranslator[key]) esriQuery[esriTranslator[key].esri] = esriTranslator[key].translate(ast[key])
  })

  return esriQuery
}
