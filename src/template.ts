// src/template.ts
import { resolve, join } from 'path'
import { copy, ensureDir, readJsonSync, writeJson } from 'fs-extra'
import { exec } from 'child_process'

const baseDir = resolve(__dirname, 'tpl')

/**
 * wrap exec into an Promise
 *
 */
async function execp(cmd: string, cwd: string): Promise<any> {
  return new Promise((resolver, rejecter) {
    exec(cmd, { cwd }, (error, stdout, stderr) => {
       if (error) {
         console.error(`ERROR:`, error)
         return rejecter(false)
       }
       console.log(`stdout`, stdout)
       if (stderr) {
         console.error(`stderr`, stderr)
       }
       resolver(true)
     })
  })
}


/**
 * This will handle all sort of different template action
 * This will be the last method to get all in the chain
 * This is the top level method then call the other sub method
 * due to different template has it's own settings
 * @param {string} name of the template
 */
async function createTemplate(name: string): Promise<any> {
  switch (name) {
    case 'koa':
        return koa()
      break;
    case 'aws':
    default:
        return Promise.reject(`No such template ${name}`)
      break;
  }
}

const koaBaseDir: string = join(baseDir, 'koa')
const destRoot: string = process.cwd()
const destDir: string = join(destRoot, 'src')
const koaTemplates: Array<string> = [
  'app.ts',
  'server.ts',
  'router.ts'
]
const configTpl: Array<string> = [
  'tsconfig.json'
]
const destPkgJson: string = join(destRoot, 'package.json')
const npmTodo: string = 'npm.json'

/**
 * handle the koa template
 * @param {string} [withDb='none'] for future development if they want db template or not
 * @return {Promise<any>} should be just true / false
 */
async function koa(withDb: string = 'none'): Promise<any> {
  // first copy the taget files
  return Promise.all(
      koaTemplates.map(tpl => copy(join(koaBaseDir, tpl), join(destDir, tpl)))
        .concat(configTpl.map(tpl => copy(join(koaBaseDir, tpl), destRoot)))
    )
    .then(() => {
      // next read the npm.json
      const npmJson = readJsonSync(join(koaBaseDir, npmTodo))
      // update the root package.json
      const pkgJson = readJsonSync(destPkgJson)
      // just overwrite it
      pkgJson.scripts = Object.assign(pkgJson.scripts, npmJson.scripts)

      return writeJson(destPkgJson, pkgJson, {spaces: 2})
        .then(() => npmJson)
    })
    .then(npmJson => {
      // finally run the install
      return Promise.all(
        npmJson.npm.map(cmd => execp(`npm ${cmd}`, destRoot))
      )
    })
}
