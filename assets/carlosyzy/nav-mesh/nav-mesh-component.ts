import { BufferAsset, CCFloat, CCString } from 'cc';
import { _decorator, Component, Node, Terrain } from 'cc';

import { MeshRenderer } from 'cc';
import { renderer } from 'cc';
import { gfx } from 'cc';
import { Vec3 } from 'cc';
import { math } from 'cc';
import { TerrainBlock } from 'cc';
import { EDITOR } from 'cc/env';
import { Color } from 'cc';
import { assetManager } from 'cc';
import { Material } from 'cc';
import { utils } from 'cc';
import { IObstacle, NavMeshCrowd, NavMesh } from './nav-mesh';
import { CCInteger } from 'cc';
const { ccclass, property, executeInEditMode, disallowMultiple, icon } = _decorator;
const NavMeshAgentConfigTips = {
    cellSize: "cellSize 用于控制导航网格分辨率的参数之一。它表示导航网格中每个网格单元的大小，\n较小的 cellSize 可以提高导航网格的精度，但会增加导航网格的数量，从而影响性能；\n较大的 cellSize 可以减少导航网格的数量，但会降低导航网格的精度，从而影响导航的准确性。\n因此，在实际应用中需要根据场景的大小和复杂度进行调整，以便生成符合要求的导航网格。",
    cellHeight: "cellHeight 用于控制导航网格分辨率的参数之一。它表示导航网格中每个网格单元的高度。\n较小的 cellHeight 可以提高导航网格的精度，但会增加导航网格的数量，从而影响性能；\n较大的 cellHeight 可以减少导航网格的数量，但会降低导航网格的精度，从而影响导航的准确性。\n因此，在实际应用中需要根据场景的大小和复杂度进行调整，以便生成符合要求的导航网格。\n同时，需要注意的是，cellHeight 的取值应该与场景中的高度差和代理对象的高度相匹配，以便代理对象能够正确地行走和爬升。",
    tileSize: "tileSize 用于控制导航网格分割的参数之一。它表示将场景分割成多个矩形区域时，每个矩形区域的大小，\n较小的 tileSize 可以提高导航网格的精度，但会增加导航网格的数量，从而影响性能；\n较大的 tileSize 可以减少导航网格的数量，但会降低导航网格的精度，从而影响导航的准确性。\n因此，在实际应用中需要根据场景的大小和复杂度进行调整，以便生成符合要求的导航网格。\n同时，需要注意的是，tileSize 的取值应该与 cellSize 和 cellHeight 相匹配，以便生成符合要求的导航网格。",
    borderSize: "borderSize 用于控制导航网格边缘大小的参数之一。它表示导航网格中每个网格单元的边缘大小，\n较小的 borderSize 可以提高导航网格的精度，但会增加导航网格的数量，从而影响性能；\n较大的 borderSize 可以减少导航网格的数量，但会降低导航网格的精度，从而影响导航的准确性。\n因此，在实际应用中需要根据场景的大小和复杂度进行调整，以便生成符合要求的导航网格。\n同时，需要注意的是，borderSize 的取值应该与 cellSize 和 cellHeight 相匹配，以便生成符合要求的导航网格。",
    walkableSlopeAngle: "walkableSlopeAngle 用于控制导航网格中可行走区域的最大斜率角度的参数之一。\n它表示代理对象可以行走的最大斜坡角度。如果斜坡角度超过了这个值，代理对象就无法行走。\nwalkableSlopeAngle 的取值范围通常在0到90之间，具体取值需要根据场景中的斜坡角度进行调整。\n需要注意的是，walkableSlopeAngle 的取值过大或过小都会影响导航的准确性和性能。\n因此，在实际应用中需要进行实验和调整，以便生成符合要求的导航网格。",
    walkableHeight: "walkableHeight 用于控制代理对象在导航网格中行走的高度的参数之一。它表示代理对象可以行走的最小高度。\n较小的 walkableHeight 可以提高导航网格的精度，但会增加导航网格的数量，从而影响性能；\n较大的 walkableHeight 可以减少导航网格的数量，但会降低导航网格的精度，从而影响导航的准确性。\n因此，在实际应用中需要根据代理对象的高度和形状进行调整，以便代理对象能够正确地行走和爬升。\n同时，需要注意的是，walkableHeight 的取值应该与 cellHeight 相匹配，以便生成符合要求的导航网格。",
    walkableClimb: "walkableClimb 用于控制代理对象爬升高度的参数之一。它表示代理对象可以爬升的最大高度。\n较小的 walkableClimb 可以提高导航网格的精度，但会增加导航网格的数量，从而影响性能；\n较大的 walkableClimb 可以减少导航网格的数量，但会降低导航网格的精度，从而影响导航的准确性。\n因此，在实际应用中需要根据代理对象的高度和形状进行调整，以便代理对象能够正确地行走和爬升。\n同时，需要注意的是，walkableClimb 的取值应该与 cellHeight 相匹配，以便生成符合要求的导航网格。",
    walkableRadius: "walkableRadius 用于控制代理对象行走半径的参数之一。它表示代理对象在导航网格中行走时的最大半径。\n较小的 walkableRadius 可以提高导航网格的精度，但会增加导航网格的数量，从而影响性能；\n较大的 walkableRadius 可以减少导航网格的数量，但会降低导航网格的精度，从而影响导航的准确性。\n因此，在实际应用中需要根据代理对象的大小和形状进行调整，以便代理对象能够正确地行走和避让障碍物。\n同时，需要注意的是，walkableRadius 的取值应该与 cellSize 相匹配，以便生成符合要求的导航网格。",
    maxEdgeLen: "maxEdgeLen 用于控制导航网格边缘最大长度的参数之一。它表示导航网格中相邻网格之间的最大边缘长度。\n较小的 maxEdgeLen 可以提高导航网格的精度，但会增加导航网格的数量，从而影响性能；\n较大的 maxEdgeLen 可以减少导航网格的数量，但会降低导航网格的精度，从而影响导航的准确性。\n因此，在实际应用中需要根据场景的大小和复杂度进行调整，以便生成符合要求的导航网格。\n同时，需要注意的是，maxEdgeLen 的取值应该与 cellSize 和 tileSize 相匹配，以便生成符合要求的导航网格。",
    maxSimplificationError: "maxSimplificationError 用于控制导航网格简化误差的参数之一。它表示导航网格简化过程中允许的最大误差值。\n较小的 maxSimplificationError 可以提高导航网格的精度，但会增加导航网格的数量，从而影响性能；\n较大的 maxSimplificationError 可以减少导航网格的数量，但会降低导航网格的精度，从而影响导航的准确性。\n因此，在实际应用中需要根据场景的大小和复杂度进行调整，以便生成符合要求的导航网格。\n同时，需要注意的是，maxSimplificationError 的取值应该与 cellSize 和 tileSize 相匹配，以便生成符合要求的导航网格。",
    minRegionArea: "minRegionArea 用于控制导航网格区域最小面积的参数之一。它表示导航网格中每个区域的最小面积。\n较小的 minRegionArea 可以提高导航网格的精度，但会增加导航网格的数量，从而影响性能；\n较大的 minRegionArea 可以减少导航网格的数量，但会降低导航网格的精度，从而影响导航的准确性。\n因此，在实际应用中需要根据场景的大小和复杂度进行调整，以便生成符合要求的导航网格。\n同时，需要注意的是，minRegionArea 的取值应该与 cellSize 和 tileSize 相匹配，以便生成符合要求的导航网格。",
    mergeRegionArea: "mergeRegionArea 用于控制导航网格区域合并的参数之一。它表示导航网格中相邻区域合并的最小面积。\n较小的 mergeRegionArea 可以提高导航网格的精度，但会增加导航网格的数量，从而影响性能；\n较大的 mergeRegionArea 可以减少导航网格的数量，但会降低导航网格的精度，从而影响导航的准确性。\n因此，在实际应用中需要根据场景的大小和复杂度进行调整，以便生成符合要求的导航网格。\n同时，需要注意的是，mergeRegionArea 的取值应该与 cellSize 和 tileSize 相匹配，以便生成符合要求的导航网格。",
    maxVertsPerPoly: "maxVertsPerPoly 用于控制导航网格中每个多边形的最大顶点数的参数之一。它表示导航网格中每个多边形的最大顶点数，通常为3到6个。\n较小的 maxVertsPerPoly 可以提高导航网格的精度，但会增加导航网格的数量，从而影响性能；\n较大的 maxVertsPerPoly 可以减少导航网格的数量，但会降低导航网格的精度，从而影响导航的准确性。\n因此，在实际应用中需要根据场景的大小和复杂度进行调整，以便生成符合要求的导航网格。\n同时，需要注意的是，maxVertsPerPoly 的取值应该与 cellSize 和 tileSize 相匹配，以便生成符合要求的导航网格。",
    detailSampleDist: "detailSampleDist 用于控制导航网格细节采样距离的参数之一。它表示在生成导航网格时，每个多边形的细节采样距离。\n较小的 detailSampleDist 可以提高导航网格的精度，但会增加导航网格的数量，从而影响性能；\n较大的 detailSampleDist 可以减少导航网格的数量，但会降低导航网格的精度，从而影响导航的准确性。\n因此，在实际应用中需要根据场景的大小和复杂度进行调整，以便生成符合要求的导航网格。\n同时，需要注意的是，detailSampleDist 的取值应该与 cellSize 和 tileSize 相匹配，以便生成符合要求的导航网格。",
    detailSampleMaxError: "detailSampleMaxError 用于控制导航网格细节采样误差的参数之一。它表示在生成导航网格时，每个多边形的细节采样误差。\n较小的 detailSampleMaxError 可以提高导航网格的精度，但会增加导航网格的数量，从而影响性能；\n较大的 detailSampleMaxError 可以减少导航网格的数量，但会降低导航网格的精度，从而影响导航的准确性。\n因此，在实际应用中需要根据场景的大小和复杂度进行调整，以便生成符合要求的导航网格。\n同时，需要注意的是，detailSampleMaxError 的取值应该与 cellSize 和 tileSize 相匹配，以便生成符合要求的导航网格。",
};

@ccclass("NavNode")
class NavNode {
    @property(Node)
    node: Node = null!;
    @property({ tooltip: "是否包含子节点" })
    child: boolean = false;
}
@ccclass("NavConfig")
class NavConfig {
    @property({ type: CCFloat, displayOrder: 0, tooltip: NavMeshAgentConfigTips.cellSize })
    cellSize: number = 0.2;
    @property({ type: CCFloat, displayOrder: 1, tooltip: NavMeshAgentConfigTips.cellHeight, })
    cellHeight: number = 0.2;
    @property({ type: CCFloat, displayOrder: 2, tooltip: NavMeshAgentConfigTips.tileSize, })
    tileSize: number = 10;
    @property({ type: CCFloat, displayOrder: 3, tooltip: NavMeshAgentConfigTips.borderSize, })
    borderSize: number = 1;
    @property({ type: CCFloat, displayOrder: 4, tooltip: NavMeshAgentConfigTips.walkableSlopeAngle, })
    walkableSlopeAngle: number = 90;
    @property({ type: CCFloat, displayOrder: 5, tooltip: NavMeshAgentConfigTips.walkableHeight, })
    walkableHeight: number = 1.0;
    @property({ type: CCFloat, displayOrder: 6, tooltip: NavMeshAgentConfigTips.walkableClimb, })
    walkableClimb: number = 1;
    @property({ type: CCFloat, displayOrder: 7, tooltip: NavMeshAgentConfigTips.walkableRadius, })
    walkableRadius: number = 1;
    @property({ type: CCFloat, displayOrder: 8, tooltip: NavMeshAgentConfigTips.maxEdgeLen, })
    maxEdgeLen: number = 12;
    @property({ type: CCFloat, displayOrder: 9, tooltip: NavMeshAgentConfigTips.maxSimplificationError, })
    maxSimplificationError: number = 1.3;
    @property({ type: CCFloat, displayOrder: 10, tooltip: NavMeshAgentConfigTips.minRegionArea, })
    minRegionArea: number = 8;
    @property({ type: CCFloat, displayOrder: 11, tooltip: NavMeshAgentConfigTips.mergeRegionArea, })
    mergeRegionArea: number = 20;
    @property({ type: CCFloat, displayOrder: 12, tooltip: NavMeshAgentConfigTips.maxVertsPerPoly, })
    maxVertsPerPoly: number = 6;
    @property({ type: CCFloat, displayOrder: 13, tooltip: NavMeshAgentConfigTips.detailSampleDist, })
    detailSampleDist: number = 6;
    @property({ type: CCFloat, displayOrder: 14, tooltip: NavMeshAgentConfigTips.detailSampleMaxError, })
    detailSampleMaxError: number = 1;
}


@ccclass('NavMeshComponent')
@executeInEditMode
@disallowMultiple
@icon("")
export class NavMeshComponent extends Component {
    @property
    _nodes: NavNode[] = [];
    @property({ type: [NavNode], displayName: "参与网格构建节点：", displayOrder: 0 })
    public get nodes() {
        return this._nodes;
    }
    public set nodes(val) {
        this._nodes = val;
        this._resetData();
    }
    @property({ type: NavConfig, displayName: "属性配置", displayOrder: 1, })
    navConfig: NavConfig = new NavConfig();

    @property({ type: CCInteger })
    _debugType: number = MeshDebugDataType.LINE;
    @property({})
    _debugColor: string = "0,0,0,255";

    private _navMeshMgr: NavMesh = null;
    private _config: NavMeshConfig = null!;
    private _positions: number[] = [];
    private _indices: number[] = [];
    /**
     * 人群
     */
    private _crowds: NavMeshCrowd[] = [];
    private _isBuild: boolean = false;
    onLoad(): void {
        this.node.destroyAllChildren();
        this._navMeshMgr = new NavMesh();
    }
    onEnable(): void {
        this._resetData();
    }
    start() {
    }
    /**
     * 私有函数，编辑器调用
     * @returns 
     */
    private _navMeshBuild(): void {
        if (this._isBuild) {
            console.log("杨宗宝 Nav Mesh：正在构建，请勿重复操作...");
            return;
        }
        this._isBuild = true;
        this._clear();
        try {
            this.build();
            this.bakeDebugBuild();
            this._isBuild = false;
            console.log("杨宗宝 Nav Mesh：构建结束...");
        } catch (error) {
            this._isBuild = false;
            console.log(error)
            console.log("杨宗宝 Nav Mesh：构建异常...");
        }
    }
    /**
     * 私有函数，编辑器调用
     * @returns 
     */
    private _navMeshClear(): void {
        this._clear();
    }
    /**
     * 私有函数，编辑器调用
     * @returns 
     */
    private _setNavmeshDebugType(val: number): void {
        this._debugType = val;
    }
    /**
     * 私有函数，编辑器调用
     * @returns 
     */
    private _setNavmeshDebugColor(color: string): void {
        this._debugColor = color;
    }
    /**
     * 私有函数 通过导入已有数据构建
     */
    private _byImportDataBuild(uuid: string): void {
        if (this._isBuild) return;
        this._isBuild = true;
        console.log(`杨宗宝 Nav Mesh：导入资源 uuid${uuid}...`);
        assetManager.loadAny(uuid, (err: any, asset: BufferAsset) => {
            if (err) {
                console.log(`杨宗宝 Nav Mesh：导入资源 uuid${uuid} 异常：err${err}...`);
                this._isBuild = false;
                return;
            }
            console.log(`杨宗宝 Nav Mesh：导入资源 uuid${uuid} 成功...`);
            let buffer = asset.buffer();
            let foobar = new Uint8Array(buffer);
            this._navMeshMgr.buildFromNavMeshData(foobar);
            this.bakeDebugBuild();
            this._isBuild = false;
        });
    }
    /**
     * 私有函数 导出构建数据
     */
    private async _exportBuildData(): Promise<void> {
        console.log(`杨宗宝 Nav Mesh：导出数据...`);
        this._navMeshBuild();
        let data: any = this._navMeshMgr.getNavMeshData();
        //保存
        await Editor.Message.send("asset-db", "create-asset", "db://assets/nav-mesh.bin", data);
        console.log("杨宗宝：navmesh 导出成功，路径：db://assets/nav-mesh.bin")
    }
    private _resetData(): void {
        this._positions = [];
        this._indices = [];
        this.traverseRendererNodes();
    }
    /**
     * 构建
     */
    public build(): void {
        this._config = {
            tileSize: this.navConfig.tileSize,
            borderSize: this.navConfig.borderSize,
            cs: this.navConfig.cellSize,
            ch: this.navConfig.cellHeight,
            walkableSlopeAngle: this.navConfig.walkableSlopeAngle,
            walkableHeight: this.navConfig.walkableHeight,
            walkableClimb: this.navConfig.walkableClimb,
            walkableRadius: this.navConfig.walkableRadius,
            maxEdgeLen: this.navConfig.maxEdgeLen,
            maxSimplificationError: this.navConfig.maxSimplificationError,
            minRegionArea: this.navConfig.minRegionArea,
            mergeRegionArea: this.navConfig.mergeRegionArea,
            maxVertsPerPoly: this.navConfig.maxVertsPerPoly,
            detailSampleDist: this.navConfig.detailSampleDist,
            detailSampleMaxError: this.navConfig.detailSampleMaxError,
        };
        this._navMeshMgr.build(this._positions, this._indices, this._config);
        console.log("杨宗宝 Nav Mesh：构建...");
    }
    /**
     * 渲染debug 调试网格
     */
    public bakeDebugBuild(): void {
        let node: Node = this.node.getChildByName("nav mesh debug");
        let render: MeshRenderer = null;
        let strs: string[] = this._debugColor.split(",");
        let color: Color = new Color(Number(strs[0]), Number(strs[1]), Number(strs[2]), Number(strs[3]));
        if (!node) {
            node = new Node();
            node.name = "nav mesh debug";
            node.position = new Vec3(0, 0, 0);
            this.node.addChild(node);
            render = node.addComponent(MeshRenderer);
            assetManager.loadAny("42524d56-ec31-44d2-94dd-44f6e5e72301", (err: string, material: Material) => {
                render.setMaterialInstance(material, 0);
                render.getMaterialInstance(0).setProperty("mainColor", color);
            });
        } else {
            render = node.getComponent(MeshRenderer);
            if (!render.material) {
                assetManager.loadAny("42524d56-ec31-44d2-94dd-44f6e5e72301", (err: string, material: Material) => {
                    render.setMaterialInstance(material, 0);
                    render.getMaterialInstance(0).setProperty("mainColor", color);
                });
            }else{
                render.getMaterialInstance(0).setProperty("mainColor", color);
            }
        }
        let navMeshData: NavMeshDebugData = this._navMeshMgr.getNavMeshDebugData(this._debugType);
        let mesh = utils.MeshUtils.createMesh({
            positions: navMeshData.positions,
            primitiveMode: gfx.PrimitiveMode.TRIANGLE_LIST,
            normals: navMeshData.normals,
        });
        render.mesh = mesh;
        console.log("杨宗宝 Nav Mesh：绘制调试网格，...");
    }
    public buildFromNavMeshData(data: Uint8Array): void {
        this._navMeshMgr.buildFromNavMeshData(data);
    }
    /**
     * 获取起点到终点的路径
     * @param start 
     * @param end 
     * @returns 
     */
    public getPath(start: Vec3, end: Vec3): Vec3[] {
        return this._navMeshMgr.findPath(start, end);
    }
    /**
     * 获取传入坐标在Nav Mesh 网格中距离最近的坐标点
     * @param pos 
     * @returns 
     */
    public getClosestPoint(pos: Vec3): Vec3 {
        return this._navMeshMgr.getClosestPoint(pos);
    }
    /**
    * 添加圆柱形障碍物
    * @param position  位置
    * @param radius  半径
    * @param height  高
    * @returns 
    */
    public addCylinderObstacle(position: Vec3, radius: number, height: number): IObstacle {
        return this._navMeshMgr.addCylinderObstacle(position, radius, height);
    }
    /**
     * 添加立方体障碍物
     * @param position  位置
     * @param size  尺寸
     * @param angle  盒子方向在Y轴上的弧度角
     * @returns 
     */
    public addBoxObstacle(position: Vec3, extent: Vec3, angle: number): IObstacle {
        return this._navMeshMgr.addBoxObstacle(position, extent, angle);
    }
    /**
     * 创建人群
     * @param maxAgents  人群中代理的数量
     * @param maxAgentRadius   人群中代理的最大半径
     * @returns 返回人群id
     */
    public createCrowd(maxAgents: number, maxAgentRadius: number): number {
        let navCrowd: NavMeshCrowd = this._navMeshMgr.createCrowd(maxAgents, maxAgentRadius);
        this._crowds.push(navCrowd);
        return this._crowds.length - 1;
    }
    /**
     * 添加代理
     * @param crowdId  将要添加的目标人
     * @param node 
     * @param conifg 
     */
    public addAgent(crowdId: number, node: Node, conifg: AgentConfig): number {
        if (crowdId >= this._crowds.length) {
            console.warn("杨宗宝 Nav Mesh：传入的crowdId不存在，...");
            return -1;
        }
        let navCrowd: NavMeshCrowd = this._crowds[crowdId];
        return navCrowd.addAgent(node, conifg);
    }
    /**
     * 设置代理的激活状态
     * 非激活状态下不会同步位置等坐标
     */
    public activeAgent(crowdId: number, agentId: number, state: boolean): void {
        if (crowdId >= this._crowds.length) {
            console.warn("杨宗宝 Nav Mesh：传入的crowdId不存在，...");
            return;
        }
        let navCrowd: NavMeshCrowd = this._crowds[crowdId];
        navCrowd.activeAgent(agentId, state);
    }
    /**
     * 代理移动到指定位置
     * @param crowdId 
     * @param agentId 
     * @param target 
     */
    public moveAgent(crowdId: number, agentId: number, target: Vec3): void {
        if (crowdId >= this._crowds.length) {
            console.warn("杨宗宝 Nav Mesh：传入的crowdId不存在，...");
            return;
        }
        let navCrowd: NavMeshCrowd = this._crowds[crowdId];
        navCrowd.agentMoveTarget(agentId, target);
    }
    /**
     * 将代理传送到指定位置
     * @param crowdId 
     * @param agentId 
     * @param target 
     */
    public teleportAgent(crowdId: number, agentId: number, target: Vec3): void {
        if (crowdId >= this._crowds.length) {
            console.warn("杨宗宝 Nav Mesh：传入的crowdId不存在，...");
            return;
        }
        let navCrowd: NavMeshCrowd = this._crowds[crowdId];
        navCrowd.agentTeleport(agentId, target);
    }


    /**
     * 遍历参与构建的渲染节点
     */
    private traverseRendererNodes(): void {
        let uuids: string[] = [];
        for (let i = 0; i < this.nodes.length; i++) {
            let _node: NavNode = this.nodes[i];
            if (!_node.node) {
                continue;
            }
            if (_node.child) {
                //获取所有的meshrenderer 
                let _renders: MeshRenderer[] = _node.node.getComponentsInChildren(MeshRenderer);
                //获取所有的terrin
                let _terrains: Terrain[] = _node.node.getComponentsInChildren(Terrain);
                for (let j = 0; j < _renders.length; j++) {
                    let _render: MeshRenderer = _renders[j];
                    let _isExistUuid: boolean = this.isExistUuid(uuids, _render.node.uuid);
                    if (!_isExistUuid) {
                        this.analysisMesh(_render);
                        uuids.push(_render.node.uuid);
                    } else {
                    }
                }
                for (let j = 0; j < _terrains.length; j++) {
                    let _terrain: Terrain = _terrains[j];
                    let _isExistUuid: boolean = this.isExistUuid(uuids, _terrain.node.uuid);
                    if (!_isExistUuid) {
                        this.analysisTerrain(_terrain);
                        uuids.push(_terrain.node.uuid);
                    } else {
                    }
                }
            } else {
                // 获取本身的meshrenderer 或者 _terrain
                let _render: MeshRenderer = _node.node.getComponent(MeshRenderer);
                let _terrain: Terrain = _node.node.getComponent(Terrain);
                let _isExistUuid: boolean = this.isExistUuid(uuids, _node.node.uuid);
                if (_render) {
                    if (!_isExistUuid) {
                        this.analysisMesh(_render);
                        uuids.push(_render.node.uuid);
                    } else {
                    }
                } else if (_terrain) {
                    if (!_isExistUuid) {
                        this.analysisTerrain(_terrain);
                        uuids.push(_terrain.node.uuid)
                    } else {
                    }
                }
            }
        }
    }
    /**
     * 解析网格
     */
    private analysisMesh(render: MeshRenderer): void {
        let model: renderer.scene.Model = render.model;
        for (let i = 0; i < model.subModels.length; ++i) {
            let subModel = model.subModels[i].subMesh;
            if (subModel && subModel.geometricInfo) {
                let { positions: vb, indices: ib } = subModel.geometricInfo;
                if (subModel.primitiveMode === gfx.PrimitiveMode.TRIANGLE_LIST) {
                    const cnt = ib.length;
                    for (let j = 0; j < cnt; j += 1) {
                        const i0 = ib[j] * 3;
                        let vec: Vec3 = new Vec3(vb[i0], vb[i0 + 1], vb[i0 + 2]);
                        Vec3.transformMat4(vec, vec, render.node.worldMatrix);
                        this._indices.push(this._positions.length / 3);
                        this._positions.push(vec.x);
                        this._positions.push(vec.y);
                        this._positions.push(vec.z);
                    }
                }
            }
        }

    }
    /**
     * 解析地形
     */
    private analysisTerrain(terrain: Terrain): void {
        let TERRAIN_BLOCK_VERTEX_COMPLEXITY: number = 33;  //地形顶点复杂成都
        let TERRAIN_BLOCK_TILE_COMPLEXITY: number = 32;  //地形块瓦复杂性
        let worldMatrix: math.Mat4 = terrain.node.getWorldMatrix();
        let blocks: TerrainBlock[] = terrain.getBlocks();
        for (let k = 0; k < blocks.length; k++) {
            let index: number[] = blocks[k].getIndex();
            //网格化地形
            for (let j = 1; j < TERRAIN_BLOCK_VERTEX_COMPLEXITY; ++j) {
                for (let i = 1; i < TERRAIN_BLOCK_VERTEX_COMPLEXITY; ++i) {
                    //左上角
                    let x = index[0] * TERRAIN_BLOCK_TILE_COMPLEXITY + (i - 1);
                    let y = index[1] * TERRAIN_BLOCK_TILE_COMPLEXITY + (j - 1);
                    let one = new Vec3(1, 1, 1);
                    Vec3.transformMat4(one, terrain.getPosition(x, y), worldMatrix);
                    //左下角
                    x = index[0] * TERRAIN_BLOCK_TILE_COMPLEXITY + (i - 1);
                    y = index[1] * TERRAIN_BLOCK_TILE_COMPLEXITY + (j);
                    let two = new Vec3(1, 1, 1);
                    Vec3.transformMat4(two, terrain.getPosition(x, y), worldMatrix);
                    //右上角
                    x = index[0] * TERRAIN_BLOCK_TILE_COMPLEXITY + (i);
                    y = index[1] * TERRAIN_BLOCK_TILE_COMPLEXITY + (j - 1);
                    let three = new Vec3(1, 1, 1);
                    Vec3.transformMat4(three, terrain.getPosition(x, y), worldMatrix);
                    //右下角
                    x = index[0] * TERRAIN_BLOCK_TILE_COMPLEXITY + (i);
                    y = index[1] * TERRAIN_BLOCK_TILE_COMPLEXITY + (j);
                    let four = new Vec3(1, 1, 1);
                    Vec3.transformMat4(four, terrain.getPosition(x, y), worldMatrix);
                    //第一个三角形
                    this._indices.push(this._positions.length / 3);
                    this._positions.push(one.x);
                    this._positions.push(one.y);
                    this._positions.push(one.z);

                    this._indices.push(this._positions.length / 3);
                    this._positions.push(two.x);
                    this._positions.push(two.y);
                    this._positions.push(two.z);

                    this._indices.push(this._positions.length / 3);
                    this._positions.push(four.x);
                    this._positions.push(four.y);
                    this._positions.push(four.z);
                    //第二个三角形
                    this._indices.push(this._positions.length / 3);
                    this._positions.push(one.x);
                    this._positions.push(one.y);
                    this._positions.push(one.z);

                    this._indices.push(this._positions.length / 3);
                    this._positions.push(four.x);
                    this._positions.push(four.y);
                    this._positions.push(four.z);

                    this._indices.push(this._positions.length / 3);
                    this._positions.push(three.x);
                    this._positions.push(three.y);
                    this._positions.push(three.z);

                }
            }
        }
    }
    private isExistUuid(arrs: string[], uuid: string): boolean {
        for (let i = 0; i < arrs.length; i++) {
            if (uuid === arrs[i]) {
                return true;
            }
        }
        return false;
    }
    private _clear(): void {
        if (!EDITOR) return;
        this._navMeshMgr.clear();
        let node: Node = this.node.getChildByName("nav mesh debug");
        if (node) {
            let render: MeshRenderer = node.getComponent(MeshRenderer);
            if (render) render.mesh = null;
        }
    }

    update(deltaTime: number) {
        if (this._navMeshMgr) this._navMeshMgr.update(deltaTime);
        for (let i = 0; i < this._crowds.length; i++) {
            this._crowds[i].update(deltaTime);
        }
    }

    onDestroy(): void {
        if (!EDITOR) {
            this._navMeshMgr.destroy();
        }
    }


}
export enum MeshDebugDataType {
    LINE = 0,
    SURFACE = 1,
}
export interface NavMeshDebugData {
    positions: number[];
    normals: number[];
}
interface NavMeshConfig {
    /**
     * 瓦片大小，用于进行动态障碍物检测
     */
    tileSize: number;
    /**
     * 高度场周围不可导航边框的大小。
     */
    borderSize: number;
    /**
     * xz平面单元格大小
     */
    cs: number;
    /**
     * y轴单元格大小
     */
    ch: number;
    /**
     * 可以步行的最大坡度。[限制：0 <= 值 < 90] [单位：度]
     */
    walkableSlopeAngle: number;
    /**
     * 到达天花板最小可行走的距离
     */
    walkableHeight: number;
    /**
     * 可以通过的最大岩架高度  
     */
    walkableClimb: number;
    /**
     * 距离障碍物的距离（半径）
     */
    walkableRadius: number;
    /**
     * 沿网格边界的轮廓边的最大允许长度
     */
    maxEdgeLen: number;
    /**
     * 简化轮廓的边界边缘应偏离原始原始轮廓的最大距离。
     */
    maxSimplificationError: number;
    /**
     * 允许形成孤岛区域的最小单元 面积
     */
    minRegionArea: number;
    /**
     * 如果可能，跨度计数小于此值的任何区域都将与更大的区域合并
     */
    mergeRegionArea: number;
    /**
     * 过程中生成的多边形所允许的最大顶点数  
     */
    maxVertsPerPoly: number;
    /**
     * 设置生成细节网格时使用的采样距离（仅适用于高度详细信息。）
     */
    detailSampleDist: number;
    /**
     * 细节网格表面应偏离高度场数据的最大距离。（仅适用于高度详细信息。）
     */
    detailSampleMaxError: number;
}
export interface AgentConfig {
    /**
     * 半径
     */
    radius?: number;

    /**
     * 高度
     */
    height?: number;

    /**
     * 最大允许加速度
     */
    maxAcceleration?: number;

    /**
     *最大允许速度
     */
    maxSpeed?: number;

    /**
     *定义碰撞元素在考虑转向行为之前的距离. [Limits: > 0]
     * 代理和代理之间的距离
     */
    collisionQueryRange?: number;

    /**
     * 路径可见性优化范围. [Limit: > 0]
     */
    pathOptimizationRange?: number;

    /**
     * *代理管理器在避免与代理发生冲突时应该采取何种激进措施. [Limit: >= 0]
     */
    separationWeight?: number;

    /**
     当agent进入以目标点为半径的虚拟圈时，
     *默认为代理半径
     */
    reachRadius?: number;
}

