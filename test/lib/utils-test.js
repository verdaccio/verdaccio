// @flow

import type { Version } from "@verdaccio/types";

export function generateNewVersion(pkgName: string, version: string): Version {
  // $FlowFixMe
  return {
    "name": pkgName,
    "version": version,
    "description": "",
    "main": "index.js",
    "dependencies": {
      "test": "^1.4.1"
    },
    "author": "",
    "license": "ISC",
    "readme": "ERROR: No README data found!",
    "_id": `${pkgName}@${version}`,
    "_npmVersion": "5.5.1",
    "_nodeVersion": "9.3.0",
    "_npmUser": {

    },
    "dist": {
      "integrity": "sha512-zVEqt1JUCOPsash9q4wMkJEDPD+QCx95TRhQII+JnoS31uBUKoZxhzvvUJCcLVy2CQG4QdwXARU7dYWPnrwhGg==",
      "shasum": "b7088c30970489637f8b4e6795e8cf2b699d7569",
      "tarball": `http:\/\/localhost:4873\/${pkgName}\/-\/npm_test-${version}.tgz`
    }
  }
}
