import { find } from 'cc';
import { _decorator, Component, Node, Vec3 } from 'cc';
import { Config } from '../data/Config';
import { math } from 'cc';
import { Messager } from '../manager/Messager';
const { ccclass, property } = _decorator;

@ccclass( 'FollowTarget' )
export class FollowTarget extends Component
{
    @property( Node )
    target: Node;

    @property( Vec3 )
    offset: Vec3 = new Vec3();

    @property( Number )
    lerpStep: number = 0.05;

    protected start (): void
    {
        if ( this.target == null )
        {
            this.target = find( 'Player' );
        }
    }

    onEnable ()
    {
        Messager.AddListener( 'updateCount', this, this.updateCount );
    }

    onDisable ()
    {
        Messager.RemoveListener( 'updateCount', this, this.updateCount );
    }

    updateCount ( num: number )
    {
        this.offset = new Vec3( 0, 4 + 1 * num, 6.8 + 2 * num );
    }

    tmpPos = new Vec3();
    lateUpdate ( deltaTime: number )
    {
        if ( this.target != null )
        {
            this.target.getPosition( this.tmpPos );
            this.tmpPos.add( this.offset );
            //  this.node.position = this.node.position.lerp( this.tmpPos, Config.CameraLerp );

            this.node.position = new Vec3( math.lerp( this.node.position.x, this.tmpPos.x, this.lerpStep ), this.tmpPos.y, this.tmpPos.z );
        }
    }

    CameraAni ()
    {
        let shakex = this.node.position.x + Math.random() * 0.05;
        let shakey = this.node.position.y + Math.random() * 0.05;
        let shakez = this.node.position.z + Math.random() * 0.05;
        let vec = new Vec3( shakex, shakey, shakez );
        this.node.position = vec;
    }
}