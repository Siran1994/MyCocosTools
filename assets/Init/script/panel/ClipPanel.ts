import { _decorator, Button, dragonBones, Label, ProgressBar } from 'cc';
import { BasePanel } from './BasePanel';
import { GameData } from '../data/GameData';
import { AudioMgr } from '../manager/AudioMgr';
import { UiManager } from '../manager/UiManager';
const { ccclass, property } = _decorator;

@ccclass( 'ClipPanel' )
export class ClipPanel extends BasePanel
{
    @property( Button )
    GetBtn: Button = null;

    @property( { type: ProgressBar } )
    progressBar: ProgressBar = null!;

    @property( Label )
    CoinTxt: Label;//金币信息    

    @property( dragonBones.ArmatureDisplay )
    BoxAni: dragonBones.ArmatureDisplay = null;//关卡信息   

    progress = 0;
    isCanOpen = false;

    init ()
    {
        this.progress = 0;
        this.isCanOpen = false;
        this.CoinTxt.string = GameData.Coin.toString();
    }

    start ()
    {
        this.BoxAni.playAnimation( '掉落', 1 );

        this.GetBtn.node.on( Button.EventType.CLICK, () =>
        {
            AudioMgr.Instance.Play( '通用按钮' );
            this.progress += 0.3;
            this.BoxAni.playAnimation( '抖', 1 );
            this.progressBar.progress = this.progress
            if ( this.progressBar.progress >= 1 )
            {
                this.progressBar.progress = 1;
                this.isCanOpen = true;
                this.BoxAni.playAnimation( '打开', 1 );
                AudioMgr.Instance.Play( '开箱' );
                this.BoxAni.addEventListener( dragonBones.EventObject.COMPLETE, ( event ) =>//开箱
                {
                    this.HidePanel();
                    UiManager.Instance.finishPanel.ShowPanel();

                }, this );
                this.GetBtn.node.active = false;
                this.progressBar.node.active = false;
            }

        }, this );
    }

    update ( dt: number )
    {
        if ( this.progress > 0 && this.isCanOpen == false )
        {
            this.progress -= dt;
            if ( this.progress <= 0 )
                this.progress = 0;
            this.progressBar.progress = this.progress
        }
    }
    onEnable ()
    {
        this.init();
    }
}