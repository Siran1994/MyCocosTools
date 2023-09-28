
import { _decorator, Component, Vec3, input, Input, EventTouch, RigidBodyComponent, Node } from 'cc';
import { GameManager } from '../manager/GameManager';
const { ccclass, property } = _decorator;
const v3_0 = new Vec3( 0, 0, 0 );
@ccclass( 'RigidCharacterController' )
export class RigidCharactorController extends Component
{
    @property( { type: RigidBodyComponent } )
    rigidBody: RigidBodyComponent;
    @property
    width = 3.5;
    @property
    MaxAngle = 60;
    _stateX: number = 0;
    deltaSpeed = 0.2;

    update ( deltaTime: number )
    {
        if ( GameManager.Instance.IsStart )
        {
            this.Move( deltaTime );
        }
    }
    onEnable ()
    {
        input.on( Input.EventType.TOUCH_START, this.touchStart, this );
        input.on( Input.EventType.TOUCH_MOVE, this.touchMove, this );
        input.on( Input.EventType.TOUCH_END, this.touchEnd, this );
        input.on( Input.EventType.TOUCH_CANCEL, this.touchCancel, this );

    }

    onDisable ()
    {
        input.off( Input.EventType.TOUCH_START, this.touchStart, this );
        input.off( Input.EventType.TOUCH_MOVE, this.touchMove, this );
        input.off( Input.EventType.TOUCH_END, this.touchEnd, this );
        input.off( Input.EventType.TOUCH_CANCEL, this.touchCancel, this );
    }

    touchStart ( touch: EventTouch )
    {
        this._stateX = 0;
    }

    touchMove ( touch: EventTouch )
    {
        if ( GameManager.Instance.IsStart )
            this.silkMove( touch );
    }

    touchEnd ( touch: EventTouch )
    {
        this._stateX = 0;
    }

    touchCancel ( touch: EventTouch )
    {
        this._stateX = 0;
    }

    Move ( deltaTime: number )
    {
        const position = this.node.position;
        v3_0.set( this.node.forward.x + this._stateX, 0, this.node.forward.z );
        v3_0.normalize();
        v3_0.multiplyScalar( GameManager.Instance.Speed * deltaTime );
        // 更新物体的位置
        this.node.setPosition( position.x + v3_0.x, position.y + v3_0.y, position.z + v3_0.z );
    }

    //丝滑移动
    silkMove ( touch: EventTouch )
    {
        const delta = touch.getDelta();
        let pos = this.node.position;
        let x = pos.x + this.deltaSpeed * delta.x;
        if ( x >= this.width )
            x = this.width;
        if ( x <= -this.width )
            x = -this.width;
        this.node.position = this.node.position.lerp( new Vec3( x, this.node.position.y, this.node.position.z ), 0.1 );
    }

    //丝滑转动
    silkRotate ( touch: EventTouch )
    {
        const delta = touch.getDelta();
        let ros = this.node.eulerAngles;
        let z = ros.z - this.deltaSpeed * delta.x;
        if ( z >= this.MaxAngle )
            z = this.MaxAngle;
        if ( z <= -this.MaxAngle )
            z = -this.MaxAngle;
        this.node.eulerAngles = this.node.eulerAngles.lerp( new Vec3( 0, 0, z ), 0.1 );
    }
}