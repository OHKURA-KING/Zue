export default class VNode {
    constructor(
        tag,// 标签类型
        elm,// 对应的真实节点
        children,// 子节点
        text,// 节点的文本
        data,// 暂无意义
        parent,// 父级节点
        nodeType // 节点类型

    ){

        this.tag = tag;
        this.elm = elm;
        this.children = children;
        this.text = text;
        this.data = data;
        this.parent = parent;
        this.nodeType = nodeType;
        this.env = {};
        this.instructions = null;// 存放当前节点的指令
        this.template = [];

    }

}