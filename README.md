# Mesos

Mesos framework clients.

 * [Documentation](#documentation)
 * [Development](#development)
 * [License](#license)

## Documentation

 * [Chronos](#chronos)
 * [Marathon](#marathon)

<a name="chronos"/>
### mesos.Chronos([options])

Initialize a new Chronos client.

Options

 * host (String, default: 127.0.0.1): Chronos address
 * port (String, default: 4400): Chronos HTTP port
 * secure (Boolean, default: false): enable HTTPS

Usage

``` javascript
var mesos = require('mesos');

var chronos = mesos.Chronos({ host: '10.141.141.10' });
```

<a name="chronos-jobs-create"/>
### chronos.jobs.create(options, callback)

Create job.

Options

 * name (String): job name
 * schedule (String): [ISO-8601][iso-8601] recurring series time
 * command (String): command to execute
 * epsilon (String): run if missed within this time period ([ISO-8601][iso-8601] duration)
 * owner (String): email address of job owner
 * async (Boolean, default: false): run job asynchronously

### chronos.jobs.destroy(options, callback)

Delete job.

Options

 * name (String): job name

<a name="chronos-jobs-list"/>
### chronos.jobs.list(callback)

List jobs.

### chronos.jobs.search(options, callback)

Search jobs.

Options

 * any (String, optional): query on any field
 * name (String, optional): query on name
 * command (String, optional): query on command
 * limit (Number, default: 10): limit the number of results
 * offset (Number, default: 0): offset results by number

### chronos.jobs.start(options, callback)

Manually start job.

Options

 * name (String): job name

### chronos.jobs.stats(options, callback)

Get jobs statistics.

Options

 * name (String, optional): job name
 * percentile (String, optional): statistic type

If you specify the job name you'll get all the statistics for that job, otherwise if you specify a percentile you'll get that statistic for all jobs.

You must specify either a job name or a percentile.

### chronos.tasks.done(options, callback)

Mark async task as complete.

Options

 * id (String): task id
 * statusCode (Integer, supports: 0, 1): task succeeded (0) or fail (1)

### chronos.tasks.kill(options, callback)

Kill tasks.

Options

 * job (String): job name

<a name="marathon"/>
### mesos.Marathon([options])

Initialize a new Marathon client.

Options

 * host (String, default: 127.0.0.1): Marathon address
 * port (String, default: 8080): Marathon HTTP port
 * secure (Boolean, default: false): enable HTTPS

Usage

``` javascript
var mesos = require('mesos');

var marathon = mesos.Marathon({ host: '10.141.141.10' });
```

See [Marathon REST][marathon-rest] documentation for more information.

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
### marathon.apps.tasks(options, callback)

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

List all running tasks.

## Development

 1. Install [Vagrant][vagrant]

 1. Clone repository

    ``` console
    $ git clone https://github.com/silas/node-mesos.git
    ```

 1. Switch to project directory

    ``` console
    $ cd node-mesos
    ```

 1. Start VM

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

[iso-8601]: https://github.com/cylc/cylc/wiki/ISO-8601
[marathon-rest]: https://github.com/mesosphere/marathon/blob/master/REST.md
[vagrant]: http://www.vagrantup.com/
