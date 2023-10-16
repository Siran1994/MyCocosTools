export class Config
{
    public static GameFrame = 60;//游戏帧率

    public static Gravity = -10;//游戏重力

    public static MaxLv = 12;//关卡数   

    public static CameraLerp = 0.15//相机跟随插值   

    public static PackageName = '城市飞侠';//默认礼包名称   

    public static PanelName =//自定义资源包名
        {
            MainPanel: "MainPanel",//主界面
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

    public static Path = //本地化存储
        {
            Coin: 'prefab/ui/Coin',//金币
            Loading: 'prefab/ui/Loading',//加载
            AudioMgr: 'prefab/audiomgr/AudioMgr',//音效
            tips: 'prefab/ui/tips',//提示
            fightTip: 'prefab/ui/fightTip',//战斗提示
            tipPanel: 'prefab/ui/tipPanel',//弹窗提示
        }

    public static PowerType =
        {
            射速: '<color=#534B73>增加</color><color=#ff860f>10%</color><color=#534B73>的射速</color>',
            攻击力: '<color=#534B73>增加</color><color=#ff860f>50%</color><color=#534B73>的攻击力</color>',
            人数: '<color=#534B73>己方人数增加</color><color=#ff860f>1</color><color=#534B73>人</color>',
            弹道: '<color=#534B73>弹道变成</color><color=#ff860f>2</color><color=#534B73>条</color>',
        }

    public static Icon =
        {
            抽奖劵: 'cjq_img',
            幸运值: 'xyz_img',
            钻石: 'zuanshi_img',

            短小刀: 'lb_1',
            太刀: 'lb_2',
            爪子刀: 'lb_3',
            蝴蝶刀: 'lb_4',
            长小刀: 'lb_5',

            蓝手套: '蓝手',
            橙手套: '橙手',
            粉手套: '粉手',
            绿手套: '绿手',
            黄手套: '黄手',
        }

    //声音音量设置
    public static Volume =
        {
            Music: 0.5,
            Audio: 1
        }

    //宝箱抽奖数值
    public static BoxReward =
        {
            Min: 30,
            Max: 50,
            AdGet: 100
        }

    //声音音量设置
    public static OnLine =
        {
            Time: 30,//时间间隔
            Per: 50,//每次
            Total: 500//最高累积
        }

    //自定义资源包名 
    public static BundleName =
        {
            Ui: "ui",//Ui         
            Audio: "audio",//音频音效
            Prefab: "prefab",//预制体
        }

}