import { _decorator, Button, Component, EventTouch, input, Input, Label } from 'cc';
import { UiManager } from '../manager/UiManager';
import { GameData } from '../data/GameData';
import { GameManager } from '../manager/GameManager';
import { PlayerCtrl } from '../role/PlayerCtrl';
import { PlayerState } from '../data/Enum';
import { AudioMgr } from '../manager/AudioMgr';
import { Messager } from '../manager/Messager';

const { ccclass, property } = _decorator;

@ccclass( 'MainPanel' )
export class MainPanel extends Component 
{
    @property( Button )
    shopBtn: Button;//商店

    @property( Button )
    setBtn: Button;//设置

    @property( Label )
    LvTips: Label;//关卡信息

    @property( Label )
    CoinTxt: Label;//金币信息

    onEnable ()
    {
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
        PlayerCtrl.Instance.Play( PlayerState.慢跑 );
        AudioMgr.Instance.游戏背景乐.playMusic();
        Messager.Broadcast( 'IsStart' );
    }

    autoStart ()
    {
        GameManager.Instance.IsStart = true;
        this.node.active = false;
        UiManager.Instance.gamePanel.node.active = true;
        PlayerCtrl.Instance.Play( PlayerState.快跑 );
        AudioMgr.Instance.游戏背景乐.playMusic();
        Messager.Broadcast( 'IsStart' );
    }

    start () 
    {
        this.CoinTxt.string = GameData.Coin.toString();
        this.LvTips.string = '关卡' + GameData.Lv.toString();
        this.shopBtn.node.on( Button.EventType.CLICK, () =>
        {
            this.node.active = false;
            UiManager.Instance.shopPanel.node.active = true;
            AudioMgr.Instance.通用按钮.Play();
        }, this );
        this.setBtn.node.on( Button.EventType.CLICK, () =>
        {
            UiManager.Instance.settingPanel.node.active = true;
            AudioMgr.Instance.通用按钮.Play();
        }, this );
    }
}