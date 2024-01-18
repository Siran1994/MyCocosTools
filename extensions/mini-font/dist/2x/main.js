"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = __importDefault(require("../core/main"));
module.exports = new class {
    constructor() {
        this.messages = {
            'open-panel'() {
                Editor.Panel.open('mini-font.setting');
            },
        };
    }
    //当package被正确加载的时候执行
    load() {
        Editor.Builder.on('build-start', this.funOnBuildStart);
        Editor.Builder.on('build-finished', this.funOnBuildFinished);
    }
    //当package被正确卸载的时候执行
    unload() {
        Editor.Builder.removeListener('build-start', this.funOnBuildStart);
        Editor.Builder.removeListener('build-finished', this.funOnBuildFinished);
    }
    funOnBuildStart(options, callback) {
        callback();
    }
    funOnBuildFinished(options, callback) {
        try {
            new main_1.default(Editor.App.version, options.dest, options.dest);
        }
        catch (error) {
            Editor.error(error);
        }
        callback();
    }
};
