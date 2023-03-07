import Vnode from '../vdom/vnode.js';
import { prepareRender,getVNodeByTemplate,clearMap,lookMap } from './render.js';
import { vmodel } from './grammer/vmodel.js';
import { vforInit } from './grammer/vfor.js';
import { mergeAttr} from '../utils/index.js';
import { checkBind } from './grammer/vbind.js';
import checkVOn from './grammer/von.js';

export function initMount(Zue){
    Zue.prototype.$mount = function (el){
        const vm = this;
        const elemNode = document.getElementById(el);
        vm._vnode = constructVnode(vm,elemNode);
        prepareRender(vm,vm._vnode);
        vm._render();
    }
}

export default function mount(vm,el){
    vm._vnode = constructVnode(vm,el,null);
    prepareRender(vm,vm._vnode);
    vm._render();
};


function constructVnode(vm,el,parent){
   let vnode =  analysisAttr(vm,el,parent);//分析元素上的属性
   if(vnode == null){
        const tag = el.nodeName;
        const children = [];
        const text = getNodeText(el);
        const data = null;
        const nodeType = el.nodeType;

        vnode = new Vnode(tag,el,children,text,data,parent,nodeType);
        if(el.nodeType == 1 && el.getAttribute('env')){
            vnode.env = mergeAttr(vnode.env,JSON.parse(el.getAttribute('env')));
        } else {
            vnode.env = mergeAttr(vnode.env,parent ? parent.env : {});
        }
   }
   checkBind(vm,vnode);// 解析v-bind
   checkVOn(vm,vnode);

    const childs = vnode.nodeType == 0 ? vnode.parent.elm.childNodes : el.childNodes;
    for(let i = 0;i < childs.length;i ++){
        const childNode = constructVnode(vm,childs[i],vnode);
        
        if(childNode instanceof Vnode){
            vnode.children.push(childNode);
        }else {// 考虑到使用v-for的情况
            vnode.children = vnode.children.concat(childNode);
        }
    }


    return vnode;
}

function analysisAttr(vm,el,parent){
  if(el.nodeType == 1){
    const attrNames = el.getAttributeNames();
    if(attrNames.includes('v-model')){
        const template = el.getAttribute('v-model');
        vmodel(vm,el,template);
    }
    if(attrNames.includes('v-for')){
        const instructions = el.getAttribute('v-for');
        return vforInit(vm,el,instructions,parent);
    }
  }
}

function getNodeText(el){
    if(el.nodeType === 3){
        return el.nodeValue;
    }else {
        return '';
    }
}


export function rebuild(vm,templates){
    const virtualNode = getVNodeByTemplate(templates);
    // console.log(virtualNode);
    for(let i = 0;i < virtualNode.length;i ++){
        const vNode = virtualNode[i];
        vNode.parent.elm.innerHTML = '';
        vNode.parent.elm.appendChild(vNode.elm);
        const resultSet = constructVnode(vm,vNode.elm,vNode.parent);
        vNode.parent.children = [resultSet];
    }
    clearMap();
    prepareRender(vm,vm._vnode);
    vm._render();
}









