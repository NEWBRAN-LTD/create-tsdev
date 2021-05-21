// put all the constants var in one place

export const PLACEHOLDER: string = '__PLACEHOLDER__'
export const PKG_FILE: string = 'package.json'
export const ACTIONS: Array<string> = ['github', 'gitlab']
export const ACTION_MAP: any = {
  github: ".github/workflows/lint-and-test.yml",
  gitlab: ".gitlab-ci.yml"
}
