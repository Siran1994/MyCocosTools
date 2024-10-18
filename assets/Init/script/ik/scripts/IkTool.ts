import { _decorator, Component, Node, Quat, Vec3 } from 'cc';
import { solveTwoBoneIKFromNodes } from './TwoBoneIK';
import { getForward } from './NodeUtils';
const { ccclass, property } = _decorator;

@ccclass( 'IkTool' )
export class IkTool extends Component
{
    @property( Node )
    public LeftHand!: Node;

    @property( Node )
    public RightHand!: Node;

    @property( Node )
    public Head!: Node;

    @property
    public speed = 1;

    @property( Node )
    public Target!: Node;

    @property( Node )
    public l_target!: Node;

    @property( Vec3 )
    l_angle: Vec3 = new Vec3( -90, 90, -10 );

    @property( Node )
    public r_target!: Node;

    @property( Vec3 )
    r_angle: Vec3 = new Vec3( -90, -90, 10 );


    lateUpdate ( deltaTime: number )
    {
        this._headFollow( this.Target );
        this._handFollow( deltaTime, this.LeftHand, new Vec3( this.l_target.worldPosition ), this.l_angle );
        this._handFollow( deltaTime, this.RightHand, new Vec3( this.r_target.worldPosition ), this.r_angle );
    }

    _handFollow ( deltaTime: number, _hand: Node, targetPos: Vec3, angle: Vec3 )
    {
        if ( _hand == null )
            return;
        const { _lastGrabbingPosition: lastGrabbingPosition } = this;

        const hand = _hand;
        const lowerArm = hand.parent!;
        const upperArm = lowerArm.parent!;
        const potentialTarget = new Vec3();
        Vec3.copy( potentialTarget, targetPos );

        if ( !this._previousGrabbed )
        {
            this._previousGrabbed = true;
            Vec3.copy( lastGrabbingPosition, hand.worldPosition );
        }
        const dir = Vec3.subtract( new Vec3(), potentialTarget, lastGrabbingPosition );
        const d = dir.length();
        dir.normalize();
        const newD = Math.max( d - this.speed * deltaTime, 0.0 );
        Vec3.multiplyScalar( dir, dir, newD );
        Vec3.subtract( dir, potentialTarget, dir );
        Vec3.copy( lastGrabbingPosition, dir );

        if ( Vec3.distance( lastGrabbingPosition, hand.worldPosition ) < 0.00001 )
        {
            return;
        }

        solveTwoBoneIKFromNodes(
            upperArm,
            lowerArm,
            hand,
            lastGrabbingPosition,
            1.0,
        );

        hand.setWorldRotationFromEuler( angle.x, angle.y, angle.z );
    }

    private _previousGrabbed = false;

    private _lastGrabbingPosition = new Vec3();

    _headFollow ( target: Node )
    {
        if ( this.Head == null )
            return;
        const { Head } = this;
        const viewDir = Vec3.subtract( new Vec3(), target.worldPosition, Head.worldPosition );
        viewDir.normalize();
        const currentDir = getForward( Head );
        const q = Quat.rotationTo( new Quat(), currentDir, viewDir );
        Head.rotate( q, Node.NodeSpace.WORLD );
    }
}