import { Package } from '@verdaccio/types';

const json: Package = {
  _id: '@scope/pk1-test',
  name: '@scope/pk1-test',
  description: '',
  'dist-tags': {
    latest: '1.0.6',
  },
  versions: {
    '1.0.6': {
      name: '@scope/pk1-test',
      version: '1.0.6',
      description: '',
      main: 'index.js',
      scripts: {
        test: 'echo "Error: no test specified" && exit 1',
      },
      keywords: [],
      author: {
        name: 'Juan Picado',
        email: 'juan@jotadeveloper.com',
      },
      license: 'ISC',
      dependencies: {
        verdaccio: '^2.7.2',
      },
      readme: '# test',
      readmeFilename: 'README.md',
      _id: '@scope/pk1-test@1.0.6',
      // @ts-ignore
      _npmVersion: '5.5.1',
      _nodeVersion: '8.7.0',
      _npmUser: {
        name: '',
      },
      dist: {
        integrity:
          'sha512-6gHiERpiDgtb3hjqpQH5/i7zRmvYi9pmCjQ' +
          'f2ZMy3QEa9wVk9RgdZaPWUt7ZOnWUPFjcr9cmE6dUBf+XoPoH4g==',
        shasum: '2c03764f651a9f016ca0b7620421457b619151b9',
        tarball: 'http://localhost:5555/@scope/pk1-test/-/@scope/pk1-test-1.0.6.tgz',
      },
    },
  },
  readme: '# test',
  _attachments: {
    '@scope/pk1-test-1.0.6.tgz': {
      content_type: 'application/octet-stream',
      data:
        'H4sIAAAAAAAAE+2W32vbMBDH85y/QnjQp9qxLEeBMsbGlo' +
        'cNBmN7bFdQ5WuqxJaEpGQdo//79KPeQsnIw5KUDX/9IOvur' +
        'Luz/DHSjK/YAiY6jcXSKjk6sMqypHWNdtmD6hlBI0wqQmo8n' +
        'VbVqMR4OsNoVB66kF1aW8eML+Vv10m9oF/jP6IfY4QyyTrI' +
        'LlD2eqkcm+gVzpdrJrPz4NuAsULJ4MZFWdBkbcByI7R79CR' +
        'jx0ScCdnAvf+SkjUFWu8IubzBgXUhDPidQlfZ3BhlLpBUK' +
        'DiQ1cDFrYDmKkNnZwjuhUM4808+xNVW8P2bMk1Y7vJrtLC' +
        '1u1MmLPjBF40+Cc4ahV6GDmI/DWygVRpMwVX3KtXUCg7S' +
        'xp7ff3nbt6TBFy65gK1iffsN41yoEHtdFbOiisWMH8bPvX' +
        'UH0SP3k+KG3UBr+DFy7OGfEJr4x5iWVeS/pLQe+D+FIv/a' +
        'gIWI6GX66kFuIhT+1gDjrp/4d7WAvAwEJPh0u14IufWkM0' +
        'zaW2W6nLfM2lybgJ4LTJ0/jWiAK8OcMjt8MW3OlfQppcuhh' +
        'Q6k+2OgkK2Q8DssFPi/IHpU9fz3/+xj5NjDf8QFE39VmE4' +
        'JDfzPCBn4P4X6/f88f/Pu47zomiPk2Lv/dOv8h+P/34/D/' +
        'p9CL+Kp67mrGDRo0KBBp9ZPsETQegASAAA=',
      length: 512,
    },
  },
};

export default json;
