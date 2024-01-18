"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unload = exports.load = exports.onAfterBuild = void 0;
const cache_1 = __importDefault(require("../core/common/cache"));
const main_1 = __importDefault(require("../core/main"));
exports.onAfterBuild = async function (options, result) {
    if (!cache_1.default.get().enabled) {
        return;
    }
    try {
        new main_1.default(Editor.App.version, result.dest, result.dest);
    }
    catch (error) {
        console.error(error);
    }
};
exports.load = async function () {
    // console.log(`[${PACKAGE_NAME}] Unload cocos plugin example in builder.`);
};
exports.unload = async function () {
    // console.log(`[${PACKAGE_NAME}] Unload cocos plugin example in builder.`);
};
