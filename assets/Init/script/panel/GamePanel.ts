import { _decorator, SpriteFrame, Sprite, Label, tween, Vec3, Quat, Prefab, Component, Node } from "cc";
import DOTweenAnimation from "../animation/DOTweenAnimation";
import { HeroType, PropType, PlayerState } from "../data/Enum";
import { GameData } from "../data/GameData";
import { AudioMgr } from "../manager/AudioMgr";
import { GameManager } from "../manager/GameManager";
import { Messager } from "../manager/Messager";
import { PoolManager } from "../manager/PoolManager";
import { ResMgr } from "../manager/ResMgr";
import { TipManager } from "../manager/TipManager";
import { PlayerCtrl } from "../role/PlayerCtrl";
import { Utils } from "../tool/Utils";
import { Config } from "../data/Config";

const { ccclass, property } = _decorator;

@ccclass( 'PartInfo' )
class PartInfo
{
    @property( { displayName: '物品类型', type: HeroType } )
    itemtype: HeroType.None;

    @property( { type: SpriteFrame } )
    BgIcon: SpriteFrame = null;

    //头
    @property( Sprite )
    Head: Sprite = null;
    @property( { type: SpriteFrame } )
    HeadIcon: SpriteFrame = null;
    @property( { type: SpriteFrame } )
    W_HeadIcon: SpriteFrame = null;

    //身体
    @property( Sprite )
    Body: Sprite = null;
    @property( { type: SpriteFrame } )
    BodyIcon: SpriteFrame = null;
    @property( { type: SpriteFrame } )
    W_BodyIcon: SpriteFrame = null;

    //右手
    @property( Sprite )
    R_Arm: Sprite = null;
    @property( { type: SpriteFrame } )
    R_ArmIcon: SpriteFrame = null;
    @property( { type: SpriteFrame } )
    W_R_ArmIcon: SpriteFrame = null;

    //左手
    @property( Sprite )
    L_Arm: Sprite = null;
    @property( { type: SpriteFrame } )
    L_ArmIcon: SpriteFrame = null;
    @property( { type: SpriteFrame } )
    W_L_ArmIcon: SpriteFrame = null;

    //右腿
    @property( Sprite )
    R_Leg: Sprite = null;
    @property( { type: SpriteFrame } )
    R_LegIcon: SpriteFrame = null;
    @property( { type: SpriteFrame } )
    W_R_LegIcon: SpriteFrame = null;

    //左腿
    @property( Sprite )
    L_Leg: Sprite = null;
    @property( { type: SpriteFrame } )
    L_LegIcon: SpriteFrame = null;
    @property( { type: SpriteFrame } )
    W_L_LegIcon: SpriteFrame = null;
}

@ccclass( 'GamePanel' )
export class GamePanel extends Component 
{
    @property( PartInfo )
    partInfo: PartInfo[] = [];

    @property( Node )
    TipPanel: Node = null;

    @property( Node )
    HeadBar: Node = null;

    @property( Sprite )
    progress: Sprite = null!;
    @property( Label )
    powerTxt: Label = null!;

    @property( Sprite )
    Bg: Sprite = null;

    @property( Label )
    LvTxt: Label;//关卡信息

    @property( Label )
    CoinTxt: Label;//金币信息

    @property( { displayName: '是否收集齐', type: Boolean } )
    isCollected: boolean = false;

    @property( { displayName: '集齐套装增加速度', type: Number } )
    AddSpeed: number = 6;

    @property( Node )
    target: Node = null;

    isGetHead = false;
    isGetBody = false;
    isGetR_Arm = false;
    isGetL_Arm = false;
    isGetR_Leg = false;
    isGetL_Leg = false;

    init () 
    {
        Config.Coin = 0;
        this.LvTxt.string = '关卡' + GameData.Lv.toString();
        this.CoinTxt.string = '0';

        this.progress.fillStart = 0.2;
        this.powerTxt.string = '500';

        this.isGetHead = false;
        this.isGetBody = false;
        this.isGetR_Arm = false;
        this.isGetL_Arm = false;
        this.isGetR_Leg = false;
        this.isGetL_Leg = false;
        this.initPartUi();

        ResMgr.loadPrefab( Config.Path.Coin, ( obj: Prefab ) =>
        {
            PoolManager.prePool( obj, 40 );
        } );
    }

    initPartUi ()
    {
        this.Bg.spriteFrame = this.partInfo[ GameManager.Instance.GetHeroType() - 1 ].BgIcon;

        tween( this.TipPanel )
            .sequence
            (
                tween().to( 0.5,
                    {
                        position: new Vec3( -240, 460 ),               // 位置缓动
                        scale: new Vec3( 1, 1, 1 ),                     // 缩放缓动
                        eulerAngles: Quat.IDENTITY                       // 旋转缓动
                    },
                    { easing: "sineIn" } ),
                tween().call( () =>
                {
                } ),
            )
            .start();
    }

    onEnable ()
    {
        this.init();
        Messager.AddListener( 'showPartUi', this, this.ShowPartUi );
        Messager.AddListener( 'updateCoin', this, this.UpdateCoin );
        Messager.AddListener( 'updatePower', this, this.UpdatePower );
        Messager.AddListener( 'coinDoFly', this, this.CoinDoFly );
        Messager.AddListener( 'CollectAll', this, this.CheckHeroCollect );
    }

    onDisable ()
    {
        Messager.RemoveListener( 'showPartUi', this, this.ShowPartUi );
        Messager.RemoveListener( 'updateCoin', this, this.UpdateCoin );
        Messager.RemoveListener( 'updatePower', this, this.UpdatePower );
        Messager.RemoveListener( 'coinDoFly', this, this.CoinDoFly );
        Messager.RemoveListener( 'CollectAll', this, this.CheckHeroCollect );
    }

    ShowPartUi ( heroType: HeroType, propType: PropType, isTarget: boolean )
    {
        let index = heroType - 1;
        switch ( propType )
        {
            case PropType.头:
                this.isGetHead = isTarget;
                this.partInfo[ index ].Head.node.active = isTarget;
                this.partInfo[ index ].Head.spriteFrame = isTarget == true ? this.partInfo[ index ].HeadIcon : this.partInfo[ index ].W_HeadIcon;
                break;
            case PropType.身体:
                this.isGetBody = isTarget;
                this.partInfo[ index ].Body.node.active = true;
                this.partInfo[ index ].Body.spriteFrame = isTarget == true ? this.partInfo[ index ].BodyIcon : this.partInfo[ index ].W_BodyIcon;
                break;
            case PropType.右手:
                this.isGetL_Arm = isTarget;
                this.partInfo[ index ].L_Arm.node.active = true;
                this.partInfo[ index ].L_Arm.spriteFrame = isTarget == true ? this.partInfo[ index ].L_ArmIcon : this.partInfo[ index ].W_L_ArmIcon;
                break;
            case PropType.左手:
                this.isGetR_Arm = isTarget;
                this.partInfo[ index ].R_Arm.node.active = true;
                this.partInfo[ index ].R_Arm.spriteFrame = isTarget == true ? this.partInfo[ index ].R_ArmIcon : this.partInfo[ index ].W_R_ArmIcon;
                break;
            case PropType.左腿:
                this.isGetL_Leg = isTarget;
                this.partInfo[ index ].L_Leg.node.active = true;
                this.partInfo[ index ].L_Leg.spriteFrame = isTarget == true ? this.partInfo[ index ].L_LegIcon : this.partInfo[ index ].W_L_LegIcon;
                break;
            case PropType.右腿:
                this.isGetR_Leg = isTarget;
                this.partInfo[ index ].R_Leg.node.active = true;
                this.partInfo[ index ].R_Leg.spriteFrame = isTarget == true ? this.partInfo[ index ].R_LegIcon : this.partInfo[ index ].W_R_LegIcon;
                break;
        }

        if ( this.isGetHead == true && this.isGetBody == true && this.isGetL_Arm == true && this.isGetR_Arm == true && this.isGetL_Leg == true && this.isGetR_Leg == true )
        {
            this.isGetHead = false;
            this.isGetBody = false;
            this.isGetR_Arm = false;
            this.isGetL_Arm = false;
            this.isGetR_Leg = false;
            this.isGetL_Leg = false;
            this.isCollected = true;
            this.CheckHeroCollect( this.isCollected );
        }
    }

    UpdateCoin ( num: number )
    {
        this.showCoin( num );
    }

    UpdatePower ( num: number )
    {
        this.showPower( num );
    }

    CoinDoFly ()
    {
        ResMgr.loadPrefab( Config.Path.Coin, ( obj: Prefab ) =>
        {
            PoolManager.prePool( obj, 50 );
            let go = PoolManager.getNode( obj, this.target.parent ) as Node;
            go.scale = Vec3.ONE;
            go.setPosition( new Vec3( -286, -750, 0 ) );
            tween( go )
                .sequence
                (
                    tween().to( 0.3,
                        {
                            position: new Vec3( go.position.x - 50, go.position.y - 80, go.position.z ),               // 位置缓动
                        },
                        { easing: "linear" } ),
                    tween().delay( 0.2 ),
                    tween().to( 0.5,
                        {
                            position: this.target.position,               // 位置缓动
                            scale: new Vec3( 0.5, 0.5, 0.5 ),                     // 缩放缓动
                            eulerAngles: Quat.IDENTITY                       // 旋转缓动
                        },
                        { easing: "sineIn" } ),

                    tween().call( () =>
                    {
                        PoolManager.putNode( go );
                    } ),
                )
                .start();
        } );
    }

    CheckHeroCollect ( isOver: boolean )
    {
        if ( isOver )//集齐套装
        {
            AudioMgr.Instance.完美收集.Play();
            let target = GameManager.Instance.GetHeroType();
            switch ( target )
            {
                case HeroType.城市队长:
                    GameManager.Instance.PlayerPower += 350;
                    break;
                case HeroType.城市飞侠:
                    GameManager.Instance.PlayerPower += 840;
                    break;
                case HeroType.钢铁英雄:
                    GameManager.Instance.PlayerPower += 2300;
                    break;
                case HeroType.黑液人:
                    GameManager.Instance.PlayerPower += 2980;
                    break;
                case HeroType.超级巨人:
                    GameManager.Instance.PlayerPower += 3660;
                    break;
                case HeroType.雷公:
                    GameManager.Instance.PlayerPower += 1570;
                    break;
            }
            Config.Speed += this.AddSpeed;
            PlayerCtrl.Instance.Play( PlayerState.快跑 );
            PlayerCtrl.Instance.ShowEffect( 3 );
        }
    }

    showCoin ( addnum: number )
    {
        var tmpNum = Config.Coin;
        var targetNum = tmpNum + addnum;
        if ( targetNum < 0 )
        {
            Config.Coin = 0;
            this.CoinTxt.string = '0';
            Messager.Broadcast( 'gameOver', true );
            return;
        }
        var ani = DOTweenAnimation.stepNum( this.CoinTxt, tmpNum, 1, targetNum, 0, '', () =>
        {
            ani.stop();
            Config.Coin = targetNum;
            Utils.DelayCallBack( 1, () =>
            {
                this.CoinTxt.string = Config.Coin.toString();
            } );
        } );
    }

    showPower ( addnum: number )
    {
        var tmpNum = GameManager.Instance.PlayerPower;
        var targetNum = tmpNum + addnum;

        if ( targetNum < 0 )
        {
            GameManager.Instance.PlayerPower = 0;
            this.powerTxt.string = '0';
            return;
        }
        if ( addnum > 0 )
            TipManager.Instance.showFightTips( 0, addnum.toString(), new Vec3( 100, 0, 0 ) );
        else
            TipManager.Instance.showFightTips( 1, ( Math.abs( addnum ) ).toString(), new Vec3( 100, 0, 0 ) );
        var ani = DOTweenAnimation.stepNum( this.powerTxt, tmpNum, 20, targetNum, 0, '', () =>
        {
            ani.stop();
            GameManager.Instance.PlayerPower = targetNum;
            this.powerTxt.string = GameManager.Instance.PlayerPower.toString();
        } );

        let ori = tmpNum * 0.01;
        let tar = targetNum * 0.01;
        var ani2 = DOTweenAnimation.stepNumProgress( this.progress, ori, 0.05, tar / 15, 0, null, () =>
        {
            ani2.stop();
        } );
    }
}