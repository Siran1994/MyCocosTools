import { _decorator, Node, EventTouch, Touch, Component, UITransform, Input, EventKeyboard, KeyCode, input, EventMouse } from 'cc';

import { Vec2 } from 'cc';
import { v3 } from 'cc';
import { v2 } from 'cc';
import { Messager } from '../../manager/Messager';
const { ccclass, property } = _decorator;
@ccclass( 'UI_Joystick' )
export class UI_Joystick extends Component
{
    private static _inst: UI_Joystick = null;
    public static get inst (): UI_Joystick
    {
        return this._inst;
    }

    @property( { displayName: '静态/动态' } )
    isDynamic = true;

    @property( { displayName: '隐藏/显示' } )
    isShow = true;


    private _ctrlRoot: UITransform = null;//摇杆根节点
    private _ctrlBg: Node = null;//摇杆背景
    private _ctrlPointer: Node = null;//摇杆中心点
    private _checkerCamera: UITransform = null;
    _buttons: Node = null;

    //#region 动态摇杆
    private _cameraSensitivity: number = 0.1;
    private _distanceOfTwoTouchPoint: number = 0;
    private _movementTouch: Touch = null;
    private _cameraTouchA: Touch = null;
    private _cameraTouchB: Touch = null;
    private _key2buttonMap = {};
    //#endregion

    //#region 静态摇杆
    UITf_dot: UITransform = null;//摇杆背景大小  
    maxLength: number = 0;//滑动半径

    private _dir: Vec2 = new Vec2( 0, 0 );//方向
    public get dir ()
    {
        return this._dir;
    }
    public set dir ( value: Vec2 )
    {
        this._dir = value;
    }
    roleAngle: number = 0;//角度
    //#endregion

    protected onLoad (): void
    {
        UI_Joystick._inst = this;
    }

    cameraInit ()//相机控制初始化
    {
        let checkerCamera = this.node.getChildByName( 'checker_camera' ).getComponent( UITransform );
        this._checkerCamera = checkerCamera;
        checkerCamera.node.on( Input.EventType.TOUCH_START, this.onTouchStart_CameraCtrl, this );
        checkerCamera.node.on( Input.EventType.TOUCH_MOVE, this.onTouchMove_CameraCtrl, this );
        checkerCamera.node.on( Input.EventType.TOUCH_END, this.onTouchUp_CameraCtrl, this );
        checkerCamera.node.on( Input.EventType.TOUCH_CANCEL, this.onTouchUp_CameraCtrl, this );
    }

    staticJoystickInit ()//静态摇杆初始化
    {
        this._ctrlRoot = this.node.getChildByName( 'ctrl' ).getComponent( UITransform );
        this._ctrlRoot.node.active = this.isShow;

        this._ctrlBg = this._ctrlRoot.node.getChildByName( 'bg' );
        this._ctrlPointer = this._ctrlRoot.node.getChildByName( 'pointer' );

        this.UITf_dot = this._ctrlBg.getComponent( UITransform );
        this.maxLength = this._ctrlBg.getComponent( UITransform ).width / 2;

        this._ctrlBg.on( Input.EventType.TOUCH_START, this.onTouchStart_Movement, this )
        this._ctrlBg.on( Input.EventType.TOUCH_MOVE, this.onTouchMove_Movement, this );
        this._ctrlBg.on( Input.EventType.TOUCH_END, this.onTouchUp_Movement, this );
        this._ctrlBg.on( Input.EventType.TOUCH_CANCEL, this.onTouchUp_Movement, this );
    }

    dynamicJoystickInit ()//动态摇杆初始化
    {
        this._ctrlRoot = this.node.getChildByName( 'ctrl' ).getComponent( UITransform );
        this._ctrlRoot.node.active = this.isShow;
        this._ctrlPointer = this._ctrlRoot.node.getChildByName( 'pointer' );
        let checkerMovement = this.node.getChildByName( 'checker_movement' ).getComponent( UITransform );
        checkerMovement.node.on( Input.EventType.TOUCH_START, this.onTouchStart_Movement, this );
        checkerMovement.node.on( Input.EventType.TOUCH_MOVE, this.onTouchMove_Movement, this );
        checkerMovement.node.on( Input.EventType.TOUCH_END, this.onTouchUp_Movement, this );
        checkerMovement.node.on( Input.EventType.TOUCH_CANCEL, this.onTouchUp_Movement, this );
    }


    btnInit ()//按钮初始化
    {
        this._buttons = this.node.getChildByName( 'buttons' );
        this._key2buttonMap[ KeyCode.KEY_J ] = 'btn_slot_0';
        this._key2buttonMap[ KeyCode.KEY_K ] = 'btn_slot_1';
        this._key2buttonMap[ KeyCode.KEY_L ] = 'btn_slot_2';
        this._key2buttonMap[ KeyCode.KEY_U ] = 'btn_slot_3';
        this._key2buttonMap[ KeyCode.KEY_I ] = 'btn_slot_4';
        input.on( Input.EventType.KEY_DOWN, this.onKeyDown, this );
        input.on( Input.EventType.KEY_UP, this.onKeyUp, this );
        input.on( Input.EventType.MOUSE_WHEEL, this.onMouseWheel, this );
    }

    start ()
    {
        this.cameraInit();
        this.btnInit();
        if ( this.isDynamic )
            this.dynamicJoystickInit();
        else
            this.staticJoystickInit();
    }

    onDestroy ()
    {
        input.off( Input.EventType.KEY_DOWN, this.onKeyDown, this );
        input.off( Input.EventType.KEY_UP, this.onKeyUp, this );
        input.off( Input.EventType.MOUSE_WHEEL, this.onMouseWheel, this );
        UI_Joystick._inst = null;
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

    getButtonByName ( btnName: string ): Node
    {
        return this._buttons.getChildByName( btnName );
    }

    onTouchStart_Movement ( event: EventTouch )
    {
        if ( this.isDynamic )
        {
            let touches = event.getTouches();
            for ( let i = 0; i < touches.length; ++i )
            {
                let touch = touches[ i ];
                let x = touch.getUILocationX();
                let y = touch.getUILocationY();
                if ( !this._movementTouch )
                {
                    let halfWidth = this._checkerCamera.width / 2;
                    let halfHeight = this._checkerCamera.height / 2;

                    this._ctrlRoot.node.active = true;
                    this._ctrlRoot.node.setPosition( x - halfWidth, y - halfHeight, 0 );
                    this._ctrlPointer.setPosition( 0, 0, 0 );
                    this._movementTouch = touch;
                }
            }
        }
    }

    onTouchMove_Movement ( event: EventTouch )
    {
        if ( this.isDynamic )
        {
            let touches = event.getTouches();
            for ( let i = 0; i < touches.length; ++i )
            {
                let touch = touches[ i ];
                if ( this._movementTouch && touch.getID() == this._movementTouch.getID() )
                {
                    let halfWidth = this._checkerCamera.width / 2;
                    let halfHeight = this._checkerCamera.height / 2;
                    let x = touch.getUILocationX();
                    let y = touch.getUILocationY();

                    let pos = this._ctrlRoot.node.position;
                    let ox = x - halfWidth - pos.x;
                    let oy = y - halfHeight - pos.y;

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
                    Messager.Broadcast( 'Moving', degree, len / radius );
                }
            }
        }
        else
        {
            // 获取世界坐标
            let worldPos = event.getUILocation();
            // 摇杆点是dotBg的子节点，所以要转换成dotBg的局部坐标
            let localPos = this.UITf_dot.convertToNodeSpaceAR( v3( worldPos.x, worldPos.y, 0 ) );
            let length = localPos.length();
            if ( length > 0 )
            {
                //  只计算方向
                this.dir.x = localPos.x / length;
                this.dir.y = localPos.y / length;
                // 计算最外一圈的x,y位置
                if ( length > this.maxLength )
                {
                    localPos.x = this.maxLength * this.dir.x;
                    localPos.y = this.maxLength * this.dir.y;
                }
                this._ctrlPointer.setPosition( localPos );
                let degree = Math.atan( this.dir.y / this.dir.x ) / Math.PI * 180;
                let radius = this._ctrlRoot.width / 2;
                if ( this.dir.x < 0 )
                    degree += 180;
                else
                    degree += 360;
                Messager.Broadcast( 'Moving', degree, this.maxLength / radius );
            }
        }
    }

    onTouchUp_Movement ( event: EventTouch )
    {
        if ( this.isDynamic )
        {
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
        else
        {
            this.dir = v2( 0, 0 );
            this._ctrlPointer.setPosition( 0, 0, 0 );
            Messager.Broadcast( 'Moving_Stop' );
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

    private _keys = [];
    private _degree: number = 0;

    onKeyDown ( event: EventKeyboard )
    {
        let keyCode = event.keyCode;
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
            if ( btnName )
            {
                Messager.Broadcast( 'BtnClick', btnName );
            }
        }
    }

    onKeyUp ( event: EventKeyboard )
    {
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

    onMouseWheel ( event: EventMouse )
    {
        let delta = event.getScrollY() * 0.1;
        Messager.Broadcast( 'Camera_Zoom', delta );
    }

    onButtonSlot ( event )
    {
        let btnName = event.target.name;
        Messager.Broadcast( 'BtnClick', btnName );
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
        {
            Messager.Broadcast( 'Moving_Stop' );
        }
        else
        {
            Messager.Broadcast( 'Moving', this._degree, 1.0 );
        }
    }
}