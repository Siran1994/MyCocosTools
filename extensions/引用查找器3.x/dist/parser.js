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
exports.Parser = void 0;
const logger_1 = require("./logger");
const object_util_1 = require("./object-util");
const FileUtil = require('./lib/eazax/file-util');
const Path = __importStar(require("path"));
/**
 * 用来解析预制体/场景
 */
var Parser;
(function (Parser) {
    /**
     * 节点树缓存
     * @type {{ [key: string]: object }}
     */
    const caches = {};
    /**
     * 获取节点树
     * @param {string} path 路径
     * @returns {Promise<object>}
     */
    async function getNodeTree(path) {
        path = Path.normalize(path);
        if (!caches[path]) {
            const file = await FileUtil.readFile(path);
            let data = null;
            try {
                data = JSON.parse(file);
            }
            catch (error) {
                (0, logger_1.print)('warn', '文件解析失败', path);
                (0, logger_1.print)('warn', error);
            }
            if (!data) {
                return null;
            }
            caches[path] = convert(data);
        }
        return caches[path];
    }
    Parser.getNodeTree = getNodeTree;
    /**
     * 更新缓存
     * @param {string} path 路径
     */
    async function updateCache(path) {
        path = Path.normalize(path);
        if (!caches[path]) {
            // 本来就没有缓存
            return;
        }
        caches[path] = null;
        await getNodeTree(path);
    }
    Parser.updateCache = updateCache;
    /**
     * 将资源解析为节点树
     * @param {object} source 源数据
     * @returns {object}
     */
    function convert(source) {
        const tree = Object.create(null);
        // 第一个元素
        const firstElement = source[0];
        // 最后一个元素
        const lastElement = source[source.length - 1];
        // 类型存储在这
        const type = firstElement.__type__;
        if (type === 'cc.SceneAsset') {
            // 场景资源
            const id = firstElement.scene.__id__;
            // 获取子节点列表
            const children = source[id]._children;
            // 类型
            tree.type = 'cc.Scene';
            // ID
            tree.id = id;
            // 场景下可以有多个一级节点
            tree.children = [];
            for (let i = 0, l = children.length; i < l; i++) {
                const nodeId = children[i].__id__;
                convertNode(source, nodeId, tree);
            }
        }
        else if (type === 'cc.Prefab') {
            // 预制体资源
            const id = firstElement.data.__id__;
            // 类型
            tree.type = 'cc.Prefab';
            // ID
            tree.id = id;
            // 预制体本身就是一个节点
            tree.children = [];
            convertNode(source, id, tree);
        }
        return tree;
    }
    /**
     * 解析节点
     * @param {NodeInfo[]} source 源数据
     * @param {number} nodeId 节点 ID
     * @param {TreeNodeInfo} parent 父节点
     */
    function convertNode(source, nodeId, parent) {
        // 获取节点数据
        const srcNode = source[nodeId];
        const node = Object.create(null);
        // 基本信息
        node.name = srcNode._name;
        node.id = nodeId;
        // TODO 更多类型
        node.type = srcNode.__type__;
        // 路径
        const parentPath = parent.path || null;
        node.path = parentPath ? `${parentPath}/${node.name}` : node.name;
        // 预制体引用
        const srcPrefab = srcNode._prefab;
        if (srcPrefab) {
            // 读取prefab数据
            const id = srcPrefab.__id__;
            node.prefab = extractValidInfo(source[id]);
            // 预制体名称特殊一点，节点信息并不包含 _name
            try {
                const overrideInfo = source[id + 2];
                if (overrideInfo.__type__ === 'CCPropertyOverrideInfo') {
                    node.path = parentPath ? `${parentPath}/${overrideInfo.value}` : overrideInfo.value;
                }
            }
            catch (error) {
            }
        }
        // 组件
        node.components = [];
        const srcComponents = srcNode._components;
        if (srcComponents && srcComponents.length > 0) {
            for (let i = 0, l = srcComponents.length; i < l; i++) {
                const compId = srcComponents[i].__id__;
                const component = extractValidInfo(source[compId]);
                node.components.push(component);
            }
        }
        // 子节点
        node.children = [];
        const srcChildren = srcNode._children;
        if (srcChildren && srcChildren.length > 0) {
            for (let i = 0, l = srcChildren.length; i < l; i++) {
                const nodeId = srcChildren[i].__id__;
                convertNode(source, nodeId, node);
            }
        }
        // 保存到父节点
        parent.children.push(node);
    }
    /**
     * 提取有效信息（含有 uuid）
     * @param {ExtraInfo} source 源数据
     * @returns {{ __type__: string, _name: string, fileId?: string }}
     */
    function extractValidInfo(source) {
        const result = Object.create(null);
        // 记录有用的属性
        if (source.__type__ !== undefined) {
            // 如果是component ， 那么这个就是组件名
            // 如果是自定义component，那么这个就是脚本的uuid（压缩过后）
            result.__type__ = source.__type__;
        }
        if (source._name !== undefined) {
            result._name = source._name;
        }
        if (source.fileId !== undefined) {
            result.fileId = source.fileId;
        }
        // 记录包含 uuid 的属性
        for (const key in source) {
            const val = source[key];
            const contains = object_util_1.ObjectUtil.containsProperty(val, '__uuid__');
            if (contains) {
                result[key] = val;
            }
        }
        return result;
    }
})(Parser || (exports.Parser = Parser = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc291cmNlL3BhcnNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHFDQUFpQztBQUNqQywrQ0FBMkM7QUFDM0MsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFDbEQsMkNBQTZCO0FBRTdCOztHQUVHO0FBQ0gsSUFBaUIsTUFBTSxDQW9MdEI7QUFwTEQsV0FBaUIsTUFBTTtJQUNuQjs7O09BR0c7SUFDSCxNQUFNLE1BQU0sR0FBb0MsRUFBRSxDQUFDO0lBRW5EOzs7O09BSUc7SUFDSSxLQUFLLFVBQVUsV0FBVyxDQUFDLElBQVk7UUFDMUMsSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1lBQ2hCLE1BQU0sSUFBSSxHQUFHLE1BQU0sUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMzQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7WUFDaEIsSUFBSSxDQUFDO2dCQUNELElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzVCLENBQUM7WUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO2dCQUNiLElBQUEsY0FBSyxFQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQzlCLElBQUEsY0FBSyxFQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztZQUN6QixDQUFDO1lBQ0QsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNSLE9BQU8sSUFBSSxDQUFDO1lBQ2hCLENBQUM7WUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2pDLENBQUM7UUFDRCxPQUFP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Q0FBQyxRQUFRLENBQUM7UUFDdEMsQ0FBQztRQUNELElBQUksTUFBTSxDQUFDLEtBQUssS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUM3QixNQUFNLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDaEMsQ0FBQztRQUNELElBQUksTUFBTSxDQUFDLE1BQU0sS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUM5QixNQUFNLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDbEMsQ0FBQztRQUVELGdCQUFnQjtRQUNoQixLQUFLLE1BQU0sR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFDO1lBQ3ZCLE1BQU0sR0FBRyxHQUFJLE1BQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNqQyxNQUFNLFFBQVEsR0FBRyx3QkFBVSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztZQUM5RCxJQUFJLFFBQVEsRUFBRSxDQUFDO2dCQUNWLE1BQWMsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7WUFDL0IsQ0FBQztRQUNMLENBQUM7UUFFRCxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0FBQ0wsQ0FBQyxFQXBMZ0IsTUFBTSxzQkFBTixNQUFNLFFBb0x0QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHByaW50IH0gZnJvbSAnLi9sb2dnZXInO1xyXG5pbXBvcnQgeyBPYmplY3RVdGlsIH0gZnJvbSAnLi9vYmplY3QtdXRpbCc7XHJcbmNvbnN0IEZpbGVVdGlsID0gcmVxdWlyZSgnLi9saWIvZWF6YXgvZmlsZS11dGlsJyk7XHJcbmltcG9ydCAqIGFzIFBhdGggZnJvbSAncGF0aCc7XHJcblxyXG4vKipcclxuICog55So5p2l6Kej5p6Q6aKE5Yi25L2TL+WcuuaZr1xyXG4gKi9cclxuZXhwb3J0IG5hbWVzcGFjZSBQYXJzZXIge1xyXG4gICAgLyoqXHJcbiAgICAgKiDoioLngrnmoJHnvJPlrZhcclxuICAgICAqIEB0eXBlIHt7IFtrZXk6IHN0cmluZ106IG9iamVjdCB9fVxyXG4gICAgICovXHJcbiAgICBjb25zdCBjYWNoZXM6IHsgW2tleTogc3RyaW5nXTogVHJlZU5vZGVJbmZvIH0gPSB7fTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPluiKgueCueagkVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGgg6Lev5b6EXHJcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxvYmplY3Q+fVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0Tm9kZVRyZWUocGF0aDogc3RyaW5nKSB7XHJcbiAgICAgICAgcGF0aCA9IFBhdGgubm9ybWFsaXplKHBhdGgpO1xyXG4gICAgICAgIGlmICghY2FjaGVzW3BhdGhdKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZpbGUgPSBhd2FpdCBGaWxlVXRpbC5yZWFkRmlsZShwYXRoKTtcclxuICAgICAgICAgICAgbGV0IGRhdGEgPSBudWxsO1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgZGF0YSA9IEpTT04ucGFyc2UoZmlsZSk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBwcmludCgnd2FybicsICfmlofku7bop6PmnpDlpLHotKUnLCBwYXRoKTtcclxuICAgICAgICAgICAgICAgIHByaW50KCd3YXJuJywgZXJyb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FjaGVzW3BhdGhdID0gY29udmVydChkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNhY2hlc1twYXRoXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOabtOaWsOe8k+WtmFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGgg6Lev5b6EXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVDYWNoZShwYXRoOiBzdHJpbmcpIHtcclxuICAgICAgICBwYXRoID0gUGF0aC5ub3JtYWxpemUocGF0aCk7XHJcbiAgICAgICAgaWYgKCFjYWNoZXNbcGF0aF0pIHtcclxuICAgICAgICAgICAgLy8g5pys5p2l5bCx5rKh5pyJ57yT5a2YXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FjaGVzW3BhdGhdID0gbnVsbCBhcyBhbnk7XHJcbiAgICAgICAgYXdhaXQgZ2V0Tm9kZVRyZWUocGF0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlsIbotYTmupDop6PmnpDkuLroioLngrnmoJFcclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBzb3VyY2Ug5rqQ5pWw5o2uXHJcbiAgICAgKiBAcmV0dXJucyB7b2JqZWN0fVxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBjb252ZXJ0KHNvdXJjZTogTm9kZUluZm9bXSkge1xyXG4gICAgICAgIGNvbnN0IHRyZWU6IFRyZWVOb2RlSW5mbyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XHJcbiAgICAgICAgLy8g56ys5LiA5Liq5YWD57SgXHJcbiAgICAgICAgY29uc3QgZmlyc3RFbGVtZW50ID0gc291cmNlWzBdO1xyXG4gICAgICAgIC8vIOacgOWQjuS4gOS4quWFg+e0oFxyXG4gICAgICAgIGNvbnN0IGxhc3RFbGVtZW50ID0gc291cmNlW3NvdXJjZS5sZW5ndGggLSAxXTtcclxuXHJcbiAgICAgICAgLy8g57G75Z6L5a2Y5YKo5Zyo6L+ZXHJcbiAgICAgICAgY29uc3QgdHlwZSA9IGZpcnN0RWxlbWVudC5fX3R5cGVfXztcclxuICAgICAgICBpZiAodHlwZSA9PT0gJ2NjLlNjZW5lQXNzZXQnKSB7XHJcbiAgICAgICAgICAgIC8vIOWcuuaZr+i1hOa6kFxyXG4gICAgICAgICAgICBjb25zdCBpZCA9IChmaXJzdEVsZW1lbnQgYXMgU2NlbmVOb2RlUm9vdCkuc2NlbmUuX19pZF9fO1xyXG4gICAgICAgICAgICAvLyDojrflj5blrZDoioLngrnliJfooahcclxuICAgICAgICAgICAgY29uc3QgY2hpbGRyZW4gPSBzb3VyY2VbaWRdLl9jaGlsZHJlbjtcclxuICAgICAgICAgICAgLy8g57G75Z6LXHJcbiAgICAgICAgICAgIHRyZWUudHlwZSA9ICdjYy5TY2VuZSc7XHJcbiAgICAgICAgICAgIC8vIElEXHJcbiAgICAgICAgICAgIHRyZWUuaWQgPSBpZDtcclxuICAgICAgICAgICAgLy8g5Zy65pmv5LiL5Y+v5Lul5pyJ5aSa5Liq5LiA57qn6IqC54K5XHJcbiAgICAgICAgICAgIHRyZWUuY2hpbGRyZW4gPSBbXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5vZGVJZCA9IGNoaWxkcmVuW2ldLl9faWRfXztcclxuICAgICAgICAgICAgICAgIGNvbnZlcnROb2RlKHNvdXJjZSwgbm9kZUlkLCB0cmVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ2NjLlByZWZhYicpIHtcclxuICAgICAgICAgICAgLy8g6aKE5Yi25L2T6LWE5rqQXHJcbiAgICAgICAgICAgIGNvbnN0IGlkID0gKGZpcnN0RWxlbWVudCBhcyBQcmVmYWJOb2RlUm9vdCkuZGF0YS5fX2lkX187XHJcbiAgICAgICAgICAgIC8vIOexu+Wei1xyXG4gICAgICAgICAgICB0cmVlLnR5cGUgPSAnY2MuUHJlZmFiJztcclxuICAgICAgICAgICAgLy8gSURcclxuICAgICAgICAgICAgdHJlZS5pZCA9IGlkO1xyXG4gICAgICAgICAgICAvLyDpooTliLbkvZPmnKzouqvlsLHmmK/kuIDkuKroioLngrlcclxuICAgICAgICAgICAgdHJlZS5jaGlsZHJlbiA9IFtdO1xyXG4gICAgICAgICAgICBjb252ZXJ0Tm9kZShzb3VyY2UsIGlkLCB0cmVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRyZWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDop6PmnpDoioLngrlcclxuICAgICAqIEBwYXJhbSB7Tm9kZUluZm9bXX0gc291cmNlIOa6kOaVsOaNrlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG5vZGVJZCDoioLngrkgSURcclxuICAgICAqIEBwYXJhbSB7VHJlZU5vZGVJbmZvfSBwYXJlbnQg54i26IqC54K5XHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGNvbnZlcnROb2RlKHNvdXJjZTogTm9kZUluZm9bXSwgbm9kZUlkOiBudW1iZXIsIHBhcmVudDogVHJlZU5vZGVJbmZvKSB7XHJcbiAgICAgICAgLy8g6I635Y+W6IqC54K55pWw5o2uXHJcbiAgICAgICAgY29uc3Qgc3JjTm9kZSA9IHNvdXJjZVtub2RlSWRdO1xyXG4gICAgICAgIGNvbnN0IG5vZGU6IFRyZWVOb2RlSW5mbyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XHJcbiAgICAgICAgLy8g5Z+65pys5L+h5oGvXHJcbiAgICAgICAgbm9kZS5uYW1lID0gc3JjTm9kZS5fbmFtZTtcclxuICAgICAgICBub2RlLmlkID0gbm9kZUlkO1xyXG4gICAgICAgIC8vIFRPRE8g5pu05aSa57G75Z6LXHJcbiAgICAgICAgbm9kZS50eXBlID0gc3JjTm9kZS5fX3R5cGVfXyBhcyBhbnk7XHJcblxyXG4gICAgICAgIC8vIOi3r+W+hFxyXG4gICAgICAgIGNvbnN0IHBhcmVudFBhdGggPSBwYXJlbnQucGF0aCB8fCBudWxsO1xyXG4gICAgICAgIG5vZGUucGF0aCA9IHBhcmVudFBhdGggPyBgJHtwYXJlbnRQYXRofS8ke25vZGUubmFtZX1gIDogbm9kZS5uYW1lO1xyXG5cclxuICAgICAgICAvLyDpooTliLbkvZPlvJXnlKhcclxuICAgICAgICBjb25zdCBzcmNQcmVmYWIgPSBzcmNOb2RlLl9wcmVmYWI7XHJcbiAgICAgICAgaWYgKHNyY1ByZWZhYikge1xyXG4gICAgICAgICAgICAvLyDor7vlj5ZwcmVmYWLmlbDmja5cclxuICAgICAgICAgICAgY29uc3QgaWQgPSBzcmNQcmVmYWIuX19pZF9fO1xyXG4gICAgICAgICAgICBub2RlLnByZWZhYiA9IGV4dHJhY3RWYWxpZEluZm8oc291cmNlW2lkXSBhcyBFeHRyYUluZm8pO1xyXG4gICAgICAgICAgICAvLyDpooTliLbkvZPlkI3np7DnibnmrorkuIDngrnvvIzoioLngrnkv6Hmga/lubbkuI3ljIXlkKsgX25hbWVcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG92ZXJyaWRlSW5mbyA9IHNvdXJjZVtpZCArIDJdIGFzIGFueTtcclxuICAgICAgICAgICAgICAgIGlmIChvdmVycmlkZUluZm8uX190eXBlX18gPT09ICdDQ1Byb3BlcnR5T3ZlcnJpZGVJbmZvJykge1xyXG4gICAgICAgICAgICAgICAgICAgIG5vZGUucGF0aCA9IHBhcmVudFBhdGggPyBgJHtwYXJlbnRQYXRofS8ke292ZXJyaWRlSW5mby52YWx1ZX1gIDogb3ZlcnJpZGVJbmZvLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDnu4Tku7ZcclxuICAgICAgICBub2RlLmNvbXBvbmVudHMgPSBbXTtcclxuICAgICAgICBjb25zdCBzcmNDb21wb25lbnRzID0gc3JjTm9kZS5fY29tcG9uZW50cztcclxuICAgICAgICBpZiAoc3JjQ29tcG9uZW50cyAmJiBzcmNDb21wb25lbnRzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBzcmNDb21wb25lbnRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY29tcElkID0gc3JjQ29tcG9uZW50c1tpXS5fX2lkX187XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb21wb25lbnQgPSBleHRyYWN0VmFsaWRJbmZvKHNvdXJjZVtjb21wSWRdIGFzIEV4dHJhSW5mbyk7XHJcbiAgICAgICAgICAgICAgICBub2RlLmNvbXBvbmVudHMucHVzaChjb21wb25lbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDlrZDoioLngrlcclxuICAgICAgICBub2RlLmNoaWxkcmVuID0gW107XHJcbiAgICAgICAgY29uc3Qgc3JjQ2hpbGRyZW4gPSBzcmNOb2RlLl9jaGlsZHJlbjtcclxuICAgICAgICBpZiAoc3JjQ2hpbGRyZW4gJiYgc3JjQ2hpbGRyZW4ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHNyY0NoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgbm9kZUlkID0gc3JjQ2hpbGRyZW5baV0uX19pZF9fO1xyXG4gICAgICAgICAgICAgICAgY29udmVydE5vZGUoc291cmNlLCBub2RlSWQsIG5vZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDkv53lrZjliLDniLboioLngrlcclxuICAgICAgICBwYXJlbnQuY2hpbGRyZW4ucHVzaChub2RlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaPkOWPluacieaViOS/oeaBr++8iOWQq+aciSB1dWlk77yJXHJcbiAgICAgKiBAcGFyYW0ge0V4dHJhSW5mb30gc291cmNlIOa6kOaVsOaNrlxyXG4gICAgICogQHJldHVybnMge3sgX190eXBlX186IHN0cmluZywgX25hbWU6IHN0cmluZywgZmlsZUlkPzogc3RyaW5nIH19XHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGV4dHJhY3RWYWxpZEluZm8oc291cmNlOiBFeHRyYUluZm8pIHtcclxuICAgICAgICBjb25zdCByZXN1bHQ6IFRyZWVOb2RlRXh0cmFJbmZvID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcclxuICAgICAgICAvLyDorrDlvZXmnInnlKjnmoTlsZ7mgKdcclxuICAgICAgICBpZiAoc291cmNlLl9fdHlwZV9fICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgLy8g5aaC5p6c5pivY29tcG9uZW50IO+8jCDpgqPkuYjov5nkuKrlsLHmmK/nu4Tku7blkI1cclxuICAgICAgICAgICAgLy8g5aaC5p6c5piv6Ieq5a6a5LmJY29tcG9uZW5077yM6YKj5LmI6L+Z5Liq5bCx5piv6ISa5pys55qEdXVpZO+8iOWOi+e8qei/h+WQju+8iVxyXG4gICAgICAgICAgICByZXN1bHQuX190eXBlX18gPSBzb3VyY2UuX190eXBlX187XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChzb3VyY2UuX25hbWUgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXN1bHQuX25hbWUgPSBzb3VyY2UuX25hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChzb3VyY2UuZmlsZUlkICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmVzdWx0LmZpbGVJZCA9IHNvdXJjZS5maWxlSWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDorrDlvZXljIXlkKsgdXVpZCDnmoTlsZ7mgKdcclxuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBzb3VyY2UpIHtcclxuICAgICAgICAgICAgY29uc3QgdmFsID0gKHNvdXJjZSBhcyBhbnkpW2tleV07XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnRhaW5zID0gT2JqZWN0VXRpbC5jb250YWluc1Byb3BlcnR5KHZhbCwgJ19fdXVpZF9fJyk7XHJcbiAgICAgICAgICAgIGlmIChjb250YWlucykge1xyXG4gICAgICAgICAgICAgICAgKHJlc3VsdCBhcyBhbnkpW2tleV0gPSB2YWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIOKGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk+KGk1xyXG5pbnRlcmZhY2UgTm9kZUJhc2Uge1xyXG4gICAgLy9cclxuICAgIF9uYW1lOiBzdHJpbmc7XHJcbiAgICAvLyDorrDlvZXlrZDoioLngrnnmoTluo/lj7dcclxuICAgIF9jaGlsZHJlbjogeyBfX2lkX186IG51bWJlcjsgfVtdO1xyXG4gICAgLy8gP1xyXG4gICAgX3ByZWZhYjoge1xyXG4gICAgICAgIF9faWRfXzogbnVtYmVyO1xyXG4gICAgfVxyXG4gICAgaW5zdGFuY2U6IHtcclxuICAgICAgICBfX2lkX186IG51bWJlcjtcclxuICAgIH1cclxuICAgIC8vIOe7hOS7tlxyXG4gICAgX2NvbXBvbmVudHM6IHsgX19pZF9fOiBudW1iZXIgfVtdO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgUHJlZmFiTm9kZVJvb3QgZXh0ZW5kcyBOb2RlQmFzZSB7XHJcbiAgICBfX3R5cGVfXzogJ2NjLlByZWZhYic7XHJcbiAgICBkYXRhOiB7XHJcbiAgICAgICAgX19pZF9fOiBudW1iZXI7XHJcbiAgICB9XHJcbn1cclxuXHJcbmludGVyZmFjZSBTY2VuZU5vZGVSb290IGV4dGVuZHMgTm9kZUJhc2Uge1xyXG4gICAgX190eXBlX186ICdjYy5TY2VuZUFzc2V0JztcclxuICAgIHNjZW5lOiB7XHJcbiAgICAgICAgX19pZF9fOiBudW1iZXI7XHJcbiAgICB9XHJcbn1cclxuXHJcbmludGVyZmFjZSBTY2VuZU5vZGVTZWNvbmQgZXh0ZW5kcyBOb2RlQmFzZSB7XHJcbiAgICBfX3R5cGVfXzogJ2NjLlNjZW5lJztcclxufVxyXG5cclxuaW50ZXJmYWNlIE9yaWdpbmFsTm9kZSBleHRlbmRzIE5vZGVCYXNlIHtcclxuICAgIF9fdHlwZV9fOiAnY2MuTm9kZSc7XHJcbn1cclxuXHJcbmludGVyZmFjZSBFeHRyYUluZm8gZXh0ZW5kcyBOb2RlQmFzZSB7XHJcbiAgICBfX3R5cGVfXzogc3RyaW5nO1xyXG4gICAgZmlsZUlkOiBzdHJpbmc7XHJcbn1cclxuXHJcbnR5cGUgTm9kZUluZm8gPSBTY2VuZU5vZGVSb290IHwgU2NlbmVOb2RlU2Vjb25kIHwgUHJlZmFiTm9kZVJvb3QgfCBPcmlnaW5hbE5vZGUgfCBFeHRyYUluZm87XHJcblxyXG5cclxuLy8g4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaT4oaTXHJcbmV4cG9ydCBpbnRlcmZhY2UgVHJlZU5vZGVJbmZvIHtcclxuICAgIGlkOiBudW1iZXI7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICB0eXBlOiAnY2MuUHJlZmFiJyB8ICdjYy5TY2VuZSc7XHJcbiAgICBjaGlsZHJlbjogVHJlZU5vZGVJbmZvW107XHJcbiAgICAvLyDlrozmlbTnmoToioLngrnot6/lvoRcclxuICAgIHBhdGg/OiBzdHJpbmc7XHJcbiAgICAvL1xyXG4gICAgcHJlZmFiOiBUcmVlTm9kZUV4dHJhSW5mbztcclxuICAgIGNvbXBvbmVudHM6IFRyZWVOb2RlRXh0cmFJbmZvW107XHJcbn1cclxuXHJcbmludGVyZmFjZSBUcmVlTm9kZUV4dHJhSW5mbyB7XHJcbiAgICBfX3R5cGVfXzogc3RyaW5nO1xyXG4gICAgX25hbWU6IHN0cmluZztcclxuICAgIGZpbGVJZDogc3RyaW5nO1xyXG59Il19