import { Enum } from "cc";

export enum ItemType
{
    None,
    Hair1,
    Hair2,
    Hair3,
    Hair4,

    Clothes_1,
    Clothes_2,
    Clothes_3,
    Clothes_4,

    Body_1,
    Body_2,
    Body_3,
    Body_4,

    Weapon_1,
    Weapon_2,
    Weapon_3,
    Weapon_4,
}
Enum( ItemType )

export enum ItemPoolType//商店道具
{
    头发,
    服装,
    身体,
    武器
}
Enum( ItemPoolType );

export enum PropType//场景道具
{
    None,
    钻石,
    陷阱,
    武器,
    头纱,
    头发,
    裙子,
    鞋子,
    结束,
}
Enum( PropType );

export enum PlayerState
{
    待机,
    跑步,
    哭泣,
    受击,
    抛花,
    亲吻,
    摔倒,
    攻击,
    跌倒
}
Enum( PlayerState )