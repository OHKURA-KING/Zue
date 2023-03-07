import { setObjectValue } from "../../utils/index.js";

export function vmodel(vm,el,template){
    el.addEventListener('input',function(e){
        setObjectValue(vm,template,e.target.value);
    })
}