"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const vue_1 = require("vue");
const cache_1 = __importDefault(require("../../core/common/cache"));
module.exports = Editor.Panel.define({
    listeners: {
        show() { console.log('show'); },
        hide() { console.log('hide'); },
    },
    template: fs_1.readFileSync(path_1.join(__dirname, '../../../static/template/default/index.html'), 'utf-8'),
    style: fs_1.readFileSync(path_1.join(__dirname, '../../../static/style/default/index.css'), 'utf-8'),
    $: {
        app: '#app',
        text: '#text',
    },
    methods: {
        hello() {
        },
    },
    ready() {
        let data = cache_1.default.get();
        if (this.$.app) {
            const app = vue_1.createApp({});
            app.component('my-counter', {
                template: fs_1.readFileSync(path_1.join(__dirname, '../../../static/template/vue/counter.html'), 'utf-8'),
                data() {
                    return data;
                }, methods: {
                    on_save() {
                        cache_1.default.set(data);
                        console.log("保存成功");
                    },
                },
            });
            app.mount(this.$.app);
        }
    },
    beforeClose() { },
    close() { },
});
