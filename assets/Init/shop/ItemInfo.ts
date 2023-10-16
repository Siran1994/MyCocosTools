import { SpriteFrame, _decorator } from 'cc';
import { ItemType } from '../script/data/Enum';

const { ccclass, property } = _decorator;

@ccclass( "ItemInfo" )
export class ItemInfo 
{
    @property( { displayName: '物品类型', type: ItemType } )
    itemtype: ItemType.None;

    @property( { displayName: '是否空', type: Boolean } )
    isNull: boolean = false;

    @property( {
        displayName: '物品图标', type: SpriteFrame, visible: function ( this: ItemInfo )
        {
            return this.isNull === false;
        }
    } )
    itemIcon: SpriteFrame;

    @property( {
        displayName: '解锁状态', type: Boolean, visible: function ( this: ItemInfo )
        {
            return this.isNull === false;
        }
    } )
    isUnlocked: boolean = false;

    @property( {
        displayName: '价格', type: Number, visible: function ( this: ItemInfo )
        {
            return this.isUnlocked === false && this.isNull === false;
        }
    } )
    price: number;

    @property( {
        displayName: '广告次数', type: Number, visible: function ( this: ItemInfo )
        {
            return this.isUnlocked === false && this.isNull === false;
        }
    } )
    count: number = 0;

    @property( {
        displayName: '当前下标', type: Number, visible: function ( this: ItemInfo )
        {
            return this.isUnlocked === false && this.isNull === false;
        }
    } )
    index: number;
}