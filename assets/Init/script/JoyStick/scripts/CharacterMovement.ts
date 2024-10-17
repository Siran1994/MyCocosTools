import { _decorator, Component, v3, RigidBody, Vec3, Camera, Collider, ICollisionEvent } from 'cc';
import { Messager } from '../../manager/Messager';
const { ccclass, property } = _decorator;
const v3_1 = v3();
@ccclass( 'CharacterMovement' )
export class CharacterMovement extends Component
{
    @property( Camera )
    mainCamera: Camera;

    @property
    velocity = 1.0;

    @property
    jumpVelocity = 1.0;

    @property
    maxJumpTimes: number = 0;
    private _curJumpTimes: number = 0;

    _rigidBody: RigidBody;
    myCollider: Collider
    _isMoving: boolean = false;
    _isAtk: boolean = false;
    _velocityScale: number = 1.0;

    _isInTheAir: boolean = false;
    _currentVerticalVelocity: number = 0.0;

    start ()
    {
        this._rigidBody = this.node.getComponent( RigidBody );

        Messager.AddListener( 'Moving', this, this.onMovement );
        Messager.AddListener( 'Moving_Stop', this, this.onMovementRelease );
        Messager.AddListener( 'BtnClick', this, this.onBtnClick );

        this.myCollider = this.getComponent( Collider );
        this.myCollider?.on( 'onCollisionEnter', ( target: ICollisionEvent ) =>
        {
            if ( target.otherCollider != target.selfCollider )
            {
                this.onLand();
            }
        } );
    }


    onDestroy ()
    {
        Messager.RemoveListener( 'Moving', this, this.onMovement );
        Messager.RemoveListener( 'Moving_Stop', this, this.onMovementRelease );
        Messager.RemoveListener( 'BtnClick', this, this.onBtnClick );
    }

    update ( deltaTime: number )
    {
        if ( this._isMoving )
        {
            this._tmp.set( this.node.forward );
            this._tmp.multiplyScalar( -1.0 );
            this._tmp.multiplyScalar( this.velocity * this._velocityScale );
            if ( this._rigidBody )
            {
                this._rigidBody.getLinearVelocity( v3_1 );
                this._tmp.y = v3_1.y;
                this._rigidBody.setLinearVelocity( this._tmp );
            }
            else
            {
                this._tmp.multiplyScalar( deltaTime );
                this._tmp.add( this.node.position );
                this.node.setPosition( this._tmp );
            }
        }

        if ( this._isInTheAir )
        {
            if ( !this._rigidBody )
            {
                this._currentVerticalVelocity -= 9.8 * deltaTime;

                let oldPos = this.node.position;
                let nextY = oldPos.y + this._currentVerticalVelocity * deltaTime;
                if ( nextY <= 0 )
                {
                    this.onLand();
                    nextY = 0.0;
                }
                this.node.setPosition( oldPos.x, nextY, oldPos.z );
            }
        }
    }

    onLand ()
    {
        this._isInTheAir = false;
        this._currentVerticalVelocity = 0.0;
        this._curJumpTimes = 0;
    }

    private _tmp = v3();
    onMovement ( degree: number, offset: number )
    {
        let cameraRotationY = 0;
        if ( this.mainCamera )
        {
            cameraRotationY = this.mainCamera.node.eulerAngles.y;
        }
        this._tmp.set( 0, ( cameraRotationY + degree - 90 + 180 ), 0 );
        this.node.setRotationFromEuler( this._tmp );
        this._isMoving = true;
    }

    onMovementRelease ()
    {
        this._isMoving = false;
        if ( this._rigidBody )
        {
            this._rigidBody.setLinearVelocity( Vec3.ZERO );
        }
    }


    onBtnClick ( btnName: string )//按钮事件监听
    {
        switch ( btnName )
        {
            case 'atk'://攻击

                break;
            case 'col':

                break;
            case 'change':

                break;
        }
    }

    onJump ()
    {
        if ( this._curJumpTimes >= this.maxJumpTimes )
        {
            return;
        }
        this._curJumpTimes++;
        if ( this._rigidBody )
        {
            this._rigidBody.getLinearVelocity( v3_1 );
            v3_1.y = this.jumpVelocity;
            this._rigidBody.setLinearVelocity( v3_1 );
        }
        else
        {
            this._currentVerticalVelocity = this.jumpVelocity;
        }
        this._isInTheAir = true;
    }
}