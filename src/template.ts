// src/template.ts
import { resolve, join } from 'path'
import { copy, ensureDir } from 'fs-extra'

const baseDir = resolve(__dirname, 'tpl')

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
const koaTemplates: Array<string> = [
  'server.ts',
  'router.ts'
]



/**
 * handle the koa template
 * @param {string} [withDb='none'] for future development if they want db template or not
 * @return {Promise<any>} should be just true / false
 */
async function koa(withDb: string = 'none'): Promise<any> {
  // first copy the taget files

}
