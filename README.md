# koop-output-odata
This output-services plugin accepts OData query parameters and responds with OData formatted XML.

## Usage

Register this plugin with koop before your provider plugins to ensure that the Odata routes are bound to the providers.

```
const odata = require('@koopjs/output-odata')
koop.register(odata)

// Register providers
```

After startup, Koop will include an OData route for each registered provider.  For example, if you had registered the Github provider, the following route would be available:

`/github/:id/odata`
