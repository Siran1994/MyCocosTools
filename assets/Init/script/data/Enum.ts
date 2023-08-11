import { Enum } from "cc";

export enum HeroType//商店道具
{
    None,
    城市队长,
    城市飞侠,
    钢铁英雄,
    黑液人,
    超级巨人,
    雷公,
}
Enum( HeroType );

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

export enum PlayerState
{
    待机,
    慢跑,
    快跑,
    战架,
    轻击,
    重击,
    受击,
    终结,
    死亡,
    胜利
}
Enum( PlayerState )

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