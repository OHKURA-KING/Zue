import { getObjectValue,getEnvObj } from "../../utils/index.js";
import { contributeEnvCode, executeClassExpress } from "../../utils/code.js";

export function checkBind(vm,vnode){
    if(vnode.nodeType != 1) return;
    const attributes = vnode.elm.getAttributeNames();
    for(let i = 0;i < attributes.length;i ++){
        if(attributes[i].indexOf('v-bind:') == 0 || attributes[i].indexOf(':') == 0){
            vbind(vm,vnode,attributes[i]);
        }
    }
};


function vbind(vm,vnode,attr){
    const attrVal = vnode.elm.getAttribute(attr);
    const key = attr.split(':')[1];
    if(/^{[\w\W]+}$/.test(attrVal)){
        const str = attrVal.trim().substring(1,attrVal.length - 1).trim();
        let expressionList = str.split(',');
        let result = analysisExpression(vm,vnode,expressionList);
        vnode.elm.removeAttribute(attr);
        vnode.elm.setAttribute(key,result)
    }else{
        vnode.elm.removeAttribute(attr);
        const value = getObjectValue(vm,attrVal);
        vnode.elm.setAttribute(key,value)
    }
};


function analysisExpression(vm, vnode, expressionList){
    let envObj = getEnvObj(vm,vnode);
    const envCode = contributeEnvCode(envObj);
    let result = '';

    for(let i = 0;i < expressionList.length;i ++){
        const expression = expressionList[i];
        let code = '';
        let key = '';
        if(expression.indexOf(':') > 0){
            code = expression.split(':')[1];
            key = expression.split(':')[0];
        }else {
            code = expression;
            key = expression;
        };
        if(executeClassExpress(envCode,code)){
            result += key + ' ';
        }
    };

    return result.substring(0,result.length - 1);
}