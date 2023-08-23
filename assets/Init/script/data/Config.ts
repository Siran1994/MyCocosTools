export class Config
{

    public static Coin = 0;
    public static GameFrame = 60;//游戏帧率

    public static Gravity = -10;//游戏重力

    public static MaxLv = 15;//关卡数

    public static FreeDrawCount = 1;//免费抽奖次数

    public static CameraLerp = 0.15//相机跟随插值

    public static Speed = 6//玩家移动速度   

    public static Rate = 1//结算奖励倍率 

    public static PackageName = '城市飞侠';

    public static BundleName =//自定义资源包名
        {
            Ui: "panel",
            Audio: "audio",
            Prefab: "prefab",
            Config: "config",
        }

    public static PanelName =//自定义资源包名
        {
            GamePanel: "GamePanel",//游戏
            SettingPanel: "SettingPanel",//设置
            SignPanel: "SignPanel",//签到
            DrawPanel: "DrawPanel",//抽奖
            ShopPanel: "ShopPanel",//商店
            FinishPanel: "FinishPanel",//完成
            FailedPanel: "ShopPanel",//失败
            RewardPanel: "RewardPanel",//奖励
            FreeTryPanel: "FreeTryPanel",//试用
        }


    //本地化存储
    public static Path =
        {
            //ShopPanel: 'prefab/panel/ShopPanel',
            // SettingPanel: 'prefab/panel/SettingPanel',//设置
            //SignPanel: 'prefab/panel/SignPanel',//签到
            // DrawPanel: 'prefab/panel/DrawPanel',//抽奖
            //FinishPanel: 'prefab/panel/FinishPanel',//结束
            // FailedPanel: 'prefab/panel/FailedPanel',//失败
            //RewardPanel: 'prefab/panel/RewardPanel',//奖励
            //FreeTryPanel: 'prefab/panel/FreeTryPanel',//试用

            Coin: 'prefab/ui/Coin',//金币
            Loading: 'prefab/Loading',//加载
            AudioMgr: 'prefab/audiomgr/AudioMgr',//音效
            tips: 'prefab/tips',//提示
            fightTip: 'prefab/fightTip',//战斗提示
            tipPanel: 'prefab/tipPanel',//弹窗提示
        }

    //声音音量设置
    public static Volume =
        {
            Bgm: 0.5,
            Audio: 1
        }

    //宝箱抽奖数值
    public static BoxReward =
        {
            Min: 40,
            Max: 100
        }

    //声音音量设置
    public static OnLine =
        {
            Time: 30,//时间间隔
            Per: 50,//每次
            Total: 500//最高累积
        }

    //本地化存储
    public static Key =
        {
            Lv: 'lv',
            Coin: 'coin'
        }

    //本地化存储
    public static AniClip =
        {
            Idle: 'idle',
            Walk: 'walk',
            Run: 'run',
            Win: 'win',
            Fail: 'fail',
            Dead: 'dead',
            Fly: 'fly',
        }

    //平台
    public static Platform =
        {
            WX: 'wx',
            COCOSPLAY: 'cocosplay',
            ANDROID: 'android',
            APPSTORE: 'appstore'
        }
}