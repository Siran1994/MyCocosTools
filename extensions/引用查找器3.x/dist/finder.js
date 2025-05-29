"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Finder = void 0;
const Path = __importStar(require("path"));
const logger_1 = require("./logger");
const object_util_1 = require("./object-util");
const parser_1 = require("./parser");
const FileUtil = require('./lib/eazax/file-util');
var Finder;
(function (Finder) {
    /**
     * 使用 uuid 进行查找
     * @param {string} uuid
     */
    async function findByUuid(assetInfo) {
        //
        let uuid = assetInfo.uuid;
        // 记录子资源 uuid
        const subAssetUuids = [];
        // 资源类型检查
        if (assetInfo.type === 'cc.ImageAsset') {
            // 纹理子资源
            const subAssetInfos = assetInfo.subAssets;
            for (const key in subAssetInfos) {
                const subAssetInfo = subAssetInfos[key];
                subAssetUuids.push(subAssetInfo.uuid);
            }
        }
        else if (assetInfo.type === 'cc.Script') {
            // 脚本资源
            uuid = Editor.Utils.UUID.compressUUID(uuid, false);
        }
        // 项目assets目录路径
        const assetsFsPath = await Editor.Message.request('asset-db', 'query-path', 'db://assets');
        (0, logger_1.print)('log', `assetsFsPath: ${assetsFsPath}`);
        // 查找资源引用
        const results = [];
        const selfResults = await findRefs(uuid, assetsFsPath);
        for (let i = 0, l = selfResults.length; i < l; i++) {
            results.push(selfResults[i]);
        }
        // 查找子资源的引用
        if (subAssetUuids.length > 0) {
            for (let i = 0; i < subAssetUuids.length; i++) {
                const subResults = await findRefs(subAssetUuids[i], assetsFsPath);
                for (let j = 0; j < subResults.length; j++) {
                    results.push(subResults[j]);
                }
            }
        }
        return results;
    }
    Finder.findByUuid = findByUuid;
    /** 扩展名对应文件类型 */
    const ASSET_TYPE_MAP = {
        // 场景
        '.fire': 'scene',
        '.scene': 'scene',
        // 预制体
        '.prefab': 'prefab',
        // 动画
        '.anim': 'animation',
        // 材质
        '.mtl': 'material',
        // 字体
        '.fnt.meta': 'font',
    };
    /**
     * 查找引用
     * @param {string} uuid
     * @returns {Promise<{ type: string, url: string, refs?: object[]}[]>}
     */
    async function findRefs(uuid, assetsFsPath) {
        const result = [];
        // 文件处理函数
        const handler = async (fsPath) => {
            // 获取文件后缀
            const ext = Path.extname(fsPath);
            // 绝对路径转资源url
            const url = await Editor.Message.request('asset-db', 'query-url', fsPath);
            if (ext === '.fire' || ext === '.scene' || ext === '.prefab') {
                // 场景和预制体资源（转为节点树）
                const tree = await parser_1.Parser.getNodeTree(fsPath);
                if (!tree) {
                    return;
                }
                // 遍历第一层节点查找引用
                const refs = [];
                for (let children = tree.children, i = 0, l = children.length; i < l; i++) {
                    await findRefsInNode(tree, children[i], uuid, refs);
                }
                // 保存当前文件引用结果
                if (refs.length > 0) {
                    result.push({
                        type: ASSET_TYPE_MAP[ext],
                        url,
                        refs,
                    });
                }
            }
            else if (ext === '.anim') {
                // 动画资源
                const data = JSON.parse(await FileUtil.readFile(fsPath)), curveData = data['curveData'], contains = object_util_1.ObjectUtil.containsValue(curveData, uuid);
                if (contains) {
                    result.push({
                        type: ASSET_TYPE_MAP[ext],
                        url
                    });
                }
            }
            else if (ext === '.mtl' || fsPath.endsWith('.fnt.meta')) {
                // 材质和字体资源
                const data = JSON.parse(await FileUtil.readFile(fsPath));
                // 需排除自己
                if ((data['uuid'] === uuid)) {
                    return;
                }
                // 是否引用
                const contains = object_util_1.ObjectUtil.containsValue(data, uuid);
                if (contains) {
                    const _ext = (ext === '.mtl') ? '.mtl' : '.fnt.meta';
                    result.push({
                        type: ASSET_TYPE_MAP[_ext],
                        url,
                    });
                }
            }
        };
        // 遍历资源目录下的文件
        await FileUtil.map(assetsFsPath, handler);
        return result;
    }
    /**
     * 查找节点中的引用
     * @param {object} tree 节点树
     * @param {object} node 目标节点
     * @param {string} uuid 查找的 uuid
     * @param {object[]} result 结果
     */
    async function findRefsInNode(tree, node, uuid, result) {
        // 检查节点上的组件是否有引用
        const components = node.components;
        if (components && components.length > 0) {
            for (let i = 0, l = components.length; i < l; i++) {
                // 获取包含uuid的字段
                const properties = getContainsUuidProperties(components[i], uuid);
                if (properties.length === 0) {
                    continue;
                }
                // 资源类型
                let type = components[i].__type__;
                // 是否为脚本资源（自定义脚本）
                if (Editor.Utils.UUID.isUUID(type)) {
                    const scriptUuid = Editor.Utils.UUID.decompressUUID(type);
                    const assetInfo = await Editor.Message.request('asset-db', 'query-asset-info', scriptUuid);
                    if (assetInfo) {
                        // 获取脚本名称
                        type = Path.basename(assetInfo.url);
                    }
                }
                // 遍历相关属性名
                for (let i = 0; i < properties.length; i++) {
                    let property = properties[i];
                    if (property === '__type__') {
                        property = null;
                    }
                    else {
                        // 处理属性名称（Label 组件需要特殊处理）
                        if (type === 'cc.Label' && property === '_N$file') {
                            property = 'font';
                        }
                        // 去除属性名的前缀
                        if (property.startsWith('_N$')) {
                            property = property.replace('_N$', '');
                        }
                        else if (property[0] === '_') {
                            property = property.substring(1);
                        }
                    }
                    // 保存结果
                    result.push({
                        node: node.path,
                        component: type,
                        property,
                    });
                }
            }
        }
        // 检查预制体是否有引用
        const prefab = node.prefab;
        if (prefab) {
            // 排除预制体自己
            // if (uuid !== tree.uuid) {
            const contains = object_util_1.ObjectUtil.containsValue(prefab, uuid);
            if (contains) {
                result.push({
                    node: node.path,
                });
            }
            // }
        }
        // 遍历子节点
        const children = node.children;
        if (children && children.length > 0) {
            for (let i = 0, l = children.length; i < l; i++) {
                await findRefsInNode(tree, children[i], uuid, result);
            }
        }
    }
    /**
     * 获取对象包含指定 uuid 的属性
     * @param {object} object 对象
     * @param {string} uuid 值
     * @returns {string[]}
     */
    function getContainsUuidProperties(object, uuid) {
        const properties = [];
        const search = (target, path) => {
            if (Object.prototype.toString.call(target) === '[object Object]') {
                for (const key in target) {
                    const curPath = (path != null) ? `${path}.${key}` : key;
                    if (target[key] === uuid) {
                        properties.push(path || key);
                    }
                    search(target[key], curPath);
                }
            }
            else if (Array.isArray(target)) {
                for (let i = 0, l = target.length; i < l; i++) {
                    const curPath = (path != null) ? `${path}[${i}]` : `[${i}]`;
                    if (target[i] === uuid) {
                        properties.push(path || `[${i}]`);
                    }
                    search(target[i], curPath);
                }
            }
        };
        search(object, null);
        return properties;
    }
})(Finder || (exports.Finder = Finder = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmluZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc291cmNlL2ZpbmRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLDJDQUE2QjtBQUM3QixxQ0FBaUM7QUFDakMsK0NBQTJDO0FBQzNDLHFDQUFnRDtBQUNoRCxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUVsRCxJQUFpQixNQUFNLENBa1B0QjtBQWxQRCxXQUFpQixNQUFNO0lBRW5COzs7T0FHRztJQUNJLEtBQUssVUFBVSxVQUFVLENBQUMsU0FBb0I7UUFDakQsRUFBRTtRQUNGLElBQUksSUFBSSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUM7UUFDMUIsYUFBYTtRQUNiLE1BQU0sYUFBYSxHQUFHLEVBQUUsQ0FBQztRQUN6QixTQUFTO1FBQ1QsSUFBSSxTQUFTLENBQUMsSUFBSSxLQUFLLGVBQWUsRUFBRSxDQUFDO1lBQ3JDLFFBQVE7WUFDUixNQUFNLGFBQWEsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDO1lBQzFDLEtBQUssTUFBTSxHQUFHLElBQUksYUFBYSxFQUFFLENBQUM7Z0JBQzlCLE1BQU0sWUFBWSxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDeEMsYUFBYSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDMUMsQ0FBQztRQUNMLENBQUM7YUFBTSxJQUFJLFNBQVMsQ0FBQyxJQUFJLEtBQUssV0FBVyxFQUFFLENBQUM7WUFDeEMsT0FBTztZQUNQLElBQUksR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3ZELENBQUM7UUFFRCxlQUFlO1FBQ2YsTUFBTSxZQUFZLEdBQUcsTUFBTSxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsWUFB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QUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQy9CLENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQyxDQUFDO1FBQ0YsTUFBTSxDQUFDLE1BQU0sRUFBRSxJQUFXLENBQUMsQ0FBQztRQUM1QixPQUFPLFVBQVUsQ0FBQztJQUN0QixDQUFDO0FBQ0wsQ0FBQyxFQWxQZ0IsTUFBTSxzQkFBTixNQUFNLFFBa1B0QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFzc2V0SW5mbyB9IGZyb20gJ0Bjb2Nvcy9jcmVhdG9yLXR5cGVzL2VkaXRvci9wYWNrYWdlcy9hc3NldC1kYi9AdHlwZXMvcHVibGljJztcclxuaW1wb3J0ICogYXMgUGF0aCBmcm9tICdwYXRoJztcclxuaW1wb3J0IHsgcHJpbnQgfSBmcm9tICcuL2xvZ2dlcic7XHJcbmltcG9ydCB7IE9iamVjdFV0aWwgfSBmcm9tICcuL29iamVjdC11dGlsJztcclxuaW1wb3J0IHsgUGFyc2VyLCBUcmVlTm9kZUluZm8gfSBmcm9tICcuL3BhcnNlcic7XHJcbmNvbnN0IEZpbGVVdGlsID0gcmVxdWlyZSgnLi9saWIvZWF6YXgvZmlsZS11dGlsJyk7XHJcblxyXG5leHBvcnQgbmFtZXNwYWNlIEZpbmRlciB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDkvb/nlKggdXVpZCDov5vooYzmn6Xmib5cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB1dWlkXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBhc3luYyBmdW5jdGlvbiBmaW5kQnlVdWlkKGFzc2V0SW5mbzogQXNzZXRJbmZvKSB7XHJcbiAgICAgICAgLy9cclxuICAgICAgICBsZXQgdXVpZCA9IGFzc2V0SW5mby51dWlkO1xyXG4gICAgICAgIC8vIOiusOW9leWtkOi1hOa6kCB1dWlkXHJcbiAgICAgICAgY29uc3Qgc3ViQXNzZXRVdWlkcyA9IFtdO1xyXG4gICAgICAgIC8vIOi1hOa6kOexu+Wei+ajgOafpVxyXG4gICAgICAgIGlmIChhc3NldEluZm8udHlwZSA9PT0gJ2NjLkltYWdlQXNzZXQnKSB7XHJcbiAgICAgICAgICAgIC8vIOe6ueeQhuWtkOi1hOa6kFxyXG4gICAgICAgICAgICBjb25zdCBzdWJBc3NldEluZm9zID0gYXNzZXRJbmZvLnN1YkFzc2V0cztcclxuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gc3ViQXNzZXRJbmZvcykge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc3ViQXNzZXRJbmZvID0gc3ViQXNzZXRJbmZvc1trZXldO1xyXG4gICAgICAgICAgICAgICAgc3ViQXNzZXRVdWlkcy5wdXNoKHN1YkFzc2V0SW5mby51dWlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoYXNzZXRJbmZvLnR5cGUgPT09ICdjYy5TY3JpcHQnKSB7XHJcbiAgICAgICAgICAgIC8vIOiEmuacrOi1hOa6kFxyXG4gICAgICAgICAgICB1dWlkID0gRWRpdG9yLlV0aWxzLlVVSUQuY29tcHJlc3NVVUlEKHV1aWQsIGZhbHNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOmhueebrmFzc2V0c+ebruW9lei3r+W+hFxyXG4gICAgICAgIGNvbnN0IGFzc2V0c0ZzUGF0aCA9IGF3YWl0IEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ2Fzc2V0LWRiJywgJ3F1ZXJ5LXBhdGgnLCAnZGI6Ly9hc3NldHMnKSBhcyBzdHJpbmc7XHJcbiAgICAgICAgcHJpbnQoJ2xvZycsIGBhc3NldHNGc1BhdGg6ICR7YXNzZXRzRnNQYXRofWApO1xyXG5cclxuICAgICAgICAvLyDmn6Xmib7otYTmupDlvJXnlKhcclxuICAgICAgICBjb25zdCByZXN1bHRzID0gW107XHJcbiAgICAgICAgY29uc3Qgc2VsZlJlc3VsdHMgPSBhd2FpdCBmaW5kUmVmcyh1dWlkLCBhc3NldHNGc1BhdGgpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gc2VsZlJlc3VsdHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaChzZWxmUmVzdWx0c1tpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIOafpeaJvuWtkOi1hOa6kOeahOW8leeUqFxyXG4gICAgICAgIGlmIChzdWJBc3NldFV1aWRzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdWJBc3NldFV1aWRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzdWJSZXN1bHRzID0gYXdhaXQgZmluZFJlZnMoc3ViQXNzZXRVdWlkc1tpXSwgYXNzZXRzRnNQYXRoKTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgc3ViUmVzdWx0cy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaChzdWJSZXN1bHRzW2pdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHRzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiDmianlsZXlkI3lr7nlupTmlofku7bnsbvlnosgKi9cclxuICAgIGNvbnN0IEFTU0VUX1RZUEVfTUFQID0ge1xyXG4gICAgICAgIC8vIOWcuuaZr1xyXG4gICAgICAgICcuZmlyZSc6ICdzY2VuZScsXHJcbiAgICAgICAgJy5zY2VuZSc6ICdzY2VuZScsXHJcbiAgICAgICAgLy8g6aKE5Yi25L2TXHJcbiAgICAgICAgJy5wcmVmYWInOiAncHJlZmFiJyxcclxuICAgICAgICAvLyDliqjnlLtcclxuICAgICAgICAnLmFuaW0nOiAnYW5pbWF0aW9uJyxcclxuICAgICAgICAvLyDmnZDotKhcclxuICAgICAgICAnLm10bCc6ICdtYXRlcmlhbCcsXHJcbiAgICAgICAgLy8g5a2X5L2TXHJcbiAgICAgICAgJy5mbnQubWV0YSc6ICdmb250JyxcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmn6Xmib7lvJXnlKhcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB1dWlkXHJcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTx7IHR5cGU6IHN0cmluZywgdXJsOiBzdHJpbmcsIHJlZnM/OiBvYmplY3RbXX1bXT59XHJcbiAgICAgKi9cclxuICAgIGFzeW5jIGZ1bmN0aW9uIGZpbmRSZWZzKHV1aWQ6IHN0cmluZywgYXNzZXRzRnNQYXRoOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCByZXN1bHQ6IHsgdHlwZTogYW55OyB1cmw6IGFueTsgcmVmcz86IGFueVtdOyB9W10gPSBbXTtcclxuICAgICAgICAvLyDmlofku7blpITnkIblh73mlbBcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gYXN5bmMgKGZzUGF0aDogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIOiOt+WPluaWh+S7tuWQjue8gFxyXG4gICAgICAgICAgICBjb25zdCBleHQgPSBQYXRoLmV4dG5hbWUoZnNQYXRoKTtcclxuICAgICAgICAgICAgLy8g57ud5a+56Lev5b6E6L2s6LWE5rqQdXJsXHJcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGF3YWl0IEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ2Fzc2V0LWRiJywgJ3F1ZXJ5LXVybCcsIGZzUGF0aCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoZXh0ID09PSAnLmZpcmUnIHx8IGV4dCA9PT0gJy5zY2VuZScgfHwgZXh0ID09PSAnLnByZWZhYicpIHtcclxuICAgICAgICAgICAgICAgIC8vIOWcuuaZr+WSjOmihOWItuS9k+i1hOa6kO+8iOi9rOS4uuiKgueCueagke+8iVxyXG4gICAgICAgICAgICAgICAgY29uc3QgdHJlZSA9IGF3YWl0IFBhcnNlci5nZXROb2RlVHJlZShmc1BhdGgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0cmVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8g6YGN5Y6G56ys5LiA5bGC6IqC54K55p+l5om+5byV55SoXHJcbiAgICAgICAgICAgICAgICBjb25zdCByZWZzOiBzdHJpbmcgfCBhbnlbXSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgY2hpbGRyZW4gPSB0cmVlLmNoaWxkcmVuLCBpID0gMCwgbCA9IGNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGZpbmRSZWZzSW5Ob2RlKHRyZWUsIGNoaWxkcmVuW2ldLCB1dWlkLCByZWZzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIOS/neWtmOW9k+WJjeaWh+S7tuW8leeUqOe7k+aenFxyXG4gICAgICAgICAgICAgICAgaWYgKHJlZnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogQVNTRVRfVFlQRV9NQVBbZXh0XSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWZzLFxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGV4dCA9PT0gJy5hbmltJykge1xyXG4gICAgICAgICAgICAgICAgLy8g5Yqo55S76LWE5rqQXHJcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gSlNPTi5wYXJzZShhd2FpdCBGaWxlVXRpbC5yZWFkRmlsZShmc1BhdGgpKSxcclxuICAgICAgICAgICAgICAgICAgICBjdXJ2ZURhdGEgPSBkYXRhWydjdXJ2ZURhdGEnXSxcclxuICAgICAgICAgICAgICAgICAgICBjb250YWlucyA9IE9iamVjdFV0aWwuY29udGFpbnNWYWx1ZShjdXJ2ZURhdGEsIHV1aWQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNvbnRhaW5zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBBU1NFVF9UWVBFX01BUFtleHRdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmxcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIGlmIChleHQgPT09ICcubXRsJyB8fCBmc1BhdGguZW5kc1dpdGgoJy5mbnQubWV0YScpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyDmnZDotKjlkozlrZfkvZPotYTmupBcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBKU09OLnBhcnNlKGF3YWl0IEZpbGVVdGlsLnJlYWRGaWxlKGZzUGF0aCkpO1xyXG4gICAgICAgICAgICAgICAgLy8g6ZyA5o6S6Zmk6Ieq5bexXHJcbiAgICAgICAgICAgICAgICBpZiAoKGRhdGFbJ3V1aWQnXSA9PT0gdXVpZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyDmmK/lkKblvJXnlKhcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRhaW5zID0gT2JqZWN0VXRpbC5jb250YWluc1ZhbHVlKGRhdGEsIHV1aWQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNvbnRhaW5zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgX2V4dCA9IChleHQgPT09ICcubXRsJykgPyAnLm10bCcgOiAnLmZudC5tZXRhJztcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IEFTU0VUX1RZUEVfTUFQW19leHRdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmwsXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIC8vIOmBjeWOhui1hOa6kOebruW9leS4i+eahOaWh+S7tlxyXG4gICAgICAgIGF3YWl0IEZpbGVVdGlsLm1hcChhc3NldHNGc1BhdGgsIGhhbmRsZXIpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5p+l5om+6IqC54K55Lit55qE5byV55SoXHJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gdHJlZSDoioLngrnmoJFcclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBub2RlIOebruagh+iKgueCuVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHV1aWQg5p+l5om+55qEIHV1aWRcclxuICAgICAqIEBwYXJhbSB7b2JqZWN0W119IHJlc3VsdCDnu5PmnpxcclxuICAgICAqL1xyXG4gICAgYXN5bmMgZnVuY3Rpb24gZmluZFJlZnNJbk5vZGUodHJlZTogVHJlZU5vZGVJbmZvLCBub2RlOiBUcmVlTm9kZUluZm8sIHV1aWQ6IHN0cmluZywgcmVzdWx0OiBhbnlbXSkge1xyXG5cclxuICAgICAgICAvLyDmo4Dmn6XoioLngrnkuIrnmoTnu4Tku7bmmK/lkKbmnInlvJXnlKhcclxuICAgICAgICBjb25zdCBjb21wb25lbnRzID0gbm9kZS5jb21wb25lbnRzO1xyXG4gICAgICAgIGlmIChjb21wb25lbnRzICYmIGNvbXBvbmVudHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IGNvbXBvbmVudHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAvLyDojrflj5bljIXlkKt1dWlk55qE5a2X5q61XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwcm9wZXJ0aWVzID0gZ2V0Q29udGFpbnNVdWlkUHJvcGVydGllcyhjb21wb25lbnRzW2ldLCB1dWlkKTtcclxuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0aWVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8g6LWE5rqQ57G75Z6LXHJcbiAgICAgICAgICAgICAgICBsZXQgdHlwZSA9IGNvbXBvbmVudHNbaV0uX190eXBlX187XHJcblxyXG4gICAgICAgICAgICAgICAgLy8g5piv5ZCm5Li66ISa5pys6LWE5rqQ77yI6Ieq5a6a5LmJ6ISa5pys77yJXHJcbiAgICAgICAgICAgICAgICBpZiAoRWRpdG9yLlV0aWxzLlVVSUQuaXNVVUlEKHR5cGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2NyaXB0VXVpZCA9IEVkaXRvci5VdGlscy5VVUlELmRlY29tcHJlc3NVVUlEKHR5cGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFzc2V0SW5mbyA9IGF3YWl0IEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ2Fzc2V0LWRiJywgJ3F1ZXJ5LWFzc2V0LWluZm8nLCBzY3JpcHRVdWlkKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYXNzZXRJbmZvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOiOt+WPluiEmuacrOWQjeensFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlID0gUGF0aC5iYXNlbmFtZShhc3NldEluZm8udXJsKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8g6YGN5Y6G55u45YWz5bGe5oCn5ZCNXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcHJvcGVydHkgPSBwcm9wZXJ0aWVzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eSA9PT0gJ19fdHlwZV9fJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5aSE55CG5bGe5oCn5ZCN56ew77yITGFiZWwg57uE5Lu26ZyA6KaB54m55q6K5aSE55CG77yJXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSAnY2MuTGFiZWwnICYmIHByb3BlcnR5ID09PSAnX04kZmlsZScpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5ID0gJ2ZvbnQnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWOu+mZpOWxnuaAp+WQjeeahOWJjee8gFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvcGVydHkuc3RhcnRzV2l0aCgnX04kJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5ID0gcHJvcGVydHkucmVwbGFjZSgnX04kJywgJycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHByb3BlcnR5WzBdID09PSAnXycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5ID0gcHJvcGVydHkuc3Vic3RyaW5nKDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIOS/neWtmOe7k+aenFxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZTogbm9kZS5wYXRoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQ6IHR5cGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5LFxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDmo4Dmn6XpooTliLbkvZPmmK/lkKbmnInlvJXnlKhcclxuICAgICAgICBjb25zdCBwcmVmYWIgPSBub2RlLnByZWZhYjtcclxuICAgICAgICBpZiAocHJlZmFiKSB7XHJcbiAgICAgICAgICAgIC8vIOaOkumZpOmihOWItuS9k+iHquW3sVxyXG4gICAgICAgICAgICAvLyBpZiAodXVpZCAhPT0gdHJlZS51dWlkKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnRhaW5zID0gT2JqZWN0VXRpbC5jb250YWluc1ZhbHVlKHByZWZhYiwgdXVpZCk7XHJcbiAgICAgICAgICAgIGlmIChjb250YWlucykge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgIG5vZGU6IG5vZGUucGF0aCxcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOmBjeWOhuWtkOiKgueCuVxyXG4gICAgICAgIGNvbnN0IGNoaWxkcmVuID0gbm9kZS5jaGlsZHJlbjtcclxuICAgICAgICBpZiAoY2hpbGRyZW4gJiYgY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IGNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgZmluZFJlZnNJbk5vZGUodHJlZSwgY2hpbGRyZW5baV0sIHV1aWQsIHJlc3VsdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5blr7nosaHljIXlkKvmjIflrpogdXVpZCDnmoTlsZ7mgKdcclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBvYmplY3Qg5a+56LGhXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdXVpZCDlgLxcclxuICAgICAqIEByZXR1cm5zIHtzdHJpbmdbXX1cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZ2V0Q29udGFpbnNVdWlkUHJvcGVydGllcyhvYmplY3Q6IGFueSwgdXVpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgcHJvcGVydGllczogYW55W10gPSBbXTtcclxuICAgICAgICBjb25zdCBzZWFyY2ggPSAodGFyZ2V0OiBhbnksIHBhdGg6IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHRhcmdldCkgPT09ICdbb2JqZWN0IE9iamVjdF0nKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiB0YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJQYXRoID0gKHBhdGggIT0gbnVsbCkgPyBgJHtwYXRofS4ke2tleX1gIDoga2V5O1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXRba2V5XSA9PT0gdXVpZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2gocGF0aCB8fCBrZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBzZWFyY2godGFyZ2V0W2tleV0sIGN1clBhdGgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkodGFyZ2V0KSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0YXJnZXQubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VyUGF0aCA9IChwYXRoICE9IG51bGwpID8gYCR7cGF0aH1bJHtpfV1gIDogYFske2l9XWA7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldFtpXSA9PT0gdXVpZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2gocGF0aCB8fCBgWyR7aX1dYCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaCh0YXJnZXRbaV0sIGN1clBhdGgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBzZWFyY2gob2JqZWN0LCBudWxsIGFzIGFueSk7XHJcbiAgICAgICAgcmV0dXJuIHByb3BlcnRpZXM7XHJcbiAgICB9XHJcbn0iXX0=