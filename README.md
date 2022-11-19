## 简介
Sword 是 [BladeX](https://gitee.ltd/blade/BladeX)前端UI项目，基于react 、ant design、dva，用于快速构建系统中后台业务。

## 特性

- :gem: **优雅美观**：基于 Ant Design 体系精心设计
- :triangular_ruler: **常见设计模式**：提炼自中后台应用的典型页面和场景
- :rocket: **最新技术栈**：使用 React/umi/dva/antd 等前端前沿技术开发
- :iphone: **响应式**：针对不同屏幕大小设计
- :art: **主题**：可配置的主题满足多样化的品牌诉求
- :globe_with_meridians: **国际化**：内建业界通用的国际化方案
- :zap: **最佳实践**：良好的工程实践助您持续产出高质量代码
- :1234: **Mock 数据**：实用的本地数据调试方案
- :white_check_mark: **UI 测试**：自动化测试保障前端产品质量

## BladeX是什么
* BladeX 是一个基于 Spring Boot 2 & Spring Cloud Greenwich & Mybatis 等核心技术，用于快速构建中大型系统的基础框架
* 已稳定生产近一年，经历了从Camden->Greenwich的技术架构，也经历了从FatJar->Docker->K8S+Jenkins的部署架构
* 采用前后端分离的模式，前端开发两个框架：Sword(基于React、Ant Design)、Saber(基于Vue、ElementUI)
* 后端采用SpringCloud系列，对其基础组件做了高度的封装，单独出一个后端核心框架：BladeX-Tool
* BladeX-Tool已推送至Maven私有库，直接引入减少工程的模块与依赖，可更注重于业务开发
* 集成Sentinel从流量控制、熔断降级、系统负载保护等多个维度保护服务的稳定性
* 注册中心、配置中心选型Nacos，为工程瘦身的同时加强各模块之间的联动
* 使用Traefik进行反向代理，监听后台变化自动化应用新的配置文件
* 集成Oauth2协议，完美支持了多终端的接入与认证授权
* 集成工作流Flowable，复杂流程需求不再难办
* 创建多租户模式，发布简单，数据隔离轻松
* 项目分包明确，规范微服务的开发模式

## 商业授权
* 您一旦开始复制、下载、安装或者使用本产品，即被视为完全理解并接受本协议的各项条款
* 更多详情请看：[BladeX商业授权许可协议](https://gitee.ltd/blade/Sword/src/master/LICENSE)

## 官网
* 官网地址：[https://bladex.vip](https://bladex.vip)

## 在线演示
* Sword演示地址：[https://sword.bladex.vip](https://sword.bladex.vip)
* Saber演示地址：[https://saber.avue.top](https://saber.avue.top)

## 后端项目地址
* [BladeX](https://gitee.ltd/blade/BladeX)

## 前端项目地址
* [Sword--基于React](https://gitee.ltd/blade/Sword)
* [Saber--基于Vue](https://gitee.ltd/blade/Saber)


## 如何启动
```
$ git clone https://gitee.com/smallc/Sword.git
$ cd Sword
$ yarn install 或者 npm install
# mock模式
$ yarn start 或者 npm start  
# 服务模式
$ yarn run start:no-mock 或者 npm run start:no-mock 
# 访问 http://localhost:8888
# 推荐使用yarn       
```
<!-- 企业端 -->
<!-- send-car-enterprise-side -->
