// const requestHandler = require('./request-handler')

function Output () {}

Output.version = require('../package.json').version
Output.type = 'output'
Output.routes = [
  {
    path: 'odata',
    methods: ['get', 'post']
  }
]

module.exports = Output
