import { _decorator, CCBoolean, TweenEasing , CCFloat, CCString, Component, easing, Enum, EventTouch, isValid, Node, NodeEventType, Tween, tween, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;
export enum FloatType {
    None,
    MoveToTop,
    MoveToTopLayer,
    // CopyToTopLayer
}
export enum DragBackHomeType {
    SetPosition,
    Tween
}
export enum EasingString {
    'linear'    , 'smooth'     , 'fade'         , 'constant'     ,
    'quadIn'    , 'quadOut'    , 'quadInOut'    , 'quadOutIn'    ,
    'cubicIn'   , 'cubicOut'   , 'cubicInOut'   , 'cubicOutIn'   ,
    'quartIn'   , 'quartOut'   , 'quartInOut'   , 'quartOutIn'   ,
    'quintIn'   , 'quintOut'   , 'quintInOut'   , 'quintOutIn'   ,
    'sineIn'    , 'sineOut'    , 'sineInOut'    , 'sineOutIn'    ,
    'expoIn'    , 'expoOut'    , 'expoInOut'    , 'expoOutIn'    ,
    'circIn'    , 'circOut'    , 'circInOut'    , 'circOutIn'    ,
    'elasticIn' , 'elasticOut' , 'elasticInOut' , 'elasticOutIn' ,
    'backIn'    , 'backOut'    , 'backInOut'    , 'backOutIn'    ,
    'bounceIn'  , 'bounceOut'  , 'bounceInOut'  , 'bounceOutIn'
}
@ccclass('GPDrag')
export class GPDrag extends Component {
    @property({type:CCBoolean, tooltip:"触碰点偏移量敏感"})
    public touchOffsetSensitive = true

    @property({type:CCBoolean, tooltip:"失败时回到起始位置"})
    public backHomeWhenFailed = true

    @property({type:Enum(DragBackHomeType), tooltip:"回家的方式", visible:function(this){
        return this.backHomeWhenFailed
    }})
    public backHomeType:DragBackHomeType = DragBackHomeType.SetPosition

    @property({type:CCFloat, visible:function(this) {
        return this.backHomeWhenFailed && this.backHomeType == DragBackHomeType.Tween
    }})
    public backTweenTime:number = 1;

    @property({type:Enum(EasingString), tooltip:"缓动类型", visible:function(this) {
        return this.backHomeWhenFailed && this.backHomeType == DragBackHomeType.Tween
    }})
    public backTweenEasing:EasingString = EasingString.linear

    @property({type:Enum(FloatType), tooltip:"上浮类型"})
    public floatType:FloatType = FloatType.None

    @property({type:Node, visible:function(this){
        return this.floatType == FloatType.MoveToTopLayer 
        // || this.floatType == FloatType.CopyToTopLayer
    }})
    public topLayerNode:Node

    @property({type:CCBoolean, tooltip:"松开后返回原来的层级", visible:function(){
        return this.floatType != FloatType.None
    }})
    public backToOriZ = true;
    private srcParent:Node
    private zOrder:number
    private dragStartPos:Vec2 = new Vec2(0, 0)
    private dragOffset:Vec2 = new Vec2(0, 0)
    public succeedCheck:Function = null;
    public succeedCallback:Function = null;
    private backTween:Tween<Node>


    start() {
        this.node.on(NodeEventType.TOUCH_START, this.OnDragStart, this)
        this.node.on(NodeEventType.TOUCH_MOVE, this.OnDragMove, this)
        this.node.on(NodeEventType.TOUCH_END, this.OnDragEnd, this)
        this.node.on(NodeEventType.TOUCH_CANCEL, this.OnDragEnd, this)
    }

    private OnDragStart(e:EventTouch) {
        this.dragStartPos.set(this.node.position.x, this.node.position.y);
        let touchPoint = e.getUILocation();
        Vec2.subtract(this.dragOffset, this.dragStartPos, touchPoint)
        switch(this.floatType) {
            case FloatType.MoveToTop:
                this.zOrder = this.node.getSiblingIndex();
                this.node.setSiblingIndex(Infinity);
                break;
            case FloatType.MoveToTopLayer:
                this.zOrder = this.node.getSiblingIndex()
                this.srcParent = this.node.parent
                this.node.parent = this.topLayerNode;
                break;
            // case FloatType.CopyToTopLayer:
            //     break;
        }
    }

    private OnDragMove(e:EventTouch) {
        let p = e.getUILocation();
        if (this.touchOffsetSensitive)
            this.node.setPosition(new Vec3(p.x + this.dragOffset.x, p.y + this.dragOffset.y, 0))
        else
            this.node.setPosition(new Vec3(p.x, 0, p.y))
    }

    private OnDragEnd(e:EventTouch) {
        if (this.succeedCheck && this.succeedCheck(e)) {
            this.succeedCallback && this.succeedCallback(e)
        } else if(this.backHomeWhenFailed){
            let p = new Vec3(this.dragStartPos.x, this.dragStartPos.y, 0);
            switch(this.backHomeType) {
                case DragBackHomeType.SetPosition:
                    this.node.setPosition(p)
                    this.OnArrivedHome();
                    break;
                case DragBackHomeType.Tween:
                    this.backTween && this.backTween.stop()
                    let easing:TweenEasing = EasingString[this.backTweenEasing] as TweenEasing
                    this.backTween = tween(this.node)
                        .to(this.backTweenTime, {position:p}, {easing:easing}).call(this.OnArrivedHome.bind(this)).start()
                    break;
            }
        }
    }

    private OnArrivedHome() {
        if (this.backToOriZ)
        switch(this.floatType) {
            case FloatType.MoveToTop:
                this.node.setSiblingIndex(this.zOrder)
                break;
            case FloatType.MoveToTopLayer:
                this.node.parent = this.srcParent;
                this.node.setSiblingIndex(this.zOrder)
                break;
        }
    }

    protected onDestroy(): void {
        this.node.off(NodeEventType.TOUCH_START, this.OnDragStart, this)
        this.node.off(NodeEventType.TOUCH_MOVE, this.OnDragMove, this)
        this.node.off(NodeEventType.TOUCH_END, this.OnDragEnd, this)
        this.node.off(NodeEventType.TOUCH_CANCEL, this.OnDragEnd, this)
    }
}