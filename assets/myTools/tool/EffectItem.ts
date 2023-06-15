import { _decorator, Component, Node } from 'cc';
import { Utils } from './Utils';
const { ccclass, property } = _decorator;

@ccclass( 'EffectItem' )
export class EffectItem extends Component
{
    @property( Number )
    disTime: number = 1.5;

    @property( Boolean )
    isDes: boolean = false;

    @property( {
        type: Number, visible: function ( this: EffectItem )
        {
            return this.isDes == true;
        }
    } )
    desTime: number = 2;

    onLoad ()
    {
        Utils.DelayCallBack( this.disTime, () =>
        {
            this.node.active = false;
        } );

        if ( this.isDes )
        {
            Utils.DelayCallBack( this.desTime, () =>
            {
                this.node.destroy();
            } );
        }
    }
}

