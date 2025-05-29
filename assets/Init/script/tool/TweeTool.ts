import { Enum, Label, Sprite, UIMeshRenderer, UIOpacity } from 'cc';
import { EventHandler } from 'cc';
import { tween, Tween } from 'cc';
import { Vec3, Color } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
export enum PlaybackMode
{
    NORMAL,
    REVERSE,
    YOYO // 往返模式
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
    constant,
    linear,
    quadIn,
    quadOut,
    quadInOut,
    cubicIn,
    cubicOut,
    cubicInOut,
    quartIn,
    quartOut,
    quartInOut,
    quintIn,
    quintOut,
    quintInOut,
    sineIn,
    sineOut,
    sineInOut,
    expoIn,
    expoOut,
    expoInOut,
    circIn,
    circOut,
    circInOut,
    elasticIn,
    elasticOut,
    elasticInOut,
    backIn,
    backOut,
    backInOut,
    bounceIn,
    bounceOut,
    bounceInOut,
    smooth,
    fade,
    quadOutIn,
    cubicOutIn,
    quartOutIn,
    quintOutIn,
    sineOutIn,
    expoOutIn,
    circOutIn,
    elasticOutIn,
    backOutIn,
    bounceOutIn,
}
Enum( EaseType );

@ccclass( 'TweenTool' )
export class TweenTool extends Component
{
    @property( { group: 'Base', type: Node } )
    target: Node = null!;

    @property( { group: 'Animation', type: EaseType } )
    easeType: EaseType = EaseType.linear;

    @property( { group: 'Animation' } )
    duration = 1;

    @property( { group: 'Animation' } )
    delay = 0;

    @property( { group: 'Properties', type: TweenActionType } )
    actionType: TweenActionType = TweenActionType.POSITION;

    @property( {
        group: 'Properties', visible: function ( this: TweenTool )
        {
            return this.actionType === TweenActionType.POSITION;
        }
    } )
    position: Vec3 = new Vec3();

    @property( {
        group: 'Properties', visible: function ( this: TweenTool )
        {
            return this.actionType === TweenActionType.ROTATION;
        }
    } )
    rotation: Vec3 = new Vec3();

    @property( {
        group: 'Properties', visible: function ( this: TweenTool )
        {
            return this.actionType === TweenActionType.SCALE;
        }
    } )
    scale: Vec3 = new Vec3( 1, 1, 1 );

    @property( {
        group: 'Properties', visible: function ( this: TweenTool )
        {
            return this.actionType === TweenActionType.OPACITY;
        }, range: [ 0, 255, 1 ]
    } )
    opacity = 1;

    @property( {
        group: 'Properties', visible: function ( this: TweenTool )
        {
            return this.actionType === TweenActionType.COLOR;
        }
    } )
    color: Color = Color.WHITE.clone();

    @property( { group: 'Playback', type: PlaybackMode } )
    playbackMode: PlaybackMode = PlaybackMode.NORMAL;

    @property( {
        group: 'Playback', visible: function ( this: TweenTool )
        {
            return this.playbackMode === PlaybackMode.YOYO;
        }
    } )
    yoyoCount = 1;

    @property( {
        group: 'Playback', visible: function ( this: TweenTool )
        {
            return this.playbackMode !== PlaybackMode.NORMAL;
        }
    } )
    reverseDelay = 0;

    @property( { group: 'Loop' } )
    isLoop = false;

    @property( { group: 'Loop' } )
    toOrby = false;

    @property( {
        group: 'Loop', visible: function ( this: TweenTool )
        {
            return this.isLoop;
        }
    } )
    loopCount = 0;

    @property( { group: 'Event', type: EventHandler } )
    public callback: EventHandler = new EventHandler();

    @property( { group: 'Event' } )
    public customEventData = '';

    private _tween: Tween<any> = null!;

    onLoad ()
    {
        if ( !this.target ) this.target = this.node;
        this.play();
    }

    private _buildTween (): Tween<any>
    {
        let target: any = this.target;
        // 根据类型处理特殊组件
        if ( this.actionType === TweenActionType.OPACITY )
        {
            target = this.target.getComponent( UIOpacity );
        } else if ( this.actionType === TweenActionType.COLOR )
        {
            target = this.target.getComponent( Sprite ) ||
                this.target.getComponent( Label ) ||
                this.target.getComponent( UIMeshRenderer );
        }
        let opts = {};
        opts[ "easing" ] = EaseType[ this.easeType ];
        let baseTween: Tween<any>;

        switch ( this.actionType )
        {
            case TweenActionType.POSITION:
                baseTween = this.toOrby ?
                    tween( target ).delay( this.delay ).to( this.duration, { position: this.position }, opts ) :
                    tween( target ).delay( this.delay ).by( this.duration, { position: this.position }, opts );
                break;
            case TweenActionType.ROTATION:
                baseTween = this.toOrby ?
                    tween( target ).delay( this.delay ).to( this.duration, { eulerAngles: this.rotation }, opts ) :
                    tween( target ).delay( this.delay ).by( this.duration, { eulerAngles: this.rotation }, opts );
                break;
            case TweenActionType.SCALE:
                baseTween = this.toOrby ?
                    tween( target ).delay( this.delay ).to( this.duration, { scale: this.scale }, opts ) :
                    tween( target ).delay( this.delay ).by( this.duration, { scale: this.scale }, opts );
                break;
            case TweenActionType.OPACITY:
                baseTween = this.toOrby ?
                    tween( target ).delay( this.delay ).to( this.duration, { opacity: this.opacity }, opts ) :
                    tween( target ).delay( this.delay ).by( this.duration, { opacity: this.opacity }, opts );
                break;
            case TweenActionType.COLOR:
                baseTween = this.toOrby ?
                    tween( target ).delay( this.delay ).to( this.duration, { color: this.color }, opts ) :
                    tween( target ).delay( this.delay ).by( this.duration, { color: this.color }, opts );
                break;
        }
        return baseTween;
    }

    play ()
    {
        const baseTween = this._buildTween();
        this._tween = baseTween;
        if ( this.isLoop )
        {
            if ( this.loopCount == -1 )
                this._tween.repeatForever( baseTween ).call( () => this.callback.emit( [ this.customEventData ] ) )
                    .start();
            else
                this._tween.repeat( this.loopCount, baseTween ).call( () => this.callback.emit( [ this.customEventData ] ) )
                    .start();
        }
        else
        {
            this._tween.call( () => this.callback.emit( [ this.customEventData ] ) )
                .start();
        }
    }

    stop ()
    {
        if ( this._tween )
        {
            this._tween.stop();
        }
    }

    test ( str )
    {
        console.error( str );
    }

    onDestroy ()
    {
        Tween.stopAllByTarget( this.target );
        this._tween = null;
    }
}