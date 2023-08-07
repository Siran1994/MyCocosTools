import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

@ccclass( 'VibrateManager' )
export class VibrateManager extends Component
{
    public static Instance: VibrateManager = null;
    onLoad ()
    {
        VibrateManager.Instance = this;
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