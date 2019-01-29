const test = require('tape')
const validateOdataParams = require('../../lib/odata-param-validator')

test('validate request params', spec => {
  spec.plan(1)
  const fixtureParams = {
    '$select': 'foo',
    '$skip': 5,
    '$top': 10
  }
  // Setup response object; embed tests
  const result = validateOdataParams(fixtureParams)
  spec.equals(result.validated, true, 'validates params')
})

test('validate request params - error', spec => {
  spec.plan(1)
  const fixtureParams = {
    'baz': 'foo',
    '$skip': 5,
    '$top': 10
  }

  // Setup response object; embed tests
  const result = validateOdataParams(fixtureParams)
  spec.equals(result.error, `"baz" is not a supported OData query parameter.`, 'returns validation error')
})
