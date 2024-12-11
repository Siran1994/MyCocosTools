
import { Quat } from 'cc';
import { _decorator, Node, MeshRenderer, gfx, Vec3, math, Mesh, Terrain, TerrainBlock, Vec2, geometry, resources, BufferAsset } from 'cc';
const { ccclass, property } = _decorator;
import Recast from "./recast.js"

@ccclass('NavMesh')
export class NavMesh {
    private _recast: any = null;
    public get recast() {
        return this._recast;
    }
    private _navMesh: any = null;
    public get navMesh() {
        return this._navMesh;
    }
    private _tempVec: any;
    private _tempVec1: any;
    private _tempVec2: any;
    /**
     * 构造函数 初始化recast
     * Recast 异步函数
     * @param cb 
     */
    constructor() {
        this._recast = new Recast();
        this._navMesh = new this._recast.NavMesh();
        this._tempVec = new this._recast.Vec3();
        this._tempVec1 = new this._recast.Vec3();
        this._tempVec2 = new this._recast.Vec3();
    }


    /**
     * 构建导航网格
     */
    public build(position: number[], indices: number[], config: any): void {
        let rc = new this._recast.rcConfig();
        rc.cs = config.cs;
        rc.ch = config.ch;
        rc.borderSize = config.borderSize;
        rc.tileSize = config.tileSize;
        rc.walkableSlopeAngle = config.walkableSlopeAngle;
        rc.walkableHeight = config.walkableHeight;
        rc.walkableClimb = config.walkableClimb;
        rc.walkableRadius = config.walkableRadius;
        rc.maxEdgeLen = config.maxEdgeLen;
        rc.maxSimplificationError = config.maxSimplificationError;
        rc.minRegionArea = config.minRegionArea;
        rc.mergeRegionArea = config.mergeRegionArea;
        rc.maxVertsPerPoly = config.maxVertsPerPoly;
        rc.detailSampleDist = config.detailSampleDist;
        rc.detailSampleMaxError = config.detailSampleMaxError;

        this._navMesh.build(position, position.length / 3, indices, indices.length, rc);
    }

    /**
     * 获取导航网格数据
     * @param type  面和线 两种方式
     * @returns 
     */
    public getNavMeshDebugData(type: MeshDebugDataType = MeshDebugDataType.SURFACE): NavMeshDebugData {
        let debugNavMesh = this._navMesh.getDebugNavMesh();
        let triangleCount = debugNavMesh.getTriangleCount();
        let _indices = [];
        let _positions = [];
        let tri: number;
        let pt: number;
        for (tri = 0; tri < triangleCount * 3; tri++) {
            _indices.push(tri);
        }
        for (tri = 0; tri < triangleCount; tri++) {
            for (pt = 0; pt < 3; pt++) {
                let point = debugNavMesh.getTriangle(tri).getPoint(pt);
                _positions.push(point.x, point.y, point.z);
            }
        }
        //进行数据转换  转换为cocos可以使用的网格数据
        let vectors: Vec3[] = [];
        for (let i = 0; i < _indices.length; i++) {
            let index = _indices[i] * 3;
            let vector: Vec3 = new Vec3(_positions[index], _positions[index + 1], _positions[index + 2]);
            vectors.push(vector);
        }
        if (type == MeshDebugDataType.SURFACE) {
            return this.getNavMeshDebugSurfaceData(vectors);
        } else {
            return this.getNavMeshDebugLineData(vectors);
        }
    }
    /**
     * 获取导航网格数据--面的网格数据
     * @param vectors 
     * @returns 
     */
    private getNavMeshDebugSurfaceData(vectors: Vec3[]): NavMeshDebugData {
        let positions = [];
        let normals = [];
        for (let i = 0; i < vectors.length; i += 3) {
            let one: Vec3 = vectors[i];
            let tow: Vec3 = vectors[i + 1];
            let three: Vec3 = vectors[i + 2];
            let arrPos = [one, tow, three];
            let value = Vec3.subtract(new Vec3(), arrPos[0], arrPos[1]).cross(Vec3.subtract(new Vec3(), arrPos[2], arrPos[1]));
            //y 大于0 顺时针
            //y 小于0 逆时针
            if (value.y > 0) {
                arrPos = arrPos.reverse();
            }
            for (let j = 0; j < arrPos.length; j++) {
                positions.push(arrPos[j].x);
                positions.push(arrPos[j].y);
                positions.push(arrPos[j].z);

                normals.push(0);
                normals.push(1);
                normals.push(0);
            }
        }
        return { positions: positions, normals: normals }
    }
    /**
     * 获取导航网格数据--线的网格数据
     * @param vectors 
     * @returns 
     */
    private getNavMeshDebugLineData(vectors: Vec3[], lineWidth: number = 0.02): NavMeshDebugData {
        let positions = [];
        let normals = [];
        //将所有的点连城线
        for (let i = 0; i < vectors.length; i += 3) {
            let one: Vec3 = vectors[i];
            let tow: Vec3 = vectors[i + 1];
            let three: Vec3 = vectors[i + 2];
            let datas = [one, tow, three];
            let value = Vec3.subtract(new Vec3(), datas[0], datas[1]).cross(Vec3.subtract(new Vec3(), datas[2], datas[1]));
            //y 大于0 顺时针
            //y 小于0 逆时针
            if (value.y > 0) {
                datas = datas.reverse();
            }
            //每三个顶点是一个三角形 
            let halfWidth = lineWidth / 2;
            let angle = math.toRadian(90);

            for (let idx = 0; idx < datas.length; idx++) {

                let leftPos = datas[idx].clone();
                let rigthPos = datas[idx + 1 >= datas.length ? 0 : idx + 1].clone();


                let tempRay = new geometry.Ray();
                geometry.Ray.fromPoints(tempRay, leftPos, rigthPos);
                let flagPos = new Vec3();
                tempRay.computeHit(flagPos, halfWidth);
                let leftBottomVec = Vec3.rotateY(new Vec3(), flagPos, leftPos, -angle);
                let leftTopVec = Vec3.rotateY(new Vec3(), flagPos, leftPos, angle);
                geometry.Ray.fromPoints(tempRay, rigthPos, leftPos);
                tempRay.computeHit(flagPos, halfWidth);
                let rightBottomVec = Vec3.rotateY(new Vec3(), flagPos, rigthPos, angle);
                let rightTopVec = Vec3.rotateY(new Vec3(), flagPos, rigthPos, -angle);

                let arrPos = [leftBottomVec, rightBottomVec, leftTopVec];
                let value = Vec3.subtract(new Vec3(), arrPos[0], arrPos[1]).cross(Vec3.subtract(new Vec3(), arrPos[2], arrPos[1]));
                if (value.y > 0) {
                    arrPos = arrPos.reverse();
                }
                for (let j = 0; j < arrPos.length; j++) {
                    positions.push(arrPos[j].x);
                    positions.push(arrPos[j].y);
                    positions.push(arrPos[j].z);

                    normals.push(0);
                    normals.push(1);
                    normals.push(0);
                }

                arrPos = [];
                arrPos = [rightBottomVec, rightTopVec, leftTopVec];
                value = Vec3.subtract(new Vec3(), arrPos[0], arrPos[1]).cross(Vec3.subtract(new Vec3(), arrPos[2], arrPos[1]));
                if (value.y > 0) {
                    arrPos = arrPos.reverse();
                }
                for (let j = 0; j < arrPos.length; j++) {
                    positions.push(arrPos[j].x);
                    positions.push(arrPos[j].y);
                    positions.push(arrPos[j].z);

                    normals.push(0);
                    normals.push(1);
                    normals.push(0);
                }
            }
        }
        return { positions: positions, normals: normals }
    }

    /**
     * 获取navmesh 数据
     */
    public getNavMeshData(): Uint8Array {
        let data = this._navMesh.getNavmeshData();
        let arr = new Uint8Array(this._recast.HEAPU8.buffer, data.dataPointer, data.size);
        let ret = new Uint8Array(data.size);
        ret.set(arr);
        this._navMesh.freeNavmeshData(data);
        return ret;
    }
    public loadNavMeshData(path: string, cb: Function): void {
        resources.load(path, (err, data: BufferAsset) => {
            if (err) {
                console.log("err :", err);
                if (cb) cb(null);
                return;
            }

            let buffer = data.buffer();
            let foobar = new Uint8Array(buffer);
            if (cb) cb(foobar);
        });
    }
    /**
     * 通过已有的数据创建navmesh
     * @param data 
     */
    public buildFromNavMeshData(data: Uint8Array): void {
        let nDataBytes = data.length * data.BYTES_PER_ELEMENT;
        let dataPtr = this._recast._malloc(nDataBytes);

        let dataHeap = new Uint8Array(this._recast.HEAPU8.buffer, dataPtr, nDataBytes);
        dataHeap.set(data);

        let buf = new this._recast.NavmeshData();
        buf.dataPointer = dataHeap.byteOffset;
        buf.size = data.length;
        // this._navMesh = new this._recast.NavMesh();
        this._navMesh.buildFromNavmeshData(buf);

        // Free memory
        this._recast._free(dataHeap.byteOffset);
    }
    /**
     * 获取亮点之间的路径
     * @param start 
     * @param end 
     */
    public findPath(start: Vec3, end: Vec3): Vec3[] {
        let _start: Vec3 = this.getClosestPoint(start);
        this._tempVec1.x = _start.x;
        this._tempVec1.y = _start.y;
        this._tempVec1.z = _start.z;
        let _end: Vec3 = this.getClosestPoint(end);
        this._tempVec2.x = _end.x;
        this._tempVec2.y = _end.y;
        this._tempVec2.z = _end.z;

        let navPath = this._navMesh.computePath(this._tempVec1, this._tempVec2);

        let pointCount = navPath.getPointCount();
        let positions: Vec3[] = [];
        for (let i = 0; i < pointCount; i++) {
            let p = navPath.getPoint(i);
            positions.push(new Vec3(p.x, p.y, p.z));
        }
        return positions;
    }
    public getClosestPoint(pos: Vec3): Vec3 {
        this._tempVec.x = pos.x;
        this._tempVec.y = pos.y;
        this._tempVec.z = pos.z;
        let ret = this._navMesh.getClosestPoint(this._tempVec);
        return new Vec3(ret.x, ret.y, ret.z);
    }
    /**
     * 创建人群代理
     */
    public createCrowd(maxAgents: number, maxAgentRadius: number): NavMeshCrowd {
        return new NavMeshCrowd(this, maxAgents, maxAgentRadius);
    }
    // /**
    //  *  Set the time step of the navigation tick update.
    //  * @param newTimeStep  s
    //  */
    // setTimeStep (newTimeStep: number = 1 / 60): void {
    //     this._timeStep = newTimeStep;
    // }
    // getTimeStep (): number {
    //     return this._timeStep;
    // }
    /**
     * 添加圆柱形障碍物
     * @param position  位置
     * @param radius  半径
     * @param height  高
     * @returns 
     */
    public addCylinderObstacle(position: Vec3, radius: number, height: number): IObstacle {
        this._tempVec1.x = position.x;
        this._tempVec1.y = position.y;
        this._tempVec1.z = position.z;
        return this._navMesh.addCylinderObstacle(this._tempVec1, radius, height);
    }
    /**
     * 添加立方体障碍物
     * @param position  位置
     * @param size  尺寸
     * @param angle  盒子方向在Y轴上的弧度角
     * @returns 
     */
    addBoxObstacle(position: Vec3, extent: Vec3, angle: number): IObstacle {
        this._tempVec1.x = position.x;
        this._tempVec1.y = position.y;
        this._tempVec1.z = position.z;
        this._tempVec2.x = extent.x;
        this._tempVec2.y = extent.y;
        this._tempVec2.z = extent.z;
        return this._navMesh.addBoxObstacle(this._tempVec1, this._tempVec2, angle);
    }
    /**
     * 移除障碍物
     * @param obstacle 
     */
    public removeObstacle(obstacle: IObstacle): void {
        console.log("移除障碍物：", obstacle);
        this._navMesh.removeObstacle(obstacle);
    }
    public update(deltaTime: number) {
        if (this._navMesh) {
            this._navMesh.update(deltaTime);
        }
    }
    public clear(): void {

    }
    public destroy(): void {
        if (this._navMesh) {
            this._navMesh.destroy();
        }
        if (this._recast) {
            this._recast.destroy();
        }
    }

}
export class NavMeshCrowd {
    private _navMeshMgr: NavMesh = null!;
    private _recastCrowd: any = {};
    private _tempVec: any;
    private _nowQuat: Quat = new Quat();
    private _newQuat: Quat = new Quat();

    private _agentIds: number[] = [];
    private _agents: NavMeshCrowdAgent[] = [];


    constructor(navMeshMagr: NavMesh, maxAgents: number, maxAgentRadius: number,) {
        this._navMeshMgr = navMeshMagr;
        this._tempVec = new navMeshMagr.recast.Vec3();
        this._recastCrowd = new this._navMeshMgr.recast.Crowd(maxAgents, maxAgentRadius, this._navMeshMgr.navMesh.getNavMesh());
    }
    public addAgent(node: Node, parameters: any): number {
        let config = new this._navMeshMgr.recast.dtCrowdAgentParams();
        config.radius = parameters.radius;
        config.height = parameters.height;
        config.maxAcceleration = parameters.maxAcceleration;
        config.maxSpeed = parameters.maxSpeed;
        config.collisionQueryRange = parameters.collisionQueryRange;
        config.pathOptimizationRange = parameters.pathOptimizationRange;
        config.separationWeight = parameters.separationWeight;
        config.updateFlags = 7;
        config.obstacleAvoidanceType = 0;  //障碍类型
        config.queryFilterType = 0;
        config.userData = 0;

        let pos: Vec3 = this._navMeshMgr.getClosestPoint(node.worldPosition);
        node.worldPosition = pos;  //强制改变代理的世界坐标位置
        let agentIndex: number = this._recastCrowd.addAgent(new this._navMeshMgr.recast.Vec3(pos.x, pos.y, pos.z), config);

        let agent: NavMeshCrowdAgent = {
            id: agentIndex,
            update: true,
            target: new Vec3(),
            destination: true,
            node: node,
            radius: parameters.reachRadius ? parameters.reachRadius : parameters.radius,
            offset: 360,
        };
        this._agentIds.push(agentIndex);
        this._agents.push(agent);
        return agentIndex;

    }
    /**
     * 更新代理参数
     * @param index 
     * @param parameters 
     */
    public updateAgentConfig(index: number, parameters: any): void {
        let agentParams = this._recastCrowd.getAgentParameters(index);

        if (parameters.radius !== undefined) {
            agentParams.radius = parameters.radius;
        }
        if (parameters.height !== undefined) {
            agentParams.height = parameters.height;
        }
        if (parameters.maxAcceleration !== undefined) {
            agentParams.maxAcceleration = parameters.maxAcceleration;
        }
        if (parameters.maxSpeed !== undefined) {
            agentParams.maxSpeed = parameters.maxSpeed;
        }
        if (parameters.collisionQueryRange !== undefined) {
            agentParams.collisionQueryRange = parameters.collisionQueryRange;
        }
        if (parameters.pathOptimizationRange !== undefined) {
            agentParams.pathOptimizationRange = parameters.pathOptimizationRange;
        }
        if (parameters.separationWeight !== undefined) {
            agentParams.separationWeight = parameters.separationWeight;
        }
        this._recastCrowd.setAgentParameters(index, agentParams);
    }
    public getAgentPosition(index: number): Vec3 {
        let agentPos = this._recastCrowd.getAgentPosition(index);
        return new Vec3(agentPos.x, agentPos.y, agentPos.z);
    }
    public getAgentNextTargetPath(index: number): Vec3 {
        let agentPos = this._recastCrowd.getAgentNextTargetPath(index);
        return new Vec3(agentPos.x, agentPos.y, agentPos.z);
    }
    public getAgentVelocity(index: number): Vec3 {
        let agentVel = this._recastCrowd.getAgentVelocity(index);
        return new Vec3(agentVel.x, agentVel.y, agentVel.z);
    }
    /**
     * 指定代理移动到目标位置
     * @param index 
     * @param destination 
     */

    public agentMoveTarget(index: number, target: Vec3): void {
        let _target: Vec3 = this._navMeshMgr.getClosestPoint(target);
        //直接传送到玩家当前真实的位置，
        const item = this._agentIds.indexOf(index);
        // let pos: Vec3 = this._agents[item].pos;
        // this._recastCrowd.agentTeleport(index, new this._navMeshMgr.recast.Vec3(pos.x, pos.y, pos.z));
        // this._recastCrowd.update(0);
        // let agentPosition = this.getAgentPosition(index);
        // this._agents[index].node.worldPosition = agentPosition;

        //移动到当前目标
        this._recastCrowd.agentGoto(index, new this._navMeshMgr.recast.Vec3(_target.x, _target.y, _target.z));
        if (item > -1) {
            //玩家为达到目的地  设置目的地的坐标
            this._agents[item].destination = false;
            this._agents[item].target.x = _target.x;
            this._agents[item].target.y = _target.y;
            this._agents[item].target.z = _target.z;
            this._agents[item].offset = 360;
        }


    }
    /**
    * 指定代理传送到目标位置
    */
    public agentTeleport(index: number, target: Vec3): void {
        let _target: Vec3 = this._navMeshMgr.getClosestPoint(target);
        this._recastCrowd.agentTeleport(index, new this._navMeshMgr.recast.Vec3(_target.x, _target.y, _target.z));
        const item = this._agentIds.indexOf(index);
        if (item > -1) {
            //玩家为达到目的地  设置目的地的坐标
            this._agents[item].destination = false;
            this._agents[item].target.x = _target.x;
            this._agents[item].target.y = _target.y;
            this._agents[item].target.z = _target.z;
        }
    }
    /**
     *移除指定代理
     * @param index 
     */
    public removeAgent(index: number): void {
        this._recastCrowd.removeAgent(index);
        let item = this._agentIds.indexOf(index);
        if (item > -1) {
            this._agentIds.splice(item, 1);
            this._agents.splice(item, 1);
        }
    }
    public activeAgent(index: number, state: boolean): void {
        let item = this._agentIds.indexOf(index);
        if (item > -1) {
            this._agents[item].update = state;
        }
    }
    public getAgents(): number[] {
        return this._agentIds;
    }
    public update(deltaTime: number): void {
        this._recastCrowd.update(deltaTime);
        //刷新代理的位置
        for (let index = 0; index < this._agentIds.length; index++) {
            let isUpdate: boolean = this._agents[index].update;
            let isDestination: boolean = this._agents[index].destination
            if (!isUpdate || isDestination) {  // 不刷新
                continue;
            }
            let agentIndex = this._agentIds[index];
            let agentPosition = this.getAgentPosition(agentIndex);
            let agentNextPosition = this.getAgentNextTargetPath(agentIndex)
            //同步距离
            this._agents[index].node.worldPosition = agentPosition;


            //获取当前角度以及计算新的角度
            this._nowQuat = this._agents[index].node.worldRotation;
            this.frontLookAt(this._newQuat, agentPosition, agentNextPosition);

            let dot: number = Quat.dot(this._nowQuat, this._newQuat);
            let angle: number = 2 * Math.acos(Math.abs(dot));
            if (angle > 45 / (180 / Math.PI) && this._agents[index].offset < 360) {
                // 将超过45度的角度变化标记为异常变化 使用上一次正常情况下的角度变化值
                let t: number = this._agents[index].offset / angle;
                Quat.lerp(this._newQuat, this._nowQuat, this._newQuat, t);
                // console.log("角度变化异常", angle * (180 / Math.PI), t);
            } else {

                this._agents[index].offset = angle;
            }
            this._agents[index].node.worldRotation = this._newQuat;


            let toTargetDis: number = Vec3.distance(agentPosition, this._agents[index].target);
            if (toTargetDis <= this._agents[index].radius) {
                this._agents[index].destination = true;
                this.agentTeleport(agentIndex, agentPosition);
            }

            // if(!isUpdate||isDestination){  // 不刷新 或者已经到达目的地
            //     continue;
            // }
            // let agentIndex = this._agentIds[index];
            // let agentPosition = this.getAgentPosition(agentIndex);
            // this._agents[index].node.worldPosition=agentPosition;
            // let toTargetDis:number=Vec3.distance(agentPosition,this._agents[index].target);
            // // console.log(agentPosition,toTargetDis,this._agents[index].radius)
            // if(toTargetDis<=this._agents[index].radius){
            //     this._agents[index].destination=true;
            // }

            // const currentAngle = getCurrentAngle();
            // // 获取目标角度
            // const targetAngle = getTargetAngle();
            // // 设置最大角度变化速度
            // const maxAngleChangeRate = 1.0; // 可根据需要调整
            // // 计算帧间的角度变化
            // const angleChange = targetAngle - currentAngle;
            // // 限制角度变化速度
            // if (Math.abs(angleChange) > maxAngleChangeRate) {
            //     angleChange = Math.sign(angleChange) * maxAngleChangeRate;
            // }
            // // 使用插值计算新的角度
            // const newAngle = currentAngle + angleChange;
            // // 应用新的角度到角色的旋转
            // applyRotation(newAngle);

        }
    }
    /**
     * z 轴正方向朝向指定目标
     */
    private frontLookAt(out: Quat, w_pos: Vec3, w_target: Vec3): void {
        let v3_a: Vec3 = new Vec3()
        Vec3.subtract(v3_a, w_pos, w_target);
        Vec3.normalize(v3_a, v3_a);
        Quat.fromViewUp(out, v3_a);
        Quat.rotateY(out, out, Math.PI);  //默认是-z 为前方， 绕y轴旋转180度
    }
    public destroy(): void {
        this._recastCrowd.destroy();
    }
}
interface NavMeshCrowdAgent {
    id: number,
    /**
     * 书否刷新代理位置
     */
    update: boolean,
    /**
     * 代理目标位置
     */
    target: Vec3,
    /**
     * 代理是否到达目的地
     */
    destination: boolean,
    /**
     * 当前代理绑定的节点
     */
    node: Node,
    /**
     * 虚拟半径  当代理到底距离目标点虚拟半径的范围内是  将停止移动
     */
    radius: number,
    /**
     * 记录上一帧
     * 节点角度的偏移读书
     */
    offset: any,
}
export enum MeshDebugDataType {
    LINE = 0,
    SURFACE = 1,
}
export interface NavMeshDebugData {
    positions: number[];
    normals: number[];
}
export interface IObstacle {
    // 代理updateFlags 的属性设置
    // DT_CROWD_ANTICIPATE_TURNS：这个标志位指示代理是否应该预测并避免未来可能的转弯。当设置时，代理会根据其速度和位置来预测可能的转弯，并采取措施以避免与其他代理发生碰撞。
    // DT_CROWD_OPTIMIZE_VIS：当设置时，代理将尝试优化其路径以减少不必要的绕过。这有助于减少路径的复杂性，但可能会导致代理在一些情况下不按照最短路径移动。
    // DT_CROWD_OPTIMIZE_TOPO：这个标志指示代理是否应该优化其路径以避免在多层导航网格中穿越楼梯或斜坡等拓扑障碍。这可以确保代理在多层导航网格中以更合适的方式移动。
    // DT_CROWD_OBSTACLE_AVOIDANCE：代理是否应该执行避障操作。当设置时，代理将尝试避免与障碍物碰撞，以保持其运动平滑。
    // DT_CROWD_SEPARATION：这个标志表示代理是否应该与其他代理保持一定的分离距离。当设置时，代理将积极避免与其他代理过于接近。、
    // DT_CROWD_OBSTACLE_AVOIDANCE_2：这是避障的另一种模式，通常用于复杂的情况下，以提高代理的避障性能。

    // obstacleAvoidanceType 的属性设置
    // 如果您不需要避障功能，或者自行实现了其他避障机制，可以选择 DT_CROWD_OBSTACLE_AVOIDANCE_DISABLED，以禁用避障。
    // 如果您对避障性能和精度有较高的要求，可以选择 DT_CROWD_OBSTACLE_AVOIDANCE_QUALITY。这个选项会提供更高的避障精度，但可能需要更多的计算资源。
    // 如果您更关注性能，而且对避障的精度要求不是特别高，可以选择 DT_CROWD_OBSTACLE_AVOIDANCE_LOW_QUALITY。这个选项在性能方面更高效，但可能牺牲一些精度。
    // 如果您希望在性能和精度之间取得平衡，可以选择 DT_CROWD_OBSTACLE_AVOIDANCE_MED_QUALITY。这个选项提供了一种中等的避障性能和计算效率。

    // updateFlags 和 separationWeight 在代理模拟中具有不同的作用，但它们可以在某种程度上相互关联，特别是在群体行为算法中。以下是它们之间的关系：
    // updateFlags：updateFlags 是用于定义代理更新行为的一组标志。这些标志控制代理在每个模拟步骤中执行的操作，例如路径规划、避障、分离等。
    // separationWeight：separationWeight 是一个控制代理之间分离行为强度的参数，用于确保代理保持一定的距离，避免相互碰撞。
    // 关系：
    // updateFlags 中可能包括一个标志，用于启用或禁用分离行为。当该标志被启用时，代理在模拟中将执行分离行为，并且 separationWeight 将影响该行为的强度。
    // 如果您将 updateFlags 中与分离行为相关的标志设置为启用，然后通过调整 separationWeight 的值，可以控制代理执行分离行为的强度。较高的 separationWeight 值将导致更积极的分离行为，而较低的值将减少其影响。
    // 总之，updateFlags 用于控制代理执行的各种行为，其中包括分离行为，而 separationWeight 是用于调整分离行为的强度。它们可以协同工作以实现更自然的群体行为，确保代理之间保持适当的距离。


    // pathOptimizationRange 是 Recast.js 中用于路径优化的参数之一，它用于控制路径优化的范围。具体的数值范围通常取决于您的应用和场景，可以根据需要进行调整。

    // 一般来说，pathOptimizationRange 的值可以是一个非负浮点数，通常是一个小数。这个值表示代理路径中的点之间的最大距离，当这个距离内的点之间没有障碍物时，路径优化将尝试移除这些中间点，从而减少路径的复杂性。较小的值会导致更严格的路径优化，而较大的值会导致更宽松的路径优化。

    // 您可以根据您的场景需求来调整 pathOptimizationRange 的值。一般来说，如果您希望路径非常精确，可以选择较小的值，但这可能会增加计算成本。如果您更关注性能和路径平滑度，可以选择较大的值。

    // 具体的数值范围通常没有硬性规定，因为它会因应用和场景的不同而异。建议您通过尝试不同的值并进行性能测试来找到最适合您应用的 pathOptimizationRange 值。根据实际情况，您可以逐步调整这个值以取得最佳性能和路径质量的平衡。

}

