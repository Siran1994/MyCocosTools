
import { _decorator, Component, Vec3, PhysicsSystem, input, Input, EventTouch } from 'cc';
import { RigidCharacter } from './rigidCharacter';
import { GameManager } from '../../manager/GameManager';

const { ccclass, property } = _decorator;
const v3_0 = new Vec3();

@ccclass( 'RigidCharacterController' )
export class RigidCharactorController extends Component
{
    @property( { type: RigidCharacter } )
    character: RigidCharacter = null!;

    @property
    speed: Vec3 = new Vec3( 1, 0, 1 );

    protected _stateX: number = 0;  // 1 positive, 0 static, -1 negative
    protected _stateZ: number = 0;
    protected _speed = 0;

    update ( dtS: number )
    {
        if ( GameManager.Instance.IsStart )
        {
            this.Move( PhysicsSystem.instance.fixedTimeStep );
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
        let x = touch.getUIDelta().x;
        if ( x > 0 )
        {
            this._stateX = this.speed.x;
        } else
        {
            this._stateX = -this.speed.x;
        }
    }

    touchEnd ( touch: EventTouch )
    {
        this._stateX = 0;
    }

    touchCancel ( touch: EventTouch )
    {
        this._stateX = 0;
    }

    Move ( dt: number )
    {
        this.character.updateFunction( dt );
        this._stateZ = this.speed.z;
        if ( !this.character.onGround )
            return;
        if ( this._stateX || this._stateZ )
        {
            v3_0.set( this._stateX, 0, this._stateZ );
            v3_0.normalize();
            this.character.move( v3_0, 1 );
        }
    }
}