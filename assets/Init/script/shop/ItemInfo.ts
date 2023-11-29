import { _decorator } from 'cc';
import { ItemType } from '../data/Enum';
const { ccclass, property } = _decorator;

@ccclass( "ItemInfo" )
export class ItemInfo 
{
    @property( { displayName: '物品类型', type: ItemType } )
    itemtype: ItemType.None;

    @property( { displayName: '是否空', type: Boolean } )
    isNull: boolean = false;

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
}