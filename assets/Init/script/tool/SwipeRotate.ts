import { _decorator, Component, Node, EventTouch, Vec3 } from 'cc';
import { Messager } from '../manager/Messager';
const { ccclass, property } = _decorator;

@ccclass( 'SwipeRotate' )
export class SwipeRotate extends Component
{
    @property( Node )
    targetNode: Node = null!;  // 需要旋转的目标节点   

    @property
    rotationSpeed: number = 0.3; // 旋转速度系数（像素到角度的转换比例）
    private lastX: number = 0;
    private isDragging: boolean = false;
    onLoad ()
    {
        this.node.on( Node.EventType.TOUCH_START, this.onTouchStart, this );
    }

    onEnable ()
    {
        Messager.AddListener( 'SetGo', this, this.SetGo );
        this.node.on( Node.EventType.TOUCH_MOVE, this.onTouchMove, this );
        this.node.on( Node.EventType.TOUCH_END, this.onTouchEnd, this );
        this.node.on( Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this );
    }

    onDisable ()
    {
        Messager.RemoveListener( 'SetGo', this, this.SetGo );
        this.node.off( Node.EventType.TOUCH_MOVE, this.onTouchMove, this );
        this.node.off( Node.EventType.TOUCH_END, this.onTouchEnd, this );
        this.node.off( Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this );
    }
    SetGo ( go )
    {
        this.targetNode = go;
    }

    private onTouchStart ( event: EventTouch )
    {
        this.lastX = event.getLocationX();
        this.isDragging = true;
    }

    private onTouchMove ( event: EventTouch )
    {
        if ( !this.isDragging ) return;
        const currentX = event.getLocationX();
        const deltaX = currentX - this.lastX;

        // 根据增量直接更改旋转角度
        this.adjustRotation( deltaX * this.rotationSpeed );

        this.lastX = currentX; // 更新最后记录位置
    }
    private onTouchEnd ()
    {
        this.isDragging = false;
    }

    private adjustRotation ( deltaAngle: number )
    {
        const currentEuler = this.targetNode.eulerAngles;
        const newYAngle = currentEuler.y + deltaAngle;
        // 规范角度范围到 0-360 度
        const normalizedY = ( newYAngle % 360 + 360 ) % 360;

        // 直接设置旋转角度
        this.targetNode.setRotationFromEuler(
            new Vec3( currentEuler.x, normalizedY, currentEuler.z )
        );
    }
}
