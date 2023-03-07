import { initMixin } from "./init.js";
import { initMount } from "./mount.js";
import { renderMixin } from './render.js';

function Zue(options){
    this._init(options);
    if(this._created){
        this._created.call(this);
    }
}

initMixin(Zue);// 混入初始化方法
initMount(Zue);// 初始化$mount方法
renderMixin(Zue);

export default Zue;