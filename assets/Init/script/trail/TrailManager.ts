import { CCInteger, gfx, Material } from 'cc';
import { RenderingSubMesh } from 'cc';
import { Director } from 'cc';
import { director } from 'cc';
import { renderer } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { TrailRenderCPU } from './TrailRenderCPU';
const { ccclass, property, executionOrder } = _decorator;

@ccclass('TrailManager')
@executionOrder(-1)
export class TrailManager extends Component {

    private static _instance: TrailManager = null;
    static get instance() {
        if (!this._instance) {
            let node = new Node();
            this._instance = node.addComponent(TrailManager);
            director.getScene().addChild(node);
        }
        return this._instance;
    }

    /**拖尾的模型数据缓存 */
    private _models: { [key: string]: { model: renderer.scene.Model, vertxBuffer: Float32Array, indexBuffer: Uint16Array, iaInfo: gfx.IndirectBuffer, iaInfoBuffer: gfx.Buffer, faceCount: number, vertSize: number, subMeshData: RenderingSubMesh } } = {};

    /**拖尾的当前数量记录 */
    private _modelIndexs: { [key: string]: number } = {};

    onLoad() {
        TrailManager._instance = this;
        //初始位置确保在在0
        this.node.setPosition(0, 0, 0);
        director.on(Director.EVENT_BEFORE_COMMIT, this.beforeRender, this);
    }

    getBufferIndex(name: string) {
        return this._modelIndexs[name];
    }

    /**
     * 创建拖尾基础模型
     * @param length 拖尾的长度
     * @param vertex 拖尾的顶点数
     * @param material 拖尾材质
     * @param maxTrailCount 最大拖尾数量 (用于创建默认的buffer数据初始化大小)
     * @returns 拖尾模型
     */
    createModel(length: number, vertex: number, material: Material, maxTrailCount: number) {
        if (this._models[material.name]) {
            this._modelIndexs[material.name]++;
            return this._models[material.name];
        }

        const iaInfo = new gfx.IndirectBuffer([new gfx.DrawInfo()]);

        const attrs = [
            new gfx.Attribute(gfx.AttributeName.ATTR_POSITION, gfx.Format.RGB32F),   // xyz:position
            new gfx.Attribute(gfx.AttributeName.ATTR_TEX_COORD, gfx.Format.RG32F), // uv
            // new Attribute(AttributeName.ATTR_TEX_COORD2, Format.RGB32F), // <wireframe debug>
            // new gfx.Attribute(gfx.AttributeName.ATTR_TEX_COORD1, gfx.Format.RGB32F), // xyz:velocity
            // new gfx.Attribute(gfx.AttributeName.ATTR_COLOR, gfx.Format.RGBA8, true),
        ];

        let vertSize = 0;
        for (const a of attrs) {
            vertSize += gfx.FormatInfos[a.format].size;
        }

        const vertexCount = length * vertex * maxTrailCount;
        const faceCount = (length - 1) * (vertex - 1) * 2 * maxTrailCount;

        const device: gfx.Device = director.root!.device;
        const vertexBuffer = device.createBuffer(new gfx.BufferInfo(
            gfx.BufferUsageBit.VERTEX | gfx.BufferUsageBit.TRANSFER_DST,
            gfx.MemoryUsageBit.HOST | gfx.MemoryUsageBit.DEVICE,
            vertSize * vertexCount,
            vertSize,
        ));
        const vBuffer: ArrayBuffer = new ArrayBuffer(vertSize * vertexCount);
        const vbF32 = new Float32Array(vBuffer);
        vertexBuffer.update(vBuffer);

        const indexBuffer = device.createBuffer(new gfx.BufferInfo(
            gfx.BufferUsageBit.INDEX | gfx.BufferUsageBit.TRANSFER_DST,
            gfx.MemoryUsageBit.HOST | gfx.MemoryUsageBit.DEVICE,
            faceCount * 3 * Uint16Array.BYTES_PER_ELEMENT,
            Uint16Array.BYTES_PER_ELEMENT,
        ));
        const iBuffer = new Uint16Array(faceCount * 3);
        indexBuffer.update(iBuffer);

        const iaInfoBuffer = device.createBuffer(new gfx.BufferInfo(
            gfx.BufferUsageBit.INDIRECT,
            gfx.MemoryUsageBit.HOST | gfx.MemoryUsageBit.DEVICE,
            gfx.DRAW_INFO_SIZE,
            gfx.DRAW_INFO_SIZE,
        ));
        iaInfo.drawInfos[0].vertexCount = vertexCount;
        iaInfo.drawInfos[0].indexCount = faceCount * 3;
        iaInfoBuffer.update(iaInfo);

        const model = director.root.createModel(renderer.scene.Model);
        const subMeshData = new RenderingSubMesh([vertexBuffer], attrs, gfx.PrimitiveMode.TRIANGLE_LIST, indexBuffer, iaInfoBuffer);
        model.initSubModel(0, subMeshData, material!);
        model.node = model.transform = this.node;
        this._getRenderScene().addModel(model);

        this._models[material.name] = { model: model, vertxBuffer: vbF32, indexBuffer: iBuffer, iaInfo: iaInfo, iaInfoBuffer: iaInfoBuffer, faceCount: faceCount, vertSize: vertSize, subMeshData: subMeshData };
        this._modelIndexs[material.name] = 0;

        return this._models[material.name];
    }

    onDestroy() {
        TrailManager._instance = null;

        for (let name in this._models) {
            const data = this._models[name];
            const model = data.model;
            if (model.scene) {
                model.scene.removeModel(model);
            }
            data.subMeshData.destroy();
            data.subMeshData = null;

            director.root.destroyModel(model);
            data.model = null;
            
            this._models[name] = null;
        }

        this._models = {};

        director.off(Director.EVENT_BEFORE_COMMIT, this.beforeRender, this);
    }

    private beforeRender() {
        for (let name in this._models) {
            const data = this._models[name];
            const model = data.model;
            const subModels = model && model.subModels;
            if (subModels && subModels.length > 0) {
                const subModel = subModels[0];
                const iaInfo = data.iaInfo;
                subModel.inputAssembler.vertexBuffers[0].update(data.vertxBuffer);
                subModel.inputAssembler.indexBuffer!.update(data.indexBuffer!);
                // iaInfo.drawInfos[0].firstIndex = 0;
                // iaInfo.drawInfos[0].indexCount = data.faceCount * this._modelIndexs[name] * 3;
                // data.iaInfoBuffer!.update(iaInfo);
            }
        }
    }
}

