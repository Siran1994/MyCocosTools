import { _decorator, Component, Node, sys } from 'cc';
import { PlayerPrefs } from './PlayerPrefs';
const { ccclass, property } = _decorator;

@ccclass('Platform')
export class Platform
{
    onPC = false;
    onWX = false;
    Wx: any;

    static instance: Platform;
    public static get Instance ()
    {
        if ( Platform.instance == null )
        {
            Platform.instance = new Platform();

            Platform.instance.onWX = sys.platform == sys.Platform.WECHAT_GAME;
            Platform.instance.onPC = sys.platform == sys.Platform.DESKTOP_BROWSER;
            if ( Platform.instance.onWX )
            {
                let p_window: any = window;
                Platform.instance.Wx = p_window[ 'wx' ];
            }
        }
        return Platform.instance;
    }
    
    public vibrateLong ()//长震动
    {
        let isOn = PlayerPrefs.GetInt( 'Vibrate', 1 ) == 1;

        if ( isOn && Platform.instance.onWX )
        {
            Platform.instance.Wx.vibrateLong();
        }
    }

    public ShowToast ( msg: string )//吐司提示
    {
        let object: any =
        {
            title: msg, icon: '', image: '', duration: 1500,
            success: () => { }, fail: () => { }, complete: () => { }, mask: false
        };
        Platform.instance.Wx.showToast( object );
    }
}

