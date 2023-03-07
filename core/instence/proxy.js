import { renderData } from "./render.js";
import { rebuild } from "./mount.js";
/**
 * 给data中的数据添加代理
 * @param {*} vm 要代理到的zue实例
 * @param {*} obj 被代理的 data
 * @param {*} namespace 
 * 
 */
const originalProto = Array.prototype;

function defArrayFunc(obj,func,namespace,vm){
    Object.defineProperty(obj,func,{
        enumerable: true,
        configurable: true,
        value: function(...args){
            const originalFunc = originalProto[func];
            const res = originalFunc.apply(this,args);
            rebuild(vm,getNameSapce(namespace,''))
            renderData(vm,getNameSapce(namespace,''));
            return res;
        }
    })
}

function arrayProxy(vm,arr,namespace){

    const proto = {
        eleType: 'Array',
        toString: function (){
            let result = '';
            for(let i = 0;i < arr.length;i ++){
                result += arr[i] + ', ';
            }
            
            return result.substring(0,result.length - 2);
        },
        push() {},
        pop() {},
        shift() {},
        unshift() {}
    }

    defArrayFunc(proto,'push',namespace,vm);
    defArrayFunc(proto,'pop',namespace,vm);
    defArrayFunc(proto,'shift',namespace,vm);
    defArrayFunc(proto,'unshift',namespace,vm);

    arr.__proto__ = proto;

    return arr;
}

function constructObjectProxy(vm,obj,namespace){
    let proxyObj = {};

    for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
            Object.defineProperty(proxyObj,key,{
                configurable: true,
                get(){
                    return obj[key]
                },
                set(value){
                    obj[key] = value;
                    renderData(vm,getNameSapce(namespace,key));
                }
            });
            if(!namespace){
                Object.defineProperty(vm,key,{
                    configurable: true,
                    get(){
                        return obj[key]
                    },
                    set(value){
                        obj[key] = value;
                        renderData(vm,getNameSapce(namespace,key));
                    }
                });
            }

            if(obj[key] instanceof Object){
                obj[key] = constructProxy(vm,obj[key],getNameSapce(namespace,key));
                if(!namespace){
                    vm[key] = obj[key];
                }
            }
        }
    }

    return proxyObj;
}

export function constructProxy(vm,obj,namespace){
    let proxyObj = null;
   if(obj instanceof Array){
        proxyObj = arrayProxy(vm,obj,namespace);
    }else if(obj instanceof Object){
        proxyObj = constructObjectProxy(vm,obj,namespace);
    }else {
        throw TypeError('options.data must be an object!')
    }

    return proxyObj;

}

function getNameSapce(namespace,propName){
    if(namespace == null || namespace == ''){
        return propName;
    }else if(propName == null || propName == ''){
        return namespace;
    }else {
        return namespace + '.' + propName;
    }
}