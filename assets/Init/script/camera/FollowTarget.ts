import { find } from 'cc';
import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass( 'FollowTarget' )
export class FollowTarget extends Component
{
    @property( Node )
    target: Node;

    @property( Vec3 )
    offset: Vec3 = new Vec3();

    protected start (): void
    {
        if ( this.target == null )
        {
            this.target = find( 'Player' );
        }
    }

    tmpPos = new Vec3();
    lateUpdate ( deltaTime: number )
    {
        if ( this.target != null )
        {
            this.target.getPosition( this.tmpPos );
            this.tmpPos.add( this.offset );
            this.node.position = this.tmpPos;
        }
    }
}