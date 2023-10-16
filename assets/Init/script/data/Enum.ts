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

export enum AniState
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
Enum( AniState )

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

export enum ItemType
{
    None,
    短小刀,
    太刀,
    爪子刀,
    蝴蝶刀,
    长小刀,

    蓝手套,
    橙手套,
    粉手套,
    绿手套,
    黄手套
}
Enum( ItemType )

export enum ItemPoolType//商店道具
{
    武器,
    手套
}
Enum( ItemPoolType );
