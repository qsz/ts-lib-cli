## 基于typescript-library-starter的一个用于创建typescript库的脚手架

### 参考：
https://github.com/alexjoverm/typescript-library-starter

### 介绍
基于`typescript-library-starter`，将其改为命令行工具，而不是每次`git clone`。  
目标是快速创建一个 `用typescript编写的库或插件` 的开发环境，不适合创建react、vue等项目。

### 配置的工具库
* parcel
* rollupJS
* jest
* npm-check-updates
#### 后续计划增加
* Prettier
* Commitizen
* Semantic release
* husky
* Conventional changelog
* TypeDoc

### 安装使用
> npm install start-tslib -g

> tlc                   自定义创建项目

> tlc --f               快速创建项目(包含所有工具库)

> cd libraryname

> npm install
