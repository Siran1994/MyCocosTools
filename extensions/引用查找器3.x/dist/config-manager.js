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
exports.ConfigManager = void 0;
const Fs = __importStar(require("fs"));
const Path = __importStar(require("path"));
const PackageUtil = require('./lib/eazax/package-util');
/** 配置文件路径 */
const CONFIG_PATH = Path.join(__dirname, '../config.json');
/** package.json 的路径 */
const PACKAGE_PATH = Path.join(__dirname, '../package.json');
/** 包名 */
const PACKAGE_NAME = PackageUtil.name;
/** 快捷键行为 */
const ACTION_NAME = 'find';
/** package.json 中的菜单项 key */
const MENU_ITEM_KEY = `i18n:MAIN_MENU.package.title/i18n:${PACKAGE_NAME}.name/i18n:${PACKAGE_NAME}.${ACTION_NAME}`;
/**
 * 配置管理器
 */
exports.ConfigManager = {
    /**
     * 默认配置
     */
    get defaultConfig() {
        return {
            version: '1.1',
            printDetails: true,
            printFolding: true,
        };
    },
    /**
     * 读取配置
     */
    get() {
        // 配置
        const config = exports.ConfigManager.defaultConfig;
        if (Fs.existsSync(CONFIG_PATH)) {
            const localConfig = JSON.parse(Fs.readFileSync(CONFIG_PATH).toString());
            for (const key in config) {
                if (localConfig[key] !== undefined) {
                    config[key] = localConfig[key];
                }
            }
        }
        else {
        }
        // 快捷键
        config.hotkey = exports.ConfigManager.getAccelerator();
        // Done
        return config;
    },
    /**
     * 保存配置
     * @param {*} value 配置
     */
    set(value) {
        // 配置
        const config = exports.ConfigManager.defaultConfig;
        for (const key in config) {
            if (value[key] !== undefined) {
                config[key] = value[key];
            }
        }
        Fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
        // 快捷键
        exports.ConfigManager.setAccelerator(value.hotkey);
    },
    /**
     * 获取快捷键
     * @returns {string}
     */
    getAccelerator() {
        const packageCfg = JSON.parse(Fs.readFileSync(PACKAGE_PATH).toString()), item = packageCfg['contributions']['shortcuts'][0];
        return item['win'] || '';
    },
    /**
     * 设置快捷键
     * @param {string} value
     */
    setAccelerator(value) {
        const packageCfg = JSON.parse(Fs.readFileSync(PACKAGE_PATH).toString()), item = packageCfg['contributions']['shortcuts'][0];
        if (value !== undefined && value !== '') {
            item['win'] = value;
            item['mac'] = value;
        }
        else {
            item['win'] = '';
            item['mac'] = '';
        }
        Fs.writeFileSync(PACKAGE_PATH, JSON.stringify(packageCfg, null, 4));
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLW1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zb3VyY2UvY29uZmlnLW1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx1Q0FBeUI7QUFDekIsMkNBQTZCO0FBQzdCLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0FBRXhELGFBQWE7QUFDYixNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0FBRTNELHVCQUF1QjtBQUN2QixNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO0FBRTdELFNBQVM7QUFDVCxNQUFNLFlBQVksR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDO0FBRXRDLFlBQVk7QUFDWixNQUFNLFdBQVcsR0FBRyxNQUFNLENBQUM7QUFFM0IsNkJBQTZCO0FBQzdCLE1BQU0sYUFBYSxHQUFHLHFDQUFxQyxZQUFZLGNBQWMsWUFBWSxJQUFJLFdBQVcsRUFBRSxDQUFDO0FBRW5IOztHQUVHO0FBQ1UsUUFBQSxhQUFhLEdBQUc7SUFFekI7O09BRUc7SUFDSCxJQUFJLGFBQWE7UUFDYixPQUFPO1lBQ0gsT0FBTyxFQUFFLEtBQUs7WUFDZCxZQUFZLEVBQUUsSUFBSTtZQUNsQixZQUFZLEVBQUUsSUFBSTtTQUNyQixDQUFDO0lBQ04sQ0FBQztJQUVEOztPQUVHO0lBQ0gsR0FBRztRQUNDLEtBQUs7UUFDTCxNQUFNLE1BQU0sR0FBUSxxQkFBYSxDQUFDLGFBQWEsQ0FBQztRQUNoRCxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQztZQUM3QixNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztZQUN4RSxLQUFLLE1BQU0sR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFDO2dCQUN2QixJQUFJLFdBQVcsQ0FBQyxHQUFHLENBQUMsS0FBSyxTQUFTLEVBQUUsQ0FBQztvQkFDakMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbkMsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDO2FBQU0sQ0FBQztRQUNSLENBQUM7UUFFRCxNQUFNO1FBQ04sTUFBTSxDQUFDLE1BQU0sR0FBRyxxQkFBYSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBRS9DLE9BQU87UUFDUCxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsR0FBRyxDQUFDLEtBQVU7UUFDVixLQUFLO1FBQ0wsTUFBTSxNQUFNLEdBQVEscUJBQWEsQ0FBQyxhQUFhLENBQUM7UUFDaEQsS0FBSyxNQUFNLEdBQUcsSUFBSSxNQUFNLEVBQUUsQ0FBQztZQUN2QixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxTQUFTLEVBQUUsQ0FBQztnQkFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM3QixDQUFDO1FBQ0wsQ0FBQztRQUNELEVBQUUsQ0FBQyxhQUFhLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRS9ELE1BQU07UUFDTixxQkFBYSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVEOzs7T0FHRztJQUNILGNBQWM7UUFDVixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsRUFDbkUsSUFBSSxHQUFHLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2RCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUVEOzs7T0FHRztJQUNILGNBQWMsQ0FBQyxLQUFVO1FBQ3JCLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUNuRSxJQUFJLEdBQUcsVUFBVSxDQUFDLGVBQWUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELElBQUksS0FBSyxLQUFLLFNBQVMsSUFBSSxLQUFLLEtBQUssRUFBRSxFQUFFLENBQUM7WUFDdEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQztZQUNwQixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBQ3hCLENBQUM7YUFBTSxDQUFDO1lBQ0osSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3JCLENBQUM7UUFDRCxFQUFFLENBQUMsYUFBYSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN4RSxDQUFDO0NBRUosQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIEZzIGZyb20gJ2ZzJztcclxuaW1wb3J0ICogYXMgUGF0aCBmcm9tICdwYXRoJztcclxuY29uc3QgUGFja2FnZVV0aWwgPSByZXF1aXJlKCcuL2xpYi9lYXpheC9wYWNrYWdlLXV0aWwnKTtcclxuXHJcbi8qKiDphY3nva7mlofku7bot6/lvoQgKi9cclxuY29uc3QgQ09ORklHX1BBVEggPSBQYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vY29uZmlnLmpzb24nKTtcclxuXHJcbi8qKiBwYWNrYWdlLmpzb24g55qE6Lev5b6EICovXHJcbmNvbnN0IFBBQ0tBR0VfUEFUSCA9IFBhdGguam9pbihfX2Rpcm5hbWUsICcuLi9wYWNrYWdlLmpzb24nKTtcclxuXHJcbi8qKiDljIXlkI0gKi9cclxuY29uc3QgUEFDS0FHRV9OQU1FID0gUGFja2FnZVV0aWwubmFtZTtcclxuXHJcbi8qKiDlv6vmjbfplK7ooYzkuLogKi9cclxuY29uc3QgQUNUSU9OX05BTUUgPSAnZmluZCc7XHJcblxyXG4vKiogcGFja2FnZS5qc29uIOS4reeahOiPnOWNlemhuSBrZXkgKi9cclxuY29uc3QgTUVOVV9JVEVNX0tFWSA9IGBpMThuOk1BSU5fTUVOVS5wYWNrYWdlLnRpdGxlL2kxOG46JHtQQUNLQUdFX05BTUV9Lm5hbWUvaTE4bjoke1BBQ0tBR0VfTkFNRX0uJHtBQ1RJT05fTkFNRX1gO1xyXG5cclxuLyoqXHJcbiAqIOmFjee9rueuoeeQhuWZqFxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IENvbmZpZ01hbmFnZXIgPSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDpu5jorqTphY3nva5cclxuICAgICAqL1xyXG4gICAgZ2V0IGRlZmF1bHRDb25maWcoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgdmVyc2lvbjogJzEuMScsXHJcbiAgICAgICAgICAgIHByaW50RGV0YWlsczogdHJ1ZSxcclxuICAgICAgICAgICAgcHJpbnRGb2xkaW5nOiB0cnVlLFxyXG4gICAgICAgIH07XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6K+75Y+W6YWN572uXHJcbiAgICAgKi9cclxuICAgIGdldCgpIHtcclxuICAgICAgICAvLyDphY3nva5cclxuICAgICAgICBjb25zdCBjb25maWc6IGFueSA9IENvbmZpZ01hbmFnZXIuZGVmYXVsdENvbmZpZztcclxuICAgICAgICBpZiAoRnMuZXhpc3RzU3luYyhDT05GSUdfUEFUSCkpIHtcclxuICAgICAgICAgICAgY29uc3QgbG9jYWxDb25maWcgPSBKU09OLnBhcnNlKEZzLnJlYWRGaWxlU3luYyhDT05GSUdfUEFUSCkudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIGNvbmZpZykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGxvY2FsQ29uZmlnW2tleV0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZ1trZXldID0gbG9jYWxDb25maWdba2V5XTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDlv6vmjbfplK5cclxuICAgICAgICBjb25maWcuaG90a2V5ID0gQ29uZmlnTWFuYWdlci5nZXRBY2NlbGVyYXRvcigpO1xyXG5cclxuICAgICAgICAvLyBEb25lXHJcbiAgICAgICAgcmV0dXJuIGNvbmZpZztcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDkv53lrZjphY3nva5cclxuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUg6YWN572uXHJcbiAgICAgKi9cclxuICAgIHNldCh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgLy8g6YWN572uXHJcbiAgICAgICAgY29uc3QgY29uZmlnOiBhbnkgPSBDb25maWdNYW5hZ2VyLmRlZmF1bHRDb25maWc7XHJcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gY29uZmlnKSB7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZVtrZXldICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGNvbmZpZ1trZXldID0gdmFsdWVba2V5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBGcy53cml0ZUZpbGVTeW5jKENPTkZJR19QQVRILCBKU09OLnN0cmluZ2lmeShjb25maWcsIG51bGwsIDIpKTtcclxuXHJcbiAgICAgICAgLy8g5b+r5o236ZSuXHJcbiAgICAgICAgQ29uZmlnTWFuYWdlci5zZXRBY2NlbGVyYXRvcih2YWx1ZS5ob3RrZXkpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPluW/q+aNt+mUrlxyXG4gICAgICogQHJldHVybnMge3N0cmluZ31cclxuICAgICAqL1xyXG4gICAgZ2V0QWNjZWxlcmF0b3IoKSB7XHJcbiAgICAgICAgY29uc3QgcGFja2FnZUNmZyA9IEpTT04ucGFyc2UoRnMucmVhZEZpbGVTeW5jKFBBQ0tBR0VfUEFUSCkudG9TdHJpbmcoKSksXHJcbiAgICAgICAgICAgIGl0ZW0gPSBwYWNrYWdlQ2ZnWydjb250cmlidXRpb25zJ11bJ3Nob3J0Y3V0cyddWzBdO1xyXG4gICAgICAgIHJldHVybiBpdGVtWyd3aW4nXSB8fCAnJztcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDorr7nva7lv6vmjbfplK5cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZVxyXG4gICAgICovXHJcbiAgICBzZXRBY2NlbGVyYXRvcih2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgY29uc3QgcGFja2FnZUNmZyA9IEpTT04ucGFyc2UoRnMucmVhZEZpbGVTeW5jKFBBQ0tBR0VfUEFUSCkudG9TdHJpbmcoKSksXHJcbiAgICAgICAgICAgIGl0ZW0gPSBwYWNrYWdlQ2ZnWydjb250cmlidXRpb25zJ11bJ3Nob3J0Y3V0cyddWzBdO1xyXG4gICAgICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSAnJykge1xyXG4gICAgICAgICAgICBpdGVtWyd3aW4nXSA9IHZhbHVlO1xyXG4gICAgICAgICAgICBpdGVtWydtYWMnXSA9IHZhbHVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGl0ZW1bJ3dpbiddID0gJyc7XHJcbiAgICAgICAgICAgIGl0ZW1bJ21hYyddID0gJyc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIEZzLndyaXRlRmlsZVN5bmMoUEFDS0FHRV9QQVRILCBKU09OLnN0cmluZ2lmeShwYWNrYWdlQ2ZnLCBudWxsLCA0KSk7XHJcbiAgICB9LFxyXG5cclxufTsiXX0=