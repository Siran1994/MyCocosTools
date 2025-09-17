export class Config
{
    public static GameId = 'ToBeRich';//游戏Id

    public static GameFrame = 60;//游戏帧率

    public static Gravity = -10;//游戏重力

    public static MaxLv = 12;//关卡数   

    public static CameraLerp = 0.15//相机跟随插值   

    public static PackageName = '城市飞侠';//默认礼包名称   

    public static Panel =//自定义资源包名
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

    public static BundleName =
        {
            Base: "base",//基础包   
            Monster: 'monster',//怪物资源包
            Audio: 'audio',//音频资源包
            JumpGame: 'jumpGame',//跳一跳小游戏
            mixFight: "mixFight",//吞噬进化   
            Queen: 'queen',//我就是女王
            Survival: 'survival',//生存大陆
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

    public static ColorValue =
        {
            绿色: '#539521',
            红色: '#ee2324',
            灰色: '#616161',
            褐色: '#745438',
            白色: '#FFFFFF',
            黑色: '#000000',
            描边绿: '#4f9437',
            描边黄: '#b27d21',
            主体绿: '#6cca19',
            主体红: '#ff4040',
        }

    //声音音量设置
    public static Volume =
        {
            Music: 0.5,
            Audio: 0.7
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


    public static Names: string[] = [
        '旧梦',
        '渺远的断云',
        '蹦瞎卡拉卡',
        '你是胖虎吗',
        '颜汐夕',
        '恋爱裁判',
        '风清隐',
        '风月琳琅',
        '最后的温柔',
        '守时守约',
        '時光逗留',
        '白起床了',
        '凉心暖男',
        '夏棠',
        '笙兮',
        '花鸢',
        '樱花蜜桃酥',
        '愤怒小鸟',
        '星梵',
        '書生' ];
}