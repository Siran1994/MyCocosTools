import { Button } from 'cc';
import { _decorator } from 'cc';
import { AudioMgr } from '../manager/AudioMgr';
import { GameManager } from '../manager/GameManager';
import { BasePanel } from './BasePanel';
import { Label } from 'cc';
import DOTweenAnimation from '../animation/DOTweenAnimation';
import { UiManager } from '../manager/UiManager';
import { Vec3 } from 'cc';
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
            AudioMgr.Instance.Play( '通用按钮' );
            UiManager.Instance.UpdateCoin( GameManager.Instance.Coin, null, Vec3.ZERO, this.CoinTxt.node.worldPosition );
            GameManager.Instance.NextLevel( false, true, () =>
            {
                GameManager.Instance.init();
            } );
        }, this );

        this.Reward3x.node.on( Button.EventType.CLICK, () =>
        {
            AudioMgr.Instance.Play( '通用按钮' );
            UiManager.Instance.UpdateCoin( GameManager.Instance.Coin * 3, null, Vec3.ZERO, this.CoinTxt.node.worldPosition );
            GameManager.Instance.NextLevel( false, true, () =>
            {
                GameManager.Instance.init()
            } );
        }, this );

        this.ReLife.node.on( Button.EventType.CLICK, () =>
        {
            AudioMgr.Instance.Play( '通用按钮' );
            this.node.active = false;
            GameManager.Instance.IsStart = true;
        }, this );

        DOTweenAnimation.ScaleLoop( this.Reward3x.node, 1.1, 1 );
    }
}