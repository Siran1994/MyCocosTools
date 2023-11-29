import { _decorator, Button, Label, SpriteFrame, Sprite, Vec3, instantiate, tween, Node, Camera, Input, PhysicsSystem, geometry, input, BoxCollider } from 'cc';
import { BasePanel } from './BasePanel';
import { AudioMgr } from '../manager/AudioMgr';
import { BattleStage } from '../game/BattleStage';
import { GameManager } from '../manager/GameManager';
import { ItemType } from '../data/Enum';
import { PrefabManager } from '../manager/PrefabManager';
import { Messager } from '../manager/Messager';
import { Utils } from '../tool/Utils';
const { ccclass, property } = _decorator;

@ccclass( 'FightPanel' )
export class FightPanel extends BasePanel
{
    @property( Button )
    FightBtn: Button;

    @property( Button )
    FightClose: Button;
    @property( Sprite )
    FcIcon: Sprite;
    @property( Label )
    FcPrice: Label;//金币信息   

    @property( Button )
    FightFor: Button;
    @property( Sprite )
    FFIcon: Sprite;
    @property( Label )
    FFPrice: Label;//金币信息

    @property( Label )
    CoinTxt: Label;//金币信息   

    @property( Button )
    AddCoinBtn: Button;//关闭    

    @property( SpriteFrame )
    btnIcons: SpriteFrame[] = [];

    init ()
    {
        // this.CoinTxt.string = GameManager.Instance.Coin.toString();
        // this.FcPrice.string = GameManager.Instance.FcPrice.toString();
        // this.FFPrice.string = GameManager.Instance.FFPrice.toString();
        this.CheckState();
    }

    start ()
    {
        this.FightBtn.node.on( Button.EventType.CLICK, () =>
        {
            // AudioMgr.Instance.战斗.Play();
            //BattleStage.Instance.FightStart();
            this.FightBtn.node.active = false;
            this.FightClose.node.active = false;
            this.FightFor.node.active = false;
            this.targetNode = null;
            input.off( Input.EventType.TOUCH_START, this.onTouchStart, this );
            input.off( Input.EventType.TOUCH_MOVE, this.onTouchMove, this );
            input.off( Input.EventType.TOUCH_END, this.onTouchEnd, this );
        }, this );

        this.FightClose.node.on( Button.EventType.CLICK, () =>
        {
            this.FightClose.interactable = false;
            Utils.DelayCallBack( 0.5, () => { this.FightClose.interactable = true; } );
            AudioMgr.Instance.通用按钮.Play();
            // if ( GameManager.Instance.coin >= GameManager.Instance.FcPrice )
            // {
            //     GameManager.Instance.coin -= GameManager.Instance.FcPrice;
            //     this.CoinTxt.string = GameManager.Instance.coin.toString();
            //     this.CheckState();
            //     this.CreateBody( BattleStage.Instance.PlayerPosList, false );
            // }
            // else
            // {
            //     this.CreateBody( BattleStage.Instance.PlayerPosList, false );
            // }

        }, this );

        this.FightFor.node.on( Button.EventType.CLICK, () =>
        {
            this.FightFor.interactable = false;
            Utils.DelayCallBack( 0.5, () => { this.FightFor.interactable = true; } );
            AudioMgr.Instance.通用按钮.Play();
            // if ( GameManager.Instance.coin >= GameManager.Instance.FFPrice )
            // {
            //     GameManager.Instance.coin -= GameManager.Instance.FFPrice;
            //     this.CoinTxt.string = GameManager.Instance.coin.toString();
            //     this.CheckState();
            //     this.CreateBody( BattleStage.Instance.PlayerPosList, true );
            // }
            // else
            // {
            //     this.CreateBody( BattleStage.Instance.PlayerPosList, true );
            // }
        }, this );

        this.AddCoinBtn.node.on( Button.EventType.CLICK, () =>
        {
            AudioMgr.Instance.点击广告按钮.Play();
            // var tmpNum = GameManager.Instance.coin;
            // var targetNum = tmpNum + 100;
            // var ani = DOTweenAnimation.stepNum( this.CoinTxt, tmpNum, 20, targetNum, 0.001, '', () =>
            // {
            //     ani.stop();
            //     GameManager.Instance.coin = targetNum;
            //     this.CoinTxt.string = GameManager.Instance.coin.toString();
            // } );
        }, this );
    }

    onEnable ()
    {
        this.init();
        input.on( Input.EventType.TOUCH_START, this.onTouchStart, this );
        input.on( Input.EventType.TOUCH_MOVE, this.onTouchMove, this );
        input.on( Input.EventType.TOUCH_END, this.onTouchEnd, this );
        Messager.AddListener( 'SetTargetPos', this, this.SetTargetPos );
    }

    onDisable ()
    {
        input.off( Input.EventType.TOUCH_START, this.onTouchStart, this );
        input.off( Input.EventType.TOUCH_MOVE, this.onTouchMove, this );
        input.off( Input.EventType.TOUCH_END, this.onTouchEnd, this );
        Messager.RemoveListener( 'SetTargetPos', this, this.SetTargetPos );
    }


    CheckState ()
    {
        // if ( GameManager.Instance.coin < GameManager.Instance.FcPrice )
        // {
        //     this.FcIcon.spriteFrame = this.btnIcons[ 1 ];
        //     this.FcPrice.string = '免费';
        // }
        // if ( GameManager.Instance.coin < GameManager.Instance.FFPrice )
        // {
        //     this.FFIcon.spriteFrame = this.btnIcons[ 1 ];
        //     this.FFPrice.string = '免费';
        // }
    }

    CreateBody ( target: Node[], isDog = false )
    {
        // if ( isDog )//创建远程狗子
        // {
        //     for ( let i = 0; i < target.length; i++ )
        //     {
        //         if ( target[ i ].children.length == 0 )
        //         {
        //             let go = instantiate( PrefabManager.get( GameManager.Instance.GetTarget( FruitType.黄狗 ), PrefabManager.PlayerMap ) );
        //             let info = go.getComponent( PlayerItem );
        //             go.parent = this.node;
        //             go.worldPosition = new Vec3( 0, BattleStage.Instance.PlayerPos.worldPosition.y, BattleStage.Instance.PlayerPos.worldPosition.z );
        //             info.player.aiBase.isEnemy = false;
        //             tween( go ).to( 0.1, { worldPosition: target[ i ].worldPosition, }, { easing: "linear" } ).call( () =>
        //             {
        //                 go.parent = target[ i ];
        //                 target[ i ].name = go.name;
        //                 go.position = new Vec3( 0, -0.5, 0 );
        //                 go.eulerAngles = new Vec3( 0, -90, 0 );
        //                 Messager.Broadcast( 'CheckPlayerItem', go.name );
        //             } )
        //                 .start();
        //             return;
        //         }
        //     }
        // }
        // else//创建近战水果人
        // {
        //     for ( let i = 0; i < target.length; i++ )
        //     {
        //         if ( target[ i ].children.length == 0 )
        //         {
        //             let go = instantiate( PrefabManager.get( GameManager.Instance.GetTarget( FruitType.梨子 ), PrefabManager.PlayerMap ) );
        //             let info = go.getComponent( PlayerItem );
        //             info.HideAres();
        //             go.parent = this.node;
        //             go.worldPosition = new Vec3( 0, BattleStage.Instance.PlayerPos.worldPosition.y, BattleStage.Instance.PlayerPos.worldPosition.z );
        //             info.player.aiBase.isEnemy = false;
        //             tween( go ).to( 0.1, { worldPosition: target[ i ].worldPosition, }, { easing: "linear" } ).call( () =>
        //             {
        //                 go.parent = target[ i ];
        //                 target[ i ].name = go.name;
        //                 go.position = new Vec3( 0, -0.5, 0 );
        //                 go.eulerAngles = new Vec3( 0, -90, 0 );
        //                 Messager.Broadcast( 'CheckPlayerItem', go.name );
        //             } )
        //                 .start();
        //             return;
        //         }
        //     }
        // }
    }

    @property( Node )
    public targetNode!: Node
    _position = new Vec3();
    @property( Camera )
    readonly cameraCom!: Camera;
    _ray: geometry.Ray = new geometry.Ray();

    onTouchStart ( event )
    {
        const touch = event.touch!;
        this.cameraCom.screenPointToRay( touch.getLocationX(), touch.getLocationY(), this._ray );
        if ( PhysicsSystem.instance.raycast( this._ray ) )
        {
            const raycastResults = PhysicsSystem.instance.raycastResults;
            if ( raycastResults.length > 0 )
            {
                const item = raycastResults[ 0 ];
                if ( item.collider.node.parent.name != 'Enemy' )
                {
                    this.targetNode = item.collider.node;
                    Vec3.copy( this._position, this.targetNode.position );
                    Messager.Broadcast( 'Select', true );
                    this.targetNode.getComponent( BoxCollider ).enabled = true;
                    this.targetNode.parent.name = 'Pos';
                }
            }
        }
    }

    onTouchMove ( event )
    {
        if ( this.targetNode != null )
        {
            const delta = event.getDelta();
            let pos = this.targetNode.position;
            let x = pos.x + 0.03 * delta.y;
            let z = pos.z + 0.03 * delta.x;
            this.targetNode.position = this.targetNode.position.lerp( new Vec3( x, this.targetNode.position.y, z ), 0.25 );
        }
    }

    tmpPos: Node = null;
    isCanComb = false;

    SetTargetPos ( targetPos: Node, isCanComb: boolean )
    {
        this.tmpPos = targetPos;
        this.isCanComb = isCanComb;
    }

    onTouchEnd ( event )
    {
        if ( this.targetNode != null )
        {
            if ( this.tmpPos != null )
            {
                this.targetNode.parent = this.tmpPos;
                this.targetNode.position = new Vec3( 0, -0.5, 0 );
                this.targetNode.parent.name = this.targetNode.name;
                if ( this.isCanComb )
                {
                    this.targetNode.parent.name = 'Compounded';
                    //Messager.Broadcast( 'CompoundItem', this.targetNode.getComponent( PlayerItem ).fruitType );
                }
            }
            else
            {
                this.targetNode.position = this._position;
                this.targetNode.parent.name = this.targetNode.name;
                this.targetNode = null;
            }
            Messager.Broadcast( 'Select', false );
            //BattleStage.Instance.PosTip.parent = BattleStage.Instance.node;
            //BattleStage.Instance.PosTip.position = new Vec3( 0, -1000, 0 );
        }
    }
}