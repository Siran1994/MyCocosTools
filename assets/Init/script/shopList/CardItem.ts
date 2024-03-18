import { _decorator, Button, Component, Label, Sprite, SpriteFrame, Vec3, Node } from 'cc'
import { AudioMgr } from '../manager/AudioMgr';
import { HeroType } from '../data/Enum';
import { GameData } from '../data/GameData';
import { TipManager } from '../manager/TipManager';
import { PlayerPrefs } from '../data/PlayerPrefs';
import { Messager } from '../manager/Messager';
import { CardData, TF } from './CardPool';
const { ccclass, property } = _decorator
@ccclass( 'CardItem' )
export class CardItem extends Component //卡片物品类，目前之提供了一张图片和标签，若想更多功能，继承该类，继续扩展此方法
{
    @property( { type: Label, displayName: "战力" } )
    m_title_lb: Label = null!
    @property( { type: Sprite, displayName: "图标" } )
    m_icon_sp: Sprite = null!

    @property( Node )
    Locked: Node = null;
    @property( Node )
    Coin: Node = null;

    @property( Button )
    ClickBtn: Button = null;

    @property( Label )
    BtnTxt: Label = null;

    @property( Label )
    Name: Label = null;

    @property( Sprite )
    BtnImg: Sprite = null;

    @property( SpriteFrame )
    BtnState: SpriteFrame[] = [];//购买,装备,已装备

    @property( Button )
    GetBtn: Button = null;
    // 卡片数据
    protected _m_cardData: CardData
    get getCardData (): CardData
    {
        return this._m_cardData;
    }
    /**
    * 对象内容的填充
    * 继承该类后最好重新该方法
    */
    set setCardData ( cardItem: CardData )
    {
        if ( this.m_title_lb && cardItem.power > 0 )
            this.m_title_lb.string = cardItem.power.toString();
        if ( this.m_icon_sp && cardItem.icon )
            this.m_icon_sp.spriteFrame = cardItem.icon

        this.Name.string = HeroType[ cardItem.heroType ];

        this.checkUnLock( cardItem );

        this.GetBtn.node.on( Button.EventType.CLICK, () =>
        {
            AudioMgr.Instance.点击广告按钮.Play();
            switch ( this.BtnTxt.string )
            {
                case '已装备':
                    TipManager.Instance.showTips( '当前已装备!' );
                    break;
                case '装备':
                    PlayerPrefs.SetString( 'HeroDress', this.Name.string );
                    this.checkUnLock( cardItem );
                    this.BtnTxt.string = '已装备';
                    this.BtnImg.spriteFrame = this.BtnState[ 2 ];
                    break;
                default:
                    if ( GameData.Coin >= cardItem.price )
                    {
                        GameData.Coin -= cardItem.price;
                        Messager.Broadcast( 'CoinUpdate' );
                        PlayerPrefs.SetBool( this.Name.string + 'UnLocked', true );
                        this.checkUnLock( cardItem );
                    }
                    else
                        TipManager.Instance.showTips( '当前金币不足!' );
                    break;
            }
        }, this );

        this._m_cardData = cardItem;
    }


    checkUnLock ( cardItem: CardData )
    {
        if ( cardItem.isUnlock || PlayerPrefs.GetBool( this.Name.string + 'UnLocked', false ) ) //解锁
        {
            this.Locked.active = false;
            this.Coin.active = false;
            this.BtnTxt.node.position = Vec3.ZERO;
            if ( PlayerPrefs.GetString( 'HeroDress', 'None' ) == this.Name.string )
            {
                this.BtnTxt.string = '已装备';
                this.BtnImg.spriteFrame = this.BtnState[ 2 ];
                console.log( '当前已装备' + this.Name.string );
                Messager.Broadcast( 'ChangeDress', this.Name.string );
            }
            else
            {
                this.BtnTxt.string = '装备';
                this.BtnImg.spriteFrame = this.BtnState[ 1 ];
            }
        }
        else//未解锁
        {
            this.Locked.active = true;
            this.Coin.active = true;
            this.BtnTxt.string = cardItem.price.toString();
            this.BtnImg.spriteFrame = this.BtnState[ 0 ];
        }
    }

    updateState ()
    {
        if ( this.getCardData.isUnlock || PlayerPrefs.GetBool( this.Name.string + 'UnLocked', false ) ) //解锁
        {
            this.Locked.active = false;
            this.Coin.active = false;
            this.BtnTxt.node.position = Vec3.ZERO;
            if ( this.Name.string == PlayerPrefs.GetString( 'HeroDress', 'None' ) )
            {
                this.BtnTxt.string = '已装备';
                this.BtnImg.spriteFrame = this.BtnState[ 2 ];
            }
            else
            {
                this.BtnTxt.string = '装备';
                this.BtnImg.spriteFrame = this.BtnState[ 1 ];
            }
        }
    }
    private _m_tf_arr: Array<TF>                    // 坐标缩放数据
    private _m_borderTf_arr: Array<TF>              // 边界坐标缩放数据
    private _m_moveComplete_callback: () => void    // 移动完成回调
    /**
     * 初始化卡牌
     * @param arr 所有点位的列表数据
     * @param idx 当前点位的索引
     */
    init = ( arr: Array<TF>, borderArr: Array<TF>, idx: number, moveCompletedHandler: () => void ) =>
    {
        this._m_tf_arr = arr
        this._m_borderTf_arr = borderArr
        this.node.setPosition( arr[ idx ].pos )
        this.node.scale = arr[ idx ].scale
        this._m_moveComplete_callback = moveCompletedHandler
    }

    /**
     * 初始化组件，代码提供一个赋值操作
     * @param title 标题标签
     * @param icon  图片缩略图
     */
    initComponent = ( title: Label, icon: Sprite ) =>
    {
        this.m_title_lb = title
        this.m_icon_sp = icon
    }

    /**
     * 获取当前卡片位置
     */
    get getPos (): Vec3
    {
        return this.node.getPosition()
    }
    private _m_curIdx = -1               // 当前索引
    private _m_dis = 0
    private _m_tempDis = 0
    private _m_addScale: number = 0
    private _m_curScale: Vec3
    private _m_canMove = false           // 是否能移动
    /**
     * 移动
     * @param moveDis 移动距离，取正负方向
     */
    move = ( moveDis: number ) =>
    {
        if ( this._m_canMove ) return
        this._m_dis = Vec3.distance( this._m_tf_arr[ 0 ].pos, this.getPos )
        this._m_curIdx = 0
        for ( let i = 1; i < this._m_tf_arr.length; i++ )
        {
            this._m_tempDis = Vec3.distance( this._m_tf_arr[ i ].pos, this.getPos )
            if ( this._m_tempDis < this._m_dis )
            {
                this._m_dis = this._m_tempDis
                this._m_curIdx = i
            }
        }
        if ( moveDis > 0 )
            this._setPreviousIndex()
        else
            this._setNextIndex()
        // 获得位置和缩放
        this._m_dis = Vec3.distance( this._m_tf_arr[ this._m_curIdx ].pos, this.getPos ) + 0.1  // 为防止分母为0，加上0.1
        this._m_addScale = this._m_tf_arr[ this._m_curIdx ].scale.x - this.node.scale.x       // 增加的缩放
        this._m_curScale = this.node.scale.clone()
        this._m_canMove = true
    }

    private _setPreviousIndex (): void
    {
        this._m_curIdx--
        if ( this._m_curIdx < 0 )
        {
            this._m_curIdx = this._m_tf_arr.length - 1
            this.node.setPosition( this._m_borderTf_arr[ this._m_borderTf_arr.length - 1 ].pos )
            this.node.setScale( this._m_borderTf_arr[ this._m_borderTf_arr.length - 1 ].scale )
        }
    }

    private _setNextIndex (): void
    {
        this._m_curIdx++
        if ( this._m_curIdx >= this._m_tf_arr.length )
        {
            this._m_curIdx = 0
            this.node.setPosition( this._m_borderTf_arr[ 0 ].pos )
            this.node.setScale( this._m_borderTf_arr[ 0 ].scale )
        }
    }

    private _m_nextPos = new Vec3()
    private _m_nextScale = new Vec3()
    update ( deltaTime: number )
    {
        if ( !this._m_canMove ) return
        this._m_tempDis = Vec3.distance( this._m_tf_arr[ this._m_curIdx ].pos, this.getPos )
        if ( this._m_tempDis > 1 )
        {
            Vec3.lerp( this._m_nextPos, this.getPos, this._m_tf_arr[ this._m_curIdx ].pos, deltaTime * 15 )
            this.node.setPosition( this._m_nextPos )
            Vec3.multiplyScalar( this._m_nextScale, Vec3.ONE, ( this._m_dis - this._m_tempDis ) / this._m_dis * this._m_addScale )
            Vec3.add( this._m_nextScale, this._m_curScale, this._m_nextScale )
            this.node.setScale( this._m_nextScale )
        } else
        {
            this.node.setPosition( this._m_tf_arr[ this._m_curIdx ].pos )
            this.node.setScale( this._m_tf_arr[ this._m_curIdx ].scale )
            this._m_canMove = false
            if ( this._m_moveComplete_callback )
                this._m_moveComplete_callback()
        }
    }
}