import { getObjectValue } from '../utils/index.js';
const vnode2TemplateMap = new Map();
const template2VnodeMap = new Map();

export function renderMixin(Zue) {
    Zue.prototype._render = function () {
        renderNode(this, this._vnode);
    }
}

export function renderData(vm,data){
    const vnodes = template2VnodeMap.get(data);
    if(vnodes){
        for(let i = 0;i < vnodes.length;i ++){
           renderNode(vm,vnodes[i]);
        }
    }
}

function renderNode(vm,vnode) {
    if (vnode.nodeType == 3) {
        const templates = vnode2TemplateMap.get(vnode);
        if(templates){
            let result = vnode.text;
            for(let i = 0;i < templates.length;i ++){
                const value = getTemplateValue([vnode.env,vm._data],templates[i]);
                if(value != null){
                    const rule = new RegExp(`{{\\s{0,}${templates[i]}\\s{0,}}}`,'g');
                    result = result.replaceAll(rule,value);
                }else {
                    console.warn(`can't find variable ${templates[i]} in the instense`)
                }
            }
            vnode.elm.nodeValue = result;
        }
    } else if(vnode.nodeType == 1) {
        const templates = vnode2TemplateMap.get(vnode);
        if(templates && vnode.tag == 'INPUT'){
            for(let i = 0;i < templates.length;i ++){
                const value = getTemplateValue([vnode.env,vm._data],templates[i]);
                if(value != null){
                    vnode.elm.value = value;
                }
            }
        }
    }
    for (let i = 0; i < vnode.children.length; i++) {
        renderNode(vm,vnode.children[i]);
    }
}

function getTemplateValue(envs,template){
    for(let i = 0;i < envs.length;i ++){
        let value = getObjectValue(envs[i],template);
        if(value != null){
            return value;
        }
    };

    return null;
}

export function prepareRender(vm, vnode) {
    if (!vnode) return;

    if (vnode.nodeType == 3) {
        analysisStringVnode(vm, vnode);
    } else if (vnode.nodeType == 1) {
        analysisAttr(vm,vnode);
        for (let i = 0; i < vnode.children.length; i++) {
            prepareRender(vm, vnode.children[i]);
        }
    }else if(vnode.nodeType == 0){
        setTemplate2VnodeMap(vnode.data,vnode);
        setVnode2TemplateMap(vnode.data,vnode);
        for (let i = 0; i < vnode.children.length; i++) {
            prepareRender(vm, vnode.children[i]);
        }
    }

};

function analysisStringVnode(vm, vnode) {
    const templateStringList = vnode.text.match(/{{[a-zA-Z0-9_. ]+}}/g);
    // console.log(templateStringList);
    for (let i = 0; templateStringList && i < templateStringList.length; i++) {-
        setVnode2TemplateMap(templateStringList[i], vnode);
        setTemplate2VnodeMap(templateStringList[i], vnode);
    }
};

function getTemplateName(template) {
    if (template.substring(0, 2) == '{{' && template.substring(template.length - 2, template.length) == '}}') {
        return template.substring(2, template.length - 2).trim();
    } else {
        return template;
    }
};


function setVnode2TemplateMap(template, vnode) {
    const templateName = getTemplateName(template);
    if (vnode2TemplateMap.get(vnode)) {
        vnode2TemplateMap.get(vnode).push(templateName);
    } else {
        vnode2TemplateMap.set(vnode, [templateName]);
    }
};

function setTemplate2VnodeMap(template, vnode) {
    const templateName = getTemplateName(template);
    if (template2VnodeMap.get(templateName)) {
        template2VnodeMap.get(templateName).push(vnode);
    } else {
        template2VnodeMap.set(templateName, [vnode]);
    }
}


function analysisAttr(vm,vnode){
    const attrs = vnode.elm.getAttributeNames();
    if(attrs.indexOf('v-model') > -1){
        const template = vnode.elm.getAttribute('v-model');
        setVnode2TemplateMap(template,vnode)
        setTemplate2VnodeMap(template,vnode)
    }
}

export function getVNodeByTemplate(template) {
    return template2VnodeMap.get(template);
}

export function clearMap(){
    vnode2TemplateMap.clear();
    template2VnodeMap.clear();
}

export function lookMap(){
    console.log(template2VnodeMap,vnode2TemplateMap);
}