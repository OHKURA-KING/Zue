# 项目介绍
模仿vue2实现的简易的MVVM框架，支持data,methods属性，created生命周期函数，v-for,v-on,v-bind指令。使用Object.defineProperty实现的双向数据绑定。

#使用说明

## 导入
```js
import Zue from './core/index.js';
```

## 传入要挂载到的节点id
```js
 new Zue({
    el:'id'
 })
```