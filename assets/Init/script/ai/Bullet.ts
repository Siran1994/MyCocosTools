import { _decorator, Collider, Component, ITriggerEvent, Node, RigidBody, v3, Vec3 } from 'cc';
import { AudioMgr } from '../manager/AudioMgr';
import { PoolManager } from '../manager/PoolManager';
import { PhysicsGroup } from './PhysicsGroup';
const { ccclass, property } = _decorator;
@ccclass( 'Bullet' )
export class Bullet extends Component
{
    @property( Collider )
    collider: Collider | null = null;

    @property( RigidBody )
    rigidbody: RigidBody = null;

    startTime: number = 0;

    position: Vec3 = v3()

    host: Node | null = null;

    target: Node | null = null;

    forward: Vec3 = v3()

    @property( Number )
    angularSpeed: number = 180;

    @property( Number )
    linearSpeed: number = 0.0;

    @property( Number )
    liftTime: number = 3;

    update ( deltaTime: number )
    {
        this.startTime += deltaTime;
        if ( this.startTime >= this.liftTime )
            PoolManager.putNode( this.node );
        Vec3.scaleAndAdd( this.position, this.node.worldPosition, this.node.forward, this.linearSpeed * deltaTime );
        this.node.worldPosition = this.position;
    }

    fire ()
    {
        this.startTime = 0;
    }

    setGroup ( isEnemy = false )
    {
        if ( isEnemy )
            this.rigidbody.group = PhysicsGroup.Enemy;
        else
            this.rigidbody.group = PhysicsGroup.Player;
    }
}

