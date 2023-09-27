import { Enum } from "cc";

export enum PropType//场景道具
{
    None,
    钻石,
    宝石,
    手套,
    陷阱,
    跳板,
    头,
    右手,
    左手,
    身体,
    右腿,
    左腿,
    结束,
    分牌,
    墙
}
Enum( PropType );

export enum AniType
{
    待机,
    行走,
    奔跑,
    起跳,
    攻击,
    受击,
    死亡,
    胜利,
    失败
}
Enum( AniType )

export enum HeroType//商店道具
{
    None,
    黑白电视人,
    美女电视人,
    花屏电视人,
    黄电视人,
    蓝电视人,
}
Enum( HeroType );

export enum BossState
{
    战架,
    轻击,
    重击,
    受击,
    终结,
    开始飞,
    飞行中,
    死亡,
}
Enum( BossState )