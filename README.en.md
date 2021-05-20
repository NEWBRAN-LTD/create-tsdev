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

By default it will init the TS dev env inside your project root. Or you can pass `--to /where/your/project/root`. So it will switch over to that folder.

You can also pass `--skipInstall` so it won't run the `npm install` in the end.

## Credits

The idea is based on this [blog post](https://www.metachris.com/2021/04/starting-a-typescript-project-in-2021/#:~:text=In%20tsconfig.json%2C%20add%20DOM%20to%20the%20list%20of,can%20attach%20custom%20properties%20to%20window%20like%20this%3A)

## TODOS

- Add options to add github / gitlab CI actions
- Option to setup postCSS and browser env
- for ava.js, work out a way to use esbuild instead of `node-ts/register` (just like using `esm`)


---

Joel Chu (c) 2021
