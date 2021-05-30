// src/template.ts
import { resolve, join } from 'path'
import { copy, ensureDir, readJsonSync, writeJson } from 'fs-extra'
import { execp, overwritePkgJson } from './util'

import {
  PKG_FILE,
  PLACEHOLDER,
  CLI_NAME
} from './constants'

const baseDir = resolve(__dirname, 'tpl')

const cliBaseDir: string = join(baseDir, 'cli')
const koaBaseDir: string = join(baseDir, 'koa')
const awsBaseDir: string = join(baseDir, 'aws')

const destRoot: string = process.cwd()
const destSrc: string = join(destRoot, 'src')
const destTest: string = join(destRoot, 'tests')

const koaTemplates: Array<string> = [
  'app.ts',
  'server.ts',
  'router.ts'
]
const configTpl: Array<string> = [
  'tsconfig.json'
]
const destPkgJson: string = join(destRoot, PKG_FILE)
const npmTodo: string = 'npm.json'

/**
 * handle the koa template
 * @TODO this should turn into a factory method for all the different templates
 * @param {string} [withDb='none'] for future development if they want db template or not
 * @return {Promise<any>} should be just true / false
 */
async function koa(withDb: string = 'none'): Promise<any> {
  // first copy the taget files
  return Promise.all(
      koaTemplates.map(tpl => copy(join(koaBaseDir, tpl), join(destSrc, tpl)))
        .concat(configTpl.map(tpl => copy(join(koaBaseDir, tpl), destRoot)))
    )
    .then(() => {
      // next read the npm.json
      const npmJson = readJsonSync(join(koaBaseDir, npmTodo))
      // update the root package.json
      const pkgJson = readJsonSync(destPkgJson)
      // just overwrite it
      pkgJson.scripts = Object.assign(pkgJson.scripts, npmJson.scripts)

      return overwritePkgJson(destPkgJson, pkgJson)
        .then(() => npmJson)
    })
    .then(npmJson => {
      // finally run the install
      return Promise.all(
        npmJson.npm.map(cmd => execp(`npm ${cmd}`, destRoot))
      )
    })
}

/**
 * To create some start-up template or not
 * 1. If skipTpl === true then no
 * 2. If they already have a ./src folder then no
 * @param {object} args
 * @return {Promise<configObjType>}
 */
async function processBaseTemplate(args: any): Promise<any> {
  // this will get copy over no matter what
  const files = [
    [join(__dirname, '..', 'clean.js'), join(destRoot, 'clean.js')]
  ]
  // from here we need to change if the user use --tpl koa|aws
  // we combine the tpl here and not using the skipInstall anymore
  if (args.tpl === CLI_NAME && !existsSync(destSrc)) {
    files.push(
      [join(cliBaseDir, 'main.tpl'), join(destSrc ,'main.ts')],
      [join(cliBaseDir, 'main.test.tpl'), join(destTest, 'main.test.ts')]
    )
  }

  return Promise.all(
    files.map(fileTodo => Reflect.apply(copy, null, fileTodo))
  )
  .then(() => args)
}

/**
 * This will handle all sort of different template action
 * This will be the last method to get all in the chain
 * This is the top level method then call the other sub method
 * due to different template has it's own settings
 * @param {*} args of the template
 */
async function createTemplate(args: any): Promise<any> {
  const { tpl } = args
  if (tpl === CLI_NAME) {
    return Promise.resolve(args)
  }
  switch (tpl) {
    case 'koa':
        args.skipInstall = true // make sure the final install not going to happen
        return koa(args)
      break;
    case 'aws':
    default:
        return Promise.reject(`No such template ${name}`)
      break;
  }
}

/**
 * The only export method, it also does the install here and skip the next call
 * @param {object} args from the command line options
 * @return {Promise<any>}
 */
export function setupTpl(args: any): Promise<any> {

  return processBaseTemplate(args)
    .then(args => createTemplate(args))
}
