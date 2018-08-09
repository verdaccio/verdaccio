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
    
    * 启动服务 sc 启动 verdaccio

## 使用WinSW

* 截至2015-10-27, WinSW 不再存在以下位置。请跟随以上使用NSSM指南。
* 下载 [WinSW](http://repo.jenkins-ci.org/releases/com/sun/winsw/winsw/) 
    * 放置可执行文件(例如`winsw-1.9-bin.exe`)到此文件夹(`c:\verdaccio`) 中并将其重命名为`verdaccio-winsw.exe`
* 在`c:\verdaccio`创建一个配置文件, 命名为`verdaccio-winsw.xml`，它有以下配置`xml verdaccio verdaccio verdaccio node c:\verdaccio\node_modules\verdaccio\src\lib\cli.js -c c:\verdaccio\config.yaml roll c:\verdaccio`。
* 安装服务 
    * `cd c:\verdaccio`
    * `verdaccio-winsw.exe install`
* 开始服务 
    * `verdaccio-winsw.exe start`

以上的一些配置比我预想的要繁琐，看起来好像忽略了'workingdirectory'，但除此以外，这对我来说很有效，而且让verdaccio instance保持在服务器重启之间，并且还在verdaccio 流程出事故的时候可以自我重启。

## 资源库

* [verdaccio-deamon-windows](https://github.com/davidenke/verdaccio-deamon-windows)