const test = require('tape')
const requestHandler = require('../request-handler')
const geojsonFixture = require('./fixtures/geojson.json')

class Output {}

Output.prototype.serve = requestHandler

test('request handler', spec => {
  spec.plan(4)
  // Setup output
  const odata = new Output()
  odata.model = {
    pull: function (req, callback) {
      callback(null, geojsonFixture)
    }
  }

  // Setup request object
  const req = {
    query: {
      $select: 'foo'
    }
  }

  // Setup response object; embed tests
  const res = {
    set: function (key, value) {
      spec.equals(key, 'Content-Type', 'sets content type correctly')
      spec.equals(value, 'text/xml', 'sets content type correctly')
      return res
    },
    status: function (code) {
      spec.equals(code, 200, 'status code set correctly')
      return res
    },
    send: function (data) {
      spec.equals(data, `<?xml version='1.0'?>
<d>
    <properties>
        <foo>bar</foo>
    </properties>
</d>`)
      return res
    }
  }

  odata.serve(req, res)
})

test('request handler - invalid parameter error response', spec => {
  spec.plan(4)
  // Setup output
  const odata = new Output()
  odata.model = {
    pull: function (req, callback) {
      callback(null, geojsonFixture)
    }
  }

  // Setup request object
  const req = {
    query: {
      baz: 'foo'
    }
  }

  // Setup response object; embed tests
  const res = {
    set: function (key, value) {
      spec.equals(key, 'Content-Type', 'sets content type correctly')
      spec.equals(value, 'text/xml', 'sets content type correctly')
      return res
    },
    status: function (code) {
      spec.equals(code, 400, 'status code set correctly')
      return res
    },
    send: function (data) {
      spec.equals(data, `<?xml version='1.0'?>
<error>
    <code>400</code>
    <message>"baz" is not a supported OData query parameter.</message>
</error>`)
      return res
    }
  }

  odata.serve(req, res)
})