import { _decorator, Component, EventTouch, Graphics, input, Input, Mask, Node, UITransform, Vec3 } from 'cc';
import { Messager } from '../../Init/script/manager/Messager';
const { ccclass, property } = _decorator;

@ccclass( 'EraserTool' )
export class EraserTool extends Component
{
    static Instance: EraserTool = null!;
    onLoad ()
    {
        EraserTool.Instance = this;
    }

    @property( Mask )
    m_Mask: Mask = null;
    m_Graphics: Graphics = null;
    rubberPointArr: number[] = [];

    @property( Node )//擦除对象
    traget: Node;

    @property( Number )//橡皮擦大小(像素)
    r = 20;

    @property()
    isNeedTool = true;

    start ()
    {
        this.m_Graphics = this.m_Mask[ "_graphics" ];
        this.rubberPointArr.length = 0;
    }

    onEnable ()
    {
        input.on( Input.EventType.TOUCH_START, this._onTouchBegin, this );
        input.on( Input.EventType.TOUCH_MOVE, this._onTouchMove, this );
        input.on( Input.EventType.TOUCH_END, this._onTouchEnd, this );
    }

    onDisable ()
    {
        input.off( Input.EventType.TOUCH_START, this._onTouchBegin, this );
        input.off( Input.EventType.TOUCH_MOVE, this._onTouchMove, this );
        input.off( Input.EventType.TOUCH_END, this._onTouchEnd, this );
    }

    _onTouchBegin ( touch: EventTouch )
    {
        if ( this.isNeedTool == false )
        {
            console.log( "开始画线" );
            let point1 = touch.getUILocation();
            let point2 = this.traget.getComponent( UITransform ).convertToNodeSpaceAR( new Vec3( point1.x, point1.y ) );
            this._addCircle( point2 );
        }
    }

    _onTouchMove ( touch: EventTouch )
    {
        if ( this.isNeedTool == false )
        {
            let point1 = touch.getUILocation();
            let point2 = this.traget.getComponent( UITransform ).convertToNodeSpaceAR( new Vec3( point1.x, point1.y ) );
            this._addCircle( point2 );
        }
    }

    _onTouchEnd ( touch: EventTouch )
    {
        if ( this.isNeedTool == false )
        {
            let point1 = touch.getUILocation();
            let point2 = this.traget.getComponent( UITransform ).convertToNodeSpaceAR( new Vec3( point1.x, point1.y ) );
            this._addCircle( point2 );
        }
    }

    /** 根据移动点进行绘制擦除 */
    _addCircle ( pos, r: number = 20 )
    {
        this.rubberPointArr.push( pos.x );

        this.m_Graphics.circle( pos.x, pos.y, this.r );
        this.m_Graphics.fill();
        console.log( "已经擦除的数量" + this.rubberPointArr.length );
        Messager.Broadcast( 'Progress', this.rubberPointArr.length );
    }

    /** 清除擦痕 */
    clearDraw ()
    {
        this.m_Graphics.clear();
    }
}