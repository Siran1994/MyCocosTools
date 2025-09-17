import { _decorator, Button, Toggle, Node } from 'cc';
import { AudioMgr } from '../manager/AudioMgr';
import { UiManager } from '../manager/UiManager';
import { GameData } from '../data/GameData';
import { BasePanel } from './BasePanel';
const { ccclass, property } = _decorator;

@ccclass( 'SettingPanel' )
export class SettingPanel extends BasePanel 
{
    @property( Button )
    closeBtn: Button;//关闭按钮

    @property( Toggle )
    AudioBtn: Toggle;//音效

    @property( Toggle )
    MusicBtn: Toggle;//音乐

    @property( Button )
    setBtn: Button;//关闭按钮

    @property( Node )
    logo: Node;//关闭按钮
    count = 0;

    start () 
    {
        this.closeBtn.node.on( Button.EventType.CLICK, () =>
        {
            AudioMgr.Instance.Play( '通用按钮' );
            UiManager.Instance.mainPanel.node.active = true;
            this.HidePanel();
        }, this );

        this.AudioBtn.node.on( Toggle.EventType.TOGGLE, ( event: Toggle ) =>
        {
            if ( event.isChecked )
                GameData.SoundOn = 1;
            else
                GameData.SoundOn = 0;
            AudioMgr.Instance.UpdateState();
            AudioMgr.Instance.Play( '通用按钮' );
        }, this );

        this.MusicBtn.node.on( Toggle.EventType.TOGGLE, ( event: Toggle ) =>
        {
            if ( event.isChecked )
                GameData.MusicOn = 1;
            else
                GameData.MusicOn = 0;
            AudioMgr.Instance.UpdateState();
            AudioMgr.Instance.Play( '通用按钮' );
        }, this );

        this.setBtn.node.on( Button.EventType.CLICK, () =>
        {
            this.count++;
            if ( this.count >= 5 )
            {
                this.logo.active = true;
                this.count = 0;
            }
        }, this );
    }

    onEnable ()
    {
        this.init();
    }

    init ()
    {
        if ( GameData.SoundOn == 1 )
            this.AudioBtn.isChecked = true;
        else
            this.AudioBtn.isChecked = false;

        if ( GameData.MusicOn == 1 )
            this.MusicBtn.isChecked = true;
        else
            this.MusicBtn.isChecked = false;
    }
}