// put all the constants var in one place

export const PLACEHOLDER: string = '__PLACEHOLDER__'
export const ACTION_NAME: string = 'action'
export const TPL_NAME: string = 'tpl'
export const CLI_NAME: string = 'cli'
export const PKG_FILE: string = 'package.json'

export const ACTIONS: Array<string> = ['github', 'gitlab']
export const TEMPLATES: Array<string> = ['cli', 'koa'] // @TODO add aws later
export const TARGET_KEYS: Array<string> =  ["test", "lint", "build", "clean", "ts-node", "docs"]
export const BASE_FILES: Array<string> = ['clean.js', '.gitignore', '.eslintrc.js']


export const ACTION_MAP: any = {
  github: ".github/workflows/lint-and-test.yml",
  gitlab: ".gitlab-ci.yml"
}
export const YML_EXT = 'yml'
export const TPL_EXT = '.tpl'


export const DEFAULT_OPTIONS = {
  to: PLACEHOLDER,
  skipInstall: false,
  action: PLACEHOLDER,
  tpl: PLACEHOLDER
}
// taking off your trousers to fart
type configObjType = {
  action?: string,
  to?: string,
  tpl?: string,
  skipInstall?: boolean
}

export { configObjType }
