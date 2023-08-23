import { _decorator, Camera, Component, find, Node, Prefab, tween, Vec3 } from 'cc';
import { FinishPanel } from '../panel/FinishPanel';
import { CameraMgr } from '../camera/CameraMgr';
import { PlayerState } from '../data/Enum';
import { AudioMgr } from '../manager/AudioMgr';
import { GameManager } from '../manager/GameManager';
import { Messager } from '../manager/Messager';
import { PoolManager } from '../manager/PoolManager';
import { ResMgr } from '../manager/ResMgr';
import { Utils } from '../tool/Utils';
import { Boss } from './Boss';
import { PlayerCtrl } from './PlayerCtrl';
import { Config } from '../data/Config';
import { UiManager } from '../manager/UiManager';
const { ccclass, property } = _decorator;

@ccclass( 'BattleStage' )
export class BattleStage extends Component
{
    public static Instance: BattleStage = null!;
    onLoad ()
    {
        BattleStage.Instance = this;
    }

    @property( { displayName: '玩家站位', type: Node } ) //玩家站位
    PlayerPos: Node = null;

    @property( { displayName: '相机位置', type: Node } ) //玩家站位
    CameraPos: Node = null;

    @property( { displayName: '结束位置', type: Node } ) //玩家站位
    FinishPos: Node = null;

    @property( { displayName: 'Boss', type: Node } ) //Boss
    BossObj: Node = null;

    @property( { displayName: '动画相机', type: Node } )//动画相机
    followCamera: Node = null;

    @property( { displayName: '胜利特效', type: Node } )
    finishEffect: Node = null;//胜利特效

    @property( { displayName: '积分榜', type: Node } )//积分榜
    scoreBoard: Node = null;

    @property( { displayName: '奖励坐标点', type: Node } )
    PosList: Node[] = [];

    start ()
    {
        this.finishEffect.active = false;
    }

    onEnable ()
    {
        Messager.AddListener( 'battleStart', this, this.BattleStart );
        Messager.AddListener( 'bossFlyAni', this, this.bossFlyAni );
    }
    onDisable ()
    {
        Messager.RemoveListener( 'battleStart', this, this.BattleStart );
        Messager.RemoveListener( 'bossFlyAni', this, this.bossFlyAni );
    }
    BattleStart ()
    {
        PlayerCtrl.Instance.ShowEffect( 3, true );
        PlayerCtrl.Instance.Play( PlayerState.战架 );
        UiManager.hidePage( 'GamePanel' );
        GameManager.Instance.target.worldPosition = this.PlayerPos.worldPosition;
        Utils.DelayCallBack( 0.1, () =>
        {
            CameraMgr.Instance.node.active = false;
            GameManager.Instance.IsStart = false;
            GameManager.Instance.MainCamera.active = true;
            GameManager.Instance.MainCamera.setParent( this.node );
            GameManager.Instance.MainCamera.getComponent( Camera ).fov = 60;
            this.CameraAni();
        } );
    }

    CameraAni ()//相机特写动画
    {
        tween( GameManager.Instance.MainCamera )
            .sequence
            (
                tween().to( 1.5,
                    {
                        position: this.CameraPos.position,               // 位置缓动
                        scale: Vec3.ONE,                     // 缩放缓动
                        eulerAngles: new Vec3( -10, 90, 0 )                       // 旋转缓动
                    },
                    { easing: "linear" } ),

                tween().call( () =>
                {
                    //战斗开始
                    UiManager.showPage( 'FinishPanel' );
                    GameManager.Instance.BossPower = GameManager.Instance.GetBossPower();
                    console.log( '当前Player战力是:' + GameManager.Instance.PlayerPower );
                    console.log( '当前boss战力是:' + GameManager.Instance.BossPower );
                    Messager.Broadcast( 'atkStart' );
                } ),
            )
            .start();
    }

    bossFlyAni ()//Boss飞行动画
    {
        let index = find( 'FinishPanel' ).getComponent( FinishPanel ).calculateDis();//获取飞行距离
        let lastTime = 0.5 * index;
        GameManager.Instance.MainCamera.active = false;
        this.followCamera.active = true;
        Boss.Instance.BossFlyAni( lastTime );
        tween( this.BossObj )
            .sequence
            (
                tween().to( lastTime,
                    {
                        position: this.PosList[ index ].position,               // 位置缓动                         
                    },
                    { easing: "linear" } ),
                tween().call( () =>
                {
                    Utils.DelayCallBack( 1.5, () =>
                    {
                        GameManager.Instance.target.worldPosition = this.FinishPos.worldPosition;
                        GameManager.Instance.target.worldRotation = this.FinishPos.worldRotation;
                        //飞行结束
                        Messager.Broadcast( 'gameOver', false );
                        PlayerCtrl.Instance.Play( PlayerState.胜利 );
                        AudioMgr.Instance.胜利结算.Play();
                        this.followCamera.active = false;
                        GameManager.Instance.MainCamera.active = true;
                        this.finishEffect.active = true;
                    } );
                } ),
            )
            .start();
    }
}