# Mesos

Mesos framework clients.

## Documentation

 * [Marathon](#marthon)

<a name="marathon"/>
### mesos.Marathon([options])

Initialize a new Marathon client.

See [Marathon REST][marathon-rest] documentation for more information.

Options

 * host (String, default: 127.0.0.1): Marathon address
 * port (String, default: 8080): Marathon HTTP port

Usage

``` javascript
var mesos = require('mesos');

var marathon = mesos.Marathon({ host: '10.141.141.10' });
```

## License

This work is licensed under the MIT License (see the LICENSE file).

[marathon-rest]: https://github.com/mesosphere/marathon/blob/master/REST.md
