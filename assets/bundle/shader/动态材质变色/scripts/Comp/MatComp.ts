import { _decorator, Component, SkinnedMeshRenderer, renderer, Color, } from 'cc';
import { insColor } from '../BulletEnum';
const { ccclass, property,executeInEditMode } = _decorator;


@ccclass('材质颜色组件')
@executeInEditMode
export class MatComp extends Component {

    @property({ type: SkinnedMeshRenderer, tooltip: '拖入角色meshRender材质' })
    mesh: SkinnedMeshRenderer = null;
    @property({ displayName: "是否启用Instanced", tooltip:"材质中使用instanced合批请勾选",displayOrder: 0 })
    private useInstanced: boolean = false;

    private mat: renderer.MaterialInstance = null;
    private colorEle: any = null
    private currentProp: string = null;

  
    onEnable(){
        if(this.useInstanced) {
            this.scheduleOnce(this.resetMain,0.0016)
        }
        else{
            this.mat = this.mesh.material;
        }
    }
    resetMain(){
        this.mesh.setInstancedAttribute("i_mainColor", insColor.WHITE)
    }

    onDisable() {
        this.colorEle = null;
        this.currentProp = null;
        this.mesh=null;
        this.mat =null;
    }

   
    setProp(ele) {

        this.useInstanced?this.setInstanced(ele):this.setNormal(ele)
     
    }

    setInstanced(ele){
        if (this.currentProp != null && this.currentProp != ele.prop) {
            this.resetInstanced()
        }

        this.currentProp = "i_"+ele.prop;
        this.mesh.setInstancedAttribute("i_mainColor", insColor.WHITE);
        this.colorEle = ele.insArr;
        this.mesh.setInstancedAttribute(this.currentProp, this.colorEle);
        this.unschedule(this.resetInstanced)
        if (ele.dura > 0) this.scheduleOnce(this.resetInstanced, ele.dura)/* 持续时间大于0时，重置初始状态 */

    }

    resetInstanced() {
        if(this.currentProp=="i_baseColor"){
            this.mesh.setInstancedAttribute(this.currentProp, insColor.BLACK);
            return
        }
        this.mesh.setInstancedAttribute(this.currentProp, this.currentProp == "i_mainColor" ? insColor.WHITE : insColor.TRANSPARENT);
    }
    
    setNormal(ele){
        if (this.currentProp != null && this.currentProp != ele.prop) {
            this.resetNormal()
        }
        this.currentProp = ele.prop;
        this.colorEle = ele.color;
        this.unschedule(this.resetNormal)
        this.changeNormal()
        if (ele.dura > 0) this.scheduleOnce(this.resetNormal, ele.dura)/* 持续时间大于0时，重置初始状态 */
    }

    changeNormal() {
        this.mat.setProperty(this.currentProp, this.colorEle);
    }

    resetNormal() {
        if(this.currentProp=="baseColor"){
            this.mat.setProperty(this.currentProp, Color.BLACK);
            return
        }
        this.mat.setProperty(this.currentProp, this.currentProp == "mainColor" ? Color.WHITE : Color.TRANSPARENT);
    }

}

