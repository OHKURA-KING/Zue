import { constructProxy } from "./proxy.js";
import mount from './mount.js';

let uid = 0;



export function initMixin(Zue){
    Zue.prototype._init = function(options){
        const vm = this;
        vm.uid = uid ++;
        vm.isZue = true;
        // 初始化data
        if(options && options.data){
            vm._data = constructProxy(vm,options.data,'');
        }
        // 初始化created
        if(options && options.created){
            vm._created = options.created;
        }
        // 初始化methods
        if(options && options.methods){
            vm._methods = options.methods;
            for(let key in options.methods){
                vm[key] = options.methods[key];
            }
        }
        // 初始化el并挂载
        if(options && options.el){
            const rootNode = document.getElementById(options.el);
            mount(vm,rootNode);
        }
    }
}