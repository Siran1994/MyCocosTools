import
{
    _decorator, Component, Node, Vec3, Color, Tween, tween, Enum,
    Sprite, Label, UIOpacity, EventHandler
} from 'cc';

const { ccclass, property } = _decorator;

export enum PlaybackMode
{
    NORMAL,     // 正常播放：从当前值到目标值
    REVERSE,    // 反向播放：从目标值回到当前值（TO模式）或反向增量（BY模式）
    YOYO        // 往返模式：先到目标值，再回到初始值
}
Enum( PlaybackMode );

export enum TweenActionType
{
    POSITION,
    ROTATION,
    SCALE,
    OPACITY,
    COLOR
}
Enum( TweenActionType );

export enum EaseType
{
    linear, quadIn, quadOut, quadInOut, cubicIn, cubicOut, cubicInOut,
    quartIn, quartOut, quartInOut, quintIn, quintOut, quintInOut,
    sineIn, sineOut, sineInOut, expoIn, expoOut, expoInOut,
    circIn, circOut, circInOut, elasticIn, elasticOut, elasticInOut,
    backIn, backOut, backInOut, bounceIn, bounceOut, bounceInOut,
    smooth, fade, quadOutIn, cubicOutIn, quartOutIn, quintOutIn,
    sineOutIn, expoOutIn, circOutIn, elasticOutIn, backOutIn, bounceOutIn,
}
Enum( EaseType );

@ccclass( 'TweenTool' )
export class TweenTool extends Component
{
    @property( { group: 'Base', type: Node, tooltip: '动画目标节点，为空则使用当前节点' } )
    target: Node | null = null;

    @property( { group: 'Base' } )
    playOnLoad: boolean = true;

    @property( { group: 'Animation', type: TweenActionType } )
    actionType: TweenActionType = TweenActionType.POSITION;

    @property( { group: 'Animation', type: EaseType } )
    easeType: EaseType = EaseType.linear;

    @property( { group: 'Animation', tooltip: '动画时长（秒）' } )
    duration: number = 1;

    @property( { group: 'Animation', tooltip: '开始前的延迟（秒）' } )
    delay: number = 0;

    @property( { group: 'Properties', visible: function ( this: TweenTool ) { return this.actionType === TweenActionType.POSITION; } } )
    position: Vec3 = new Vec3();

    @property( { group: 'Properties', visible: function ( this: TweenTool ) { return this.actionType === TweenActionType.ROTATION; } } )
    rotation: Vec3 = new Vec3();

    @property( { group: 'Properties', visible: function ( this: TweenTool ) { return this.actionType === TweenActionType.SCALE; } } )
    scale: Vec3 = new Vec3( 1, 1, 1 );

    @property( { group: 'Properties', visible: function ( this: TweenTool ) { return this.actionType === TweenActionType.OPACITY; }, range: [ 0, 255, 1 ] } )
    opacity: number = 255;

    @property( { group: 'Properties', visible: function ( this: TweenTool ) { return this.actionType === TweenActionType.COLOR; } } )
    color: Color = Color.WHITE.clone();

    @property( { group: 'Properties', tooltip: 'true: 绝对值(to)，false: 相对值(by)' } )
    toOrby: boolean = true;

    @property( { group: 'Playback', type: PlaybackMode } )
    playbackMode: PlaybackMode = PlaybackMode.NORMAL;

    @property( { group: 'Playback', visible: function ( this: TweenTool ) { return this.playbackMode === PlaybackMode.YOYO; }, tooltip: '往返次数（1表示一次往返：去+回）' } )
    yoyoCount: number = 1;

    @property( { group: 'Playback', visible: function ( this: TweenTool ) { return this.playbackMode === PlaybackMode.YOYO; }, tooltip: '返程前的延迟（秒）' } )
    reverseDelay: number = 0;

    @property( { group: 'Loop' } )
    isLoop: boolean = false;

    @property( { group: 'Loop', visible: function ( this: TweenTool ) { return this.isLoop; }, tooltip: '0或-1表示无限循环，>0表示重复次数' } )
    loopCount: number = 0;

    @property( { group: 'Event', type: EventHandler } )
    onComplete: EventHandler = new EventHandler();

    @property( { group: 'Event', tooltip: '传递给回调函数的自定义数据' } )
    customEventData: string = '';

    private _tween: Tween<Node | UIOpacity | Sprite | Label> | null = null;
    private _initialValues = {
        position: new Vec3(),
        rotation: new Vec3(),
        scale: new Vec3( 1, 1, 1 ),
        opacity: 255,
        color: Color.WHITE.clone()
    };

    onLoad ()
    {
        if ( !this.target )
        {
            this.target = this.node;
        }
    }

    onEnable ()
    {
        if ( this.playOnLoad )
        {
            this.play();
        }
    }

    /**
     * 获取动画目标对象（可能是Node或Component）
     */
    private _getTarget (): any
    {
        if ( !this.target ) return this.node;

        switch ( this.actionType )
        {
            case TweenActionType.OPACITY: {
                let comp = this.target.getComponent( UIOpacity );
                if ( !comp )
                {
                    comp = this.target.addComponent( UIOpacity );
                    comp.opacity = 255;
                }
                return comp;
            }
            case TweenActionType.COLOR: {
                return this.target.getComponent( Sprite ) ||
                    this.target.getComponent( Label ) ||
                    this.target;
            }
            default:
                return this.target;
        }
    }

    /**
     * 记录初始值，用于REVERSE和YOYO模式
     */
    private _recordInitialValues ( target: any )
    {
        switch ( this.actionType )
        {
            case TweenActionType.POSITION:
                this._initialValues.position = target.position?.clone() || new Vec3();
                break;
            case TweenActionType.ROTATION:
                this._initialValues.rotation = target.eulerAngles?.clone() || new Vec3();
                break;
            case TweenActionType.SCALE:
                this._initialValues.scale = target.scale?.clone() || new Vec3( 1, 1, 1 );
                break;
            case TweenActionType.OPACITY:
                this._initialValues.opacity = target.opacity !== undefined ? target.opacity : 255;
                break;
            case TweenActionType.COLOR:
                this._initialValues.color = target.color?.clone() || Color.WHITE.clone();
                break;
        }
    }

    /**
     * 获取缓动函数
     */
    private _getEase ()
    {
        let opts = {};
        opts[ "easing" ] = EaseType[ this.easeType ];
        return opts;
    }

    /**
     * 获取正向动画属性
     */
    private _getForwardProps (): any
    {
        switch ( this.actionType )
        {
            case TweenActionType.POSITION: return { position: this.position };
            case TweenActionType.ROTATION: return { eulerAngles: this.rotation };
            case TweenActionType.SCALE: return { scale: this.scale };
            case TweenActionType.OPACITY: return { opacity: this.opacity };
            case TweenActionType.COLOR: return { color: this.color };
            default: return {};
        }
    }

    /**
     * 获取反向动画属性（用于REVERSE和YOYO的返回阶段）
     */
    private _getReverseProps (): any
    {
        // TO模式：回到初始值
        if ( this.toOrby )
        {
            switch ( this.actionType )
            {
                case TweenActionType.POSITION: return { position: this._initialValues.position };
                case TweenActionType.ROTATION: return { eulerAngles: this._initialValues.rotation };
                case TweenActionType.SCALE: return { scale: this._initialValues.scale };
                case TweenActionType.OPACITY: return { opacity: this._initialValues.opacity };
                case TweenActionType.COLOR: return { color: this._initialValues.color };
            }
        }
        // BY模式：反向增量（对于Scale和Color，回到初始值更合理）
        else
        {
            switch ( this.actionType )
            {
                case TweenActionType.POSITION:
                    return { position: this.position.clone().negative() };
                case TweenActionType.ROTATION:
                    return { eulerAngles: this.rotation.clone().negative() };
                case TweenActionType.SCALE:
                    // Scale的反向通常不是简单取反，这里回到初始值
                    return { scale: this._initialValues.scale };
                case TweenActionType.OPACITY:
                    return { opacity: -this.opacity };
                case TweenActionType.COLOR:
                    // Color的反向计算复杂，回到初始值
                    return { color: this._initialValues.color };
            }
        }
        return {};
    }

    /**
     * 瞬间设置属性值（用于REVERSE模式的预处理）
     */
    private _instantSetProps ( target: any, props: any )
    {
        if ( !props ) return;

        if ( props.position !== undefined && target.setPosition )
        {
            target.setPosition( props.position );
        }
        if ( props.eulerAngles !== undefined && target.setRotationFromEuler )
        {
            target.setRotationFromEuler( props.eulerAngles );
        }
        if ( props.scale !== undefined && target.setScale )
        {
            target.setScale( props.scale );
        }
        if ( props.opacity !== undefined && target.opacity !== undefined )
        {
            target.opacity = props.opacity;
        }
        if ( props.color !== undefined && target.color !== undefined )
        {
            target.color = props.color;
        }
    }

    /**
     * 创建基础Tween（正向）
     */
    private _createForwardTween ( target: any, delay: number ): Tween<any>
    {
        const props = this._getForwardProps();
        const ease = this._getEase();
        const t = tween( target ).delay( delay );

        if ( this.toOrby )
        {
            return t.to( this.duration, props, ease );
        } else
        {
            return t.by( this.duration, props, ease );
        }
    }

    /**
     * 创建反向Tween（用于REVERSE模式或YOYO的返程）
     */
    private _createReverseTween ( target: any, useReverseDelay: boolean ): Tween<any>
    {
        const props = this._getReverseProps();
        const ease = this._getEase();
        let t = tween( target );

        if ( useReverseDelay && this.reverseDelay > 0 )
        {
            t = t.delay( this.reverseDelay );
        }

        // REVERSE模式下，BY使用by，TO使用to（回到初始值）
        // 注意：对于TO模式，在_buildReverseTween中已经预处理设置到目标值了
        if ( this.toOrby )
        {
            return t.to( this.duration, props, ease );
        } else
        {
            return t.by( this.duration, props, ease );
        }
    }

    /**
     * 构建NORMAL模式动画
     */
    private _buildNormalTween ( target: any ): Tween<any>
    {
        return this._createForwardTween( target, this.delay );
    }

    /**
     * 构建REVERSE模式动画
     * TO模式：先瞬间设置到目标值，然后动画回到初始值
     * BY模式：直接反向增量动画
     */
    private _buildReverseTween ( target: any ): Tween<any>
    {
        if ( this.toOrby )
        {
            // TO模式：先设置到目标值（瞬间），然后回到初始值
            const forwardProps = this._getForwardProps();
            this._instantSetProps( target, forwardProps );

            const reverseProps = this._getReverseProps();
            return tween( target )
                .delay( this.delay )
                .to( this.duration, reverseProps, this._getEase() );
        } else
        {
            // BY模式：直接反向移动
            return this._createReverseTween( target, false ).delay( this.delay );
        }
    }

    /**
     * 构建YOYO模式动画（往返）
     */
    private _buildYoyoTween ( target: any ): Tween<any>
    {
        // 正向
        const forward = this._createForwardTween( target, this.delay );

        // 反向
        const backward = this._createReverseTween( target, true );

        // 组合成序列
        let sequence = tween( target ).sequence( forward, backward );

        // 处理多次往返（yoyoCount表示往返次数，1表示去+回一次）
        if ( this.yoyoCount > 1 )
        {
            sequence = sequence.repeat( this.yoyoCount - 1 );
        }

        return sequence;
    }

    /**
     * 播放动画
     */
    play ()
    {
        this.stop();

        if ( !this.target )
        {
            console.warn( '[TweenTool] Target is null' );
            return;
        }

        const target = this._getTarget();
        this._recordInitialValues( target );

        let mainTween: Tween<any>;

        // 根据播放模式构建动画
        switch ( this.playbackMode )
        {
            case PlaybackMode.NORMAL:
                mainTween = this._buildNormalTween( target );
                break;
            case PlaybackMode.REVERSE:
                mainTween = this._buildReverseTween( target );
                break;
            case PlaybackMode.YOYO:
                mainTween = this._buildYoyoTween( target );
                break;
            default:
                mainTween = this._buildNormalTween( target );
        }

        // 添加完成回调
        if ( this.onComplete && this.onComplete.handler )
        {
            mainTween.call( () =>
            {
                this.onComplete.emit( [ this.customEventData ] );
            } );
        }

        // 处理循环
        if ( this.isLoop )
        {
            if ( this.loopCount === -1 || this.loopCount === 0 )
            {
                this._tween = mainTween.repeatForever().start();
            } else
            {
                // repeat(n) 表示额外重复n次，总共n+1次
                this._tween = mainTween.repeat( this.loopCount ).start();
            }
        } else
        {
            this._tween = mainTween.start();
        }
    }

    /**
     * 停止动画
     */
    stop ()
    {
        if ( this._tween )
        {
            this._tween.stop();
            this._tween = null;
        }
    }

    /**
     * 重置到初始状态（停止动画并恢复初始值）
     */
    reset ()
    {
        this.stop();
        if ( !this.target ) return;

        const target = this._getTarget();
        // 恢复初始值
        this._instantSetProps( target, {
            position: this._initialValues.position,
            eulerAngles: this._initialValues.rotation,
            scale: this._initialValues.scale,
            opacity: this._initialValues.opacity,
            color: this._initialValues.color
        } );
    }

    onDisable ()
    {
        this.stop();
    }

    onDestroy ()
    {
        this.stop();
    }
}