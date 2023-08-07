import { _decorator, Component, ParticleSystem } from 'cc';
import { Utils } from 'db://assets/Init/script/tool/Utils';
const { ccclass, property } = _decorator;

@ccclass( 'EffectItem' )
export class EffectItem extends Component
{
    @property( Number )
    disTime: number = 1.5;

    @property( Number )
    interval: number = 1.5;

    @property( Boolean )
    isDis: boolean = true;

    @property( Boolean )
    isDes: boolean = false;

    effcet: ParticleSystem = null;

    @property( {
        type: Number, visible: function ( this: EffectItem )
        {
            return this.isDes == true;
        }
    } )
    desTime: number = 2;

    onLoad ()
    {
        if ( this.isDis )
        {
            Utils.DelayCallBack( this.disTime, () =>
            {
                this.node.active = false;
            } );
        }

        if ( this.isDes )
        {
            Utils.DelayCallBack( this.desTime, () =>
            {
                this.node.destroy();
            } );
        }
    }

    start ()
    {
        if ( this.effcet == null )
            this.effcet = this.getComponent( ParticleSystem );
        this.schedule( this.play, this.interval );
    }

    play ()
    {
        this.effcet.play();
    }

    onDisable ()
    {
        this.unschedule( this.play );
    }
}