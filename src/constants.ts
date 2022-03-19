// put all the constants var in one place

export const PLACEHOLDER: string = '__PLACEHOLDER__'
export const ACTION_NAME: string = 'action'
export const TPL_NAME: string = 'tpl'
export const CLI_NAME: string = 'cli'
export const KOA_NAME: string = 'koa'

export const NPM_NAME: string = 'npm'
export const PNPM_NAME: string = 'pnpm'
export const YARN_NAME: string = 'yarn'

export const PACKAGE_MANAGERS: Array<string> = [NPM_NAME, PNPM_NAME, YARN_NAME]

export const PKG_FILE: string = 'package.json'

export const ACTIONS: Array<string> = ['github', 'gitlab']
export const TEMPLATES: Array<string> = [CLI_NAME, KOA_NAME] // @TODO add aws later
export const TARGET_KEYS: Array<string> =  ["test", "lint", "build", "clean", "docs"]
export const BASE_FILES: Array<string> = ['clean.js']
// these files were not part of the npm, therefore need to handle it differently
export const SETTING_FILES: Array<any> = [
  ['gitignore.tpl', '.gitignore'],
  ['eslintrc.tpl', '.eslintrc.js']
]
export const ACTION_MAP: any = {
  github: ".github/workflows/lint-and-test.yml",
  gitlab: ".gitlab-ci.yml"
}
export const YML_EXT = 'yml'
export const TPL_EXT = '.tpl'
export const TS_EXT = '.ts'

export const DEFAULT_OPTIONS = {
  to: PLACEHOLDER,
  install: false, // change in 0.8.0
  action: PLACEHOLDER,
  tpl: CLI_NAME
}

export const CLI_TPLS: Array<string> = [
  'main.tpl',
  'main.test.tpl'
]

export const KOA_TPLS: Array<string> = [
  'app.ts.tpl',
  'server.ts.tpl',
  'router.ts.tpl'
]
export const CONFIG_TPLS: Array<string> = [
  'tsconfig.json'
]
export const TEST_TPLS: Array<string> = [
  'server.test.ts.tpl'
]

export const NPM_TODO: string = 'npm.json'

// taking off your trousers to fart
type configObjType = {
  action?: string,
  to?: string,
  tpl?: string,
  install?: boolean | string // 0.8.0 now a union type if this flag present with no value then default to npm
}

export { configObjType }
