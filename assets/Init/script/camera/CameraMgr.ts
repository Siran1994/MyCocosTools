
import { _decorator, Component, Node, EventMouse, Quat, Vec3, Enum, IVec3Like, input, Input, find } from 'cc';
import { VectorTool, Quaternion } from './CameraTool';

const { ccclass, property } = _decorator;

export enum ThirdPersonCameraType
{
    /** 相机紧跟随着目标，相机不会旋转 */
    Follow = 0,
    /** 相机会旋转紧跟着目标正后方，旋转不可控制 */
    FollowTrackRotation = 1,
    /** 相机紧跟随着目标，相机可以自由旋转 */
    FollowIndependentRotation = 2,
}

/**
 * 第三人称相机跟随
 * 这里总结了三个相机跟随
 * 1. 相机紧跟随着目标，相机不会旋转
 * 2. 相机紧跟随着目标，相机会旋转紧跟着目标正后方，旋转不可控制
 * 3. 相机紧跟随着目标，相机可以自由旋转，角色向前移动的时候，前方向永远是相机的正方向
 */
@ccclass( 'CameraMgr' )
export class CameraMgr extends Component
{
    public static Instance: CameraMgr = null;
    protected onLoad (): void 
    {
        CameraMgr.Instance = this;
    }
    /** 目标 */
    @property( Node )
    target: Node = null;
    /** 注视的目标，这里我想让相机对准目标的上方一点，所有多加了注视（相机正对着）的目标 */
    @property( Node )
    lookAt: Node = null;
    @property( { type: Enum( ThirdPersonCameraType ) } )
    cameraType: ThirdPersonCameraType = ThirdPersonCameraType.Follow;
    /** 距离目标距离 */
    @property
    positionOffset: Vec3 = new Vec3( 0, 120, 200 );
    /** 移动差值移动系数 */
    @property
    moveSmooth: number = 0.02;
    /** 差值旋转系数 */
    @property
    rotateSmooth: number = 0.03;

    public MouseX: number = 0;
    public MouseY: number = 0;

    private _forward: Vec3 = new Vec3();
    private _right: Vec3 = new Vec3();
    private _up: Vec3 = new Vec3();
    private angle: IVec3Like = null;

    start ()
    {
        if ( this.target == null )
            this.target = find( 'Player' );
        if ( this.lookAt == null )
            this.lookAt = find( 'Player' );

        input.on( Input.EventType.MOUSE_DOWN, this.MouseDown, this );
        input.on( Input.EventType.MOUSE_MOVE, this.MouseMove, this );
        input.on( Input.EventType.MOUSE_UP, this.MouseUp, this );

        this.cameraType == ThirdPersonCameraType.Follow && this.node.lookAt( this.target.worldPosition );
    }

    isDown: boolean = false;
    private MouseDown ( e: EventMouse )
    {
        this.isDown = true;
    }

    private MouseMove ( e: EventMouse )
    {

        if ( this.cameraType == ThirdPersonCameraType.FollowIndependentRotation )
        {
            this.SetIndependentRotation( e );
        }
    }

    private MouseUp ( e: EventMouse )
    {
        this.isDown = false;
    }

    lateUpdate ( dt: number )
    {
        if ( this.target )
        {
            switch ( this.cameraType )
            {
                case ThirdPersonCameraType.Follow:
                    this.SetFollow();
                    break;
                case ThirdPersonCameraType.FollowTrackRotation:
                    //this.SetFollowTrackRotation();
                    this.SetFollowAndRotation()
                    break;
                case ThirdPersonCameraType.FollowIndependentRotation:
                    this.SetMove();
                    break;
            }

        }
    }

    private SetFollow ()
    {
        let temp: Vec3 = new Vec3();
        Vec3.add( temp, this.lookAt.worldPosition, new Vec3( 0, this.positionOffset.y, this.positionOffset.z ) );
        this.node.position = this.node.position.lerp( temp, this.moveSmooth );
    }

    private velocity = new Vec3();
    private forwardView: Vec3 = new Vec3();
    /**
     * 
     */
    private SetFollowTrackRotation ()
    {
        //这里计算出相机距离目标的位置的所在坐标先，距离多高Y，距离多远Z
        //下面四句代码等同于：targetPosition+Up*updistance-forwardView*backDistance
        let u = Vec3.multiplyScalar( new Vec3(), Vec3.UP, this.positionOffset.y );

        let f = Vec3.multiplyScalar( new Vec3(), this.target.forward, this.positionOffset.z );

        let pos = Vec3.add( new Vec3(), this.target.position, u );
        //本来这里应该是减的，可是下面的lookat默认前方是-z，所有这里倒转过来变为加

        Vec3.add( pos, pos, f );

        //球形差值移动，我发现cocos只有Lerp差值移动，而我看unity是有球形差值移动的，所有我这里照搬过来了一个球形差值
        this.node.position = VectorTool.SmoothDampV3( this.node.position, pos, this.velocity, this.moveSmooth, 100000, 0.02 );
        // this.node.position = this.node.position.lerp( pos, this.moveSmooth );
        //计算前方向
        this.forwardView = Vec3.subtract( this.forwardView, this.node.position, this.target.getWorldPosition() );
        this.node.lookAt( this.target.position );
        //this.node.rotation = Quaternion.LookRotation( this.forwardView );
    }

    tmpPos = new Vec3();
    SetFollowAndRotation ()
    {
        this.target.getPosition( this.tmpPos );
        this.tmpPos.add( this.positionOffset );
        this.node.position = this.node.position.lerp( this.tmpPos, this.moveSmooth );
        this.node.eulerAngles = this.node.eulerAngles.lerp( new Vec3( this.node.eulerAngles.x, this.target.eulerAngles.y, 0 ), this.moveSmooth );
    }

    /*************************FollowIndependentRotation***************** */
    /**
     * 实时设置相机距离目标的位置position
     */
    public SetMove ()
    {
        this._forward = new Vec3();
        this._right = new Vec3();
        this._up = new Vec3();
        Vec3.transformQuat( this._forward, Vec3.FORWARD, this.node.rotation );

        this._forward.multiplyScalar( this.positionOffset.z );
        let desiredPos = new Vec3();
        desiredPos = desiredPos.add( this.lookAt.worldPosition ).subtract( this._forward ).add( this._right ).add( this._up );
        this.node.position = this.node.position.lerp( desiredPos, this.moveSmooth );
    }

    /**
     * 计算根据鼠标X，Y偏移量来围绕X轴和Y轴的旋转四元数
     * @param e 
     */
    private SetIndependentRotation ( e: EventMouse )
    {

        let radX: number = -e.movementX;
        let radY: number = -e.movementY;
        let _quat: Quat = new Quat();

        //计算绕X轴旋转的四元数并应用到node，这里用的是鼠标上下Y偏移量
        let _right = Vec3.transformQuat( this._right, Vec3.RIGHT, this.node.rotation );
        _quat = Quaternion.RotationAroundNode( this.node, this.target.position, _right, radY );
        this.angle = Quaternion.GetEulerFromQuat( _quat );
        //限制相机抬头低头的范围
        this.angle.x = this.angle.x > 0 ? this.Clamp( this.angle.x, 120, 180 ) : this.Clamp( this.angle.x, -180, -170 );
        Quat.fromEuler( _quat, this.angle.x, this.angle.y, this.angle.z );
        this.node.setWorldRotation( _quat );

        //计算绕Y轴旋转的四元数并应用到node，这里用的是鼠标上下X偏移量
        _quat = Quaternion.RotationAroundNode( this.node, this.target.position, Vec3.UP, radX );
        this.node.setWorldRotation( _quat );

        this.angle = Quaternion.GetEulerFromQuat( _quat );
        this.MouseX = this.angle.y;
        this.MouseY = this.angle.x;
    }

    /*************************FollowIndependentRotation end***************** */

    private Clamp ( val: number, min: number, max: number )
    {
        if ( val <= min ) val = min;
        else if ( val >= max ) val = max;
        return val;
    }

    public GetType (): ThirdPersonCameraType
    {
        return this.cameraType;
    }
}