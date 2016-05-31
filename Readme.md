[![Coveralls – test coverage
](https://img.shields.io/coveralls/studio-b12/monopod.svg?style=flat-square
)](https://coveralls.io/r/studio-b12/monopod
) [![Travis – build status
](https://img.shields.io/travis/studio-b12/monopod/master.svg?style=flat-square
)](https://travis-ci.org/studio-b12/monopod
) [![David – status of dependencies
](https://img.shields.io/david/studio-b12/monopod.svg?style=flat-square
)](https://david-dm.org/studio-b12/monopod
) [![Stability: experimental
](https://img.shields.io/badge/stability-experimental-yellow.svg?style=flat-square
)](https://nodejs.org/api/documentation.html#documentation_stability_index
) [![Code style: airbnb
](https://img.shields.io/badge/code%20style-airbnb-777777.svg?style=flat-square)
](https://github.com/airbnb/javascript)




<a id="/"></a>&nbsp;

# monopod

**Monorepo done simple**




<a id="/installation"></a>&nbsp;

## Installation

```sh
# As a global command:
npm install --global monopod

# …or locally for an npm project:
npm install --save-dev monopod
```




<a id="/synopsis"></a>&nbsp;

## Synopsis

```sh
monopod <command> [...<command options>]  
monopod <command> --help  
monopod --help  
```




<a id="/description"></a>&nbsp;

## Description

`monopod` manages an npm monorepo for you. To make it as simple as gets, we’re following a couple of principles:

- **No magic behind the scenes.**  
  In case of an emergency, you can easily set things up by hand.

- **All packages live in directories under `packages/<package name>`.**  
  It can’t get any simpler.

- **All packages have the same [npm scope](https://docs.npmjs.com/misc/scope).**  
  This helps make sure packages can `require` one another with very little overhead. Good news though! It’s okay to omit the scope in a top-level package.

- **External dependencies are synchronized across packages.**  
  This helps keep the project slim and the install blazing fast. Tried and tested in the UNIX ecosystem.

- **Every package is [semver](http://semver.org/)-compliant.**  
  We use [yankee](https://git.io/yankee) to prepare each release – make sure every package has a `Changelog.yaml`.


### Curious for more?

`monopod` is very simple, so you can easily understand all that happens. A quick glance at [`monopod bootstrap --help`](./Readme/bootstrap) will give you a good grasp.




<a id="/options"></a>&nbsp;

## Options

<!-- @options start -->
#### `<command>`
Available commands: `bootstrap`, `debootstrap`.

#### `-h, --help`
You’re looking at it.
<!-- @options end -->




<a id="/license"></a>&nbsp;

## License

[MIT](https://git.io/monopod.License) © [Studio B12](http://studio-b12.de)
