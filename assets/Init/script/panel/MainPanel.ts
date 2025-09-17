import { _decorator, Button, Component, EventTouch, input, Input, Label } from 'cc';
import { UiManager } from '../manager/UiManager';
import { GameData } from '../data/GameData';
import { GameManager } from '../manager/GameManager';
import { PlayerCtrl } from '../role/PlayerCtrl';
import { AudioMgr } from '../manager/AudioMgr';
import { AniState } from '../data/Enum';
import { TipManager } from '../manager/TipManager';
const { ccclass, property } = _decorator;

@ccclass( 'MainPanel' )
export class MainPanel extends Component 
{
    @property( Button )
    setBtn: Button;//设置

    @property( Button )
    AddCoinBtn: Button;//获取金币

    @property( Button )
    moreGame: Button;//抽奖  

    @property( Button )
    signBtn: Button;//签到

    @property( Button )
    drawBtn: Button;//抽奖

    @property( Button )
    shopBtn: Button;//商店

    @property( Button )
    shopBtn2: Button;//商店

    @property( Label )
    LvTips: Label;//关卡信息

    @property( Label )
    CoinTxt: Label;//金币信息

    init ()
    {
        this.LvTips.string = '关卡' + GameData.Lv.toString();
        this.CoinTxt.string = GameData.Coin.toString();
    }

    start () 
    {
        this.setBtn.node.on( Button.EventType.CLICK, () =>
        {
            AudioMgr.Instance.Play( '通用按钮' );
            UiManager.Instance.settingPanel.ShowPanel();
            this.node.active = false;
        }, this );


        this.AddCoinBtn.node.on( Button.EventType.CLICK, () =>
        {
            UiManager.Instance.AdGetCoin( this.CoinTxt );
        }, this );

        this.signBtn.node.on( Button.EventType.CLICK, () =>
        {
            AudioMgr.Instance.Play( '通用按钮' );
            UiManager.Instance.signPanel.ShowPanel();
            this.node.active = false;

        }, this );

        this.drawBtn.node.on( Button.EventType.CLICK, () =>
        {
            AudioMgr.Instance.Play( '通用按钮' );
            UiManager.Instance.drawPanel.ShowPanel();
            this.node.active = false;
        }, this );

        this.shopBtn.node.on( Button.EventType.CLICK, () =>
        {
            AudioMgr.Instance.Play( '通用按钮' );
            UiManager.Instance.shopList.ShowPanel();
            this.node.active = false;
        }, this );

        this.shopBtn2.node.on( Button.EventType.CLICK, () =>
        {
            AudioMgr.Instance.Play( '通用按钮' );
            UiManager.Instance.shopPanel.ShowPanel();
            this.node.active = false;
        }, this );

        this.moreGame.node.on( Button.EventType.CLICK, () =>
        {
            AudioMgr.Instance.Play( '通用按钮' );
            TipManager.Instance.showTips( '请接入SDK的相关功能' );
        }, this );
    }

    onEnable ()
    {
        this.init();
        input.on( Input.EventType.TOUCH_MOVE, this.touchStart, this );
    }

    onDisable ()
    {
        input.off( Input.EventType.TOUCH_MOVE, this.touchStart, this );
    }

    touchStart ( touch: EventTouch )
    {
        GameManager.Instance.IsStart = true;
        this.node.active = false;
        UiManager.Instance.gamePanel.node.active = true;
        GameManager.Instance.Play( PlayerCtrl.Instance.anmator, AniState.行走 );
    }
}