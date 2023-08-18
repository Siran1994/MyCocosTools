import { SpriteFrame } from "cc"

/**
 * 卡片数据类，若数据结构不够，可以继承该类继续扩展自己的CardData
 */
export class CardData  
{
    id: number;//编号
    itemType: any;//类型
    icon: SpriteFrame;//图标
    isUnlock: boolean;//是否解锁
    price: number;//价格
    power: number;//战力

    public constructor ( id: number, itemType: any, icon: SpriteFrame, isUnlock: boolean, price: number, power: number )
    {
        this.id = id;
        this.itemType = itemType;
        this.icon = icon;
        this.isUnlock = isUnlock;
        this.price = price;
        this.power = power;
    }
}