// create the AWS credential file
import { homedir } from 'os'
import { join } from 'path'
import { writeFile } from 'fs-extra'


/**
 * simple util to generate the aws required credential file and region file
 * we only need one file call config
 * @param {sring} key <ACCESS_KEY>
 * @param {string} secret <SECRET_ACCESS_KEY>
 * @param {string} region (optional)
 */
export function writeToCredentialFile(key: string, secret: string, region?: string): Promise<any> {
  const awsDir = join(homedir(), '.aws')
  const filename = join(awsDir, 'credentials')
  const content = `[default]
aws_access_key_id = ${key}
aws_secret_access_key = ${secret}
`
  if (region) {
    const regionFilename: string = join(awsDir, 'config')
    const configContent: string = `[default]
region = ${region}
`
    // @TODO
    console.log(regionFilename, configContent)
  }

  return writeFile(filename, content)
}
