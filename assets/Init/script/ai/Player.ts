import { _decorator, Component, game, macro, math, Node, v3, Vec3 } from 'cc';
import { AiBase } from './AiBase';
import { ActionType, AiState, FighterType } from '../data/Enum';
import { BulletShoot } from './BulletShoot';
import { Messager } from '../manager/Messager';
import { Utils } from '../tool/Utils';
import { BattleStage } from './BattleStage';
const { ccclass, property, requireComponent } = _decorator;
let temp = v3();
@ccclass( 'Player' )
@requireComponent( AiBase )
export class Player extends Component
{
    @property( AiBase )
    aiBase: AiBase = null;

    @property( Number )
    atkRange: number = 0.5;

    @property( { type: FighterType } )
    fighterType: FighterType = FighterType.近战;

    @property( {
        type: BulletShoot, visible: function ( this: Player )
        {
            return this.fighterType == FighterType.远程;
        }
    } )
    bulletShoot: BulletShoot = null;

    @property( {
        type: Node, visible: function ( this: Player )
        {
            return this.fighterType == FighterType.远程;
        }
    } )
    shootPos: Node = null;

    @property( Number )
    atkInterval: number = 5000;

    actionType: ActionType = ActionType.追击;

    lastAtkTime: number = 0;

    @property( { type: AiBase } )
    target: AiBase = null;

    init ()
    {
        this.aiBase.init();
        // //需要设置目标
        if ( this.aiBase.isEnemy )
        {
            this.target = this.getRandomTarget( false );
            this.schedule( this.AiAction, 1.0, macro.REPEAT_FOREVER, 1.0 );
        }
        else
        {
            this.target = this.getRandomTarget( true );
            this.schedule( this.AiAction, 1.0, macro.REPEAT_FOREVER, 1.0 );
        }
    }

    onEnable ()
    {
        Messager.AddListener( 'ChangeTarget', this, this.ChangeTarget );
        this.node.on( "atk", this.atk, this );
    }

    onDisable ()
    {
        Messager.RemoveListener( 'ChangeTarget', this, this.ChangeTarget );
        this.node.off( "atk", this.atk, this );
    }

    onDestroy ()
    {
        this.unschedule( this.AiAction );
    }

    ChangeTarget ()
    {
        if ( this.aiBase.isEnemy )
            this.target = this.getRandomTarget( false );
        else
            this.target = this.getRandomTarget( true );
    }

    AiAction ()//Ai行为
    {
        if ( this.target == null ) // 找不到目标
            return;
        if ( this.aiBase.currState != AiState.待机 && this.aiBase.currState != AiState.奔跑 )  // 我不处于 Run/Idle 状态
            return;

        const canAttack = game.totalTime - this.lastAtkTime >= this.atkInterval;

        if ( this.target.currState == AiState.死亡 || !canAttack ) // 目标已死或我不能攻击
        {
            this.actionType = ActionType.待机;
            this.aiBase.changeState( ActionType.待机 );
            return;
        }

        const distance = Vec3.distance( this.node.worldPosition, this.target.node.worldPosition ); // 判断是否在攻击范围内

        if ( distance > this.atkRange )
        {
            this.actionType = ActionType.追击;
            this.aiBase.changeState( AiState.奔跑 );
            Vec3.subtract( temp, this.target!.node.worldPosition, this.node.worldPosition );
            temp.normalize();
            this.aiBase.destForward.set( temp.x, 0, temp.z );
            return;
        }
        this.actionType = ActionType.攻击;
        Vec3.subtract( temp, this.target!.node.worldPosition, this.node.worldPosition );
        temp.normalize();
        this.aiBase.destForward.set( temp.x, 0, temp.z );
        this.aiBase.node.forward.set( temp.x, 0, temp.z );
        this.aiBase.changeState( AiState.攻击 );
        this.lastAtkTime = game.totalTime;
    }

    isFaceTarget (): boolean
    {
        Vec3.subtract( temp, this.target.node.worldPosition, this.node.worldPosition );
        temp.y = 0;
        temp.normalize();
        return Vec3.angle( this.node.forward, temp ) < math.toRadian( 60 );
    }

    atk ()//帧事件
    {
        if ( !this.target )
            return;

        if ( this.fighterType == FighterType.近战 )
        {
            let dir = v3();
            Vec3.subtract( dir, this.target.node.worldPosition, this.node.worldPosition );
            let angle = Vec3.angle( this.node.forward, dir );
            if ( angle < Math.PI * 0.5 )
            {
                const distance = dir.length();

                if ( distance < this.atkRange )
                {
                    this.target.hurt( this.aiBase.aiData.atk, this.aiBase, dir );
                }
            }
        }
        else //发射子弹
        {
            let bullet = this.bulletShoot!.create( this.aiBase.isEnemy );
            bullet.node.worldPosition = this.shootPos.worldPosition;

            bullet.target = this.target.node;

            bullet.host = this.node;
            Vec3.subtract( temp, this.target.node.worldPosition, this.node.worldPosition );
            temp.normalize();
            bullet.node.forward = temp;
            bullet.fire();
        }
    }

    getRandomTarget ( isEnemy: boolean )
    {
        let targets = null;
        if ( isEnemy )
            targets = BattleStage.Instance.getEnemyTarget();
        else
            targets = BattleStage.Instance.getPlayerTarget();
        if ( !targets || targets?.length == 0 )
            return;
        let actor = targets[ Utils.randomNum( 0, targets.length - 1 ) ].getComponent( AiBase );
        return actor;
    }

    getNeareastEnemy ( isEnemy = false )
    {
        let enemies = null;
        if ( isEnemy )
            enemies = BattleStage.Instance.getPlayerTarget();
        else
            enemies = BattleStage.Instance.getEnemyTarget();
        if ( !enemies || enemies?.length == 0 )
        {
            return null;
        }

        let nearDistance = 99999;
        let nearastEnemy: Node | null = null;
        for ( let enemy of enemies )
        {

            const actor = enemy.getComponent( AiBase );
            if ( actor.dead )
            {
                continue;
            }

            const distance = Vec3.distance( this.node.worldPosition, enemy.worldPosition );
            if ( distance < nearDistance )
            {
                nearDistance = distance;
                nearastEnemy = enemy;
            }
        }
        return nearastEnemy;
    }
}