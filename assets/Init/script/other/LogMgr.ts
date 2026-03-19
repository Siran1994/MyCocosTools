/**
 * 日志管理器
 */
export class LogManager {
    private static _instance: LogManager;
    private _enabled: boolean = true;

    private constructor() { }

    /**
     * 获取单例实例
     */
    public static getInstance(): LogManager {
        if (!this._instance) {
            this._instance = new LogManager();
        }
        return this._instance;
    }

    /**
     * 设置日志功能开关
     * @param enabled true开启日志，false关闭日志
     */
    public setEnabled(enabled: boolean): void {
        this._enabled = enabled;
        this.log(`日志功能已${enabled ? '开启' : '关闭'}`);
    }

    /**
     * 获取日志功能开关状态
     */
    public isEnabled(): boolean {
        return this._enabled;
    }

    /**
     * 输出普通日志
     * @param args 日志参数
     */
    public log(...args: any[]): void {
        if (this._enabled) {
            console.log(...args);
        }
    }

    /**
     * 输出信息日志
     * @param args 日志参数
     */
    public info(...args: any[]): void {
        if (this._enabled) {
            console.info(...args);
        }
    }

    /**
     * 输出警告日志
     * @param args 日志参数
     */
    public warn(...args: any[]): void {
        if (this._enabled) {
            console.warn(...args);
        }
    }

    /**
     * 输出错误日志
     * @param args 日志参数
     */
    public error(...args: any[]): void {
        if (this._enabled) {
            console.error(...args);
        }
    }

    /**
     * 输出调试日志
     * @param args 日志参数
     */
    public debug(...args: any[]): void {
        if (this._enabled) {
            console.debug(...args);
        }
    }

    /**
     * 清空控制台
     */
    public clear(): void {
        if (this._enabled) {
            console.clear();
        }
    }

    /**
     * 打印调用堆栈
     * @param args 日志参数
     */
    public trace(...args: any[]): void {
        if (this._enabled) {
            console.trace(...args);
        }
    }

    /**
     * 计时开始
     * @param label 计时标签
     */
    public time(label?: string): void {
        if (this._enabled) {
            console.time(label);
        }
    }

    /**
     * 计时结束
     * @param label 计时标签
     */
    public timeEnd(label?: string): void {
        if (this._enabled) {
            console.timeEnd(label);
        }
    }

    /**
     * 打印表格
     * @param tabularData 表格数据
     * @param properties 属性列表
     */
    public table(tabularData: any, properties?: string[]): void {
        if (this._enabled) {
            console.table(tabularData, properties);
        }
    }

    /**
     * 开始分组
     * @param label 分组标签
     */
    public group(label?: string): void {
        if (this._enabled) {
            console.group(label);
        }
    }

    /**
     * 结束分组
     */
    public groupEnd(): void {
        if (this._enabled) {
            console.groupEnd();
        }
    }

    /**
     * 条件断言
     * @param value 条件
     * @param message 断言消息
     * @param args 其他参数
     */
    public assert(value: any, message?: string, ...args: any[]): void {
        if (this._enabled) {
            console.assert(value, message, ...args);
        }
    }
}

export const LogMgr = LogManager.getInstance();