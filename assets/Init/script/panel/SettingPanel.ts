import { _decorator, Button, Component, Toggle } from 'cc';
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

    start () 
    {
        this.closeBtn.node.on( Button.EventType.CLICK, () =>
        {
            AudioMgr.Instance.通用按钮.Play();
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
            AudioMgr.Instance.通用按钮.Play();
        }, this );

        this.MusicBtn.node.on( Toggle.EventType.TOGGLE, ( event: Toggle ) =>
        {
            if ( event.isChecked )
                GameData.MusicOn = 1;
            else
                GameData.MusicOn = 0;
            AudioMgr.Instance.UpdateState();
            AudioMgr.Instance.通用按钮.Play();
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