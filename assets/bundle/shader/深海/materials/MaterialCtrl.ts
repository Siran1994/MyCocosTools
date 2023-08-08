
import { _decorator, Component, Node, MeshRenderer, Color, Vec4 } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = MaterialCtrl
 * DateTime = Thu Mar 10 2022 12:27:11 GMT+0800 (中国标准时间)
 * Author = tombs_tang
 * FileBasename = MaterialCtrl.ts
 * FileBasenameNoExtension = MaterialCtrl
 * URL = db://assets/app/materials/MaterialCtrl.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

@ccclass('MaterialCtrl')
export class MaterialCtrl extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    start() {
        // [3]
        // 获取节点上的模型渲染
        let target = this.node.getComponent(MeshRenderer);

        // target.sharedMaterial会直接对材质进行设置，所有引用同一个材质文件的对象均会受到影响。
        // 设置mainColor
        let color = new Color(255, 0, 0, 255)
        target.sharedMaterial.setProperty('mainColor', color)

        // 设置colorScaleAndCutoff
        let colorScaleAndCutoff = new Vec4(1.0, 1.0, 1.0, 0.5)
        target.sharedMaterial.setProperty('colorScaleAndCutoff', colorScaleAndCutoff)
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.4/manual/zh/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.4/manual/zh/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.4/manual/zh/scripting/life-cycle-callbacks.html
 */
