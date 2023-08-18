import { _decorator, Component, Label, Node } from 'cc';
import DateUtils from '../tool/DateUtils';
import { PlayerPrefs } from '../data/PlayerPrefs';
import { Messager } from '../manager/Messager';
const { ccclass, property } = _decorator;

@ccclass( 'SignItem' )
export class SignItem extends Component
{
    @property( Node )
    Signed: Node = null;//签到

    @property( Node )
    Selected: Node = null;//签到

    @property( { type: Label } )
    rewardtxt: Label = null;

    @property
    index: number = 0;

    start ()
    {
        this.init();
    }

    init ()
    {
        if ( this.index == PlayerPrefs.GetInt( 'signDay', 1 ) && PlayerPrefs.GetInt( 'signDate', 0 ) != DateUtils.getDate().day )
            this.Selected.active = true;
        else
            this.Selected.active = false;

        if ( this.index < PlayerPrefs.GetInt( 'signDay', 1 ) )
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
        {
            this.Signed.active = true;
            this.Selected.active = true;
        }
        else
            this.Selected.active = false;

    }
}

