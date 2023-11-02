import { _decorator, Camera, Component, v3, Vec3 } from "cc";

const { ccclass, property } = _decorator;

@ccclass
export default class CameraShake extends Component
{

    public static Instance: CameraShake = null!;
    onLoad ()
    {
        CameraShake.Instance = this;
    }

    @property( Camera )
    camera: Camera = null;

    originalPosition: Vec3 = v3( 0, 0, 0 );
    shakeTime: number = 0;
    shakeAmount: number = 0;
    shakeInterval: number = 0.1;

    start ()
    {
        // 记录相机的初始位置
        this.originalPosition = this.camera.node.position;
    }

    shake ( amount: number = 1, time: number = 0.25 )
    {
        this.shakeAmount = amount;
        this.shakeTime = time;
        this.schedule( this.updateShake, this.shakeInterval );
    }

    updateShake ()
    {
        if ( this.shakeTime > 0 )
        {
            // 随机生成一个偏移量并应用到相机位置
            const offsetX = ( Math.random() - 0.5 ) * this.shakeAmount;
            const offsetY = ( Math.random() - 0.5 ) * this.shakeAmount;
            this.camera.node.setPosition( this.originalPosition.x + offsetX, this.originalPosition.y + offsetY, this.originalPosition.z );
            this.shakeTime -= this.shakeInterval;
        } else
        {
            // 相机抖动结束，恢复到初始位置
            this.camera.node.setPosition( this.originalPosition );
            this.unschedule( this.updateShake );
        }
    }
}
