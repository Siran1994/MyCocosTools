'use strict';
const { updatePropByDump, disconnectGroup } = require('./prop');
type Selector<$> = { $: Record<keyof $, any | null> }


exports.template = `
<div class="component-container">
</div>
<ui-section header="调试" expand>
    <ui-prop>
        <ui-label slot="label">调试类型：</ui-label>
        <ui-select slot="content" value="0" class="debugType">
            <option value="0">线</option>
            <option value="1">面</option>
        </ui-select>
    </ui-prop>
    <ui-prop>
        <ui-label slot="label">调试颜色：</ui-label>
        <ui-color slot="content" class="debugColor"></ui-color>
    </ui-prop>
    <div class="debug-group">
        <ui-button  class="btnClear" type="warning">Clear</ui-button>
        <ui-button  class="btnBuild" type="success">Build</ui-button>
    </div>
</ui-section>
<ui-section header="导入构建数据" expand>
    <div class="debug-group">
        <ui-asset class="bufferAsset" readonly" droppable="cc.BufferAsset"></ui-asset>
        <ui-button  class="btnImportData" type="danger">Export Data</ui-button>
    </div>
</ui-section>
<ui-section header="构建数据导出" expand>
    <ui-button  class="btnExportData" type="primary">Export Data</ui-button>
</ui-section>
`;



exports.style = /* css */`
.debug-group{
    display: flex;
    flex-wrap: wrap;
    margin-top: 16px;
}
.btnClear {
    width: 48%;
    margin-right: 2%;
}
.btnBuild {
    width: 48%;
    margin-left: 2%;
}
.bufferAsset{
    width: 68%;
    margin-right: 2%;
}
.btnImportData{
    width: 28%;
    margin-left: 2%;
}
.btnExportData{
    flex-wrap: wrap;
    margin-top: 12px;
    height:25px;
}
`;
export const $ = {
    componentContainer: '.component-container',
    btnClear: ".btnClear",
    btnBuild: ".btnBuild",
    debugType: ".debugType",
    debugColor: ".debugColor",
    bufferAsset: ".bufferAsset",
    btnImportData: ".btnImportData",
    btnExportData: ".btnExportData",

};
type PanelThis = Selector<typeof $> & { dump: any };
export function update(this: PanelThis, dump: any) {
    updatePropByDump(this, dump);
    this.dump = dump;
    this.$.debugType.value = dump.value._debugType.value;
    let color = dump.value._debugColor.value;
    color = color.split(",");
    this.$.debugColor.value = [Number(color[0]), Number(color[1]), Number(color[2]), Number(color[3])];
}
export function ready(this: PanelThis) {
    disconnectGroup(this);
    this.$.btnClear.addEventListener('confirm', () => {
        Editor.Message.send("scene", "execute-component-method", { uuid: this.dump.value.uuid.value, name: "_navMeshClear", args: [] });
    });
    this.$.btnBuild.addEventListener('confirm', () => {
        Editor.Message.send("scene", "execute-component-method", { uuid: this.dump.value.uuid.value, name: "_navMeshBuild", args: [] });
    });
    this.$.debugType.addEventListener('confirm', () => {
        let val = this.$.debugType.value;
        Editor.Message.send("scene", "execute-component-method", { uuid: this.dump.value.uuid.value, name: "_setNavmeshDebugType", args: [val] });
    });
    this.$.debugColor.addEventListener('confirm', () => {
        let val = this.$.debugColor.value;
        Editor.Message.send("scene", "execute-component-method", { uuid: this.dump.value.uuid.value, name: "_setNavmeshDebugColor", args: [val[0] + "," + val[1] + "," + val[2] + "," + val[3]] });
    });
    this.$.btnImportData.addEventListener('confirm', () => {
        let val = this.$.bufferAsset.value;
        console.log(`杨宗宝 Nav Mesh：导出资源uuid${val}...`);
        Editor.Message.send("scene", "execute-component-method", { uuid: this.dump.value.uuid.value, name: "_byImportDataBuild", args: [val] });
    });
    this.$.btnExportData.addEventListener('confirm', () => {
        Editor.Message.send("scene", "execute-component-method", { uuid: this.dump.value.uuid.value, name: "_exportBuildData" });
    });
}