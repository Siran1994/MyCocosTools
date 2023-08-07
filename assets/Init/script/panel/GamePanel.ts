import { _decorator, Component, Label, Node, SpriteFrame, tween, Quat, Vec3, Sprite } from 'cc';
import { Messager } from '../manager/Messager';
import { GameData } from '../data/GameData';
import DOTweenAnimation from '../animation/DOTweenAnimation';
import { Utils } from '../tool/Utils';
import { GameManager } from '../manager/GameManager';
import { HeroType, PlayerState, PropType } from '../data/Enum';
import { PlayerCtrl } from '../role/PlayerCtrl';
import { UiManager } from '../manager/UiManager';
import { AudioMgr } from '../manager/AudioMgr';

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

    @property( Node )
    target: Node = null;
    public coin: number = 0;
    public power: number = 500;

    isGetHead = false;
    isGetBody = false;
    isGetR_Arm = false;
    isGetL_Arm = false;
    isGetR_Leg = false;
    isGetL_Leg = false;

    start () 
    {
        this.coin = 0;
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
        Messager.AddListener( 'showPartUi', this, this.ShowPartUi );
    }

    onDisable ()
    {
        Messager.RemoveListener( 'showPartUi', this, this.ShowPartUi );
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
            GameManager.Instance.isCollected = true;
            this.CheckHeroCollect( GameManager.Instance.isCollected );
        }
    }

    CheckHeroCollect ( isOver: boolean )
    {
        if ( isOver )//集齐套装
        {
            AudioMgr.Instance.完美收集.Play();
            let target = GameManager.Instance.GetHeroType();
            switch ( target )
            {
                case HeroType.美国队长:
                    UiManager.Instance.gamePanel.power += 350;
                    break;
                case HeroType.蜘蛛侠:
                    UiManager.Instance.gamePanel.power += 840;
                    break;
                case HeroType.钢铁侠:
                    UiManager.Instance.gamePanel.power += 2300;
                    break;
                case HeroType.毒液:
                    UiManager.Instance.gamePanel.power += 2980;
                    Messager.Broadcast( 'changeBody', HeroType.毒液 );
                    break;
                case HeroType.绿巨人:
                    UiManager.Instance.gamePanel.power += 3660;
                    Messager.Broadcast( 'changeBody', HeroType.绿巨人 );
                    break;
                case HeroType.雷神:
                    UiManager.Instance.gamePanel.power += 1570;
                    break;
            }
            GameManager.Instance.Speed += GameManager.Instance.AddSpeed;
            PlayerCtrl.Instance.Play( PlayerState.快跑 );
            PlayerCtrl.Instance.ShowEffect( 3 );
        }
    }

    showCoin ( addnum: number )
    {
        var tmpNum = this.coin;
        var targetNum = tmpNum + addnum;
        if ( targetNum < 0 )
        {
            this.coin = 0;
            this.CoinTxt.string = '0';
            Messager.Broadcast( 'gameOver', true );
            return;
        }
        var ani = DOTweenAnimation.stepNum( this.CoinTxt, tmpNum, 1, targetNum, 0, '', () =>
        {
            ani.stop();
            this.coin = targetNum;
            Utils.DelayCallBack( 1, () =>
            {
                this.CoinTxt.string = this.coin.toString();
            } );
        } );
    }

    showPower ( addnum: number )
    {
        var tmpNum = this.power;
        var targetNum = tmpNum + addnum;

        if ( targetNum < 0 )
        {
            this.power = 0;
            this.powerTxt.string = '0';
            return;
        }
        if ( addnum > 0 )
            UiManager.Instance.showFightTips( 0, addnum.toString(), new Vec3( 100, 0, 0 ) );
        else
            UiManager.Instance.showFightTips( 1, ( Math.abs( addnum ) ).toString(), new Vec3( 100, 0, 0 ) );
        var ani = DOTweenAnimation.stepNum( this.powerTxt, tmpNum, 20, targetNum, 0, '', () =>
        {
            ani.stop();
            this.power = targetNum;
            this.powerTxt.string = this.power.toString();
        } );

        let ori = tmpNum * 0.01;
        let tar = targetNum * 0.01;
        var ani2 = DOTweenAnimation.stepNumProgress( this.progress, ori, 0.05, tar / 50, 0, null, () =>
        {
            ani2.stop();
        } );
    }
}