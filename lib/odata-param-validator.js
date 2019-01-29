const odataLookup = require('../lib/odata-param-lookup')

/**
 * Reject request if OData params are not valid
 * @param {*} params
 */
module.exports = function validateOdataParams (params) {
  // Validate the query parameters
  let invalidQueryParam
  Object.keys(params).some(key => {
    if (!odataLookup[key]) {
      invalidQueryParam = key
      return true
    }
  })

  // If invalid parameters, return object with error message
  if (invalidQueryParam) return { error: `"${invalidQueryParam}" is not a supported OData query parameter.` }
}
