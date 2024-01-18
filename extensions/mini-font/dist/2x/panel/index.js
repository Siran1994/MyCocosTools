function trans(path) {
    return Editor.url("packages://mini-font/" + path);
}
var fs = require("fs");
var path = require("path");
const electron = require("electron");
const Main = require(trans("dist/core/Main")).default;
const AppCache = require(trans("dist/core/AppCache")).default;
Editor.Panel.extend({
    style: fs.readFileSync(trans('static/index.css'), 'utf-8'),
    template: fs.readFileSync(trans('static/index.html'), 'utf-8'),
    ready: function () {
        var self = this;
        let data = AppCache.get();
        self.vue = new window.Vue({
            // @ts-ignore
            el: this.shadowRoot,
            data: function () {
                return data;
            },
            watch: {},
            created: function () { },
            methods: {
                on_save() {
                    AppCache.set(data);
                    Editor.log("保存成功");
                },
                on_build() {
                    AppCache.set(data);
                    try {
                        const indexPath = path.join(data.path, "../", "index.html");
                        new Main(AppCache.getVersion(), data.path, indexPath);
                    }
                    catch (error) {
                        Editor.error(error);
                    }
                },
                on_open() {
                    try {
                        electron.shell.openExternal(path.join(data.path, "../", "index.html"));
                    }
                    catch (error) {
                        Editor.error(error);
                    }
                }
            }
        });
    }
});
