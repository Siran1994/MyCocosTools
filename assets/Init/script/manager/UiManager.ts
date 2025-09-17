import { _decorator, Component, Label, Node } from "cc";
import CoinFly from "../animation/CoinFly";
import DOTweenAnimation from "../animation/DOTweenAnimation";
import { GameData } from "../data/GameData";
import { DrawPanel } from "../panel/DrawPanel";
import { FailedPanel } from "../panel/FailedPanel";
import { FinishPanel } from "../panel/FinishPanel";
import { FreeTryPanel } from "../panel/FreeTryPanel";
import { GamePanel } from "../panel/GamePanel";
import { MainPanel } from "../panel/MainPanel";
import { RewardPanel } from "../panel/RewardPanel";
import { SettingPanel } from "../panel/SettingPanel";
import { ShopPanel } from "../panel/ShopPanel";
import { SignPanel } from "../panel/SignPanel";
import { ShopList } from "../shopList/ShopList";
import { Prefab } from "cc";
import { ClipPanel } from "../panel/ClipPanel";
import { AudioMgr } from "./AudioMgr";
import { SpriteFrame } from "cc";
import { FightPanel } from "../panel/FightPanel";
import { Camera } from "cc";
import { Vec3 } from "cc";
import { Sprite } from "cc";
import { Utils } from "../tool/Utils";

const { ccclass, property } = _decorator;

@ccclass( 'UiManager' )
export class UiManager extends Component 
{
    public static Instance: UiManager = null;
    onLoad ()
    {
        UiManager.Instance = this;
    }

    @property( MainPanel )
    mainPanel: MainPanel;//主界面

    @property( GamePanel )
    gamePanel: GamePanel = null;

    @property( SettingPanel )
    settingPanel: SettingPanel = null;//设置

    @property( SignPanel )
    signPanel: SignPanel = null;//签到

    @property( DrawPanel )
    drawPanel: DrawPanel = null;//抽奖

    @property( ShopList )
    shopList: ShopList = null;//抽奖

    @property( ShopPanel )
    shopPanel: ShopPanel = null;//抽奖

    @property( FightPanel )
    fightPanel: FightPanel = null;//失败

    @property( ClipPanel )
    clipPanel: ClipPanel = null;//开宝箱  

    @property( FinishPanel )
    finishPanel: FinishPanel = null;//成功

    @property( FailedPanel )
    faildPanel: FailedPanel = null;//失败

    @property( RewardPanel )
    rewardPanel: RewardPanel = null;//奖励

    @property( FreeTryPanel )
    freeTryPanel: FreeTryPanel = null;//试用

    @property( CoinFly )
    coinfly: CoinFly = null;

    @property( SpriteFrame )
    Bars: SpriteFrame[] = [];

    @property( Prefab )
    HpBar: Prefab = null;

    @property( Camera )
    uiCamera: Camera = null;


    init ()
    {
        if ( GameData.Lv == 2 && this.signPanel.isCanSign() )
        {
            this.signPanel.ShowPanel();
        }

        if ( GameData.Lv == 3 && GameData.PackPlan == 0 )
        {
            this.drawPanel.ShowPanel();
            GameData.PackPlan = 1;
        }
    }

    start ()
    {
        this.init();
    }

    UpdateCoin ( num: number, txt: Label, stPos: Vec3, edPos: Vec3, count = 15 )//金币飞行动画
    {
        this.coinfly.playAnim( stPos, edPos, () =>
        {
            AudioMgr.Instance.Play( '金币收集' );
            if ( txt != null )
            {
                var tmpNum = GameData.Coin;
                var targetNum = tmpNum + num;
                var ani = DOTweenAnimation.stepNum( txt, tmpNum, 25, targetNum, 0, '', () =>
                {
                    ani.stop();
                    GameData.Coin = targetNum;
                    txt.string = GameData.Coin.toString();
                } );
            }
            else
                GameData.Coin + num;

        }, count );
    }

    AdGetCoin ( CoinTxt: Label )
    {
        AudioMgr.Instance.Play( '点击广告按钮' );
        var tmpNum = GameData.Coin;
        var targetNum = tmpNum + 100;
        var ani = DOTweenAnimation.stepNum( CoinTxt, tmpNum, 25, targetNum, 0, '', () =>
        {
            ani.stop();
            GameData.Coin = targetNum;
            CoinTxt.string = GameData.Coin.toString();
        } );
    }

    //----------倒计时3秒---------
    @property( Node )
    countDown: Node;//倒计时
    @property( SpriteFrame )
    countDowns: SpriteFrame[] = [];
    @property( Label )
    time: Label = null;

    ShowCountDown ( cb?: Function )
    {
        AudioMgr.Instance.Play( 'djs' );
        this.countDown.active = true;
        let tip = this.countDown.getChildByName( 'timer' ).getComponent( Sprite );
        for ( let i = 0; i < this.countDowns.length; i++ )
        {
            setTimeout( () =>
            {
                tip.spriteFrame = this.countDowns[ i ];
                DOTweenAnimation.ScaleLoopOnce( tip.node, 0.9, 1, 0.25, 0.5 );
                if ( i == this.countDowns.length - 1 )
                {
                    Utils.DelayCallBack( 1, () =>
                    {
                        cb && cb();
                    } );
                }
            }, i * 1000 )
        }
    }

    //-----------计时器-----------
    startTimer ( totalTime: number, txt: Label, cb?: Function )
    {
        this.OnLineTimer( totalTime, txt, () =>
        {
            txt.string = '';
            txt.node.active = false;
            cb && cb();
        } );
    }

    OnLineTimer ( totalTime: number, txt: Label, cb?: Function )
    {
        txt.node.active = true;
        txt.string = Utils.ToMS( totalTime );
        this.schedule( () =>//每秒进行在线时间存档
        {
            if ( totalTime == 0 )
                return;
            totalTime -= 1;
            txt.string = Utils.ToMS( totalTime );
            if ( totalTime <= 0 )
            {
                txt.node.active = false;
                totalTime = 0;
                cb && cb();
            }
        }, 1, totalTime );
    }
}