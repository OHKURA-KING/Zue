import { getObjectValue } from "../../utils/index.js";


export default function checkVOn(vm,vnode){
    if(vnode.nodeType !== 1) return;

    const attributes = vnode.elm.getAttributeNames();
    for(let i = 0;i < attributes.length;i ++){
        if(attributes[i].indexOf('v-bind:') == 0 || attributes[i].indexOf('@') == 0){
            const event = analysisAttribute(attributes[i]);
            const methodName = vnode.elm.getAttribute(attributes[i]);
            von(vm,vnode,event,methodName);
        }
    }
};

function analysisAttribute(attr){
    if(attr.indexOf('@') == 0){
        return attr.slice(1,attr.length);
    }else if(attr.indexOf('@') == 0){
        return attr.slice(6,attr.length);
    }
}


function von(vm,vnode,event,name){
    const method = getObjectValue(vm,name);
    vnode.elm.addEventListener(event,proxyMethod(vm,method))
};

function proxyMethod(vm,method){
    return function(){
        method.call(vm);
    }
}