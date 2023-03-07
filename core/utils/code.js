export function contributeEnvCode(obj){
    let result = '';

    for(let key in obj){
        if(obj.hasOwnProperty(key)){
            result += `let ${key} = ${JSON.stringify(obj[key])};`
        }
    };

    return result;
};

export function executeClassExpress(envCode,code){
   let flag = false;
    eval(envCode + `if(${code}){flag = true}`);
     return flag;
}