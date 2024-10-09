"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onCreateMenu = exports.unload = exports.load = exports.methods = void 0;
// @ts-ignore
const package_json_1 = __importDefault(require("../package.json"));
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
/**
 * @en
 * @zh 为扩展的主进程的注册方法
 */
exports.methods = {
    async importNavMeshExample() {
        let targetPath = (0, path_1.join)(Editor.Project.path, '/assets/carlosyzy/nav-mesh-example');
        let isExist = (0, fs_extra_1.pathExistsSync)(targetPath);
        if (!isExist) {
            let resourcePath = (0, path_1.resolve)(__dirname, '../static/nav-mesh-example.zip');
            await Editor.Utils.File.unzip(resourcePath, (0, path_1.join)(Editor.Project.path, '/assets/carlosyzy'));
            Editor.Message.request("asset-db", "refresh-asset", "db://assets");
            console.log("杨宗宝 Nav Mesh： 插件示例集成ok，可以正常使用了...");
        }
        else {
            console.log("杨宗宝 Nav Mesh : 示例已存在已存在，如遇见问题删除nav-mesh-example目录重新导入...");
        }
    }
};
/**
 * @en Hooks triggered after extension loading is complete
 * @zh 扩展加载完成后触发的钩子
 */
async function load() {
    // 在assets 目录下创建 jszip文件夹
    //读取当前目录下的文件
    let targetPath = (0, path_1.join)(Editor.Project.path, '/assets/carlosyzy/nav-mesh');
    let isExist = (0, fs_extra_1.pathExistsSync)(targetPath);
    if (!isExist) {
        let resourcePath = (0, path_1.resolve)(__dirname, '../static/nav-mesh.zip');
        await Editor.Utils.File.unzip(resourcePath, (0, path_1.join)(Editor.Project.path, '/assets/carlosyzy'));
        Editor.Message.request("asset-db", "refresh-asset", "db://assets");
        console.log("杨宗宝 Nav Mesh： 插件集成ok，可以正常使用了...");
    }
    else {
        console.log("杨宗宝 Nav Mesh : 插件已存在...");
    }
}
exports.load = load;
/**
 * @en Hooks triggered after extension uninstallation is complete
 * @zh 扩展卸载完成后触发的钩子
 */
async function unload() {
}
exports.unload = unload;
function onCreateMenu(assetInfo) {
    return [
        {
            label: 'i18n:carlosyzy-navmesh.create',
            click() {
                //创建nav mesh node
                const options = {
                    name: package_json_1.default.name,
                    method: 'createNavMeshNode',
                    args: [],
                };
                Editor.Message.request('scene', 'execute-scene-script', options);
            },
        },
    ];
}
exports.onCreateMenu = onCreateMenu;
;
