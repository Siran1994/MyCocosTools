import { Button } from 'cc';
import { _decorator, Component } from 'cc';
import { AudioMgr } from '../manager/AudioMgr';
import { GameManager } from '../manager/GameManager';
import { BasePanel } from './BasePanel';
import { Label } from 'cc';
import { GameData } from '../data/GameData';
const { ccclass, property } = _decorator;

@ccclass( 'FailedPanel' )
export class FailedPanel extends BasePanel
{
    @property( Label )
    CoinTxt: Label = null;//重新挑战

    @property( Button )
    RestartBtn: Button;//重新挑战

    @property( Button )
    Reward3x: Button;//重新挑战   

    @property( Button )
    ReLife: Button;//重新挑战     

    start ()
    {
        this.CoinTxt.string = 'x' + GameManager.Instance.Coin;

        this.RestartBtn.node.on( Button.EventType.CLICK, () =>
        {
            AudioMgr.Instance.通用按钮.Play();
            GameData.Coin += GameManager.Instance.Coin;
            GameManager.Instance.NextLevel( false, true, () =>
            {
                GameManager.Instance.init();
                //UiManager.Instance.mainPanel.autoStart();
            } );
        }, this );

        this.Reward3x.node.on( Button.EventType.CLICK, () =>
        {
            AudioMgr.Instance.通用按钮.Play();
            GameData.Coin += GameManager.Instance.Coin * 3;
            GameManager.Instance.NextLevel( false, true, () =>
            {
                GameManager.Instance.init()
            } );
        }, this );
        this.ReLife.node.on( Button.EventType.CLICK, () =>
        {
            AudioMgr.Instance.通用按钮.Play();
            this.node.active = false;
            GameManager.Instance.IsStart = true;

        }, this );
    }
}