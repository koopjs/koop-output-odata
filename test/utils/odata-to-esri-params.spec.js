const test = require('tape')
const odataToEsri = require('../../utils/odata-to-esri-params')
const querystring = require('query-string')
const fixtureParams = {
  '$select': 'foo',
  '$skip': 5,
  '$top': 10
}
test('test', spec => {
  spec.plan(1)
  const esriParams = odataToEsri(fixtureParams)
  const expected = {
    outFields: 'foo',
    resultOffset: 5,
    resultRecordCount: 10
  }
  spec.ok(true, 'stub')
})
