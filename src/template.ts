// src/template.ts
import { resolve, join } from 'path'
import { copy, readJsonSync, existsSync } from 'fs-extra'
import { execp, overwritePkgJson, removeTpl } from './util'

import {
  PKG_FILE,
  CLI_NAME,
  TPL_NAME,
  KOA_NAME,
  BASE_FILES,
  SETTING_FILES,
  KOA_TPLS,
  CONFIG_TPLS,
  TEST_TPLS
} from './constants'
// this is potentially a problem because it sets here
// but when call the chdir it didn't change it


const baseDir = resolve(__dirname, TPL_NAME)
const appRoot = resolve(__dirname, '..')

const cliBaseDir: string = join(baseDir, CLI_NAME)
const koaBaseDir: string = join(baseDir, KOA_NAME)
// const awsBaseDir: string = join(baseDir, 'aws')

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
      KOA_TPLS.map(tpl => copy(join(koaBaseDir, tpl), join(destSrc, removeTpl(tpl) )))
        .concat(
          CONFIG_TPLS.map(tpl => copy(join(koaBaseDir, tpl), join(destRoot, removeTpl(tpl)) ))
            .concat(
              TEST_TPLS.map(tpl => copy(join(koaBaseDir, tpl), join(destTest, removeTpl(tpl))))
            )
        )
    )
    .then(async () => {
      // next read the npm.json
      const npmJson = readJsonSync(join(koaBaseDir, npmTodo))
      // update the root package.json
      const pkgJson = readJsonSync(destPkgJson)
      // just overwrite it
      pkgJson.scripts = Object.assign(pkgJson.scripts, npmJson.scripts)
      // change from a promise callback
      await overwritePkgJson(destPkgJson, pkgJson)

      return npmJson
    })
    .then(npmJson => {
      if (process.env.NODE_ENV !== 'test') {
        // finally run the install
        return Promise.all(
          npmJson.npm.map((cmd: string) => {
            console.log('Running: ', `npm ${cmd}`)
            return execp(`npm ${cmd}`, destRoot)
          })
        ).then(() => args)
      }
      return args
    })
}

/**
 * prepare all the required based files
 * @param {string} appRoot org
 * @param {string} destRoot dest
 * @return {Array<*>}
 */
function getBaseCopyFiles(appRoot: string, destRoot: string): Array<any> {

  return BASE_FILES.map(file => [join(appRoot, file), join(destRoot, file)])
    .concat(SETTING_FILES.map( ([org, dest]) =>  [
        join(baseDir, org), join(destRoot, dest)
    ]))
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
  const files = getBaseCopyFiles(appRoot, destRoot)
  // v0.6.4 need to handle these files differently

  // from here we need to change if the user use --tpl koa|aws
  // we combine the tpl here and not using the skipInstall anymore
  if (args.tpl === CLI_NAME && !existsSync(destSrc)) {
    console.log(`Install cli template`)
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
        console.log(`Install koa template`)
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
export async function setupTpl(args: any): Promise<any> {

  return processBaseTemplate(args)
    .then(createTemplate)
}
