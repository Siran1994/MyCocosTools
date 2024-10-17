import { _decorator, Component, Label, Node } from 'cc';
import { Messager } from '../manager/Messager';
import { GameData } from '../data/GameData';
const { ccclass, property } = _decorator;

@ccclass( 'SignItem' )
export class SignItem extends Component
{
    @property( Node )
    Signed: Node = null;//签到

    // @property( Node )
    // Selected: Node = null;//签到

    @property( { type: Label } )
    rewardtxt: Label = null;

    @property
    index: number = 0;

    start ()
    {
        if ( this.index < GameData.SignDay )
            this.Signed.active = true;
        else
            this.Signed.active = false;
    }

    onEnable ()
    {
        Messager.AddListener( 'SignItem', this, this.SignItem );
    }

    onDisable ()
    {
        Messager.RemoveListener( 'SignItem', this, this.SignItem );
    }

    SignItem ( i: number )
    {
        if ( this.index == i )
            this.Signed.active = true;
    }
}