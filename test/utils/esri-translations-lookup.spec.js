const test = require('tape')
const esriLookup = require('../../utils/esri-translations-lookup')
const fixtureAst = {
  '$select': ['foo'],
  '$skip': 5,
  '$top': 10,
  '$noLookup': 'bar'
}

test('convert odata params object to esri params object', spec => {
  spec.plan(1)

  const esriQuery = {}

  Object.keys(fixtureAst).forEach(key => {
    if(esriLookup[key]) esriQuery[esriLookup[key].esri] = esriLookup[key].translate(fixtureAst[key])
  })
  
  const expected = {
    outFields: 'foo',
    resultOffset: 5,
    resultRecordCount: 10
  }

  spec.deepEquals(esriQuery, expected, 'converts a OData AST to Esri query params object')
})
