import { join } from 'path';

// 临时在当前模块增加编辑器内的模块为搜索路径，为了能够正常 require 到 cc 模块，后续版本将优化调用方式
module.paths.push(join(Editor.App.path, 'node_modules'));

// 当前版本需要在 module.paths 修改后才能正常使用 cc 模块
// 并且如果希望正常显示 cc 的定义，需要手动将 engine 文件夹里的 cc.d.ts 添加到插件的 tsconfig 里
// 当前版本的 cc 定义文件可以在当前项目的 temp/declarations/cc.d.ts 找到
declare const cc: any;
declare const cce: any;
export function load() { };
export function unload() { };
export const methods = {
    /**
     * 创建nav mesh 组件节点
     * 在当前场景的更结点下
     */
    createNavMeshNode() {
        let scene = cc.director.getScene();
        //创建前先全局检测是否已经存在
        let navMeshs: any[] = scene.getComponentsInChildren("NavMeshComponent");
        if (navMeshs.length > 0) {
            console.log("杨宗宝 Nav Mesh : 场景中已存在 NavMesh组件对应的节点，不可重复创建...");
        } else {
            let node = new cc.Node();
            node.name = "Nav Mesh";
            node.position = new cc.Vec3(0, 0, 0);
            scene.addChild(node);
            node.addComponent("NavMeshComponent");
        }
    }
};