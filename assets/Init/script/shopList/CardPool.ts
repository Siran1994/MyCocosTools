import { _decorator, Component, Label, SpriteFrame } from 'cc';
import { ScrollCardList } from './ScrollCardList';
import { HeroType } from '../data/Enum';
import { Vec3 } from 'cc';
const { ccclass, property } = _decorator;
export class TF //位置缩放信息类
{
    pos: Vec3
    scale: Vec3
    constructor ( x: number, y: number, scale: number )
    {
        this.pos = new Vec3( x, y, 0 )
        this.scale = new Vec3( scale, scale, 1 )
    }
}
export class CardData   //卡片数据类，若数据结构不够，可以继承该类继续扩展自己的CardData
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

@ccclass( 'CardInfo' )
class CardInfo
{
    @property( { displayName: '物品类型', type: HeroType } )
    cardtype: HeroType.None;

    @property( { displayName: '物品图标', type: SpriteFrame } )
    cardIcon: SpriteFrame;

    @property( { displayName: '解锁状态', type: Boolean } )
    isUnlocked: boolean = false;

    @property( {
        displayName: '价格', type: Number, visible: function ( this: CardInfo )
        {
            return this.isUnlocked === false;
        }
    } )
    price: number;

    @property( {
        displayName: '战力', type: Number, visible: function ( this: CardInfo )
        {
            return this.isUnlocked === false;
        }
    } )
    power: number;
}

@ccclass( 'CardPool' )
export class CardPool extends Component
{
    @property( CardInfo )
    cardinfo: CardInfo[] = [];

    @property( Label )
    m_select_label: Label = null!;

    @property( ScrollCardList )
    m_scrollCardList: ScrollCardList = null!

    start ()
    {
        // 生成卡片列表
        let cardDataArr = new Array<CardData>();
        for ( let i = 0; i < this.cardinfo.length; i++ )
            cardDataArr.push( new CardData(
                i,
                this.cardinfo[ i ].cardtype,
                this.cardinfo[ i ].cardIcon,
                this.cardinfo[ i ].isUnlocked,
                this.cardinfo[ i ].price,
                this.cardinfo[ i ].power ) );
        // 初始化组件
        this.m_scrollCardList.m_isHorizontalDisplay = true          // 该属性为true则横向列表,否则为纵向
        this.m_scrollCardList.init( cardDataArr, ( card ) =>
        {
            console.log( '初始化完成!' );
            this.m_select_label.string = card.getCardData.power.toString();
        } )
    }
}