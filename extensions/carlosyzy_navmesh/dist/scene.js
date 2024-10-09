"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.unload = exports.load = void 0;
const path_1 = require("path");
// 临时在当前模块增加编辑器内的模块为搜索路径，为了能够正常 require 到 cc 模块，后续版本将优化调用方式
module.paths.push((0, path_1.join)(Editor.App.path, 'node_modules'));
function load() { }
exports.load = load;
;
function unload() { }
exports.unload = unload;
;
exports.methods = {
    /**
     * 创建nav mesh 组件节点
     * 在当前场景的更结点下
     */
    createNavMeshNode() {
        let scene = cc.director.getScene();
        //创建前先全局检测是否已经存在
        let navMeshs = scene.getComponentsInChildren("NavMeshComponent");
        if (navMeshs.length > 0) {
            console.log("杨宗宝 Nav Mesh : 场景中已存在 NavMesh组件对应的节点，不可重复创建...");
        }
        else {
            let node = new cc.Node();
            node.name = "Nav Mesh";
            node.position = new cc.Vec3(0, 0, 0);
            scene.addChild(node);
            node.addComponent("NavMeshComponent");
        }
    }
};
