// src/template.ts
import { resolve, join } from 'path'
import { copy, ensureDir, readJsonSync, writeJson, existsSync } from 'fs-extra'
import { execp, overwritePkgJson } from './util'

import {
  PKG_FILE,
  PLACEHOLDER,
  CLI_NAME
} from './constants'
// this is potentially a problem because it sets here
// but when call the chdir it didn't change it


const baseDir = resolve(__dirname, 'tpl')
const appRoot = resolve(__dirname, '..')

const cliBaseDir: string = join(baseDir, 'cli')
const koaBaseDir: string = join(baseDir, 'koa')
const awsBaseDir: string = join(baseDir, 'aws')

const koaTemplates: Array<string> = [
  'app.ts',
  'server.ts',
  'router.ts'
]
const configTpl: Array<string> = [
  'tsconfig.json'
]


const npmTodo: string = 'npm.json'

/**
 * bit of hack to get the path where we wanted
 * @return {*} key value
 */
function getDest(): any {
  const destRoot: string = process.cwd()

  return {
    destRoot,
    destSrc: join(destRoot, 'src'),
    destTest: join(destRoot, 'tests'),
    destPkgJson: join(destRoot, PKG_FILE)
  }
}


/**
 * handle the koa template
 * @TODO this should turn into a factory method for all the different templates
 * @param {object} args for future development if they want db template or not
 * @return {Promise<any>} should be just true / false
 */
async function koa(args: any): Promise<any> {
  const { destRoot, destSrc, destTest, destPkgJson } = getDest()

  // first copy the taget files
  return Promise.all(
      koaTemplates.map(tpl => copy(join(koaBaseDir, tpl), join(destSrc, tpl)))
        .concat(
          configTpl.map(tpl => copy(join(koaBaseDir, tpl), join(destRoot, tpl)))
            .concat([copy(join(koaBaseDir, 'server.test.tpl'), join(destTest, 'server.test.ts'))])
        )
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
      if (process.env.NODE_ENV !== 'test') {
        // finally run the install
        return Promise.all(
          npmJson.npm.map(cmd => execp(`npm ${cmd}`, destRoot))
        )
      }
    })
    .then(() => args)
}

/**
 * To create some start-up template or not
 * 1. If skipTpl === true then no
 * 2. If they already have a ./src folder then no
 * @param {object} args
 * @return {Promise<configObjType>}
 */
async function processBaseTemplate(args: any): Promise<any> {
  const { destRoot, destSrc, destTest } = getDest()
  // this will get copy over no matter what
  const files = [
    [join(appRoot, 'clean.js'), join(destRoot, 'clean.js')]
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

  switch (tpl) {
    case 'koa':
        args.skipInstall = true // make sure the final install not going to happen

        return koa(args)
    case 'aws':
    default:
      return Promise.resolve(args)
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
