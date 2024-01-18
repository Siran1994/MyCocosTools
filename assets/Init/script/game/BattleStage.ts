import { _decorator, Component, Node } from 'cc';
import { CameraMgr } from '../camera/CameraMgr';
import { GameManager } from '../manager/GameManager';
import { Messager } from '../manager/Messager';
import { UiManager } from '../manager/UiManager';
import { PlayerCtrl } from '../role/PlayerCtrl';
import { Utils } from '../tool/Utils';

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
        // PlayerCtrl.Instance.Play( AniType.战架 );
        UiManager.Instance.gamePanel.node.active = false;
        //GameManager.Instance.target.worldPosition = this.PlayerPos.worldPosition;
        Utils.DelayCallBack( 0.1, () =>
        {
            CameraMgr.Instance.node.active = false;
            GameManager.Instance.IsStart = false;
            // GameManager.Instance.MainCamera.active = true;
            // GameManager.Instance.MainCamera.setParent( this.node );
            // GameManager.Instance.MainCamera.getComponent( Camera ).fov = 60;
            this.CameraAni();
        } );
    }

    CameraAni ()//相机特写动画
    {
        // tween( GameManager.Instance.MainCamera )
        //     .sequence
        //     (
        //         tween().to( 1.5,
        //             {
        //                 position: this.CameraPos.position,               // 位置缓动
        //                 scale: Vec3.ONE,                     // 缩放缓动
        //                 eulerAngles: new Vec3( -10, 90, 0 )                       // 旋转缓动
        //             },
        //             { easing: "linear" } ),

        //         tween().call( () =>
        //         {
        //             //战斗开始
        //             UiManager.Instance.finishPanel.node.active = true;
        //             GameManager.Instance.BossPower = 500;
        //             Messager.Broadcast( 'atkStart' );
        //         } ),
        //     )
        //     .start();
    }


    bossFlyAni ()//Boss飞行动画
    {
        //     let index = 3;
        //     let lastTime = 0.5 * index;
        //    // GameManager.Instance.MainCamera.active = false;
        //     this.followCamera.active = true;
        //     Boss.Instance.BossFlyAni( lastTime );
        //     tween( this.BossObj )
        //         .sequence
        //         (
        //             tween().to( lastTime,
        //                 {
        //                     position: this.PosList[ index ].position,               // 位置缓动                         
        //                 },
        //                 { easing: "linear" } ),
        //             tween().call( () =>
        //             {
        //                 Utils.DelayCallBack( 1.5, () =>
        //                 {
        //                     GameManager.Instance.target.worldPosition = this.FinishPos.worldPosition;
        //                     GameManager.Instance.target.worldRotation = this.FinishPos.worldRotation;
        //                     //飞行结束
        //                     Messager.Broadcast( 'gameOver', false );
        //                     PlayerCtrl.Instance.Play( PlayerState.胜利 );
        //                     AudioMgr.Instance.胜利结算.Play();
        //                     this.followCamera.active = false;
        //                     GameManager.Instance.MainCamera.active = true;
        //                     this.finishEffect.active = true;
        //                 } );
        //             } ),
        //         )
        //         .start();
    }
}