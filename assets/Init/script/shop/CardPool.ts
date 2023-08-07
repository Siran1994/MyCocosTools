import { _decorator, Component, Label, SpriteFrame } from 'cc';
import { CardData } from './CardData';
import { ScrollCardList } from './ScrollCardList';
import { HeroType } from '../data/Enum';
const { ccclass, property } = _decorator;

@ccclass( 'ItemInfo' )
class ItemInfo
{
    @property( { displayName: '物品类型', type: HeroType } )
    itemtype: HeroType.None;

    @property( { displayName: '物品图标', type: SpriteFrame } )
    itemIcon: SpriteFrame;

    @property( { displayName: '解锁状态', type: Boolean } )
    isUnlocked: boolean = false;

    @property( {
        displayName: '价格', type: Number, visible: function ( this: ItemInfo )
        {
            return this.isUnlocked === false;
        }
    } )
    price: number;

    @property( {
        displayName: '战力', type: Number, visible: function ( this: ItemInfo )
        {
            return this.isUnlocked === false;
        }
    } )
    power: number;
}

@ccclass( 'CardPool' )
export class CardPool extends Component
{

    @property( ItemInfo )
    iteminfo: ItemInfo[] = [];

    @property( Label )
    m_select_label: Label = null!;
    @property( ScrollCardList )
    m_scrollCardList: ScrollCardList = null!

    start ()
    {
        // 生成卡片列表
        let cardDataArr = new Array<CardData>();
        for ( let i = 0; i < this.iteminfo.length; i++ )
            cardDataArr.push( new CardData(
                i,
                this.iteminfo[ i ].itemtype,
                this.iteminfo[ i ].itemIcon,
                this.iteminfo[ i ].isUnlocked,
                this.iteminfo[ i ].price,
                this.iteminfo[ i ].power ) );
        // 初始化组件
        this.m_scrollCardList.m_isHorizontalDisplay = true          // 该属性为true则横向列表,否则为纵向
        this.m_scrollCardList.init( cardDataArr, ( item ) =>
        {
            console.log( '初始化完成!' );
            this.m_select_label.string = item.getCardData.power.toString();
        } )
    }
}