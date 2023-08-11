
import { _decorator, Component, Vec3, input, Input, EventTouch, RigidBodyComponent, tween, Node, PhysicsSystem, game } from 'cc';
import { HeroType } from '../data/Enum';
import { GameData } from '../data/GameData';
import { AudioMgr } from '../manager/AudioMgr';
import { GameManager } from '../manager/GameManager';
import { Messager } from '../manager/Messager';
import { PlayerCtrl } from './PlayerCtrl';
const { ccclass, property } = _decorator;
const v3_0 = new Vec3( 0, 0, 0 );

@ccclass( 'RigidCharacterController' )
export class RigidCharactorController extends Component
{
    @property( { displayName: '小号', type: Node } ) //玩家站位
    Player: Node = null;

    @property( { displayName: '黑液人', type: Node } ) //玩家站位
    Venom: Node = null;

    @property( { displayName: '浩克', type: Node } ) //玩家站位
    Huk: Node = null;

    @property( { type: RigidBodyComponent } )
    rigidBody: RigidBodyComponent;

    protected _stateX: number = 0;
    _angle = 0;
    TargetPos = new Vec3();

    protected start (): void
    {
        PhysicsSystem.instance.gravity = new Vec3( 0, -50, 0 ); // 设置重力向量为向下的 1000 米/秒²//设置重力
        game.frameRate = GameData.GameFrame;//帧率设置
        PhysicsSystem.instance.fixedTimeStep = 1 / game.frameRate;//优化物理引擎计算次数
    }
    update ( deltaTime: number )
    {
        if ( GameManager.Instance.IsStart )
            this.Move( deltaTime );
        this.rigidBody.applyForce( PhysicsSystem.instance.gravity );
    }
    onEnable ()
    {
        input.on( Input.EventType.TOUCH_START, this.touchStart, this );
        input.on( Input.EventType.TOUCH_MOVE, this.touchMove, this );
        input.on( Input.EventType.TOUCH_END, this.touchEnd, this );
        input.on( Input.EventType.TOUCH_CANCEL, this.touchCancel, this );
        Messager.AddListener( 'battleStart', this, this.BattleStart );
        Messager.AddListener( 'changeDir', this, this.ChangeDir );
        Messager.AddListener( 'changeBody', this, this.ChangeBody );
    }

    onDisable ()
    {
        input.off( Input.EventType.TOUCH_START, this.touchStart, this );
        input.off( Input.EventType.TOUCH_MOVE, this.touchMove, this );
        input.off( Input.EventType.TOUCH_END, this.touchEnd, this );
        input.off( Input.EventType.TOUCH_CANCEL, this.touchCancel, this );
        Messager.RemoveListener( 'battleStart', this, this.BattleStart );
        Messager.RemoveListener( 'changeDir', this, this.ChangeDir );
        Messager.RemoveListener( 'changeBody', this, this.ChangeBody );
    }
    BattleStart ()
    {
        GameManager.Instance.Speed = 0;
        this.node.worldPosition = new Vec3( this.node.worldPosition.x, 0.1, this.node.worldPosition.z );
    }
    isturing = false;
    ChangeDir ( angle: number, pos: Vec3 )
    {
        this.isturing = true;
        tween( this.node )
            .sequence
            (
                tween().to( 0.2,
                    {
                        eulerAngles: new Vec3( 0, angle, 0 )                       // 旋转缓动
                    },
                    { easing: "linear" } ),
                tween().call( () =>
                {
                    this.node.eulerAngles = new Vec3( 0, angle, 0 );
                    this._angle = angle;
                    this.TargetPos = pos;
                    this.isturing = false;
                } ),
            )
            .start();
    }

    ChangeBody ( heroType: HeroType )
    {
        if ( heroType == HeroType.黑液人 ) 
        {
            this.Player.active = false;
            this.Venom.active = true;
            this.Huk.active = false;
        }
        if ( heroType == HeroType.超级巨人 ) 
        {
            this.Player.active = false;
            this.Venom.active = false;
            this.Huk.active = true;
        }
        PlayerCtrl.Instance.ShowEffect( 2 );
        AudioMgr.Instance.吃到服装.Play();
    }

    touchStart ( touch: EventTouch )
    {
        this._stateX = 0;
    }

    touchMove ( touch: EventTouch )
    {
        if ( this.isturing == false && GameManager.Instance.IsStart )
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
        if ( this.node.position.y < -2 )
        {
            this.node.setPosition( this.node.position.x, 0, this.node.position.z );
            this.rigidBody.isKinematic = true;
            Messager.Broadcast( 'gameOver', true );
            return;
        }
        const position = this.node.position;
        if ( this._angle == -1 || this._angle == 0 )
            v3_0.set( this.node.forward.x + this._stateX, 0, this.node.forward.z );
        else if ( this._angle == -90 )
            v3_0.set( this.node.forward.x, 0, this.node.forward.z + this._stateX );
        else if ( this._angle == 90 )
            v3_0.set( this.node.forward.x, 0, this.node.forward.z - this._stateX );
        v3_0.normalize();
        v3_0.multiplyScalar( GameManager.Instance.Speed * deltaTime );
        // 更新物体的位置
        this.node.setPosition( position.x + v3_0.x, position.y + v3_0.y, position.z + v3_0.z );
    }

    deltaSpeed = 0.2;

    //丝滑移动
    silkMove ( touch: EventTouch )
    {
        const delta = touch.getDelta();
        let pos = this.node.position;
        if ( this._angle == -1 || this._angle == 0 )
        {
            let x = pos.x + this.deltaSpeed * delta.x;
            if ( x >= 2.3 + this.TargetPos.x )
                x = 2.3 + this.TargetPos.x;
            if ( x <= -2.3 + this.TargetPos.x )
                x = -2.3 + this.TargetPos.x;
            this.node.position = this.node.position.lerp( new Vec3( x, this.node.position.y, this.node.position.z ), 0.1 );
        }
        else
        {
            let z = 0;
            if ( this._angle == 90 )
                z = pos.z - this.deltaSpeed * delta.x;
            else
                z = pos.z + this.deltaSpeed * delta.x;

            if ( z >= 2.3 + this.TargetPos.z )
                z = 2.3 + this.TargetPos.z;
            if ( z <= -2.3 + this.TargetPos.z )
                z = -2.3 + this.TargetPos.z;
            this.node.position = this.node.position.lerp( new Vec3( this.node.position.x, this.node.position.y, z ), 0.1 );
        }
    }
}