const odataParser = require('odata-parser')
const querystring = require('query-string')
const odataLookup = require('./odata-param-lookup')

/**
 * Convert the query object to an OData object and then to Esri Geoservices params
 * @param {object} params - request query object
 */
module.exports = function odataToEsri (params) {
  if (!Object.keys(params).length) return params
  // Convert the query back to a querystring (parsing library expects that format) and parse it
  const str = querystring.stringify(params, { encode: false })
  const ast = odataParser.parse(str)
  const esriQuery = {}

  // Loop through translations and apply those appropriate into a new query object
  Object.keys(ast).forEach(key => {
    if (odataLookup[key]) esriQuery[odataLookup[key].esri] = odataLookup[key].translate(ast[key])
  })

  return esriQuery
}
