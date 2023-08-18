
import { _decorator, Component } from 'cc';
import { TipManager } from '../manager/TipManager';
const { ccclass } = _decorator;

@ccclass( 'VibrateManager' )
export class VibrateManager 
{
    private static instance: VibrateManager = null;
    static get Instance ()
    {
        if ( VibrateManager.instance == null )
        {
            VibrateManager.instance = new VibrateManager();
        }
        return VibrateManager.instance;
    }
    static set Instance ( value: VibrateManager )
    {
        this.instance = value;
    }

    //#region 安卓震动开启方法
    //1.开启权限:<uses-permission android: name =“android.permission.VIBRATE” / >
    //2.jsb.Device.vibrate(5.0);// 震动时间
    //#endregion
    isSupport ()
    {
        // navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
        if ( navigator.vibrate )
        {
            console.log( "支持设备震动！" );
            return true;
        }
        else
            return false;
    }

    vibrateInterval;
    // 开始震动
    startVibrate ( duration )
    {
        if ( this.isSupport() )
            navigator.vibrate( duration );
        else
            TipManager.Instance.showTips( '当前设备不支持震动:' );
    }

    // 停止震动
    stopVibrate ()
    {
        if ( this.isSupport() )
        {
            // 清除间隔和停止持续振动
            if ( this.vibrateInterval )
                clearInterval( this.vibrateInterval );
            navigator.vibrate( 0 );
        }
    }

    //在给定的持续时间和间隔时开始持续的振动
    //假定一个数字值
    startPeristentVibrate ( duration, interval )
    {
        if ( this.isSupport() )
        {
            this.vibrateInterval = setInterval( function ()
            {
                this.startVibrate( duration );
            }, interval );
        }
    }
}