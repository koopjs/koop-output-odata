const paramsToErsi = require('./lib/odata-to-esri-params')
const hasValidOdataParams = require('./lib/odata-param-validator')
const js2xmlparser = require('js2xmlparser')
const winnow = require('winnow')
const _ = require('lodash')

/**
 * Handle a request
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
function requestHandler (req, res) {
  // Reject the request if the query parameters are not supported
  if (!hasValidOdataParams(req.query, res)) return

  // Transform the OData query parameters to Esri query parameters
  req.query = paramsToErsi(req.query)

  this.model.pull(req, (err, geojson) => {
    if (err) {
      const errorXml = js2xmlparser.parse('error', {
        code: err.code || 500,
        message: err.message
      })
      return res.status(400).send(errorXml)
    }

    // send data to winnow; filter the data according to query
    const options = _.cloneDeep(req.query)
    options.toEsri = false
    const filteredGeojson = winnow.query(geojson, options)

    // Extract geojson properties to an array
    const records = filteredGeojson.features.map(function (feature) {
      return feature.properties
    })

    // Convert the properties array to OData XML and respond
    const xml = js2xmlparser.parse('d', { properties: records })
    res.set('Content-Type', 'text/xml')
    res.status(200).send(xml)
  })
}

module.exports = requestHandler
