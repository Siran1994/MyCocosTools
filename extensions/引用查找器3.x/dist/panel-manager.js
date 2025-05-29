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
exports.PanelManager = void 0;
const { calcWindowPositionByFocused } = require('./lib/eazax/window-util');
const { BrowserWindow } = require('electron');
const Path = __importStar(require("path"));
const i18n_1 = require("./i18n");
var PanelManager;
(function (PanelManager) {
    let settings = null;
    /**
     * 打开设置面板
     */
    function openSettingsPanel() {
        // 已打开则直接展示
        if (settings) {
            settings.show();
            return;
        }
        // 窗口尺寸和位置（macOS 标题栏高 28px）
        const winSize = [500, 450], winPos = calcWindowPositionByFocused(winSize, 'center');
        // 创建窗口
        const win = settings = new BrowserWindow({
            width: winSize[0],
            height: winSize[1],
            minWidth: winSize[0],
            minHeight: winSize[1],
            x: winPos[0],
            y: winPos[1] - 100,
            frame: true,
            title: `${i18n_1.I18n.t('name')} | Cocos Creator`,
            // 菜单，用来调试
            autoHideMenuBar: true,
            resizable: true,
            minimizable: false,
            maximizable: false,
            fullscreenable: false,
            skipTaskbar: false,
            alwaysOnTop: true,
            hasShadow: true,
            show: false,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
        });
        // 就绪后（展示，避免闪烁）
        win.on('ready-to-show', () => win.show());
        // 关闭后
        win.on('closed', () => (settings = null));
        // 监听按键
        win.webContents.on('before-input-event', (event, input) => {
            if (input.key === 'Escape')
                PanelManager.closeSettingsPanel();
        });
        // 调试用的 devtools
        // win.webContents.openDevTools({ mode: 'detach' });
        // 加载页面
        const path = Path.join(__dirname, './renderer/settings/index.html');
        win.loadURL(`file://${path}?lang=${Editor.I18n.getLanguage()}`);
    }
    PanelManager.openSettingsPanel = openSettingsPanel;
    /**
     * 关闭面板
     */
    function closeSettingsPanel() {
        if (!settings) {
            return;
        }
        settings.hide();
        settings.close();
        settings = null;
    }
    PanelManager.closeSettingsPanel = closeSettingsPanel;
})(PanelManager || (exports.PanelManager = PanelManager = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFuZWwtbWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NvdXJjZS9wYW5lbC1tYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsTUFBTSxFQUFFLDJCQUEyQixFQUFFLEdBQUcsT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDM0UsTUFBTSxFQUFFLGFBQWEsRUFBRSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUM5QywyQ0FBNkI7QUFDN0IsaUNBQThCO0FBRTlCLElBQWlCLFlBQVksQ0FrRTVCO0FBbEVELFdBQWlCLFlBQVk7SUFDekIsSUFBSSxRQUFRLEdBQVEsSUFBSSxDQUFDO0lBRXpCOztPQUVHO0lBQ0gsU0FBZ0IsaUJBQWlCO1FBQzdCLFdBQVc7UUFDWCxJQUFJLFFBQVEsRUFBRSxDQUFDO1lBQ1gsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2hCLE9BQU87UUFDWCxDQUFDO1FBQ0QsMkJBQTJCO1FBQzNCLE1BQU0sT0FBTyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUN0QixNQUFNLEdBQUcsMkJBQTJCLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzVELE9BQU87UUFDUCxNQUFNLEdBQUcsR0FBRyxRQUFRLEdBQUcsSUFBSSxhQUFhLENBQUM7WUFDckMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDakIsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDbEIsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDcEIsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDckIsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDWixDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUc7WUFDbEIsS0FBSyxFQUFFLElBQUk7WUFDWCxLQUFLLEVBQUUsR0FBRyxXQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0I7WUFDMUMsVUFBVTtZQUNWLGVBQWUsRUFBRSxJQUFJO1lBQ3JCLFNBQVMsRUFBRSxJQUFJO1lBQ2YsV0FBVyxFQUFFLEtBQUs7WUFDbEIsV0FBVyxFQUFFLEtBQUs7WUFDbEIsY0FBYyxFQUFFLEtBQUs7WUFDckIsV0FBVyxFQUFFLEtBQUs7WUFDbEIsV0FBVyxFQUFFLElBQUk7WUFDakIsU0FBUyxFQUFFLElBQUk7WUFDZixJQUFJLEVBQUUsS0FBSztZQUNYLGNBQWMsRUFBRTtnQkFDWixlQUFlLEVBQUUsSUFBSTtnQkFDckIsZ0JBQWdCLEVBQUUsS0FBSzthQUMxQjtTQUNKLENBQUMsQ0FBQztRQUNILGVBQWU7UUFDZixHQUFHLENBQUMsRUFBRSxDQUFDLGVBQWUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUMxQyxNQUFNO1FBQ04sR0FBRyxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUMxQyxPQUFPO1FBQ1AsR0FBRyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxLQUFVLEVBQUUsS0FBVSxFQUFFLEVBQUU7WUFDaEUsSUFBSSxLQUFLLENBQUMsR0FBRyxLQUFLLFFBQVE7Z0JBQUUsWUFBWSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFDbEUsQ0FBQyxDQUFDLENBQUM7UUFDSCxnQkFBZ0I7UUFDaEIsb0RBQW9EO1FBQ3BELE9BQU87UUFDUCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxnQ0FBZ0MsQ0FBQyxDQUFDO1FBQ3BFLEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxJQUFJLFNBQVMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDcEUsQ0FBQztJQS9DZSw4QkFBaUIsb0JBK0NoQyxDQUFBO0lBRUQ7O09BRUc7SUFDSCxTQUFnQixrQkFBa0I7UUFDOUIsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ1osT0FBTztRQUNYLENBQUM7UUFDRCxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDaEIsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2pCLFFBQVEsR0FBRyxJQUFJLENBQUM7SUFDcEIsQ0FBQztJQVBlLCtCQUFrQixxQkFPakMsQ0FBQTtBQUNMLENBQUMsRUFsRWdCLFlBQVksNEJBQVosWUFBWSxRQWtFNUIiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCB7IGNhbGNXaW5kb3dQb3NpdGlvbkJ5Rm9jdXNlZCB9ID0gcmVxdWlyZSgnLi9saWIvZWF6YXgvd2luZG93LXV0aWwnKTtcclxuY29uc3QgeyBCcm93c2VyV2luZG93IH0gPSByZXF1aXJlKCdlbGVjdHJvbicpO1xyXG5pbXBvcnQgKiBhcyBQYXRoIGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgeyBJMThuIH0gZnJvbSAnLi9pMThuJztcclxuXHJcbmV4cG9ydCBuYW1lc3BhY2UgUGFuZWxNYW5hZ2VyIHtcclxuICAgIGxldCBzZXR0aW5nczogYW55ID0gbnVsbDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOaJk+W8gOiuvue9rumdouadv1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gb3BlblNldHRpbmdzUGFuZWwoKSB7XHJcbiAgICAgICAgLy8g5bey5omT5byA5YiZ55u05o6l5bGV56S6XHJcbiAgICAgICAgaWYgKHNldHRpbmdzKSB7XHJcbiAgICAgICAgICAgIHNldHRpbmdzLnNob3coKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyDnqpflj6PlsLrlr7jlkozkvY3nva7vvIhtYWNPUyDmoIfpopjmoI/pq5ggMjhweO+8iVxyXG4gICAgICAgIGNvbnN0IHdpblNpemUgPSBbNTAwLCA0NTBdLFxyXG4gICAgICAgICAgICB3aW5Qb3MgPSBjYWxjV2luZG93UG9zaXRpb25CeUZvY3VzZWQod2luU2l6ZSwgJ2NlbnRlcicpO1xyXG4gICAgICAgIC8vIOWIm+W7uueql+WPo1xyXG4gICAgICAgIGNvbnN0IHdpbiA9IHNldHRpbmdzID0gbmV3IEJyb3dzZXJXaW5kb3coe1xyXG4gICAgICAgICAgICB3aWR0aDogd2luU2l6ZVswXSxcclxuICAgICAgICAgICAgaGVpZ2h0OiB3aW5TaXplWzFdLFxyXG4gICAgICAgICAgICBtaW5XaWR0aDogd2luU2l6ZVswXSxcclxuICAgICAgICAgICAgbWluSGVpZ2h0OiB3aW5TaXplWzFdLFxyXG4gICAgICAgICAgICB4OiB3aW5Qb3NbMF0sXHJcbiAgICAgICAgICAgIHk6IHdpblBvc1sxXSAtIDEwMCxcclxuICAgICAgICAgICAgZnJhbWU6IHRydWUsXHJcbiAgICAgICAgICAgIHRpdGxlOiBgJHtJMThuLnQoJ25hbWUnKX0gfCBDb2NvcyBDcmVhdG9yYCxcclxuICAgICAgICAgICAgLy8g6I+c5Y2V77yM55So5p2l6LCD6K+VXHJcbiAgICAgICAgICAgIGF1dG9IaWRlTWVudUJhcjogdHJ1ZSxcclxuICAgICAgICAgICAgcmVzaXphYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBtaW5pbWl6YWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgIG1heGltaXphYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgZnVsbHNjcmVlbmFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICBza2lwVGFza2JhcjogZmFsc2UsXHJcbiAgICAgICAgICAgIGFsd2F5c09uVG9wOiB0cnVlLFxyXG4gICAgICAgICAgICBoYXNTaGFkb3c6IHRydWUsXHJcbiAgICAgICAgICAgIHNob3c6IGZhbHNlLFxyXG4gICAgICAgICAgICB3ZWJQcmVmZXJlbmNlczoge1xyXG4gICAgICAgICAgICAgICAgbm9kZUludGVncmF0aW9uOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY29udGV4dElzb2xhdGlvbjogZmFsc2UsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy8g5bCx57uq5ZCO77yI5bGV56S677yM6YG/5YWN6Zeq54OB77yJXHJcbiAgICAgICAgd2luLm9uKCdyZWFkeS10by1zaG93JywgKCkgPT4gd2luLnNob3coKSk7XHJcbiAgICAgICAgLy8g5YWz6Zet5ZCOXHJcbiAgICAgICAgd2luLm9uKCdjbG9zZWQnLCAoKSA9PiAoc2V0dGluZ3MgPSBudWxsKSk7XHJcbiAgICAgICAgLy8g55uR5ZCs5oyJ6ZSuXHJcbiAgICAgICAgd2luLndlYkNvbnRlbnRzLm9uKCdiZWZvcmUtaW5wdXQtZXZlbnQnLCAoZXZlbnQ6IGFueSwgaW5wdXQ6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaW5wdXQua2V5ID09PSAnRXNjYXBlJykgUGFuZWxNYW5hZ2VyLmNsb3NlU2V0dGluZ3NQYW5lbCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vIOiwg+ivleeUqOeahCBkZXZ0b29sc1xyXG4gICAgICAgIC8vIHdpbi53ZWJDb250ZW50cy5vcGVuRGV2VG9vbHMoeyBtb2RlOiAnZGV0YWNoJyB9KTtcclxuICAgICAgICAvLyDliqDovb3pobXpnaJcclxuICAgICAgICBjb25zdCBwYXRoID0gUGF0aC5qb2luKF9fZGlybmFtZSwgJy4vcmVuZGVyZXIvc2V0dGluZ3MvaW5kZXguaHRtbCcpO1xyXG4gICAgICAgIHdpbi5sb2FkVVJMKGBmaWxlOi8vJHtwYXRofT9sYW5nPSR7RWRpdG9yLkkxOG4uZ2V0TGFuZ3VhZ2UoKX1gKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWFs+mXremdouadv1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gY2xvc2VTZXR0aW5nc1BhbmVsKCkge1xyXG4gICAgICAgIGlmICghc2V0dGluZ3MpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzZXR0aW5ncy5oaWRlKCk7XHJcbiAgICAgICAgc2V0dGluZ3MuY2xvc2UoKTtcclxuICAgICAgICBzZXR0aW5ncyA9IG51bGw7XHJcbiAgICB9XHJcbn0iXX0=