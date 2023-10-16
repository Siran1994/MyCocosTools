import { _decorator, Button } from 'cc';
import { Label } from 'cc';
import { GameData } from '../data/GameData';
import { AudioMgr } from '../manager/AudioMgr';
import DOTweenAnimation from '../animation/DOTweenAnimation';
import { UiManager } from '../manager/UiManager';
import { Messager } from '../manager/Messager';
import { Config } from '../data/Config';
import { BasePanel } from '../panel/BasePanel';

const { ccclass, property } = _decorator;

@ccclass( 'ShopList' )
export class ShopList extends BasePanel 
{
    @property( Label )
    CoinTxt: Label;//金币信息

    @property( Button )
    CloseBtn: Button;//关闭

    @property( Button )
    AddCoinBtn: Button;//关闭

    init ()
    {
        this.CoinTxt.string = GameData.Coin.toString();
    }

    start () 
    {
        this.CloseBtn.node.on( Button.EventType.CLICK, () =>
        {
            AudioMgr.Instance.通用按钮.Play();
            UiManager.Instance.mainPanel.node.active = true;
            this.HidePanel();
        }, this );

        this.AddCoinBtn.node.on( Button.EventType.CLICK, () =>
        {
            AudioMgr.Instance.点击广告按钮.Play();
            var tmpNum = GameData.Coin;
            var targetNum = tmpNum + Config.BoxReward.AdGet;
            var ani = DOTweenAnimation.stepNum( this.CoinTxt, tmpNum, 10, targetNum, 0.001, '', () =>
            {
                ani.stop();
                GameData.Coin = targetNum;
                this.CoinTxt.string = GameData.Coin.toString();
            } );
        }, this );
    }

    onEnable ()
    {
        this.init();
        Messager.AddListener( 'CoinUpdate', this, this.UpdateCoin );
    }

    onDisable ()
    {
        Messager.RemoveListener( 'CoinUpdate', this, this.UpdateCoin );
    }

    UpdateCoin ()
    {
        this.CoinTxt.string = GameData.Coin.toString();
    }
}