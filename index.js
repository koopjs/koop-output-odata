const requestHandler = require('./request-handler')

function Output () {}

Output.prototype.serve = requestHandler

Output.version = require('../package.json').version
Output.type = 'output'
Output.routes = [
  {
    path: 'odata',
    methods: ['get', 'post'],
    handler: 'serve'
  }
]

module.exports = Output
