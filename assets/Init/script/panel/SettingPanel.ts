import { _decorator, Button, Component, Toggle } from 'cc';
import { PlayerPrefs } from '../data/PlayerPrefs';
import { AudioMgr } from '../manager/AudioMgr';
import { PoolManager } from '../manager/PoolManager';
import { UiManager } from '../manager/UiManager';
const { ccclass, property } = _decorator;

@ccclass( 'SettingPanel' )
export class SettingPanel extends Component 
{
    @property( Button )
    closeBtn: Button;//关闭按钮

    @property( Toggle )
    AudioBtn: Toggle;//音效

    @property( Toggle )
    MusicBtn: Toggle;//音乐

    start () 
    {
        this.init();

        this.closeBtn.node.on( Button.EventType.CLICK, () =>
        {
            AudioMgr.Instance.通用按钮.Play();
            UiManager.Instance.mainPanel.node.active = true;
            UiManager.hidePage( this.name );
        }, this );

        this.AudioBtn.node.on( Toggle.EventType.TOGGLE, ( event: Toggle ) =>
        {
            if ( event.isChecked )
                PlayerPrefs.SetInt( 'soundOn', 1 );
            else
                PlayerPrefs.SetInt( 'soundOn', 0 );
            AudioMgr.Instance.UpdateState();
            AudioMgr.Instance.通用按钮.Play();
        }, this );

        this.MusicBtn.node.on( Toggle.EventType.TOGGLE, ( event: Toggle ) =>
        {
            if ( event.isChecked )
                PlayerPrefs.SetInt( 'musicOn', 1 );
            else
                PlayerPrefs.SetInt( 'musicOn', 0 );
            AudioMgr.Instance.UpdateState();
            AudioMgr.Instance.通用按钮.Play();
        }, this );
    }

    init ()
    {
        if ( PlayerPrefs.GetInt( 'soundOn', 1 ) == 1 )
            this.AudioBtn.isChecked = true;
        else
            this.AudioBtn.isChecked = false;

        if ( PlayerPrefs.GetInt( 'musicOn', 1 ) == 1 )
            this.MusicBtn.isChecked = true;
        else
            this.MusicBtn.isChecked = false;
    }
}