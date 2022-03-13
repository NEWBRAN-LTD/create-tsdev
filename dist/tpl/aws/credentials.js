"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeToCredentialFile = void 0;
// create the AWS credential file
const os_1 = require("os");
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
/**
 * simple util to generate the aws required credential file and region file
 * we only need one file call config
 * @param {sring} key <ACCESS_KEY>
 * @param {string} secret <SECRET_ACCESS_KEY>
 * @param {string} region (optional)
 */
function writeToCredentialFile(key, secret, region) {
    const awsDir = path_1.join(os_1.homedir(), '.aws');
    const filename = path_1.join(awsDir, 'credentials');
    const content = `[default]
aws_access_key_id = ${key}
aws_secret_access_key = ${secret}
`;
    if (region) {
        const regionFilename = path_1.join(awsDir, 'config');
        const configContent = `[default]
region = ${region}
`;
        // @TODO
        console.log(regionFilename, configContent);
    }
    return fs_extra_1.writeFile(filename, content);
}
exports.writeToCredentialFile = writeToCredentialFile;
