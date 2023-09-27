import { _decorator, Component, tween } from 'cc';
import { Collider } from 'cc';
import { ITriggerEvent, Vec3 } from 'cc';
import { Messager } from '../manager/Messager';
import { PropType } from '../data/Enum';
const { ccclass, property } = _decorator;

@ccclass( 'PropItem' )
export class PropItem extends Component
{
    //钻石,宝石,手套
    @property( { type: PropType } )
    propType: PropType = PropType.None;

    @property( {
        type: Number, visible: function ( this: PropItem )
        {
            return this.propType == PropType.宝石;
        }
    } )
    posY = 0.2;

    start ()
    {
        const collider = this.getComponent( Collider );
        collider?.on( 'onTriggerEnter', ( event: ITriggerEvent ) => 
        {
            collider.enabled = false;
            switch ( this.propType )
            {
                case PropType.宝石:
                    Messager.Broadcast( 'PropItem', null, this.propType, 10 );
                    break;
                case PropType.手套:
                    Messager.Broadcast( 'PropItem', null, this.propType, 100 );
                    break;
                case PropType.钻石:
                    Messager.Broadcast( 'PropItem', null, this.propType, null );
                    break;
            }
            this.node.parent.destroy();
        } );
    }
}