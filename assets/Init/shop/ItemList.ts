import { _decorator, Component, Node } from 'cc';
import { ItemInfo } from './ItemInfo';
import { item } from './item';
import { ItemPoolType } from '../script/data/Enum';
const { ccclass, property } = _decorator;

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