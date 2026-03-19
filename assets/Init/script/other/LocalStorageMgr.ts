// LocalStorageManager.ts

import { LogMgr } from "./LogMgr";

const STORAGE_PREFIX = "game_"; // 存储键名前缀，避免与其他应用冲突

export class LocalStorageManager {
    private static _instance: LocalStorageManager = null;
    private _encryptionKey: string = null; // 简单加密密钥

    public static getInstance(): LocalStorageManager {
        if (!this._instance) {
            this._instance = new LocalStorageManager();
        }
        return this._instance;
    }

    /**
     * 设置加密密钥（可选）
     * @param key 加密密钥
     */
    public setEncryptionKey(key: string): void {
        this._encryptionKey = key;
    }

    /**
     * 存储数据
     * @param key 存储键名
     * @param value 存储值（支持string, number, boolean, object）
     * @param useEncryption 是否使用加密（需要先设置加密密钥）
     */
    public setItem(key: string, value: any, useEncryption: boolean = false): boolean {
        try {
            const fullKey = STORAGE_PREFIX + key;
            let dataToStore = value;

            // 处理对象类型
            if (typeof value === 'object') {
                dataToStore = JSON.stringify(value);
            }

            // 加密处理
            if (useEncryption && this._encryptionKey) {
                dataToStore = this.simpleEncrypt(dataToStore.toString(), this._encryptionKey);
            }

            localStorage.setItem(fullKey, dataToStore.toString());
            return true;
        } catch (error) {
            LogMgr.error("LocalStorageManager setItem error:", error);
            return false;
        }
    }

    /**
     * 获取数据
     * @param key 存储键名
     * @param defaultValue 默认值（当获取失败时返回）
     * @param useDecryption 是否需要解密（需要先设置加密密钥）
     */
    public getItem(key: string, defaultValue: any = null, useDecryption: boolean = false): any {
        try {
            const fullKey = STORAGE_PREFIX + key;
            let data = localStorage.getItem(fullKey);

            if (data === null) {
                return defaultValue;
            }

            // 解密处理
            if (useDecryption && this._encryptionKey) {
                data = this.simpleDecrypt(data, this._encryptionKey);
            }

            // 尝试解析JSON
            try {
                return JSON.parse(data);
            } catch (e) {
                // 如果不是JSON字符串，直接返回
                return data;
            }
        } catch (error) {
            LogMgr.error("LocalStorageManager getItem error:", error);
            return defaultValue;
        }
    }

    /**
     * 删除指定数据
     * @param key 存储键名
     */
    public removeItem(key: string): boolean {
        try {
            const fullKey = STORAGE_PREFIX + key;
            localStorage.removeItem(fullKey);
            return true;
        } catch (error) {
            LogMgr.error("LocalStorageManager removeItem error:", error);
            return false;
        }
    }

    /**
     * 清空所有带有前缀的数据
     */
    public clear(): boolean {
        try {
            const keysToRemove: string[] = [];

            // 遍历所有存储项，只删除带有前缀的项
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(STORAGE_PREFIX)) {
                    keysToRemove.push(key);
                }
            }

            // 删除找到的项
            keysToRemove.forEach(key => {
                localStorage.removeItem(key);
            });

            return true;
        } catch (error) {
            LogMgr.error("LocalStorageManager clear error:", error);
            return false;
        }
    }

    /**
     * 获取所有存储的键名
     */
    public getAllKeys(): string[] {
        const keys: string[] = [];

        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(STORAGE_PREFIX)) {
                    // 移除前缀返回
                    keys.push(key.substring(STORAGE_PREFIX.length));
                }
            }
        } catch (error) {
            LogMgr.error("LocalStorageManager getAllKeys error:", error);
        }

        return keys;
    }

    /**
 * 简单加密方法（注意：这不是真正的安全加密，只是简单混淆）
 * @param data 要加密的数据
 * @param key 加密密钥
 */
    private simpleEncrypt(data: string, key: string): string {
        let result = '';
        for (let i = 0; i < data.length; i++) {
            const charCode = data.charCodeAt(i) ^ key.charCodeAt(i % key.length);
            result += String.fromCharCode(charCode);
        }
        // 解决btoa中文报错
        const latin1Result = unescape(encodeURIComponent(result));
        return btoa(latin1Result); // 转换为base64
    }

    /**
     * 简单解密方法
     * @param data 要解密的数据
     * @param key 解密密钥
     */
    private simpleDecrypt(data: string, key: string): string {
        try {
            // 先base64解码，再转回原始字符串
            const decodedData = decodeURIComponent(escape(atob(data)));
            let result = '';
            for (let i = 0; i < decodedData.length; i++) {
                const charCode = decodedData.charCodeAt(i) ^ key.charCodeAt(i % key.length);
                result += String.fromCharCode(charCode);
            }
            return result;
        } catch (error) {
            LogMgr.error("Decryption error:", error);
            return data; // 如果解密失败，返回原始数据
        }
    }
}

// 导出单例
export const LocalStorageMgr = LocalStorageManager.getInstance();