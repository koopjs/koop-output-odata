const test = require('tape')
const hasValidOdataParams = require('../../lib/odata-param-validator')

test('validate request params', spec => {
  spec.plan(1)
  const fixtureParams = {
    '$select': 'foo',
    '$skip': 5,
    '$top': 10
  }
  // Setup response object; embed tests
  const result = hasValidOdataParams(fixtureParams, {})
  spec.equals(result, true, 'validates params')
})

test('validate request params - reject request due to bad params', spec => {
  spec.plan(5)
  const fixtureParams = {
    'baz': 'foo',
    '$skip': 5,
    '$top': 10
  }
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
  // Setup response object; embed tests
  const result = hasValidOdataParams(fixtureParams, res)
  spec.equals(result, false, 'validates params')
})
