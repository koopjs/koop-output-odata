const js2xmlparser = require('js2xmlparser')
const odataLookup = require('../lib/odata-param-lookup')

/**
 * Reject request if OData params are not valid
 * @param {*} params
 * @param {*} res
 */
module.exports = function hasValidOdataParams (params, res) {
  // Validate the query parameters
  let invalidQueryParam
  Object.keys(params).some(key => {
    if (!odataLookup[key]) {
      invalidQueryParam = key
      return true
    }
  })

  // If no invalid parameters, return true
  if (invalidQueryParam) {
    // Reject request because it includes invalid OData query parameters
    const errorXml = js2xmlparser.parse('error', {
      code: 400,
      message: `"${invalidQueryParam}" is not a supported OData query parameter.`
    })
    res.set('Content-Type', 'text/xml')
    res.status(400).send(errorXml)
    return false
  }

  return true
}
