import { _decorator, Component, Node, Camera, MeshRenderer } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UniformSetter')
export class UniformSetter extends Component {

    @property(Camera)
    camera:Camera;

    start() {
        this.camera = this.node.getComponent(Camera);
        this.camera.camera.matViewProjInv;
        this.camera.camera.position;

        let material = this.node.getComponent(MeshRenderer).sharedMaterial;
        material.setProperty('matViewProjInv', this.camera.camera.matViewProjInv);
        material.setProperty('cameraWorldPos', this.camera.camera.position);
    }

    update(deltaTime: number) {
        
    }
}

