// src/template.ts
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


/**
 * handle the koa template
 *
 */
async function koa(): Promise<any> {
  

}
