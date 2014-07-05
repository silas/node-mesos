# Mesos

Mesos framework clients.

 * [Documentation](#documentation)
 * [Development](#development)
 * [License](#license)

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

## Development

 1. Install [Vagrant][vagrant]
 1. Start box

    ``` console
    $ vagrant up
    ```

 1. Install client dependencies

    ``` console
    $ npm install
    ```

 1. Run tests

    ``` console
    $ npm test
    ```

## License

This work is licensed under the MIT License (see the LICENSE file).

[marathon-rest]: https://github.com/mesosphere/marathon/blob/master/REST.md
[vagrant]: http://www.vagrantup.com/
