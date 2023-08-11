import { _decorator, BoxCollider, Component, ITriggerEvent } from 'cc';
import { Messager } from '../manager/Messager';

const { ccclass, property } = _decorator;

@ccclass( 'RoadDir' )
export class RoadDir extends Component
{
    @property( Number )
    angle: Number = 0;

    @property( { type: BoxCollider } )
    collider: BoxCollider;

    start ()
    {
        if ( this.collider != null )
        {
            this.collider?.on( 'onTriggerEnter', ( event: ITriggerEvent ) => 
            {
                this.collider.enabled = false;
                Messager.Broadcast( 'changeDir', this.angle, this.node.worldPosition );
            } );
        }
    }
}