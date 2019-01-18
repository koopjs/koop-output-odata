// const parser = require('./utils/odata-parser')
const js2xmlparser = require('js2xmlparser')

/**
 * Handle a request
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
function requestHandler (req, res) {
  // transform the query parameters

  // validate query parameters

  this.model.pull(req, (e, geojson) => {
    if (e) res.status(e.code || 500).json({ error: e.message })
    else {
      // send data to winnow; filter the data according to query (possibly redundant when provider is AGOL, but would be necessary for other providers)

      const records = geojson.features.map(function (feature) {
        return feature.properties
      })
      const xml = js2xmlparser('d', { properties: records })
      res.set('Content-Type', 'text/xml')
      res.status(200).send(xml)
    }
  })

  res.status(200).json({ message: 'success' })
}

module.exports = requestHandler
