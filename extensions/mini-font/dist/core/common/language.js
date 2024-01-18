"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zh = require('../../../i18n/zh');
const en = require('../../../i18n/en');
exports.default = new class {
    /**
     * 获取多语言文本
     * @param {string} key 关键字
     * @returns {string}
     */
    get(key) {
        let lang = "en";
        try {
            lang = Editor.lang;
        }
        catch (error) {
        }
        if (lang === "zh") {
            return zh[key];
        }
        else {
            return en[key];
        }
    }
};
