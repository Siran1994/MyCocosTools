"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = void 0;
exports.load = load;
exports.unload = unload;
const finder_1 = require("./finder");
const i18n_1 = require("./i18n");
const logger_1 = require("./logger");
const panel_manager_1 = require("./panel-manager");
const parser_1 = require("./parser");
const printer_1 = require("./printer");
const MainEvent = require('./lib/eazax/main-event');
const { reload } = require('./lib/eazax/editor-main-util');
/**
 * @en Registration method for the main process of Extension
 * @zh 为扩展的主进程的注册方法
 */
exports.methods = {
    /**
     * 查找引用
     */
    async findCurrentSelection() {
        // 获取选中资源
        // asset
        const lastSelectType = Editor.Selection.getLastSelectedType();
        // uuid
        const lastSelectUuid = Editor.Selection.getLastSelected(lastSelectType);
        // uuid
        const lastSelectUuids = Editor.Selection.getSelected(lastSelectType);
        (0, logger_1.print)('log', `lastSelectType:${lastSelectType} lastSelectUuid:${lastSelectUuid}`);
        (0, logger_1.print)('log', `lastSelectType:${lastSelectType} lastSelectUuids:${JSON.stringify(lastSelectUuids)}`);
        const uuids = lastSelectUuids;
        const tmpAssetInfoMap = {};
        for (let i = 0; i < uuids.length; i++) {
            const uuid = uuids[i];
            const assetInfo = await Editor.Message.request('asset-db', 'query-asset-info', uuid);
            if (!assetInfo) {
                (0, logger_1.print)('error', `找不到资源信息${uuid}`);
                continue;
            }
            (0, logger_1.print)('log', `资源详情：${JSON.stringify(assetInfo, null, 4)}`);
            if (assetInfo.isDirectory) {
                // 文件夹不用
                uuids.splice(i--);
            }
            else {
                tmpAssetInfoMap[uuid] = assetInfo;
            }
        }
        // 未选择资源
        if (uuids.length === 0) {
            (0, logger_1.print)('log', i18n_1.I18n.t('please-select-assets'));
            return;
        }
        // 遍历查找
        for (let i = 0; i < uuids.length; i++) {
            const uuid = uuids[i];
            // 读取缓存
            let assetInfo = tmpAssetInfoMap[uuid];
            if (!assetInfo) {
                // 再查找一次
                assetInfo = await Editor.Message.request('asset-db', 'query-asset-info', uuid);
            }
            if (!assetInfo) {
                continue;
            }
            // 去掉前缀
            const shortUrl = assetInfo.url.replace('db://', '');
            // 查找引用
            (0, logger_1.print)('info', '🔍', `${i18n_1.I18n.t('find-asset-refs')} ${shortUrl}`);
            const refs = await finder_1.Finder.findByUuid(assetInfo);
            if (refs.length === 0) {
                (0, logger_1.print)('info', '📂', `${i18n_1.I18n.t('no-refs')} ${shortUrl}`);
                continue;
            }
            // 打印结果
            printer_1.Printer.printResult({
                type: assetInfo.type,
                uuid,
                url: assetInfo.url,
                path: assetInfo.path,
                refs,
            });
        }
    },
    /**
     * 打开设置面板
     */
    openSettingsPanel() {
        panel_manager_1.PanelManager.openSettingsPanel();
    },
    /**
     * 场景编辑器就绪后
     */
    onSceneReady() {
        // 自动检查更新
        // const config = ConfigManager.get();
        // if (config.autoCheckUpdate) {
        //     checkUpdate(false);
        // }
    },
    /**
     * 资源变化回调
     */
    async onAssetChanged(uuid) {
        //
        const assetInfo = await Editor.Message.request('asset-db', 'query-asset-info', uuid);
        const { type, url, file } = assetInfo;
        // 场景和预制体
        if (type === 'cc.SceneAsset' || type === 'cc.Prefab') {
            // 排除内置资源
            if (url.indexOf('db://internal') !== -1) {
                return;
            }
            // 更新节点树
            await parser_1.Parser.updateCache(file);
        }
    }
};
/**
 * @en Method Triggered on Extension Startup
 * @zh 扩展启动时触发的方法
 */
function load() {
    // 修改快捷键之后需要重新加载
    MainEvent.on('reload', () => {
        reload();
    });
}
/**
 * @en Method triggered when uninstalling the extension
 * @zh 卸载扩展时触发的方法
 */
function unload() { }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NvdXJjZS9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQTZIQSxvQkFLQztBQU1ELHdCQUE0QjtBQXZJNUIscUNBQWtDO0FBQ2xDLGlDQUE4QjtBQUM5QixxQ0FBaUM7QUFDakMsbURBQStDO0FBQy9DLHFDQUFrQztBQUNsQyx1Q0FBb0M7QUFDcEMsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLHdCQUF3QixDQUFDLENBQUM7QUFDcEQsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO0FBRTNEOzs7R0FHRztBQUNVLFFBQUEsT0FBTyxHQUE0QztJQUM1RDs7T0FFRztJQUNILEtBQUssQ0FBQyxvQkFBb0I7UUFFdEIsU0FBUztRQUNULFFBQVE7UUFDUixNQUFNLGNBQWMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFDOUQsT0FBTztRQUNQLE1BQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3hFLE9BQU87UUFDUCxNQUFNLGVBQWUsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNyRSxJQUFBLGNBQUssRUFBQyxLQUFLLEVBQUUsa0JBQWtCLGNBQWMsbUJBQW1CLGNBQWMsRUFBRSxDQUFDLENBQUM7UUFDbEYsSUFBQSxjQUFLLEVBQUMsS0FBSyxFQUFFLGtCQUFrQixjQUFjLG9CQUFvQixJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUVwRyxNQUFNLEtBQUssR0FBRyxlQUFlLENBQUM7UUFDOUIsTUFBTSxlQUFlLEdBQTJCLEVBQUUsQ0FBQztRQUNuRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0s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LFNBQVM7UUFDVCxzQ0FBc0M7UUFDdEMsZ0NBQWdDO1FBQ2hDLDBCQUEwQjtRQUMxQixJQUFJO0lBQ1IsQ0FBQztJQUVEOztPQUVHO0lBQ0gsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFZO1FBQzdCLEVBQUU7UUFDRixNQUFNLFNBQVMsR0FBRyxNQUFNLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxrQkFBa0IsRUFBRSxJQUFJLENBQWMsQ0FBQztRQUNsRyxNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxTQUFTLENBQUM7UUFDdEMsU0FBUztRQUNULElBQUksSUFBSSxLQUFLLGVBQWUsSUFBSSxJQUFJLEtBQUssV0FBVyxFQUFFLENBQUM7WUFDbkQsU0FBUztZQUNULElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDO2dCQUN0QyxPQUFPO1lBQ1gsQ0FBQztZQUNELFFBQVE7WUFDUixNQUFNLGVBQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkMsQ0FBQztJQUNMLENBQUM7Q0FDSixDQUFDO0FBRUY7OztHQUdHO0FBQ0gsU0FBZ0IsSUFBSTtJQUNoQixnQkFBZ0I7SUFDaEIsU0FBUyxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFO1FBQ3hCLE1BQU0sRUFBRSxDQUFDO0lBQ2IsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBRUQ7OztHQUdHO0FBQ0gsU0FBZ0IsTUFBTSxLQUFLLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBc3NldEluZm8gfSBmcm9tICdAY29jb3MvY3JlYXRvci10eXBlcy9lZGl0b3IvcGFja2FnZXMvYXNzZXQtZGIvQHR5cGVzL3B1YmxpYyc7XHJcbmltcG9ydCB7IEZpbmRlciB9IGZyb20gJy4vZmluZGVyJztcclxuaW1wb3J0IHsgSTE4biB9IGZyb20gJy4vaTE4bic7XHJcbmltcG9ydCB7IHByaW50IH0gZnJvbSAnLi9sb2dnZXInO1xyXG5pbXBvcnQgeyBQYW5lbE1hbmFnZXIgfSBmcm9tICcuL3BhbmVsLW1hbmFnZXInO1xyXG5pbXBvcnQgeyBQYXJzZXIgfSBmcm9tICcuL3BhcnNlcic7XHJcbmltcG9ydCB7IFByaW50ZXIgfSBmcm9tICcuL3ByaW50ZXInO1xyXG5jb25zdCBNYWluRXZlbnQgPSByZXF1aXJlKCcuL2xpYi9lYXpheC9tYWluLWV2ZW50Jyk7XHJcbmNvbnN0IHsgcmVsb2FkIH0gPSByZXF1aXJlKCcuL2xpYi9lYXpheC9lZGl0b3ItbWFpbi11dGlsJyk7XHJcblxyXG4vKipcclxuICogQGVuIFJlZ2lzdHJhdGlvbiBtZXRob2QgZm9yIHRoZSBtYWluIHByb2Nlc3Mgb2YgRXh0ZW5zaW9uXHJcbiAqIEB6aCDkuLrmianlsZXnmoTkuLvov5vnqIvnmoTms6jlhozmlrnms5VcclxuICovXHJcbmV4cG9ydCBjb25zdCBtZXRob2RzOiB7IFtrZXk6IHN0cmluZ106ICguLi5hbnk6IGFueSkgPT4gYW55IH0gPSB7XHJcbiAgICAvKipcclxuICAgICAqIOafpeaJvuW8leeUqFxyXG4gICAgICovXHJcbiAgICBhc3luYyBmaW5kQ3VycmVudFNlbGVjdGlvbigpIHtcclxuXHJcbiAgICAgICAgLy8g6I635Y+W6YCJ5Lit6LWE5rqQXHJcbiAgICAgICAgLy8gYXNzZXRcclxuICAgICAgICBjb25zdCBsYXN0U2VsZWN0VHlwZSA9IEVkaXRvci5TZWxlY3Rpb24uZ2V0TGFzdFNlbGVjdGVkVHlwZSgpO1xyXG4gICAgICAgIC8vIHV1aWRcclxuICAgICAgICBjb25zdCBsYXN0U2VsZWN0VXVpZCA9IEVkaXRvci5TZWxlY3Rpb24uZ2V0TGFzdFNlbGVjdGVkKGxhc3RTZWxlY3RUeXBlKTtcclxuICAgICAgICAvLyB1dWlkXHJcbiAgICAgICAgY29uc3QgbGFzdFNlbGVjdFV1aWRzID0gRWRpdG9yLlNlbGVjdGlvbi5nZXRTZWxlY3RlZChsYXN0U2VsZWN0VHlwZSk7XHJcbiAgICAgICAgcHJpbnQoJ2xvZycsIGBsYXN0U2VsZWN0VHlwZToke2xhc3RTZWxlY3RUeXBlfSBsYXN0U2VsZWN0VXVpZDoke2xhc3RTZWxlY3RVdWlkfWApO1xyXG4gICAgICAgIHByaW50KCdsb2cnLCBgbGFzdFNlbGVjdFR5cGU6JHtsYXN0U2VsZWN0VHlwZX0gbGFzdFNlbGVjdFV1aWRzOiR7SlNPTi5zdHJpbmdpZnkobGFzdFNlbGVjdFV1aWRzKX1gKTtcclxuXHJcbiAgICAgICAgY29uc3QgdXVpZHMgPSBsYXN0U2VsZWN0VXVpZHM7XHJcbiAgICAgICAgY29uc3QgdG1wQXNzZXRJbmZvTWFwOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ID0ge307XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB1dWlkcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCB1dWlkID0gdXVpZHNbaV07XHJcbiAgICAgICAgICAgIGNvbnN0IGFzc2V0SW5mbyA9IGF3YWl0IEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ2Fzc2V0LWRiJywgJ3F1ZXJ5LWFzc2V0LWluZm8nLCB1dWlkKTtcclxuICAgICAgICAgICAgaWYgKCFhc3NldEluZm8pIHtcclxuICAgICAgICAgICAgICAgIHByaW50KCdlcnJvcicsIGDmib7kuI3liLDotYTmupDkv6Hmga8ke3V1aWR9YCk7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwcmludCgnbG9nJywgYOi1hOa6kOivpuaDhe+8miR7SlNPTi5zdHJpbmdpZnkoYXNzZXRJbmZvLCBudWxsLCA0KX1gKTtcclxuICAgICAgICAgICAgaWYgKGFzc2V0SW5mby5pc0RpcmVjdG9yeSkge1xyXG4gICAgICAgICAgICAgICAgLy8g5paH5Lu25aS55LiN55SoXHJcbiAgICAgICAgICAgICAgICB1dWlkcy5zcGxpY2UoaS0tKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRtcEFzc2V0SW5mb01hcFt1dWlkXSA9IGFzc2V0SW5mbztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyDmnKrpgInmi6notYTmupBcclxuICAgICAgICBpZiAodXVpZHMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHByaW50KCdsb2cnLCBJMThuLnQoJ3BsZWFzZS1zZWxlY3QtYXNzZXRzJykpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIOmBjeWOhuafpeaJvlxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdXVpZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgdXVpZCA9IHV1aWRzW2ldO1xyXG4gICAgICAgICAgICAvLyDor7vlj5bnvJPlrZhcclxuICAgICAgICAgICAgbGV0IGFzc2V0SW5mbzogQXNzZXRJbmZvID0gdG1wQXNzZXRJbmZvTWFwW3V1aWRdO1xyXG4gICAgICAgICAgICBpZiAoIWFzc2V0SW5mbykge1xyXG4gICAgICAgICAgICAgICAgLy8g5YaN5p+l5om+5LiA5qyhXHJcbiAgICAgICAgICAgICAgICBhc3NldEluZm8gPSBhd2FpdCBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdhc3NldC1kYicsICdxdWVyeS1hc3NldC1pbmZvJywgdXVpZCkgYXMgQXNzZXRJbmZvO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghYXNzZXRJbmZvKSB7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyDljrvmjonliY3nvIBcclxuICAgICAgICAgICAgY29uc3Qgc2hvcnRVcmwgPSBhc3NldEluZm8udXJsLnJlcGxhY2UoJ2RiOi8vJywgJycpO1xyXG4gICAgICAgICAgICAvLyDmn6Xmib7lvJXnlKhcclxuICAgICAgICAgICAgcHJpbnQoJ2luZm8nLCAn8J+UjScsIGAke0kxOG4udCgnZmluZC1hc3NldC1yZWZzJyl9ICR7c2hvcnRVcmx9YCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlZnMgPSBhd2FpdCBGaW5kZXIuZmluZEJ5VXVpZChhc3NldEluZm8pO1xyXG4gICAgICAgICAgICBpZiAocmVmcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHByaW50KCdpbmZvJywgJ/Cfk4InLCBgJHtJMThuLnQoJ25vLXJlZnMnKX0gJHtzaG9ydFVybH1gKTtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIOaJk+WNsOe7k+aenFxyXG4gICAgICAgICAgICBQcmludGVyLnByaW50UmVzdWx0KHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IGFzc2V0SW5mby50eXBlLFxyXG4gICAgICAgICAgICAgICAgdXVpZCxcclxuICAgICAgICAgICAgICAgIHVybDogYXNzZXRJbmZvLnVybCxcclxuICAgICAgICAgICAgICAgIHBhdGg6IGFzc2V0SW5mby5wYXRoLFxyXG4gICAgICAgICAgICAgICAgcmVmcyxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIOaJk+W8gOiuvue9rumdouadv1xyXG4gICAgICovXHJcbiAgICBvcGVuU2V0dGluZ3NQYW5lbCgpIHtcclxuICAgICAgICBQYW5lbE1hbmFnZXIub3BlblNldHRpbmdzUGFuZWwoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlnLrmma/nvJbovpHlmajlsLHnu6rlkI5cclxuICAgICAqL1xyXG4gICAgb25TY2VuZVJlYWR5KCkge1xyXG4gICAgICAgIC8vIOiHquWKqOajgOafpeabtOaWsFxyXG4gICAgICAgIC8vIGNvbnN0IGNvbmZpZyA9IENvbmZpZ01hbmFnZXIuZ2V0KCk7XHJcbiAgICAgICAgLy8gaWYgKGNvbmZpZy5hdXRvQ2hlY2tVcGRhdGUpIHtcclxuICAgICAgICAvLyAgICAgY2hlY2tVcGRhdGUoZmFsc2UpO1xyXG4gICAgICAgIC8vIH1cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDotYTmupDlj5jljJblm57osINcclxuICAgICAqL1xyXG4gICAgYXN5bmMgb25Bc3NldENoYW5nZWQodXVpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgLy9cclxuICAgICAgICBjb25zdCBhc3NldEluZm8gPSBhd2FpdCBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdhc3NldC1kYicsICdxdWVyeS1hc3NldC1pbmZvJywgdXVpZCkgYXMgQXNzZXRJbmZvO1xyXG4gICAgICAgIGNvbnN0IHsgdHlwZSwgdXJsLCBmaWxlIH0gPSBhc3NldEluZm87XHJcbiAgICAgICAgLy8g5Zy65pmv5ZKM6aKE5Yi25L2TXHJcbiAgICAgICAgaWYgKHR5cGUgPT09ICdjYy5TY2VuZUFzc2V0JyB8fCB0eXBlID09PSAnY2MuUHJlZmFiJykge1xyXG4gICAgICAgICAgICAvLyDmjpLpmaTlhoXnva7otYTmupBcclxuICAgICAgICAgICAgaWYgKHVybC5pbmRleE9mKCdkYjovL2ludGVybmFsJykgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8g5pu05paw6IqC54K55qCRXHJcbiAgICAgICAgICAgIGF3YWl0IFBhcnNlci51cGRhdGVDYWNoZShmaWxlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG4vKipcclxuICogQGVuIE1ldGhvZCBUcmlnZ2VyZWQgb24gRXh0ZW5zaW9uIFN0YXJ0dXBcclxuICogQHpoIOaJqeWxleWQr+WKqOaXtuinpuWPkeeahOaWueazlVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGxvYWQoKSB7XHJcbiAgICAvLyDkv67mlLnlv6vmjbfplK7kuYvlkI7pnIDopoHph43mlrDliqDovb1cclxuICAgIE1haW5FdmVudC5vbigncmVsb2FkJywgKCkgPT4ge1xyXG4gICAgICAgIHJlbG9hZCgpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZW4gTWV0aG9kIHRyaWdnZXJlZCB3aGVuIHVuaW5zdGFsbGluZyB0aGUgZXh0ZW5zaW9uXHJcbiAqIEB6aCDljbjovb3mianlsZXml7bop6blj5HnmoTmlrnms5VcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiB1bmxvYWQoKSB7IH0iXX0=