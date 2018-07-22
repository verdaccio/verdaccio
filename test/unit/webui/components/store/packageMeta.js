export const packageMeta = {
  name: 'verdaccio',
  'dist-tags': { latest: '2.7.1', beta: '2.4.1-beta' },
  time: {
    modified: '2017-12-14T15:43:27.317Z',
    created: '2016-07-28T12:48:43.536Z',
    '1.4.0': '2016-07-28T12:48:43.536Z',
    '2.0.0': '2016-08-26T22:36:41.762Z',
    '2.0.1': '2016-08-29T13:26:21.754Z',
    '2.1.0': '2016-10-12T00:48:03.025Z',
    '2.1.1': '2017-02-07T06:43:22.801Z',
    '2.2.0-v20170212': '2017-02-12T14:48:27.322Z',
    '2.1.2': '2017-03-09T06:25:28.107Z',
    '2.1.3': '2017-03-29T20:03:36.850Z',
    '2.1.4': '2017-04-13T20:08:41.131Z',
    '2.1.5': '2017-04-22T09:07:39.821Z',
    '2.1.6': '2017-05-12T07:43:36.616Z',
    '2.1.7': '2017-05-14T13:50:14.016Z',
    '2.1.10': '2017-06-03T09:53:52.449Z',
    '2.2.0': '2017-06-08T19:02:53.618Z',
    '2.2.1': '2017-06-17T16:23:14.158Z',
    '2.2.2': '2017-07-02T13:13:13.304Z',
    '2.2.3': '2017-07-04T20:43:59.442Z',
    '2.2.4': '2017-07-05T17:28:07.187Z',
    '2.2.5': '2017-07-05T17:34:11.089Z',
    '2.2.6': '2017-07-13T05:04:54.418Z',
    '2.2.7': '2017-07-15T23:27:24.523Z',
    '2.3.0-beta': '2017-07-15T23:31:31.664Z',
    '2.2.7-r': '2017-07-18T19:44:48.946Z',
    '2.3.0-beta-1': '2017-07-22T16:27:45.025Z',
    '2.3.0-beta-2': '2017-07-22T17:12:09.905Z',
    '2.3.0-beta-3': '2017-07-22T17:35:05.771Z',
    '2.3.0-beta-4': '2017-07-22T18:22:42.563Z',
    '2.3.0': '2017-07-22T23:08:37.513Z',
    '2.3.1-pre': '2017-07-24T05:50:40.852Z',
    '2.3.1': '2017-07-25T05:24:27.651Z',
    '2.3.2': '2017-07-28T23:05:36.431Z',
    '2.3.3': '2017-07-29T10:05:30.120Z',
    '2.3.4': '2017-07-29T10:18:44.061Z',
    '2.3.5': '2017-08-14T06:22:57.686Z',
    '2.3.6': '2017-08-17T04:30:44.872Z',
    '2.4.0': '2017-09-23T08:01:22.780Z',
    '2.4.1-beta': '2017-10-01T08:57:14.509Z',
    '2.5.0': '2017-10-01T12:31:06.333Z',
    '2.5.1': '2017-10-01T13:32:06.584Z',
    '2.6.0': '2017-10-18T20:22:32.836Z',
    '2.6.1': '2017-10-19T17:26:24.083Z',
    '2.6.2': '2017-10-21T08:37:16.527Z',
    '2.6.3': '2017-10-21T16:04:05.556Z',
    '2.6.4': '2017-10-31T17:47:03.647Z',
    '2.6.5': '2017-11-05T09:09:31.332Z',
    '2.6.6': '2017-11-08T22:47:16.504Z',
    '2.7.0': '2017-12-05T23:25:06.372Z',
    '2.7.1': '2017-12-14T15:43:27.317Z'
  },
  _uplinks: {
    abc: { etag: 'ddfdxjn8m8n6gn70-8m', fetched: 1532297472000}, 
    npmjs: { etag: '"5a272ad2-4f6b1"', fetched: 1513266232741 }, 
    xyz: { etag: '564748hydydygs-s7ehj', fetched: 1532124672000}
  },
  _rev: '16-ba1b806df0298246',
  _attachments: {},
  latest: {
    name: 'verdaccio',
    version: '2.7.1',
    description: 'Private npm repository server',
    author: {
      name: 'User NPM',
      email: 'test@author.local',
      avatar: 'https://www.gravatar.com/avatar/a5a236ba477ee98908600c40cda74f4a'
    },
    repository: {
      type: 'git',
      url: 'git://github.com/verdaccio/verdaccio.git'
    },
    main: 'index.js',
    bin: { verdaccio: './bin/verdaccio' },
    dependencies: {
      '@verdaccio/file-locking': '0.0.3',
      '@verdaccio/streams': '0.0.2',
      JSONStream: '^1.1.1',
      'apache-md5': '^1.1.2',
      async: '^2.0.1',
      'body-parser': '^1.15.0',
      bunyan: '^1.8.0',
      chalk: '^2.0.1',
      commander: '^2.11.0',
      compression: '1.6.2',
      cookies: '^0.7.0',
      cors: '^2.8.3',
      express: '4.15.3',
      global: '^4.3.2',
      handlebars: '4.0.5',
      'http-errors': '^1.4.0',
      'js-string-escape': '1.0.1',
      'js-yaml': '^3.6.0',
      jsonwebtoken: '^7.4.1',
      lockfile: '^1.0.1',
      lodash: '4.17.4',
      lunr: '^0.7.0',
      marked: '0.3.6',
      mime: '^1.3.6',
      minimatch: '^3.0.2',
      mkdirp: '^0.5.1',
      pkginfo: '^0.4.0',
      request: '^2.72.0',
      semver: '^5.1.0',
      'unix-crypt-td-js': '^1.0.0'
    },
    devDependencies: {
      axios: '0.16.2',
      'babel-cli': '6.24.1',
      'babel-core': '6.25.0',
      'babel-eslint': '7.2.3',
      'babel-loader': '7.1.1',
      'babel-plugin-flow-runtime': '0.11.1',
      'babel-plugin-transform-decorators-legacy': '1.3.4',
      'babel-plugin-transform-runtime': '6.23.0',
      'babel-polyfill': '^6.26.0',
      'babel-preset-env': '1.5.2',
      'babel-preset-flow': '6.23.0',
      'babel-preset-react': '6.24.1',
      'babel-preset-stage-2': '6.24.1',
      'babel-preset-stage-3': '6.24.1',
      'babel-runtime': '6.23.0',
      'codacy-coverage': '2.0.2',
      codecov: '2.2.0',
      coveralls: '2.13.1',
      'css-loader': '0.28.4',
      'element-react': '1.0.16',
      'element-theme-default': '1.3.7',
      eslint: '4.2.0',
      'eslint-config-google': '0.8.0',
      'eslint-loader': '1.8.0',
      'eslint-plugin-babel': '4.1.1',
      'eslint-plugin-flowtype': '2.35.0',
      'eslint-plugin-import': '2.6.1',
      'eslint-plugin-react': '7.1.0',
      'extract-text-webpack-plugin': '3.0.0',
      'file-loader': '0.11.2',
      'flow-runtime': '0.13.0',
      'friendly-errors-webpack-plugin': '1.6.1',
      'fs-extra': '4.0.1',
      'github-markdown-css': '2.8.0',
      'html-webpack-plugin': '2.29.0',
      'in-publish': '2.0.0',
      'localstorage-memory': '1.0.2',
      mocha: '3.4.2',
      'mocha-lcov-reporter': '1.3.0',
      'node-sass': '4.5.3',
      'normalize.css': '7.0.0',
      nyc: '11.0.3',
      ora: '1.3.0',
      'prop-types': '15.5.10',
      react: '15.6.1',
      'react-dom': '15.6.1',
      'react-hot-loader': '3.0.0-beta.7',
      'react-router-dom': '4.1.1',
      'react-syntax-highlighter': '5.6.2',
      rimraf: '2.6.1',
      'sass-loader': '6.0.6',
      'source-map-loader': '0.2.1',
      'standard-version': '4.2.0',
      'style-loader': '0.18.2',
      stylelint: '7.13.0',
      'stylelint-config-standard': '16.0.0',
      'stylelint-webpack-plugin': '0.8.0',
      'url-loader': '0.5.8',
      webpack: '3.2.0',
      'webpack-dev-server': '2.5.0',
      'webpack-merge': '4.1.0'
    },
    keywords: [
      'private',
      'package',
      'repository',
      'registry',
      'enterprise',
      'modules',
      'proxy',
      'server'
    ],
    scripts: {
      release: 'standard-version -a -s',
      prepublish: 'in-publish && npm run build:webui || not-in-publish',
      test: 'mocha ./test/functional ./test/unit --reporter=spec --full-trace',
      'pre:ci': 'npm run build:webui',
      'test:ci': 'npm run test:coverage',
      'test:only': 'mocha ./test/functional ./test/unit',
      'test:coverage': 'nyc npm t',
      'coverage:html': 'nyc report --reporter=html',
      'coverage:publish': 'nyc report --reporter=lcov | codecov',
      lint: 'eslint .',
      'lint:css': "stylelint 'src/**/*.scss' --syntax scss",
      'pre:webpack': 'npm run lint && rimraf static/*',
      'dev:webui': 'babel-node tools/dev.server.js',
      'build:webui':
        'npm run pre:webpack && webpack --config tools/webpack.prod.config.babel.js',
      'build:docker': 'docker build -t verdaccio . --no-cache',
      'build:docker:rpi': 'docker build -f Dockerfile.rpi -t verdaccio:rpi .'
    },
    jest: { snapshotSerializers: ['jest-serializer-enzyme'] },
    engines: { node: '>=4.6.1', npm: '>=2.15.9' },
    preferGlobal: true,
    publishConfig: { registry: 'http://localhost:4873/' },
    license: 'WTFPL',
    contributors: [
      {
        name: '030',
        email: 'test1@test.local',
        avatar:
          'https://www.gravatar.com/avatar/4ef03c2bf8d8689527903212d96fb45b'
      },
      {
        name: 'User NPM',
        email: 'test2@test.local',
        avatar:
          'https://www.gravatar.com/avatar/a5a236ba477ee98908600c40cda74f4a'
      },
      {
        name: 'User NPM',
        email: 'test3@test.comu',
        avatar:
          'https://www.gravatar.com/avatar/41a61049006855759bd6ec82ef0543a0'
      },
      {
        name: 'Alex Vernacchia',
        email: 'tes4@test.local',
        avatar:
          'https://www.gravatar.com/avatar/06975001f7f2be7052bcf978700c6112'
      },
      {
        name: 'Alexander Makarenko',
        email: 'test5@test.local',
        avatar:
          'https://www.gravatar.com/avatar/d9acfc4ed4e49a436738ff26a722dce4'
      },
      {
        name: 'Alexandre-io',
        email: 'test6@test.local',
        avatar:
          'https://www.gravatar.com/avatar/2e095c7cfd278f72825d0fed6e12e3b1'
      },
      {
        name: 'Aram Drevekenin',
        email: 'test7@test.local',
        avatar:
          'https://www.gravatar.com/avatar/371edff6d79c39bb9e36bde39d41a4b0'
      },
      {
        name: 'Bart Dubois',
        email: 'test8@test.local',
        avatar:
          'https://www.gravatar.com/avatar/4acf72b14fcb459286c988c4523bafc8'
      },
      {
        name: 'Barthélemy Vessemont',
        email: 'test9@test.local',
        avatar:
          'https://www.gravatar.com/avatar/322cd2fad528a55c4351ec76d85ef525'
      },
      {
        name: 'Brandon Nicholls',
        email: 'test10@test.local',
        avatar:
          'https://www.gravatar.com/avatar/2d3b462f08f214ed459967aa7ef206f7'
      },
      {
        name: 'Bren Norris',
        email: 'test11@test.local',
        avatar:
          'https://www.gravatar.com/avatar/465a42204a22efada0f15b46a7cdad3a'
      },
      {
        name: 'Brett Trotter',
        email: 'test12@test.local',
        avatar:
          'https://www.gravatar.com/avatar/27a54519dcbe64c6d705f3cc4854595a'
      },
      {
        name: 'Brian Peacock',
        email: 'test13@test.local',
        avatar:
          'https://www.gravatar.com/avatar/3dd3d627330e7e048c13a7480f19842e'
      },
      {
        name: 'Cedric Darne',
        email: 'test14@test.local',
        avatar:
          'https://www.gravatar.com/avatar/0a617cebc6539940d7956c86e86c72a6'
      },
      {
        name: 'Chad Killingsworth',
        email: 'test15@test.local',
        avatar:
          'https://www.gravatar.com/avatar/a5825b2d69311e559e28a535e5f0d483'
      },
      {
        name: 'Chris Breneman',
        email: 'test16@test.local',
        avatar:
          'https://www.gravatar.com/avatar/3c5c3edef955c93edac672cbad04d7cd'
      },
      {
        name: 'Cody Droz',
        email: 'test17@test.local',
        avatar:
          'https://www.gravatar.com/avatar/b762ce4d14acfece36e783b1592d882b'
      },
      {
        name: 'Daniel Rodríguez Rivero',
        email: 'test18@test.local',
        avatar:
          'https://www.gravatar.com/avatar/ac7f548c31e8a002cfa41bd4c71e222d'
      },
      {
        name: 'Denis Babineau',
        email: 'test19@test.local',
        avatar:
          'https://www.gravatar.com/avatar/ee5a522e067759ba0403824ecebeab4d'
      },
      {
        name: 'Emmanuel Narh',
        email: 'test20@test.local',
        avatar:
          'https://www.gravatar.com/avatar/93a84a6120969fd181785ff9de834f0a'
      },
      {
        name: 'Fabio Poloni',
        email: 'test21@test.local',
        avatar:
          'https://www.gravatar.com/avatar/f9a05677360e5f52fcca6e1af9b0f2ee'
      },
      {
        name: 'Facundo Chambó',
        email: 'test22@test.local',
        avatar:
          'https://www.gravatar.com/avatar/ec9e7c590ba4081c25fcf197f90a4ea0'
      },
      {
        name: 'Guilherme Bernal',
        email: 'test23@test.local',
        avatar:
          'https://www.gravatar.com/avatar/e5d55dcf2495618e8b9f8778f8353ee0'
      },
      {
        name: 'Jakub Jirutka',
        email: 'test24@test.local',
        avatar:
          'https://www.gravatar.com/avatar/061bdb74aa4a543108658b277a257b4b'
      },
      {
        name: 'James Newell',
        email: 'test25@test.local',
        avatar:
          'https://www.gravatar.com/avatar/825190aaae6ec7fd95085e1fb6f261d2'
      },
      {
        name: 'Jan Vansteenkiste',
        email: 'test26@test.local',
        avatar:
          'https://www.gravatar.com/avatar/41835625a324201c796a0a0cffe4796b'
      },
      {
        name: 'Jannis Achstetter',
        email: 'test27@test.local',
        avatar:
          'https://www.gravatar.com/avatar/92d1cce007b032f4a63c6df764f18030'
      },
      {
        name: 'Jeremy Moritz',
        email: 'test28@test.local',
        avatar:
          'https://www.gravatar.com/avatar/008127e8f10293f43e62de3b7b3520e1'
      },
      {
        name: 'John Gozde',
        email: 'test29@test.local',
        avatar:
          'https://www.gravatar.com/avatar/3e8927c60cb043a56fdd6531cfcaddbc'
      },
      {
        name: 'Jon de la Motte',
        email: 'test30@test.local',
        avatar:
          'https://www.gravatar.com/avatar/126c1ea4fdb20bbb85c3ff735b7b0964'
      },
      {
        name: 'Joseph Gentle',
        email: 'test31@test.local',
        avatar:
          'https://www.gravatar.com/avatar/484f0b8ba8b7cc43db0be8f910a91254'
      },
      {
        name: 'José De Paz',
        email: 'test32@test.local',
        avatar:
          'https://www.gravatar.com/avatar/2532122835f5ebf1642b707ae088c895'
      },
      {
        name: 'Juan Carlos Picado',
        email: 'test33@test.local',
        avatar:
          'https://www.gravatar.com/avatar/c676605ff39f9c7a43f5518a8ce54e12'
      },
      {
        name: 'Juan Carlos Picado',
        email: 'test34@test.local',
        avatar:
          'https://www.gravatar.com/avatar/fba48015a688c38cc84e5b55b07858c0'
      },
      {
        name: 'User NPM',
        email: 'test35@test.local',
        avatar:
          'https://www.gravatar.com/avatar/fba48015a688c38cc84e5b55b07858c0'
      },
      {
        name: 'User NPM @nickname',
        email: 'test36@test.local',
        avatar:
          'https://www.gravatar.com/avatar/fba48015a688c38cc84e5b55b07858c0'
      },
      {
        name: 'Kalman Speier',
        email: 'test37@test.local',
        avatar:
          'https://www.gravatar.com/avatar/272806ba17639e2fbf811e51eb8bfb99'
      },
      {
        name: 'Keyvan Fatehi',
        email: 'test38@test.local',
        avatar:
          'https://www.gravatar.com/avatar/22735d1ba5765955914eb2d597dfaab5'
      },
      {
        name: 'Kody J. Peterson',
        email: 'test39@test.local',
        avatar:
          'https://www.gravatar.com/avatar/918a15afc52e9b0a67b2651191b23d04'
      },
      {
        name: 'Madison Grubb',
        email: 'test40@test.local',
        avatar:
          'https://www.gravatar.com/avatar/73b84fdf661c11d48d3370bfa197162b'
      },
      {
        name: 'Manuel de Brito Fontes',
        email: 'test41@test.local',
        avatar:
          'https://www.gravatar.com/avatar/8798ca0a499428e5e8f25d3614ac8b6e'
      },
      {
        name: 'Mark Doeswijk',
        email: 'test42@test.local',
        avatar:
          'https://www.gravatar.com/avatar/0d70ebd6c46dc01502bfab5f8c2d2bc5'
      },
      {
        name: 'Meeeeow',
        email: 'test43@test.local',
        avatar:
          'https://www.gravatar.com/avatar/baa061890d7b352ba121082272419a8a'
      },
      {
        name: 'Meeeeow',
        email: 'test44@test.local',
        avatar:
          'https://www.gravatar.com/avatar/12a36e093451d4c0f75d4240960ce29b'
      },
      {
        name: 'Michael Arnel',
        email: 'test45@test.local',
        avatar:
          'https://www.gravatar.com/avatar/5f9a5ed24c63609d52651258f6dd8c12'
      },
      {
        name: 'Michael Crowe',
        email: 'test46@test.local',
        avatar:
          'https://www.gravatar.com/avatar/eec9ee62019852da28a3bc91c57907f9'
      },
      {
        name: 'Miguel Mejias',
        email: 'test47@test.local',
        avatar:
          'https://www.gravatar.com/avatar/7289a01fedfdb9ddf855ee4dd4d41ae2'
      },
      {
        name: 'Miroslav Bajtoš',
        email: 'test48@test.local',
        avatar:
          'https://www.gravatar.com/avatar/b4d8831300713259f74aea79f842ca57'
      },
      {
        name: 'Nate Ziarek',
        email: 'test49@test.local',
        avatar:
          'https://www.gravatar.com/avatar/6442023756294fd43aa518bbe5cc6dcc'
      },
      {
        name: 'Nick',
        email: 'test50@test.local',
        avatar:
          'https://www.gravatar.com/avatar/8a810f12c9624ea2092852fe7c19f1ee'
      },
      {
        name: 'Piotr Synowiec',
        email: 'test51@test.local',
        avatar:
          'https://www.gravatar.com/avatar/87028f33a3e1e5b4201c371abddf93e2'
      },
      {
        name: 'Rafael Cesar',
        email: 'test52@test.local',
        avatar:
          'https://www.gravatar.com/avatar/204ed93fa5be7e2f9f299ad8bca6431f'
      },
      {
        name: 'Robert Ewald',
        email: 'test53@test.local',
        avatar:
          'https://www.gravatar.com/avatar/ec2166ce419f78fb354f128b01a4a44d'
      },
      {
        name: 'Robert Groh',
        email: 'test54@test.local',
        avatar:
          'https://www.gravatar.com/avatar/565ccb5374a3e0e31a75f11da2eb57aa'
      },
      {
        name: 'Robin Persson',
        email: 'test55@test.local',
        avatar:
          'https://www.gravatar.com/avatar/99da46e4d59664134b176869340f464b'
      },
      {
        name: 'Romain Lai-King',
        email: 'test56@test.local',
        avatar:
          'https://www.gravatar.com/avatar/69d0370c58399d0e0bbd15ccabfe1ec5'
      },
      {
        name: 'Ryan Graham',
        email: 'test57@test.local',
        avatar:
          'https://www.gravatar.com/avatar/8bd1dd86bbf8705a5a702b86a2f3a390'
      },
      {
        name: 'Ryan Graham',
        email: 'test58@test.local',
        avatar:
          'https://www.gravatar.com/avatar/e272ab422c1c629e9be26cba8b6c0166'
      },
      {
        name: 'Sam Day',
        email: 'test59@test.local',
        avatar:
          'https://www.gravatar.com/avatar/1886554b0562a0eeeb78a4d1f27917ea'
      },
      {
        name: 'Tarun Garg',
        email: 'test60@test.local',
        avatar:
          'https://www.gravatar.com/avatar/185e200c3451cfbe341f0e758626303a'
      },
      {
        name: 'Thomas Cort',
        email: 'test61@test.local',
        avatar:
          'https://www.gravatar.com/avatar/120d2921c33c1bd8dedfce67a28dcc63'
      },
      {
        name: 'Tom Vincent',
        email: 'test62@test.local',
        avatar:
          'https://www.gravatar.com/avatar/fb0c7faeda7f5d5632182a3d80381bfa'
      },
      {
        name: 'Trent Earl',
        email: 'test63@test.local',
        avatar:
          'https://www.gravatar.com/avatar/1e30abe66d21824b89c28d05e5b57d84'
      },
      {
        name: 'Yannick Croissant',
        email: 'test64@test.local',
        avatar:
          'https://www.gravatar.com/avatar/1e619ddb2a180222dd3d9f0348e65b9b'
      },
      {
        name: 'Yannick Galatol',
        email: 'test65@test.local',
        avatar:
          'https://www.gravatar.com/avatar/2f624f92326fef845bb2c07b392b7e48'
      },
      {
        name: 'cklein',
        email: 'test66@test.local',
        avatar:
          'https://www.gravatar.com/avatar/f8288370380881cf3afc5a92a63d652d'
      },
      {
        name: 'danielo515',
        email: 'test67@test.local',
        avatar:
          'https://www.gravatar.com/avatar/ac7f548c31e8a002cfa41bd4c71e222d'
      },
      {
        name: 'jmwilkinson',
        email: 'test68@test.local',
        avatar:
          'https://www.gravatar.com/avatar/3b99683f0a4c26a8906ecbe7968a4ade'
      },
      {
        name: 'nickname',
        email: 'test69@test.local',
        avatar:
          'https://www.gravatar.com/avatar/fba48015a688c38cc84e5b55b07858c0'
      },
      {
        name: 'nickname',
        email: 'test70@test.local',
        avatar:
          'https://www.gravatar.com/avatar/047ba1e853d20459e531619af5493c56'
      },
      {
        name: 'maxlaverse',
        email: 'test71@test.local',
        avatar:
          'https://www.gravatar.com/avatar/74324a2900906c45949a8c5cee6d0730'
      },
      {
        name: 'saheba',
        email: 'test72@test.local',
        avatar:
          'https://www.gravatar.com/avatar/77644c51856cab149e0f550c5f0c6ed8'
      },
      {
        name: 'steve-p-com',
        email: 'test73@test.local',
        avatar:
          'https://www.gravatar.com/avatar/bef1821d3036b8b9242c4999826c1c3c'
      },
      {
        name: 'trent.earl',
        email: 'test74@test.local',
        avatar:
          'https://www.gravatar.com/avatar/f84b8ae496f7c988dce5a71d773e75bb'
      }
    ],
    readmeFilename: 'README.md',
    gitHead: '567dbe327819ed30afb96906f8d43f19740e2e3d',
    bugs: { url: 'https://github.com/verdaccio/verdaccio/issues' },
    homepage: 'https://github.com/verdaccio/verdaccio#readme',
    _id: 'verdaccio@2.7.1',
    _shasum: '958c919180e7f2ed6775f48d4ec64bd8de2a14df',
    _from: '.',
    _npmVersion: '3.10.10',
    _nodeVersion: '6.9.5',
    _npmUser: {},
    dist: {
      shasum: '958c919180e7f2ed6775f48d4ec64bd8de2a14df',
      tarball: 'http://localhost:4873/verdaccio/-/verdaccio-2.7.1.tgz'
    }
  }
};
