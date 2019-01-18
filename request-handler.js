const paramsToErsi = require('./utils/odata-to-esri-params')
const esriLookup = require('./utils/esri-translations-lookup')
const js2xmlparser = require('js2xmlparser')
const winnow = require('winnow')
const _ = require('lodash')

/**
 * Handle a request
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
function requestHandler (req, res) {
  res.set('Content-Type', 'text/xml')
  
  // transform the query parameters and add to request object in case needed in the provider
  let invalidQueryParam

  Object.keys(req.query).some(key => {
    if (!esriLookup[key]) {
      invalidQueryParam = key
      return true
    }
  })

  if (invalidQueryParam) {
    const errorXml = js2xmlparser.parse('error', { 
      code: 400,
      message: `"${invalidQueryParam}" is not a supported OData query parameter.`
    })
    return res.status(400).send(errorXml)
  }
  
  req.query = paramsToErsi(req.query)

  this.model.pull(req, (err, geojson) => {
    if (err){
      const errorXml = js2xmlparser.parse('error', { 
        code: err.code || 500,
        message: err.message
      })
      return res.status(400).send(errorXml)
    }

    // send data to winnow; filter the data according to query (possibly redundant when provider is AGOL, but would be necessary for other providers)
    const options = _.cloneDeep(req.query)
    options.toEsri = false
    const filteredGeojson = winnow.query(geojson, options)
    const records = filteredGeojson.features.map(function (feature) {
      return feature.properties
    })

    const xml = js2xmlparser.parse('d', { properties: records })
    res.status(200).send(xml)
  })
}

module.exports = requestHandler
