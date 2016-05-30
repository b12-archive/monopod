<a id="/"></a>&nbsp;

# monopod bootstrap

**Wire up your monorepo**




<a id="/synopsis"></a>&nbsp;

## Synopsis

```sh
monopod bootstrap [--scope=<scope>] [<path>]
monopod bootstrap --help
```




<a id="/description"></a>&nbsp;

## Description

When you call `monopod bootstrap`, we’ll wire up your monorepo. Firstly, we’ll create a symlink at the root `<path>/node_modules/@<scope>` so that your packages have access to one another. Then we’ll add symlinks at `packages/*/node_modules` pointing at the root `<path>/node_modules/` so that npm knows its way inside a package.

Remember to run `monopod bootstrap` after the initial `npm install` and every time you add a new package at `packages/`. By the way, don’t worry about calling it multiple times – the results are always the same.




<a id="/options"></a>&nbsp;

## Options

<!-- @options start -->
<!-- @options end -->




<a id="/license"></a>&nbsp;

## License

[MIT](https://git.io/monopod.License) © [Studio B12](http://studio-b12.de)
