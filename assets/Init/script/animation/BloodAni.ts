import { tween } from 'cc';
import { UIOpacity } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { Messager } from '../manager/Messager';
const { ccclass, property } = _decorator;

@ccclass( 'BloodAni' )
export class BloodAni extends Component
{
    @property( { type: UIOpacity } )
    Blood: UIOpacity = null;

    onEnable ()
    {
        Messager.AddListener( 'PlayBlood', this, this.PlayAni );
    }

    onDisable ()
    {
        Messager.RemoveListener( 'PlayBlood', this, this.PlayAni );
    }

    PlayAni ()
    {
        tween( this.Blood )
            .sequence
            (
                tween().to( 0.4, { opacity: 255 } ),
                tween().to( 0.4, { opacity: 0 } ),
            )
            .repeat( 2 )
            .start();
    }
}