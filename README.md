# zhiziyun-material-angularcli

该项目采用angular6( https://angular.cn )框架，使用angular-cli( https://cli.angular.io/ )技术创建。
一系列先进的技术使得项目更安全、更高效、更简洁，在使用该项目前假设已经掌握了NodeJs( http://nodejs.cn/ )编程基础知识。以下是可能需要学习的技术：

# typescript
系统代码采用typescript语言编写，它是javascript的超集，官网 https://www.tslang.cn/

# angualr
从angularJs升级到angular需要重新学习，这里是中文文档 https://angular.cn

# RxJs
系统数据交互采用响应式编程方案--RxJs技术，这里是中文官方文档 https://cn.rx.js.org/

# angular-cli
命令行工具，使得创建angular项目更方便

# angular material 组件
这是一套由angular实现基于google最新material设计风格的组件

# 使用
克隆项目到本地，执行ng serve,打开浏览器访问localhost:4200。
* 请注意，由于浏览器同源策略，不同的域名无法直接通过浏览器进行数据通讯，解决方案包括ngnix、代理、配置同源策略文件等，这里介绍使用代理的方式。
在项目根目录创建文件proxy.config.js文件，内容类似

```
const PROXY_CONFIG = [
     {
         "context": [
             "/options"
         ],
         "target": "http://localhost:8080/dmp-probe-site/",
         "secure": false,
         "logLevel": "debug",
         "changeOrigin": true
     }
 ]
 
 module.exports = PROXY_CONFIG;
 ```
 所有对前缀options的访问都会被转到目标地址http://localhost:8080/dmp-probe-site/,启动命令
 ```
 ng serve --proxy-config proxy.config.js
 ```


