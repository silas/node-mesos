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
 * secure (Boolean, default: false): enable HTTPS

Usage

``` javascript
var mesos = require('mesos');

var marathon = mesos.Marathon({ host: '10.141.141.10' });
```

<a name="marathon-apps-create"/>
### marathon.apps.create(options, callback)

Create and start a new application.

Options

 * id (String): app ID
 * cpus (Number): number of CPUs for each instance
 * mem (Number): amount of memory for each instance
 * instances (Number): number of instances
 * cmd (String, optional): command to execute

And more, see [docs](https://github.com/mesosphere/marathon/blob/master/REST.md#post-v2apps).

<a name="marathon-apps-list"/>
### marathon.apps.list([options], callback)

List all running applications.

Options

 * cmd (String, optional): filter apps by command

<a name="marathon-apps-get"/>
### marathon.apps.get(options, callback)

Get application with by ID.

Options

 * id (String): app ID

<a name="marathon-apps-versions"/>
### marathon.apps.versions(options, callback)

List the versions of an application by ID.

Options

 * id (String): app ID

<a name="marathon-apps-version"/>
### marathon.apps.version(options, callback)

List the configuration of an application by ID at a specified version.

Options

 * id (String): app ID
 * version (String): app version

<a name="marathon-apps-update"/>
### marathon.apps.update(options, callback)

Change parameters of a running application. The new application parameters
apply only to subsequently created tasks, and currently running tasks are
not pre-emptively restarted.

Options

 * id (String): app ID
 * cpus (Number): number of CPUs for each instance
 * mem (Number): amount of memory for each instance
 * instances (Number): number of instances
 * cmd (String, optional): command to execute

And more, see [docs](https://github.com/mesosphere/marathon/blob/master/REST.md#put-v2appsappid).

<a name="marathon-apps-destroy"/>
### marathon.apps.destroy(options, callback)

Destroy an applicationb by ID.

Options

 * id (String): app ID

<a name="marathon-apps-tasks"/>
### marathon.apps.destroy(options, callback)

List all running tasks for an application by ID.

Options

 * id (String): app ID

<a name="marathon-apps-kill"/>
### marathon.apps.kill(options, callback)

Kill tasks that belong to an application.

Options

 * id (String): app ID
 * task (String, optional): kill by task ID
 * host (String, optional): restrict to tasks on specified slave (can't use with task)
 * scale (Boolean, optional): scale application down by one

<a name="marathon-eventSubscriptions-register"/>
### marathon.eventSubscriptions.register(options, callback)

Register a callback URL as an event subscriber.

Options

 * url (String): callback URL

<a name="marathon-eventSubscriptions-list"/>
### marathon.eventSubscriptions.list(callback)

List all event subscriber callback URLs.

<a name="marathon-eventSubscriptions-unregister"/>
### marathon.eventSubscriptions.unregister(options, callback)

Unregister a callback URL.

Options

 * url (String): callback URL

<a name="marathon-tasks"/>
### marathon.tasks(callback)

List tasks for the entire cluster.

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
