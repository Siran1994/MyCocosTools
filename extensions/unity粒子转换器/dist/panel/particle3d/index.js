const { dialog, shell } = require("electron").remote;
const fs = require("fs");
const path = require("path");
const Vue = require('./../vue.min.js');

const Panel = {
    style: fs.readFileSync(path.join(__dirname, "index.css"), "utf-8"),
    template: fs.readFileSync(path.join(__dirname, "index.html"), "utf-8"),

    $: {
        elem: '#app',
    },

    ready() {
        this.vueObj = new Vue({
            el: this.$.elem,
            data: {
                filePath: null,
            },
            created() {
                console.log('vue ready');
            },
            methods: {
                onChoseFile(e) {
                    let elememt = e.currentTarget;
                    this.filePath = elememt.value;
                },

                onConfirm(e) {
                    Editor.Message.send('u3d-particle-ado', 'p2m-particle3d-build', this.filePath);
                },
            }
        });
    },
    methods: {
        "m2p-particle3d-log"() {
            console.log("hello");
        }
    }
};

module.exports = Panel;