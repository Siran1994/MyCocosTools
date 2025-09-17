import { _decorator, Component, Node } from 'cc';
import { item } from './item';
import { ItemPoolType, ItemType } from '../data/Enum';
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

@ccclass( 'ItemList' )
export class ItemList extends Component 
{
    @property( { type: ItemInfo } )
    itemInfos: ItemInfo[] = [];

    @property( { displayName: '物品类型', type: ItemPoolType } )
    pooltype: ItemPoolType = ItemPoolType.武器;

    @property( { type: Node } )//当前Icon
    itemList: Node = null;

    public initItem ()
    {
        for ( let i = 0; i < this.itemList.children.length; i++ )
            this.itemList.children[ i ].getComponent( item ).initItem( this.itemInfos[ i ], i, this.pooltype );
        this.itemList.children[ 0 ].getComponent( item ).itemBtn.isChecked = true;
        this.itemList.children[ 0 ].getComponent( item ).BtnClick();
    }
}