# create-tsdev

> Using npx to generate a latest (2021) Typescript development environment for node.js side

This setup is using [esbuild](https://esbuild.github.io/getting-started/) (claim to be 3 times faster than webpack / babel) and [ava.js](https://github.com/avajs/) a real modern testing suite for node.js (My options ava.js is way way way better than this [joker](https://jestjs.io))

## Installation

```sh
$ npx create-tsdev
```

or use npm

```sh
$ npm init tsdev
```

Please note you need to init your project before you can use this tool.

You could also install this globally with `npm install --global create-tsdev` then just call it

```sh
$ create-tsdev
```

## Options

From 0.8.x, all the options are optional.

- `--to /where/your/project/root`: By default it will init the TS dev env inside your project root. Or you can pass `--to /where/your/project/root`. So it will switch over to that folder.
- ~~`--skipInstall`: it won't run the `npm install` in the end.~~ (no longer install by default see below)
- `--install [packageManager]` We don't run install from now on unless you specify the package manager (default: `npm`, support `pnpm`, `yard`)
- `--action`: options are `github` (will add `github.yml` template) or `gitlab` (will add `gitlab.yml`)
- `--tpl`: ~~This is a breaking change since v0.6.x, you have to specify what template you want to us~~ 0.8.x use a `basic` template by default
  * `basic` (default) which will setup bare minimum, and you can expand from it.
  * `cli`: (`--tpl cli`) If there is no `src` folder in your project root. Then it will create some template files (as well as a tests directory with a test file in it). If you pass this option then it will skip this step entirely.
  * `koa`: (`--tpl koa`) this will set up code and templates for a Koa based project.
  * `aws`: (`--tpl aws`) coming soon

## Credits

The idea is based on this [blog post](https://www.metachris.com/2021/04/starting-a-typescript-project-in-2021/#:~:text=In%20tsconfig.json%2C%20add%20DOM%20to%20the%20list%20of,can%20attach%20custom%20properties%20to%20window%20like%20this%3A)


---

Joel Chu (c) 2022
