// put all the constants var in one place

export const PLACEHOLDER: string = '__PLACEHOLDER__'
export const ACTION_NAME: string = 'action'
export const ACTIONS: Array<string> = ['github', 'gitlab']
export const DEFAULT_OPTIONS = {
  to: PLACEHOLDER,
  skipInstall: false,
  skipTpl: false,
  action: PLACEHOLDER
}

export const PKG_FILE: string = 'package.json'
export const TARGET_KEYS: Array<string> =  ["test", "lint", "build", "clean", "ts-node", "docs"]

export const ACTION_MAP: any = {
  github: ".github/workflows/lint-and-test.yml",
  gitlab: ".gitlab-ci.yml"
}
export const YML_EXT = 'yml'

// the main method
type configObjType = {
  action?: string,
  to?: string,
  skipInstall? : boolean,
  skipTpl?: boolean
}

export { configObjType }
