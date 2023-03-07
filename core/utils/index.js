export function getObjectValue(obj,template){
    if(!obj) return null;

    const keys = template.trim().split('.');
    let temp = obj;
    for(let i = 0;i < keys.length;i ++){
        if(temp[keys[i]] !== undefined){
            temp = temp[keys[i]];
        }else {
            return undefined;
        }
    };

    return temp;
};


export function setObjectValue(obj,template,value){
    if(!obj) return;

    let temp = obj;
    const keys = template.trim().split('.');

    for(let i = 0;i < keys.length - 1;i ++){
        if(temp[keys[i]]){
            temp = temp[keys[i]];
        }else{
            return;
        }
    };


    temp[keys[keys.length - 1]] = value;
}


export function mergeAttr(obj1,obj2){
    if(obj1 == null && obj1 == null){
        return new Error('mergeArrs params is wrong')
    }
    if(obj1 == null){
        return clone(obj2);
    };

    if(obj2 == null){
        return clone(obj1);
    }
    const newObj = {};
    const obj1KeyNames = Object.getOwnPropertyNames(obj1);
    for(let i = 0;i < obj1KeyNames.length;i ++){
        const key = obj1KeyNames[i];
        newObj[key] = clone(obj1[key]);
    }
    const obj2KeyNames = Object.getOwnPropertyNames(obj2);
    for(let i = 0;i < obj2KeyNames.length;i ++){
        const key = obj2KeyNames[i];
        newObj[key] = clone(obj2[key]);
    }
    return newObj;
}

function clone(data){
    if(data instanceof Array){
        return cloneArr(data);
    }else if(data instanceof Object){
        return cloneObj(data);
    }else {
        return data;
    }
};

function cloneArr(data){
    const len = data.length;
    const newArr = new Array(len);

    for(let i = 0;i < len;i ++){
        newArr[i] = clone(data[i]);
    }
    return newArr;
};


function cloneObj(data){
    const newObj = {};
    const keys = Object.getOwnPropertyNames(data);
    for(let i = 0;i < keys.length;i ++){
        newObj[keys[i]] = clone(data[keys[i]]);
    };

    return newObj;
}

export function getEnvObj(vm,vnode){
    let env = mergeAttr(vm._data,vm._computed);
    env = mergeAttr(env,vnode.env);
    return env;
}