const test = require('tape')
const esriLookup = require('../../lib/odata-param-lookup')
const odataParser = require("odata-parser")

test('convert odata params object to esri params object', spec => {
  spec.plan(1)
  const fixtureQuerystring = `$select=foo&$top=10&$skip=5&$filter=Name eq 'John' and score gt 100 and 'world' eq hello`
  const fixtureAst = odataParser.parse(fixtureQuerystring)
  const esriQuery = {}

  Object.keys(fixtureAst).forEach(key => {
    if (esriLookup[key]) esriQuery[esriLookup[key].esri] = esriLookup[key].translate(fixtureAst[key])
  })

  const expected = {
    outFields: 'foo',
    resultRecordCount: 10,
    resultOffset: 5,
    where: `Name = 'John' and score > 100 and 'world' = hello`
  }

  spec.deepEquals(esriQuery, expected, 'converts a OData AST to Esri query params object')
})
