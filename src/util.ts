// src/util.ts
import { writeJson } from 'fs-extra'
import { exec } from 'child_process'
import { TPL_EXT } from './constants'
/**
 * Take the tpl ext off from path
 * @param {string} tpl
 * @return {string}
 */
export function removeTpl(str: string): string {
  return str.replace(TPL_EXT, '')
}

/**
 * check if that exist in the predefined array of values
 * @param {array} arr
 * @param {string} arg
 * @return {boolean}
 */
export function checkExist(arr: Array<any>, arg: string): boolean {
  return arr.filter(a => a === arg.toLowerCase()).length > 0
}

// lots of little method that get share betwen
// so I put them all here
/**
 * just overwrite the existing package.json
 * @param {string} pkgFile path to package.json
 * @param {object} pkg content of the json
 * @return {promise} not throw error that means success
 */
export function overwritePkgJson(pkgFile: string, pkg: any): Promise<any> {
  return writeJson(pkgFile, pkg, {spaces: 2})
}

/**
 * wrap exec into an Promise
 * @param {string} cmd to run
 * @param {string} cwd where to execute this cmd
 * @return {promise<any>}
 */
export async function execp(cmd: string, cwd: string): Promise<any> {
  return new Promise((resolver, rejecter) => {
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
