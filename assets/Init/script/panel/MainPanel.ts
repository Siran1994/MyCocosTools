import { _decorator, Button, Component, EventTouch, input, Input, Label, Prefab, Node } from 'cc';
import { UiManager } from '../manager/UiManager';
import { PlayerState } from '../data/Enum';
import { GameData } from '../data/GameData';
import { AudioMgr } from '../manager/AudioMgr';
import { GameManager } from '../manager/GameManager';
import { Messager } from '../manager/Messager';
import { PoolManager } from '../manager/PoolManager';
import { ResMgr } from '../manager/ResMgr';
import { PlayerCtrl } from '../role/PlayerCtrl';
import { Utils } from '../tool/Utils';


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

    start () 
    {
        this.CoinTxt.string = GameData.Coin.toString();
        this.LvTips.string = '关卡' + GameData.Lv.toString();

        this.shopBtn.node.on( Button.EventType.CLICK, () =>
        {
            AudioMgr.Instance.通用按钮.Play();
            ResMgr.loadPrefab( 'prefab/panel/ShopPanel', ( obj: Prefab ) =>
            {
                PoolManager.getNode( obj, this.node.parent ) as Node;
            } );
            this.node.active = false;
        }, this );

        this.setBtn.node.on( Button.EventType.CLICK, () =>
        {
            AudioMgr.Instance.通用按钮.Play();
            ResMgr.loadPrefab( 'prefab/panel/SettingPanel', ( obj: Prefab ) =>
            {
                PoolManager.getNode( obj, this.node.parent ) as Node;
            } );
        }, this );

        this.signBtn.node.on( Button.EventType.CLICK, () =>
        {
            AudioMgr.Instance.通用按钮.Play();
            ResMgr.loadPrefab( 'prefab/panel/SignPanel', ( obj: Prefab ) =>
            {
                PoolManager.getNode( obj, this.node.parent ) as Node;
            } );
            this.node.active = false;

        }, this );

        this.drawBtn.node.on( Button.EventType.CLICK, () =>
        {
            AudioMgr.Instance.通用按钮.Play();
            ResMgr.loadPrefab( 'prefab/panel/DrawPanel', ( obj: Prefab ) =>
            {
                PoolManager.getNode( obj, this.node.parent ) as Node;
            } );
            this.node.active = false;
        }, this );
    }

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
}