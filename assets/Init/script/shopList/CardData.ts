import { SpriteFrame } from "cc"
import { HeroType } from "../data/Enum"

/**
 * 卡片数据类，若数据结构不够，可以继承该类继续扩展自己的CardData
 */
export class CardData  
{
    id: number;//编号
    heroType: HeroType;//类型
    icon: SpriteFrame;//图标
    isUnlock: boolean;//是否解锁
    price: number;//价格
    power: number;//战力

    public constructor ( id: number, heroType: HeroType, icon: SpriteFrame, isUnlock: boolean, price: number, power: number )
    {
        this.id = id;
        this.heroType = heroType;
        this.icon = icon;
        this.isUnlock = isUnlock;
        this.price = price;
        this.power = power;
    }
}