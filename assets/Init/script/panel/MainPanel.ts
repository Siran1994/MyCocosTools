import { _decorator, Button, Component, EventTouch, input, Input, Label } from 'cc';
import { UiManager } from '../manager/UiManager';
import { GameData } from '../data/GameData';
import { GameManager } from '../manager/GameManager';
import { PlayerCtrl } from '../role/PlayerCtrl';
import { AudioMgr } from '../manager/AudioMgr';
import { AniType } from '../data/Enum';
import { VibrateManager } from '../other/VibrateManager';

const { ccclass, property } = _decorator;

@ccclass( 'MainPanel' )
export class MainPanel extends Component 
{
    @property( Button )
    shopBtn: Button;//商店

    @property( Button )
    setBtn: Button;//设置

    @property( Button )
    signBtn: Button;//签到

    @property( Button )
    drawBtn: Button;//抽奖

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
        this.shopBtn.node.on( Button.EventType.CLICK, () =>
        {
            AudioMgr.Instance.通用按钮.Play();
            UiManager.Instance.shopPanel.ShowPanel();
            this.node.active = false;
        }, this );

        this.setBtn.node.on( Button.EventType.CLICK, () =>
        {
            AudioMgr.Instance.通用按钮.Play();
            UiManager.Instance.settingPanel.ShowPanel();
            this.node.active = false;
        }, this );

        this.signBtn.node.on( Button.EventType.CLICK, () =>
        {
            AudioMgr.Instance.通用按钮.Play();
            UiManager.Instance.signPanel.ShowPanel();
            this.node.active = false;

        }, this );

        this.drawBtn.node.on( Button.EventType.CLICK, () =>
        {
            AudioMgr.Instance.通用按钮.Play();
            UiManager.Instance.drawPanel.ShowPanel();
            this.node.active = false;
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
        PlayerCtrl.Instance.Play( AniType.奔跑 );
        AudioMgr.Instance.游戏背景乐.playMusic();
    }
}