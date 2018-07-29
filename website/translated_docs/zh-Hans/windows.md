---
id: windows
title: "作为 Windows 服务安装"
---
基于的非精确指南请见[这里](http://asysadmin.tumblr.com/post/32941224574/running-nginx-on-windows-as-a-service)。 我制作以下，它提供良好运行的verdaccio 服务安装：

1. 为 verdaccio创建一个目录 
    * mkdir `c:\verdaccio`
    * cd `c:\verdaccio`
2. 当地安装verdaccio（我在全局安装的时候出现npm问题） 
    * npm install verdaccio
3. 在此位置`(c:\verdaccio\config.yaml)`创建`config.yaml`文件
4. Windows服务设置

## 使用NSSM

替代方法: (当我尝试下载的时候，WinSW 包缺失)

* 下载[NSSM](https://www.nssm.cc/download/)并提取

* 添加包含nssm.exe 的路径到PATH（路径）中

* 打开管理命令

* 运行nssm install verdaccio，至少必须填写应用程序 tab Path（选项卡路径），启动目录和参数字段。 假设在系统路径中以及c:\verdaccio位置用node安装，以下的值将起作用：
    
    * Path: `node`
    * Startup directory: `c:\verdaccio`
    * Arguments: `c:\verdaccio\node_modules\verdaccio\build\lib\cli.js -c c:\verdaccio\config.yaml`
    
    您可以根据需要在其他选项卡调整其他服务设置。完成后，请单击安装服务按钮
    
    * Start the service sc start verdaccio

## 使用WinSW

* 截至2015-10-27, WinSW 不再存在以下位置。请跟随以上使用NSSM指南。
* 下载 [WinSW](http://repo.jenkins-ci.org/releases/com/sun/winsw/winsw/) 
    * Place the executable (e.g. `winsw-1.9-bin.exe`) into this folder (`c:\verdaccio`) and rename it to `verdaccio-winsw.exe`
* Create a configuration file in `c:\verdaccio`, named `verdaccio-winsw.xml` with the following configuration `xml verdaccio verdaccio verdaccio node c:\verdaccio\node_modules\verdaccio\src\lib\cli.js -c c:\verdaccio\config.yaml roll c:\verdaccio`.
* Install your service 
    * `cd c:\verdaccio`
    * `verdaccio-winsw.exe install`
* Start your service 
    * `verdaccio-winsw.exe start`

Some of the above config is more verbose than I had expected, it appears as though 'workingdirectory' is ignored, but other than that, this works for me and allows my verdaccio instance to persist between restarts of the server, and also restart itself should there be any crashes of the verdaccio process.

## Repositories

* [verdaccio-deamon-windows](https://github.com/davidenke/verdaccio-deamon-windows)