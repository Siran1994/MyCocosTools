import { Button } from 'cc';
import { _decorator, Component } from 'cc';
import { AudioMgr } from '../manager/AudioMgr';
import { GameManager } from '../manager/GameManager';
const { ccclass, property } = _decorator;

@ccclass( 'FailedPanel' )
export class FailedPanel extends Component
{
    @property( Button )
    RestartBtn: Button;//重新挑战     

    start ()
    {
        this.RestartBtn.node.on( Button.EventType.CLICK, () =>
        {
            this.RestartBtn.interactable = false;
            AudioMgr.Instance.通用按钮.Play();
            GameManager.Instance.NextLevel( false );
        }, this );
    }
}