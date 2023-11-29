import { _decorator, Component, Node, RigidBody, SkeletalAnimation, v3, Vec3, Animation, SkeletalAnimationState, math, BoxCollider, Camera, ITriggerEvent } from 'cc';
import { Utils } from '../tool/Utils';
import { PhysicsGroup } from './PhysicsGroup';
import { PoolManager } from '../manager/PoolManager';
import { UiManager } from '../manager/UiManager';
import { Messager } from '../manager/Messager';
import { Bullet } from './Bullet';
import { GameManager } from '../manager/GameManager';
import { AudioMgr } from '../manager/AudioMgr';
import { AiState } from '../data/Enum';
import { PlayerCtrl } from '../role/PlayerCtrl';
import { HpBar } from './HpBar';
const { ccclass, property } = _decorator;
let tempVelocity: Vec3 = v3();

@ccclass( 'AiData' )
export class AiData
{
    @property( Number )
    maxHp: number = 100;//最大生命值

    @property( Number )
    hp: number = 100;//生命

    @property( Number )
    atk: number = 10;//攻击力   

    get hpPercent (): number
    {
        return math.clamp01( this.hp / this.maxHp );
    }
}

@ccclass( 'AiBase' )
export class AiBase extends Component
{
    @property( SkeletalAnimation )
    anmator: SkeletalAnimation = null;

    @property( RigidBody )
    rigidbody: RigidBody = null;

    @property( { type: BoxCollider } )
    collider: BoxCollider = null;

    @property( Node )
    HpBarPos: Node = null;

    @property( Number )
    linearSpeed: number = 3.0;

    @property( Number )
    angularSpeed: number = 180;

    @property( HpBar )
    hpBar: HpBar = null;

    currState: AiState | string = AiState.待机;

    destForward: Vec3 = v3()

    get dead (): boolean
    {
        return this.currState == AiState.死亡;
    }

    @property( AiData )
    aiData: AiData = null;

    @property( Boolean )
    isEnemy = false;

    init ()//战前准备
    {

        let go = PoolManager.getNode( UiManager.Instance.HpBar, UiManager.Instance.fightPanel.target );
        this.hpBar = go.getComponent( HpBar );
        this.hpBar.init( this.isEnemy );
        this.hpBar.showHpBar( 1 );
        this.syncUiHpBar();

        if ( this.isEnemy )
            this.rigidbody.group = PhysicsGroup.Enemy;
        else
            this.rigidbody.group = PhysicsGroup.Player;
    }

    start ()
    {
        this.anmator?.on( Animation.EventType.FINISHED, ( eventType: Animation.EventType, state: SkeletalAnimationState ) =>
        {
            if ( state.name == AiState.攻击 )
                this.changeState( AiState.待机 );

            if ( state.name == AiState.受击 )
                this.changeState( AiState.待机 );

        }, this );

        this.collider?.on( "onTriggerEnter", ( event: ITriggerEvent ) =>
        {
            if ( !PhysicsGroup.isHurtable( event.otherCollider.getGroup(), this.collider.getGroup() ) )
                return;
            if ( event.otherCollider.node.name == 'Bullet' )
            {
                console.log( '被敌人子弹击中' );
                const bullet = event.otherCollider.getComponent( Bullet );
                const hostActor = bullet!.host?.getComponent( AiBase );
                let hurtDirection = v3()
                Vec3.subtract( hurtDirection, event.otherCollider.node.worldPosition, event.selfCollider.node.worldPosition );
                hurtDirection.normalize();
                this.hurt( hostActor.aiData.atk, hostActor!, hurtDirection );
                PoolManager.putNode( event.otherCollider.node );
                AudioMgr.Instance.受击.Play();
            }
        }, this );
    }

    update ( deltaTime: number )
    {
        if ( this.currState == AiState.死亡 )
            return;
        let a = Utils.signAngle( this.node.forward, this.destForward, Vec3.UP );
        let as = v3( 0, a * 20, 0 );
        this.rigidbody.setAngularVelocity( as );

        switch ( this.currState )
        {
            case AiState.奔跑:
                this.doMove();
                break;
        }
    }

    doMove ()//移动
    {
        let speed = this.linearSpeed * this.destForward.length();
        tempVelocity.x = math.clamp( this.node.forward.x, -1, 1 ) * speed;
        tempVelocity.z = math.clamp( this.node.forward.z, -1, 1 ) * speed;
        this.rigidbody?.setLinearVelocity( tempVelocity );
    }

    stopMove ()//停止移动
    {
        this.rigidbody?.setLinearVelocity( Vec3.ZERO );
    }

    hurt ( dam: number, hurtSource: AiBase | null, hurtDirection: Vec3 )//受伤
    {
        // this.changeState( AiState.受击 );
        this.changeState( AiState.待机 );
        if ( this.currState != AiState.死亡 )
        {
            this.aiData.hp -= dam;
            this.hpBar.showHpBar( this.aiData.hpPercent );//更新血条
            if ( this.aiData.hp <= 0 )
            {
                this.aiData.hp = 0;
                this.hpBar.showHpBar( this.aiData.hpPercent );//更新血条
                this.onDie()
            }
        }
    }

    changeState ( state: AiState | string )
    {
        if ( state == this.currState && state != AiState.受击 )
            return;

        if ( this.currState == AiState.死亡 )
            return;

        if ( this.currState == AiState.奔跑 )
            this.stopMove()

        this.anmator?.crossFade( state as string, 0.1 );
        this.currState = state;
    }

    onDie ()
    {
        if ( this.currState == AiState.死亡 )
            return;
        this.changeState( AiState.死亡 );
        // this.node.destroy();//敌人死亡    //需要进行处理
        // this.hpBar.node.destroy();  
        this.node.parent.name = 'Pos';
        this.node.parent = GameManager.Instance.node.parent;
        this.changeState( AiState.死亡 );
        Messager.Broadcast( 'ChangeTarget', this.isEnemy );
        this.node.active = false;
    }

    attack ()
    {
        this.changeState( AiState.攻击 );
    }

    syncUiHpBar ()//同步血条
    {
        // var wPos = this.HpBarPos.getWorldPosition();
        // var screenPos = PlayerCtrl.Instance.Camera.getComponent( Camera ).worldToScreen( wPos );
        // this.hpBar.showAt( screenPos );
    }

    lateUpdate ( dt: number )//更新血条位置
    {
        if ( this.hpBar )
        {
            this.syncUiHpBar();
        }
    }
}