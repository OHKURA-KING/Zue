import VNode from "../../vdom/vnode.js";
import { getObjectValue } from "../../utils/index.js";

export function vforInit(vm,el,instructions,parent){
    const virtualNode = new VNode(el.nodeName,el,[],'',getVirtualNodeData(instructions)[2],parent,0);
    parent.elm.removeChild(el);
    parent.elm.appendChild(document.createTextNode(''));
    analysisInstructions(vm,instructions,el,parent);
    return virtualNode;
};


function  getVirtualNodeData(instructions) {
    const instructionArr = instructions.trim().split(' ');
    if(instructionArr.length < 3 || instructionArr[1] !== 'in' && instructionArr[1] !== 'of'){
        return new Error('v-for instruction is wrong');
    };

    return instructionArr;
};

function analysisInstructions(vm,instructions,el,parent){
    const instructionArr = getVirtualNodeData(instructions);
    const dataSet = getObjectValue(vm._data,instructionArr[2]);

    if(!dataSet){
        return new Error('The data of v-for is not found')
    };

    for (let i = 0; i < dataSet.length; i++) {
        const childNode = document.createElement(el.nodeName);
        childNode.innerHTML = el.innerHTML;
        let env = analysisKV(instructionArr[0],dataSet[i],i);
        childNode.setAttribute('env',JSON.stringify(env));
        parent.elm.appendChild(childNode);
    }
};


function analysisKV(instructions,value,index){
    instructions = instructions.trim();
    if(/\([a-zA-Z0-9_$, ]+\)/.test(instructions)){
        instructions = instructions.slice(1,instructions.length-1);
    }
    const keys = instructions.split(',');
    if(keys.length === 0){
        return new Error('error');
    }
    let env = {};
    
    env[keys[0].trim()] = value;

    if(keys.length > 1){
        env[keys[1].trim()] = index;
    }

    return env;
}