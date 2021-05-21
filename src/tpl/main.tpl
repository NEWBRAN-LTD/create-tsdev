// stock template

export const greeting(name?: any): any {
  return `Hello${name ? ' ' + name : ' nobody'}`
}
