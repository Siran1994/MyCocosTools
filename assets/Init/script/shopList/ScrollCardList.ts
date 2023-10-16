import { CardData } from './CardData'
import { CardItem } from './CardItem'
import { TF } from './TF'
import { _decorator, Vec3, instantiate, Component, Node, Vec2, Input, EventTouch, CurveRange, CCInteger, CCBoolean } from 'cc'
const { ccclass, property } = _decorator

/**
 * 开片列表循环滚动管理类
 */
@ccclass( 'ScrollCardList' )
export class ScrollCardList extends Component
{

    @property( { type: Node, displayName: "卡片模板预设" } )
    m_template_prefab: Node = null!
    /**
     * 代码设置预设对象
     */
    set CardItemTemplate ( item: Node )
    {
        this.m_template_prefab = item
    }
    @property( { type: CCInteger, displayName: "运行时中心位置" } )
    m_centerId: number = 0
    @property( { type: CCBoolean, displayName: "是否启用手指滑动切换" } )
    m_useTouchSwipeChange = true
    @property( { type: CCBoolean, displayName: "是否是横向列表展示，否为纵向列表展示" } )
    m_isHorizontalDisplay = true
    @property( { type: CCInteger, displayName: "两个卡片之间的间隔" } )
    m_gap: number = 300
    @property( { type: CCInteger, displayName: "卡片之间的波动幅度" } )
    m_waveRange: number = 200

    @property( { type: CurveRange, displayName: "位置曲线" } )
    m_location_curve: CurveRange = new CurveRange()
    @property( { type: CurveRange, displayName: "缩放曲线" } )
    m_scale_curve: CurveRange = new CurveRange()


    // 卡片列表
    protected _m_cardItem_arr: Array<CardItem> = new Array<CardItem>()
    private _m_useCardItem_arr: Array<CardItem>       // 启用卡片
    /**
     * 获取正在使用的卡片列表
     */
    get getUseCardItems (): Array<CardItem> { return this._m_useCardItem_arr }

    private _m_moveCompleted_handler: ( item: CardItem ) => void = null // 移动完成回调
    private _m_touchStart_handler: () => void = null;                // 手指按下回调
    private _m_touchEnd_handler: () => void = null;                  // 手指抬起回调
    /**
     * 初始化卡片列表（核心方法)
     * @param dataArr 卡片填充内容信息数组
     * @param moveCompletedHandler 卡片移动完成调用此回调函数，携带中心点卡片物体参数 （非必须）
     * @param touchStartHandler 手指按下回调 （非必须）
     * @param touchEndHandler 手指抬起回调 （非必须）
     */
    init = ( dataArr: Array<CardData>, moveCompletedHandler: ( item: CardItem ) => void = null,
        touchStartHandler: () => void = null, touchEndHandler: () => void = null ) =>
    {
        if ( dataArr.length < 1 ) return
        if ( this.m_template_prefab === null )
        {
            console.log( "[ScrollCardList]: 初始化失败，卡片模板预设还没有设置" )

            return
        }

        if ( Math.abs( this.m_centerId ) > dataArr.length )
        {
            console.log( "[ScrollCardList]: 初始化失败，运行时中心位置不能大于传入的 CardData 数组长度!" )
            return
        }
        // 初始化布局
        let offsetStep = this._initLayout( dataArr.length ) - this.m_centerId;
        let cardDatas = new Array<CardData>();

        let idx = offsetStep;

        for ( let i = 0; i < dataArr.length; i++ )
        {
            idx = i - offsetStep
            if ( idx < 0 )
                idx = idx + dataArr.length
            cardDatas.push( dataArr[ idx ] )
        }
        // 生成卡片
        let len = cardDatas.length > this._m_cardItem_arr.length ? cardDatas.length : this._m_cardItem_arr.length;
        for ( let i = 0; i < len; i++ )
        {
            if ( i < cardDatas.length )
            {
                if ( i >= this._m_cardItem_arr.length )
                {
                    let cardNode = instantiate( this.m_template_prefab )
                    this.node.addChild( cardNode )
                    this._m_cardItem_arr.push( cardNode.getComponent( CardItem ) )
                }
                this._m_cardItem_arr[ i ].node.active = true
                this._m_cardItem_arr[ i ].setCardData = cardDatas[ i ]
            } else
                this._m_cardItem_arr[ i ].node.active = false
        }

        // 初始化每张卡片
        this._m_useCardItem_arr = new Array<CardItem>()
        for ( let i = 0; i < len; i++ )
        {
            this._m_cardItem_arr[ i ].init( this._m_cardTF_arr, this._m_cardBoderTF_arr, i, () =>
            {
                if ( this._m_moveCompleted ) return
                this._m_moveCompletedTotal++
                if ( this._m_moveCompletedTotal >= len )
                    this._moveCompleted()
            } )
            this._m_useCardItem_arr.push( this._m_cardItem_arr[ i ] )
        }

        this._m_touchStart_handler = touchStartHandler
        this._m_touchEnd_handler = touchEndHandler
        this._m_moveCompleted_handler = moveCompletedHandler
        this._moveCompleted()
    }

    protected _m_cardTF_arr: Array<TF>                  // 启用卡片的位置和缩放
    protected _m_cardBoderTF_arr: Array<TF>             // 最边界的两个位置和缩放
    private _m_moveCompletedTotal: number = 0           // 当前移动完成的个数
    private _m_moveCompleted = true                     // 当前是否移动给完成
    private _m_centerPos: Vec3                          // 中心点的位置
    /**
    * 初始化布局
    */
    protected _initLayout = ( len: number ) =>
    {
        let allCardTFArr = Array<TF>();                // 所有的卡片的位置缩放信息
        this._m_cardTF_arr = new Array<TF>();
        this._m_cardBoderTF_arr = new Array<TF>();
        // 计算位置缩放
        let virtualLen = len + 2;                      // 带上边界的总个数
        let stepRatio = 1 / virtualLen;
        let minIdx = 0, maxIdx = 0;
        let tf: TF = this._getMaxTFByIndex( 0, 0 );
        this._m_centerPos = tf.pos.clone();
        allCardTFArr.push( tf );

        for ( let i = 1; i < virtualLen; i++ )
        {
            if ( i % 2 === 1 )
            {
                minIdx++;
                tf = this._getMinTFByIndex( minIdx, stepRatio );
            }
            else
            {
                maxIdx++;
                tf = this._getMaxTFByIndex( maxIdx, stepRatio );
            }
            allCardTFArr.push( tf );
        }
        // 排序
        if ( this.m_isHorizontalDisplay )
            allCardTFArr = allCardTFArr.sort( ( tf1, tf2 ) => tf1.pos.x - tf2.pos.x )
        else
            allCardTFArr = allCardTFArr.sort( ( tf1, tf2 ) => tf2.pos.y - tf1.pos.y )
        // 设置边界位置缩放
        this._m_cardBoderTF_arr.push( allCardTFArr[ 0 ] )
        this._m_cardBoderTF_arr.push( allCardTFArr[ virtualLen - 1 ] )
        // 设置启用卡片的位置和缩放
        let offsetIdx = -1;
        for ( let i = 0, j = 1; i < len; i++, j++ )
        {
            if ( offsetIdx === -1 && Vec3.equals( allCardTFArr[ j ].pos, this._m_centerPos ) )
                offsetIdx = i;
            this._m_cardTF_arr.push( allCardTFArr[ j ] );
        }

        return offsetIdx;
    }

    private _getMinTFByIndex ( idx: number, ratio: number ): TF
    {
        let x = -( idx * this.m_gap );
        let y = 0.5 - idx * ratio;
        let scale = this.m_scale_curve.spline.evaluate( y );      
        y = 0;
        return this.m_isHorizontalDisplay ? new TF( x, y, scale ) : new TF( y, x, scale );
    }

    private _getMaxTFByIndex ( idx: number, ratio: number ): TF
    {
        let x = idx * this.m_gap;
        let y = 0.5 + idx * ratio;
        let scale = 1;
        y = 0;
        return this.m_isHorizontalDisplay ? new TF( x, y, scale ) : new TF( y, x, scale );
    }

    protected onEnable (): void
    {
        if ( this.m_useTouchSwipeChange )
        {
            this.node.on( Input.EventType.TOUCH_START, this._onTouchStart, this )
            this.node.on( Input.EventType.TOUCH_END, this._onTouchEnd, this )
            this.node.on( Input.EventType.TOUCH_CANCEL, this._onTouchEnd, this )
        }
    }

    protected onDisable (): void
    {
        this.node.off( Input.EventType.TOUCH_START, this._onTouchStart, this )
        this.node.off( Input.EventType.TOUCH_END, this._onTouchEnd, this )
        this.node.off( Input.EventType.TOUCH_CANCEL, this._onTouchEnd, this )
    }

    private _onTouchStart ( _: EventTouch ): void
    {
        if ( this._m_touchStart_handler )
            this._m_touchStart_handler()
    }

    private _onTouchEnd ( e: EventTouch ): void
    {
        this._moveTouchEnd( e.getStartLocation().subtract( e.getLocation() ) )
        if ( this._m_touchEnd_handler )
            this._m_touchEnd_handler()
    }

    /**
     * 手指滑动完成调用
     * @param dis 手指滑动距离
     */
    protected _moveTouchEnd ( dis: Vec2 )
    {
        let moveDis = this.m_isHorizontalDisplay ? dis.x : -dis.y
        if ( Math.abs( moveDis ) < 30 ) return
        this._moveStep( moveDis )
    }

    /**
     * 滑动一格
     * @param dir 滑动方向
     */
    protected _moveStep ( dir: number )
    {
        if ( !this._m_moveCompleted ) return
        this._m_moveCompleted = false
        for ( let i = 0; i < this._m_useCardItem_arr.length; i++ )
            this._m_useCardItem_arr[ i ].move( dir )
    }

    /**
     * 下一个
     */
    nextStep = () =>
    {
        this._moveStep( 1 )
    }

    /**
     * 上一个
     */
    previousStep = () =>
    {
        this._moveStep( -1 )
    }

    /**
     * 移动完成调用
     */
    private _moveCompleted = () =>
    {
        let dis = Vec3.distance( this._m_useCardItem_arr[ 0 ].getPos, this._m_centerPos )
        let idx = 0
        for ( let i = 1; i < this._m_useCardItem_arr.length; i++ )
        {
            let tempDis = Vec3.distance( this._m_useCardItem_arr[ i ].getPos, this._m_centerPos )
            if ( tempDis < dis )
            {
                idx = i
                dis = tempDis
            }
        }
        this._m_useCardItem_arr[ idx ].node.setSiblingIndex( this._m_useCardItem_arr.length )
        if ( this._m_moveCompleted_handler )
            this._m_moveCompleted_handler( this._m_useCardItem_arr[ idx ] )
        this._m_moveCompletedTotal = 0
        this._m_moveCompleted = true
    }
}