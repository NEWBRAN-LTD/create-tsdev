// the main method
type configObj = {
  to?: String,
  skipInstall? : Boolean
}


/**
 * @param {array} arg -- process.argv
 * @return {promise} resolve nothing
 */
export async function processArg(argv: Array<String>): Promise<configObj> {
  return Promise.resolve(argv.slice(2))
    .then(args => {
      return args.reduce((a: configObj, arg: String) => {
        if (a.to !== undefined) {
          a.to = arg
        }
        else if (arg.toLowerCase() === '--to') {
          a.to = '' // placeholder
        }
        else if (arg === '--skipInstall') {
          a.skipInstall = true
        }
        return a
      }, {})
    })
}
