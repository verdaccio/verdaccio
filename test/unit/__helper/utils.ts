import { Package } from "@verdaccio/types";

export function generateAttachment() {
	return {
			"content_type": "application\/octet-stream",
			"data": "H4sIAAAAAAAAE+2W32vbMBDH85y\/QnjQp9qxLEeBMsbGlocNBmN7bFdQ5WuqxJaEpGQdo\/\/79KPeQsnIw5KUDX\/9IOvurLuz\/DHSjK\/YAiY6jcXSKjk6sMqypHWNdtmD6hlBI0wqQmo8nVbVqMR4OsNoVB66kF1aW8eML+Vv10m9oF\/jP6IfY4QyyTrILlD2eqkcm+gVzpdrJrPz4NuAsULJ4MZFWdBkbcByI7R79CRjx0ScCdnAvf+SkjUFWu8IubzBgXUhDPidQlfZ3BhlLpBUKDiQ1cDFrYDmKkNnZwjuhUM4808+xNVW8P2bMk1Y7vJrtLC1u1MmLPjBF40+Cc4ahV6GDmI\/DWygVRpMwVX3KtXUCg7Sxp7ff3nbt6TBFy65gK1iffsN41yoEHtdFbOiisWMH8bPvXUH0SP3k+KG3UBr+DFy7OGfEJr4x5iWVeS\/pLQe+D+FIv\/agIWI6GX66kFuIhT+1gDjrp\/4d7WAvAwEJPh0u14IufWkM0zaW2W6nLfM2lybgJ4LTJ0\/jWiAK8OcMjt8MW3OlfQppcuhhQ6k+2OgkK2Q8DssFPi\/IHpU9fz3\/+xj5NjDf8QFE39VmE4JDfzPCBn4P4X6\/f88f\/Pu47zomiPk2Lv\/dOv8h+P\/34\/D\/p9CL+Kp67mrGDRo0KBBp9ZPsETQegASAAA=",
			"length": 512
		}
}

export function generateVersion(pkgName, version) {
	return {
		"name": pkgName,
		"version": version,
		"description": "some foo dependency",
		"main": "index.js",
		"scripts": {
			"test": "echo \"Error: no test specified\" && exit 1"
		},
		"keywords": [],
		"author": {
			"name": "User NPM",
			"email": "user@domain.com"
		},
		"license": "ISC",
		"dependencies": {
			"verdaccio": "^4.0.0"
		},
		"readme": "# test",
		"readmeFilename": "README.md",
		"_id": `${pkgName}@${version}`,
		"_npmVersion": "5.5.1",
		"_npmUser": {
			'name': 'foo',
		},
		"dist": {
			"integrity": "sha512-6gHiERpiDgtb3hjqpQH5\/i7zRmvYi9pmCjQf2ZMy3QEa9wVk9RgdZaPWUt7ZOnWUPFjcr9cmE6dUBf+XoPoH4g==",
			"shasum": "2c03764f651a9f016ca0b7620421457b619151b9", // pragma: allowlist secret
			"tarball": `http:\/\/localhost:5555\/${pkgName}\/-\/${pkgName}-${version}.tgz`
		}
	}
}

/**
 * Generates a metadata body including attachments.
 * If you intent to build a body for npm publish, please include only one version.
 * if you intent to to generate a complete metadata include multiple versions.
 */
export function generatePackageBody(pkgName: string, _versions: string[] = ['1.0.0']): Package {
	const latest: string = _versions[_versions.length - 1];
	const versions = _versions.reduce((cat, version) => {
		cat[version] = generateVersion(pkgName, version);
		return cat;
	}, {});

	const attachtment = _versions.reduce((cat, version) => {
		cat[`${pkgName}-${version}.tgz`] = generateAttachment();
		return cat;
	}, {});

	// @ts-ignore
	return {
		"_id": pkgName,
		"name": pkgName,
		"readme": "# test",
		"dist-tags": {
			"latest": latest
		},
		"versions": versions,
		"_attachments": attachtment
	}
}

/**
 * The metadata that comes from npm unpublish only contains the versions won't be removed and
 * also does not includes any _attachment.
 * @param pkgName
 * @param _versions
 */
export function generatePackageUnpublish(pkgName: string, _versions: string[] = ['1.0.0']): Package {
	const latest: string = _versions[_versions.length - 1];
	const versions = _versions.reduce((cat, version) => {
		cat[version] = generateVersion(pkgName, version);
		return cat;
	}, {});

	// @ts-ignore
	return {
		"_id": pkgName,
		"name": pkgName,
		"readme": "# test",
		// users usually is present when run npm star [pkg]
		"users": {},
		"dist-tags": {
			"latest": latest
		},
		"versions": versions,
	}
}

export function generateStarMedatada(pkgName: string, users): any {
	return {
		"_id": pkgName,
		"_rev": "3-b0cdaefc9bdb77c8",
		"users": users
	}
}

export function generatePackageMetadata(pkgName: string, version = '1.0.0'): Package {
	// @ts-ignore
	return {
		"_id": pkgName,
		"name": pkgName,
		"dist-tags": {
			"latest": version
		},
		"versions": {
			[version]: {
				"name": pkgName,
				"version": version,
				"description": "",
				"main": "index.js",
				"scripts": {
					"test": "echo \"Error: no test specified\" && exit 1"
				},
				"keywords": [

				],
				"author": {
					"name": "User NPM",
					"email": "user@domain.com"
				},
				"license": "ISC",
				"dependencies": {
					"verdaccio": "^2.7.2"
				},
				"readme": "# test",
				"readmeFilename": "README.md",
				"_id": `${pkgName}@${version}`,
				"_npmVersion": "5.5.1",
				"_npmUser": {
						'name': 'foo',
				},
				"dist": {
					"integrity": "sha512-6gHiERpiDgtb3hjqpQH5\/i7zRmvYi9pmCjQf2ZMy3QEa9wVk9RgdZaPWUt7ZOnWUPFjcr9cmE6dUBf+XoPoH4g==",
					"shasum": "2c03764f651a9f016ca0b7620421457b619151b9", // pragma: allowlist secret
					"tarball": `http:\/\/localhost:5555\/${pkgName}\/-\/${pkgName}-${version}.tgz`
				}
			}
		},
		"readme": "# test",
		"_attachments": {
			[`${pkgName}-${version}.tgz`]: {
				"content_type": "application\/octet-stream",
				"data": "H4sIAAAAAAAAE+2W32vbMBDH85y\/QnjQp9qxLEeBMsbGlocNBmN7bFdQ5WuqxJaEpGQdo\/\/79KPeQsnIw5KUDX\/9IOvurLuz\/DHSjK\/YAiY6jcXSKjk6sMqypHWNdtmD6hlBI0wqQmo8nVbVqMR4OsNoVB66kF1aW8eML+Vv10m9oF\/jP6IfY4QyyTrILlD2eqkcm+gVzpdrJrPz4NuAsULJ4MZFWdBkbcByI7R79CRjx0ScCdnAvf+SkjUFWu8IubzBgXUhDPidQlfZ3BhlLpBUKDiQ1cDFrYDmKkNnZwjuhUM4808+xNVW8P2bMk1Y7vJrtLC1u1MmLPjBF40+Cc4ahV6GDmI\/DWygVRpMwVX3KtXUCg7Sxp7ff3nbt6TBFy65gK1iffsN41yoEHtdFbOiisWMH8bPvXUH0SP3k+KG3UBr+DFy7OGfEJr4x5iWVeS\/pLQe+D+FIv\/agIWI6GX66kFuIhT+1gDjrp\/4d7WAvAwEJPh0u14IufWkM0zaW2W6nLfM2lybgJ4LTJ0\/jWiAK8OcMjt8MW3OlfQppcuhhQ6k+2OgkK2Q8DssFPi\/IHpU9fz3\/+xj5NjDf8QFE39VmE4JDfzPCBn4P4X6\/f88f\/Pu47zomiPk2Lv\/dOv8h+P\/34\/D\/p9CL+Kp67mrGDRo0KBBp9ZPsETQegASAAA=",
				"length": 512
			}
		}
	}
}

export function generateDeprecateMetadata(pkgName: string, version = '1.0.0', deprecated:string = ''): Package {
  const res = {
    ...generatePackageMetadata(pkgName, version),
    _attachments: {},
  };
  res.versions[version].deprecated = deprecated;
  return res;
}
