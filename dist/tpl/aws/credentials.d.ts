/**
 * simple util to generate the aws required credential file and region file
 * we only need one file call config
 * @param {sring} key <ACCESS_KEY>
 * @param {string} secret <SECRET_ACCESS_KEY>
 * @param {string} region (optional)
 */
export declare function writeToCredentialFile(key: string, secret: string, region?: string): Promise<any>;
