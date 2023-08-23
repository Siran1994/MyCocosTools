import { _decorator, Button, Component } from 'cc';
import { Label } from 'cc';
import DOTweenAnimation from '../animation/DOTweenAnimation';
import { GameData } from '../data/GameData';
import { AudioMgr } from '../manager/AudioMgr';
import { Messager } from '../manager/Messager';
import { PoolManager } from '../manager/PoolManager';
import { UiManager } from '../manager/UiManager';


const { ccclass, property } = _decorator;

@ccclass( 'ShopPanel' )
export class ShopPanel extends Component 
{
    @property( Label )
    CoinTxt: Label;//金币信息

    @property( Button )
    CloseBtn: Button;//关闭

    @property( Button )
    AddCoinBtn: Button;//关闭

    start () 
    {
        this.CloseBtn.node.on( Button.EventType.CLICK, () =>
        {
            AudioMgr.Instance.通用按钮.Play();
            UiManager.Instance.mainPanel.node.active = true;
            UiManager.hidePage( this.name );
        }, this );

        this.AddCoinBtn.node.on( Button.EventType.CLICK, () =>
        {
            AudioMgr.Instance.点击广告按钮.Play();
            var tmpNum = GameData.Coin;
            var targetNum = tmpNum + 400;
            var ani = DOTweenAnimation.stepNum( this.CoinTxt, tmpNum, 20, targetNum, 0.001, '', () =>
            {
                ani.stop();
                GameData.Coin = targetNum;
                this.CoinTxt.string = GameData.Coin.toString();
            } );
        }, this );
    }

    onEnable ()
    {
        Messager.AddListener( 'CoinUpdate', this, this.UpdateCoin );
        this.CoinTxt.string = GameData.Coin.toString();
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