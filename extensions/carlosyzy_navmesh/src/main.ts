// @ts-ignore
import packageJSON from '../package.json';
import { AssetInfo } from "../@types/packages/asset-db/@types/public";
import { pathExistsSync, ensureDirSync, } from 'fs-extra';
import { ExecuteSceneScriptMethodOptions } from '../@types/packages/scene/@types/public';
import { join, resolve } from 'path';

/**
 * @en 
 * @zh 为扩展的主进程的注册方法
 */
export const methods: { [key: string]: (...any: any) => any } = {
    async importNavMeshExample() {
        let targetPath: string = join(Editor.Project.path, '/assets/carlosyzy/nav-mesh-example')
        let isExist: any = pathExistsSync(targetPath)
        if (!isExist) {
            let resourcePath = resolve(__dirname, '../static/nav-mesh-example.zip');
            await Editor.Utils.File.unzip(resourcePath, join(Editor.Project.path, '/assets/carlosyzy'));
            Editor.Message.request("asset-db", "refresh-asset", "db://assets");
            console.log("杨宗宝 Nav Mesh： 插件示例集成ok，可以正常使用了...");
        } else {
            console.log("杨宗宝 Nav Mesh : 示例已存在已存在，如遇见问题删除nav-mesh-example目录重新导入...");
        }
    }
};

/**
 * @en Hooks triggered after extension loading is complete
 * @zh 扩展加载完成后触发的钩子
 */
export async function load() {
    // 在assets 目录下创建 jszip文件夹
    //读取当前目录下的文件
    let targetPath: string = join(Editor.Project.path, '/assets/carlosyzy/nav-mesh')
    let isExist: any = pathExistsSync(targetPath)
    if (!isExist) {
        let resourcePath = resolve(__dirname, '../static/nav-mesh.zip');
        await Editor.Utils.File.unzip(resourcePath, join(Editor.Project.path, '/assets/carlosyzy'));
        Editor.Message.request("asset-db", "refresh-asset", "db://assets");
        console.log("杨宗宝 Nav Mesh： 插件集成ok，可以正常使用了...");
    } else {
        console.log("杨宗宝 Nav Mesh : 插件已存在...");
    }
}

/**
 * @en Hooks triggered after extension uninstallation is complete
 * @zh 扩展卸载完成后触发的钩子
 */
export async function unload() {

}

export function onCreateMenu(assetInfo: AssetInfo) {
    return [
        {
            label: 'i18n:carlosyzy-navmesh.create',
            click() {
                //创建nav mesh node
                const options: ExecuteSceneScriptMethodOptions = {
                    name: packageJSON.name,
                    method: 'createNavMeshNode',
                    args: [],
                };
                Editor.Message.request('scene', 'execute-scene-script', options)
            },
        },
    ];
};


