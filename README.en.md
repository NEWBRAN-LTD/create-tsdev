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

## Options

- `--to /where/your/project/root`: By default it will init the TS dev env inside your project root. Or you can pass `--to /where/your/project/root`. So it will switch over to that folder.
- `--skipInstall`: it won't run the `npm install` in the end.
- `--action`: options are `github` (will add `github.yml` template) or `gitlab` (will add `gitlab.yml`)
- `--skipTpl`: If there is no `src` folder in your project root. Then it will create some template files (as well as a tests directory with a test file in it). If you pass this option then it will skip this step entirely.

## Credits

The idea is based on this [blog post](https://www.metachris.com/2021/04/starting-a-typescript-project-in-2021/#:~:text=In%20tsconfig.json%2C%20add%20DOM%20to%20the%20list%20of,can%20attach%20custom%20properties%20to%20window%20like%20this%3A)

## TODOS

- ~~Add options to add github / gitlab CI actions~~
- ~~Option to setup postCSS and browser env~~ (this will be in another package)
- ~~Add serverless CI option (added in 0.3.0)~~
- ~~for ava.js, work out a way to use `esbuild` instead of `node-ts/register` (just like using `esm`)~~ (v0.5.0) using [esbuild-register](https://github.com/egoist/esbuild-register)
- AWS template
- Other Server side dev templates 

## TS Stupidity

TS actually couldn't handle many of the things it claim it does. You have to rely on yet-another-external-lib to do that for you, and
TS won't ship it. Therefore you need to add `tslib` as a dependencies!

---

Joel Chu (c) 2021
