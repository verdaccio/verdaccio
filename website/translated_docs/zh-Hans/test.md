---
id: unit-testing(单元-测试）
title: "单元测试"
---
所有测试都被分成3 个文件夹：

- `test/unit` - 涵盖非平凡方式转换数据的功能测试。这些测试只 `require()` 一些文件并在其中运行代码，因此它们是非常快的。
- `test/functional` - 启动verdaccio instance并在 http上执行一系列请求的测试。它们比单元测试慢一些。
- `test/integration` - 启动verdaccio instance并用 npm对其执行请求的测试。它们真的很慢并能打击到真的npm registry。 **unmaintained test**

单元和功能测试是从项目根目录里运行 `npm test` 来自动执行的。集成测试应该时常手动执行。

我们所有测试都使用 `jest`。

## Npm 脚本

要运行测试脚本，您可以使用 `npm` 或 `yarn`。

    yarn run test
    

这将只会触发测试，单元和功能的前两组。

### 使用测试/单元

以下只是单元测试的一个例子。基本上遵守`jest` 标准。

请试着描述单元在 `test` 部分页眉里的单一句子里确切测试什么。

```javacript
const verdaccio = require('../../src/api/index');
const config = require('./partials/config');

describe('basic system test', () => {

  beforeAll(function(done) {
    // something important
  });

  afterAll((done) => {
    // undo something important
  });

  test('server should respond on /', done => {
    // your test
    done();
  });
});
```

### 使用测试/功能

Verdaccio 中的功能测试有点复杂，需要深入解释来让您有成功的体验。

一切从`index.js`文件开始。让我们来深入了解它吧。

```javascript
// we create 3 server instances
 const config1 = new VerdaccioConfig(
    './store/test-storage',
    './store/config-1.yaml',
    'http://localhost:55551/');
  const config2 = new VerdaccioConfig(
      './store/test-storage2',
      './store/config-2.yaml',
      'http://localhost:55552/');
  const config3 = new VerdaccioConfig(
        './store/test-storage3',
        './store/config-3.yaml',
        'http://localhost:55553/');
  const server1: IServerBridge = new Server(config1.domainPath);
  const server2: IServerBridge = new Server(config2.domainPath);
  const server3: IServerBridge = new Server(config3.domainPath);
  const process1: IServerProcess = new VerdaccioProcess(config1, server1, SILENCE_LOG);
  const process2: IServerProcess = new VerdaccioProcess(config2, server2, SILENCE_LOG);
  const process3: IServerProcess = new VerdaccioProcess(config3, server3, SILENCE_LOG);
  const express: any = new ExpressServer();
  ...

    // we check whether all instances has been started, since run in independent processes
    beforeAll((done) => {
      Promise.all([
        process1.init(),
        process2.init(),
        process3.init()]).then((forks) => {
          _.map(forks, (fork) => {
            processRunning.push(fork[0]);
          });
          express.start(EXPRESS_PORT).then((app) =>{
            done();
          }, (err) => {
            done(err);
          });
      }).catch((error) => {
        done(error);
      });
    });

    // after finish all, we ensure are been stoped
    afterAll(() => {
      _.map(processRunning, (fork) => {
        fork.stop();
      });
      express.server.close();
    });


```

### 使用

这里我们将描述常规功能测试看起来是什么样的，请核对内联了解更多详细信息。

#### The lib/server.js

服务器 class(类）只是模拟 `npm` client 的 wrapper类，它为功能测试提供简单的API。

如我们在之前的章节里提到的， 我们正创建3 个流程服务器，可以在每个流程里以`server1`, `server2` 和 ``server3`进行访问。

通过这样的引用，您可以给这任何3 个运行的instance 发送请求。

```javascript
<br />export default function(server) {
  // we recieve any server instance via arguments
  test('add tag - 404', () => {
    // we interact with the server instance.
    return server.addTag('testpkg-tag', 'tagtagtag', '0.0.1').status(404).body_error(/no such package/);
  });
});
```

### 测试/集成

这些部分还没有被使用，但是我们在寻求帮助来让它正常运转。**欢迎任何新的想法。**