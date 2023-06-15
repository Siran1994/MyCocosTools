import { _decorator, Component } from 'cc';
import { PropType } from './Enum';
import { Collider } from 'cc';
import { ITriggerEvent, Vec3 } from 'cc';
import { Messager } from '../tool/Messager';
const { ccclass, property } = _decorator;

@ccclass( 'PropItem' )
export class PropItem extends Component
{
    @property( { type: PropType } )
    propType: PropType = PropType.None;

    @property( {
        type: Boolean, visible: function ( this: PropItem )
        {
            return this.propType !== PropType.结束;
        }
    } )
    isAutoDestroy: boolean = false;

    @property( {
        type: Boolean, visible: function ( this: PropItem )
        {
            return this.propType !== PropType.结束;
        }
    } )
    isHaveName = false;

    @property( {
        displayName: '物品名称', type: String, visible: function ( this: PropItem )
        {
            return this.isHaveName === true;
        }
    } )
    PropName: string = '';

    start ()
    {
        const collider = this.getComponent( Collider );
        collider?.on( 'onTriggerEnter', ( event: ITriggerEvent ) => 
        {
            collider.enabled = false;
            if ( this.isHaveName )
                Messager.Broadcast( 'PropItem', this.propType, this.PropName );
            else
                Messager.Broadcast( 'PropItem', this.propType, '' );
            if ( this.isAutoDestroy )
            {
                if ( this.propType == PropType.钻石 )
                    Messager.Broadcast( 'coinDoFly', this.node );
                this.node.destroy();
            }
        } );
    }
}