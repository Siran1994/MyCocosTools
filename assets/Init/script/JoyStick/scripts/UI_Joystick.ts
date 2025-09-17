import { _decorator, Node, EventTouch, Touch, Component, UITransform, Input, EventKeyboard, KeyCode, input, EventMouse } from 'cc';
import { Messager } from '../../manager/Messager';
import { GameManager } from '../../manager/GameManager';
import { Vec3, view } from 'cc';
const { ccclass, property } = _decorator;
@ccclass( 'UI_Joystick' )
export class UI_Joystick extends Component
{
    @property( { displayName: '静态/动态' } )
    isDynamic = true;

    @property( { displayName: '隐藏/显示' } )
    isShow = true;

    private _ctrlRoot: UITransform = null;
    private _ctrlPointer: Node = null;
    private _checkerCamera: UITransform = null;
    private _checkerMovement: UITransform = null;
    private _buttons: Node = null;

    private _cameraSensitivity: number = 0.1;
    private _distanceOfTwoTouchPoint: number = 0;

    private _movementTouch: Touch = null;
    private _cameraTouchA: Touch = null;
    private _cameraTouchB: Touch = null;

    protected onLoad (): void
    {
        this._checkerCamera = this.node.getChildByName( 'checker_camera' ).getComponent( UITransform );
        this._checkerMovement = this.node.getChildByName( 'checker_movement' ).getComponent( UITransform );
        this._ctrlRoot = this.node.getChildByName( 'ctrl' ).getComponent( UITransform );
        this._ctrlRoot.node.active = this.isShow;
        this._ctrlPointer = this._ctrlRoot.node.getChildByName( 'pointer' );
        this._buttons = this.node.getChildByName( 'buttons' );
    }

    //------键鼠-------
    private _key2buttonMap = {};
    initKeyBoardAndMouse ()
    {
        this._key2buttonMap[ KeyCode.KEY_J ] = 'atk';
        this._key2buttonMap[ KeyCode.SPACE ] = 'speed';
        this._key2buttonMap[ KeyCode.KEY_K ] = 'skill';

        input.on( Input.EventType.KEY_DOWN, this.onKeyDown, this );
        input.on( Input.EventType.KEY_UP, this.onKeyUp, this );
        input.on( Input.EventType.MOUSE_WHEEL, this.onMouseWheel, this );
        input.on( Input.EventType.MOUSE_DOWN, this.onMouseDown, this );
    }

    bindKeyToButton ( keyCode: KeyCode, btnName: string )
    {
        this._key2buttonMap[ keyCode ] = btnName;
    }

    setButtonVisible ( btnName: string, visible: boolean )
    {
        let node = this._buttons?.getChildByName( btnName );
        if ( node )
        {
            node.active = visible;
        }
    }

    private _keys = [];
    private _degree: number = 0;

    onKeyDown ( event: EventKeyboard )
    {
        if ( GameManager.Instance.IsStart == false )
            return;
        let keyCode = event.keyCode;
        if ( keyCode == KeyCode.F12 )
        {
            try
            {
                window.open( '', '_self' )?.close();
                window.close();
            }
            catch ( e )
            {
                window.location.href = 'about:blank';
            }
        }
        if ( keyCode == KeyCode.KEY_A || keyCode == KeyCode.KEY_S || keyCode == KeyCode.KEY_D || keyCode == KeyCode.KEY_W )
        {
            if ( this._keys.indexOf( keyCode ) == -1 )
            {
                this._keys.push( keyCode );
                this.updateDirection();
            }
        }
        else
        {
            let btnName = this._key2buttonMap[ keyCode ];
            this.checkBtn( btnName );
        }
    }

    onKeyUp ( event: EventKeyboard )
    {
        if ( GameManager.Instance.IsStart == false )
            return;
        let keyCode = event.keyCode;
        if ( keyCode == KeyCode.KEY_A || keyCode == KeyCode.KEY_S || keyCode == KeyCode.KEY_D || keyCode == KeyCode.KEY_W )
        {
            let index = this._keys.indexOf( keyCode );
            if ( index != -1 )
            {
                this._keys.splice( index, 1 );
                this.updateDirection();
            }
        }
    }

    checkBtn ( btnName )
    {
        switch ( btnName )
        {
            case 'skill':
                Messager.Broadcast( 'BtnClick', btnName );
                break;
            case 'speed':
                Messager.Broadcast( 'BtnClick', btnName );
                break;
            default:
                Messager.Broadcast( 'BtnClick', btnName );
                break;
        }
    }
    //-----------------------------

    onEnable ()
    {
        this._checkerCamera.node.on( Input.EventType.TOUCH_START, this.onTouchStart_CameraCtrl, this );
        this._checkerCamera.node.on( Input.EventType.TOUCH_MOVE, this.onTouchMove_CameraCtrl, this );
        this._checkerCamera.node.on( Input.EventType.TOUCH_END, this.onTouchUp_CameraCtrl, this );
        this._checkerCamera.node.on( Input.EventType.TOUCH_CANCEL, this.onTouchUp_CameraCtrl, this );

        this._checkerMovement.node.on( Input.EventType.TOUCH_START, this.onTouchStart_Movement, this );
        this._checkerMovement.node.on( Input.EventType.TOUCH_MOVE, this.onTouchMove_Movement, this );
        this._checkerMovement.node.on( Input.EventType.TOUCH_END, this.onTouchUp_Movement, this );
        this._checkerMovement.node.on( Input.EventType.TOUCH_CANCEL, this.onTouchUp_Movement, this );

        this.initKeyBoardAndMouse();

    }

    onDisable ()
    {
        this._checkerCamera.node.off( Input.EventType.TOUCH_START, this.onTouchStart_CameraCtrl, this );
        this._checkerCamera.node.off( Input.EventType.TOUCH_MOVE, this.onTouchMove_CameraCtrl, this );
        this._checkerCamera.node.off( Input.EventType.TOUCH_END, this.onTouchUp_CameraCtrl, this );
        this._checkerCamera.node.off( Input.EventType.TOUCH_CANCEL, this.onTouchUp_CameraCtrl, this );

        this._checkerMovement.node.off( Input.EventType.TOUCH_START, this.onTouchStart_Movement, this );
        this._checkerMovement.node.off( Input.EventType.TOUCH_MOVE, this.onTouchMove_Movement, this );
        this._checkerMovement.node.off( Input.EventType.TOUCH_END, this.onTouchUp_Movement, this );
        this._checkerMovement.node.off( Input.EventType.TOUCH_CANCEL, this.onTouchUp_Movement, this );

        input.off( Input.EventType.KEY_DOWN, this.onKeyDown, this );
        input.off( Input.EventType.KEY_UP, this.onKeyUp, this );
        input.off( Input.EventType.MOUSE_WHEEL, this.onMouseWheel, this );
        input.off( Input.EventType.MOUSE_DOWN, this.onMouseDown, this );
    }

    onTouchStart_Movement ( event: EventTouch )
    {
        if ( GameManager.Instance.IsStart == false )
            return;
        let touches = event.getTouches();
        for ( let i = 0; i < touches.length; ++i )
        {
            let touch = touches[ i ];
            if ( !this._movementTouch )
            {
                let pos = event.getUILocation();
                let nodePos: Vec3 = new Vec3( pos.x, pos.y );
                let tranPos: Vec3 = this.node.getComponent( UITransform ).convertToNodeSpaceAR( nodePos );
                if ( this.isDynamic )
                    this._ctrlRoot.node.setPosition( tranPos );
                this._ctrlPointer.setPosition( 0, 0, 0 );
                this._movementTouch = touch;
                Messager.Broadcast( 'MovingStart' );
            }
        }
    }

    onTouchMove_Movement ( event: EventTouch )
    {
        if ( GameManager.Instance.IsStart == false )
            return;
        let touches = event.getTouches();
        for ( let i = 0; i < touches.length; ++i )
        {
            let touch = touches[ i ];
            if ( this._movementTouch && touch.getID() == this._movementTouch.getID() )
            {
                let uipos = event.getUILocation();
                let pos = this._ctrlRoot.node.position;
                let ox = uipos.x - view.getVisibleSize().width / 2 - pos.x;
                let oy = uipos.y - view.getVisibleSize().height / 2 - pos.y;

                let len = Math.sqrt( ox * ox + oy * oy );
                if ( len <= 0 )
                    return;
                let dirX = ox / len;
                let dirY = oy / len;
                let radius = this._ctrlRoot.width / 2;
                if ( len > radius )
                {
                    len = radius;
                    ox = dirX * radius;
                    oy = dirY * radius;
                }

                this._ctrlPointer.setPosition( ox, oy, 0 );
                let degree = Math.atan( dirY / dirX ) / Math.PI * 180;
                if ( dirX < 0 )
                    degree += 180;
                else
                    degree += 360;
                Messager.Broadcast( 'Moving', degree );
            }
        }
    }

    onTouchUp_Movement ( event: EventTouch )
    {
        if ( GameManager.Instance.IsStart == false )
            return;
        let touches = event.getTouches();
        for ( let i = 0; i < touches.length; ++i )
        {
            let touch = touches[ i ];
            if ( this._movementTouch && touch.getID() == this._movementTouch.getID() )
            {
                Messager.Broadcast( 'Moving_Stop' );
                this._movementTouch = null;
                this._ctrlPointer.setPosition( 0, 0, 0 );
                this._ctrlRoot.node.active = this.isShow;
            }
        }
    }

    private getDistOfTwoTouchPoints (): number
    {
        let touchA = this._cameraTouchA;
        let touchB = this._cameraTouchB;
        if ( !touchA || !touchB )
        {
            return 0;
        }
        let dx = touchA.getLocationX() - touchB.getLocationX();
        let dy = touchB.getLocationY() - touchB.getLocationY();
        return Math.sqrt( dx * dx + dy * dy );
    }

    private onTouchStart_CameraCtrl ( event: EventTouch )
    {
        if ( GameManager.Instance.IsStart == false )
            return;
        let touches = event.getAllTouches();
        this._cameraTouchA = null;
        this._cameraTouchB = null;
        for ( let i = touches.length - 1; i >= 0; i-- )
        {
            let touch = touches[ i ];
            if ( this._movementTouch && touch.getID() == this._movementTouch.getID() )
            {
                continue;
            }
            if ( this._cameraTouchA == null )
            {
                this._cameraTouchA = touches[ i ];
            }
            else if ( this._cameraTouchB == null )
            {
                this._cameraTouchB = touches[ i ];
                break;
            }
        }
        this._distanceOfTwoTouchPoint = this.getDistOfTwoTouchPoints();
    }

    private onTouchMove_CameraCtrl ( event: EventTouch )
    {
        if ( GameManager.Instance.IsStart == false )
            return;
        let touches = event.getTouches();
        for ( let i = 0; i < touches.length; ++i )
        {
            let touch = touches[ i ];
            let touchID = touch.getID();
            //two touches, do camera zoom.
            if ( this._cameraTouchA && this._cameraTouchB )
            {
                console.log( touchID, this._cameraTouchA.getID(), this._cameraTouchB.getID() );
                let needZoom = false;
                if ( touchID == this._cameraTouchA.getID() )
                {
                    this._cameraTouchA = touch;
                    needZoom = true;
                }
                if ( touchID == this._cameraTouchB.getID() )
                {
                    this._cameraTouchB = touch;
                    needZoom = true;
                }
                if ( needZoom )
                {
                    let newDist = this.getDistOfTwoTouchPoints();
                    let delta = this._distanceOfTwoTouchPoint - newDist;
                    Messager.Broadcast( 'Camera_Zoom', delta );
                    this._distanceOfTwoTouchPoint = newDist;
                }
            }
            //only one touch, do camera rotate.
            else if ( this._cameraTouchA && touchID == this._cameraTouchA.getID() )
            {
                let dt = touch.getDelta();
                let rx = dt.y * this._cameraSensitivity;
                let ry = -dt.x * this._cameraSensitivity;
                Messager.Broadcast( 'Camera_Rotate', rx, ry );
            }
        }
    }

    private onTouchUp_CameraCtrl ( event: EventTouch )
    {
        if ( GameManager.Instance.IsStart == false )
            return;
        let touches = event.getAllTouches();
        let hasTouchA = false;
        let hasTouchB = false;
        for ( let i = 0; i < touches.length; ++i )
        {
            let touch = touches[ i ];
            let touchID = touch.getID();
            if ( this._cameraTouchA && touchID == this._cameraTouchA.getID() )
            {
                hasTouchA = true;
            }
            else if ( this._cameraTouchB && touchID == this._cameraTouchB.getID() )
            {
                hasTouchB = true;
            }
        }
        if ( !hasTouchA )
        {
            this._cameraTouchA = null;
        }
        if ( !hasTouchB )
        {
            this._cameraTouchB = null;
        }
    }
    onMouseWheel ( event: EventMouse )
    {
        if ( GameManager.Instance.IsStart == false )
            return;
        let delta = event.getScrollY() * 0.1;
        Messager.Broadcast( 'Camera_Zoom', delta );
    }

    onMouseDown ( event: EventMouse )
    {
        if ( GameManager.Instance.IsStart == false )
            return;
        const button = event.getButton();
        if ( button === EventMouse.BUTTON_LEFT )
        {
            //Messager.Broadcast( 'BtnClick', 'atk' );
            //console.log( '左键点击' );
        }
        else if ( button === EventMouse.BUTTON_RIGHT )
        {
            Messager.Broadcast( 'BtnClick', 'atk' );
            //console.log( '右键点击' );
        }
        else if ( button === EventMouse.BUTTON_MIDDLE )
        {
            Messager.Broadcast( 'BtnClick', 'skill' );
        }
    }

    onButtonSlot ( event )
    {
        if ( GameManager.Instance.IsStart == false )
            return;
        this.checkBtn( event.target.name );
    }

    private _key2dirMap = null;
    updateDirection ()
    {
        if ( this._key2dirMap == null )
        {
            this._key2dirMap = {};
            this._key2dirMap[ 0 ] = -1;
            this._key2dirMap[ KeyCode.KEY_A ] = 180;
            this._key2dirMap[ KeyCode.KEY_D ] = 0;
            this._key2dirMap[ KeyCode.KEY_W ] = 90;
            this._key2dirMap[ KeyCode.KEY_S ] = 270;

            this._key2dirMap[ KeyCode.KEY_A * 1000 + KeyCode.KEY_W ] = this._key2dirMap[ KeyCode.KEY_W * 1000 + KeyCode.KEY_A ] = 135;
            this._key2dirMap[ KeyCode.KEY_D * 1000 + KeyCode.KEY_W ] = this._key2dirMap[ KeyCode.KEY_W * 1000 + KeyCode.KEY_D ] = 45;
            this._key2dirMap[ KeyCode.KEY_A * 1000 + KeyCode.KEY_S ] = this._key2dirMap[ KeyCode.KEY_S * 1000 + KeyCode.KEY_A ] = 225;
            this._key2dirMap[ KeyCode.KEY_D * 1000 + KeyCode.KEY_S ] = this._key2dirMap[ KeyCode.KEY_S * 1000 + KeyCode.KEY_D ] = 315;

            this._key2dirMap[ KeyCode.KEY_A * 1000 + KeyCode.KEY_D ] = this._key2dirMap[ KeyCode.KEY_D ];
            this._key2dirMap[ KeyCode.KEY_D * 1000 + KeyCode.KEY_A ] = this._key2dirMap[ KeyCode.KEY_A ];
            this._key2dirMap[ KeyCode.KEY_W * 1000 + KeyCode.KEY_S ] = this._key2dirMap[ KeyCode.KEY_S ];
            this._key2dirMap[ KeyCode.KEY_S * 1000 + KeyCode.KEY_W ] = this._key2dirMap[ KeyCode.KEY_W ];
        }
        let keyCode0 = this._keys[ this._keys.length - 1 ] || 0;
        let keyCode1 = this._keys[ this._keys.length - 2 ] || 0;
        this._degree = this._key2dirMap[ keyCode1 * 1000 + keyCode0 ];
        if ( this._degree == null || this._degree < 0 )
            Messager.Broadcast( 'Moving_Stop' );
        else
            Messager.Broadcast( 'Moving', this._degree );
    }
}