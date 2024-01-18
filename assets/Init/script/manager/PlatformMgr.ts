import { _decorator } from 'cc';
import { sys } from 'cc';
import { TipManager } from './TipManager';
import { PlayerPrefs } from '../data/PlayerPrefs';
const { ccclass } = _decorator;

@ccclass( 'PlatformMgr' )
export class PlatformMgr 
{
    private static instance: PlatformMgr = null;

    public static get Instance ()
    {
        if ( this.instance )
            return this.instance;
        this.instance = new PlatformMgr();
        return this.instance;
    }

    getCurrentPlatform ()
    {
        let platform = '';
        switch ( sys.platform )
        {
            case sys.Platform.MOBILE_BROWSER://手机浏览器
                PlayerPrefs.DeleteAll();
                platform = '手机浏览器';
                break;
            case sys.Platform.DESKTOP_BROWSER://电脑浏览器
                PlayerPrefs.DeleteAll();
                platform = '电脑浏览器';
                break;
            case sys.Platform.EDITOR_PAGE://电脑模拟器
                PlayerPrefs.DeleteAll();
                platform = '电脑编辑器';
                break;
            case sys.Platform.WECHAT_GAME://微信
                platform = '微信';
                break;
            case sys.Platform.VIVO_MINI_GAME://VIVO
                platform = 'VIVO';
                break;
            case sys.Platform.OPPO_MINI_GAME://OPPO
                platform = 'OPPO';
                break;
            case sys.Platform.HUAWEI_QUICK_GAME://华为
                platform = '华为';
                break;
            case sys.Platform.XIAOMI_QUICK_GAME://小米
                platform = '小米';
                break;
            case sys.Platform.BAIDU_MINI_GAME://百度
                platform = '百度';
                break;
            case sys.Platform.TAOBAO_MINI_GAME://淘宝
                platform = '淘宝';
                break;
            case sys.Platform.BYTEDANCE_MINI_GAME://抖音
                platform = '抖音';
                break;
            case sys.Platform.ALIPAY_MINI_GAME://支付宝
                platform = '支付宝';
                break;
            case sys.Platform.ANDROID://安卓
                platform = '安卓';
                break;
            case sys.Platform.IOS://苹果
                platform = '苹果';
                break;
        }
        console.log( '当前运行平台是: ' + platform );
        TipManager.Instance.showTips( '当前运行平台是: <outline color=red width=2><i><b><size=30><color=green>' + platform + '</color></size></b></i></outline>' );
    }
}

