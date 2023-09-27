import { _decorator, AnimationComponent, Collider, Component, ITriggerEvent } from 'cc';
import { Messager } from '../manager/Messager';
import { AudioMgr } from '../manager/AudioMgr';
import { PropType } from '../data/Enum';
import { GameData } from '../data/GameData';
const { ccclass, property } = _decorator;

@ccclass( 'TrapItem' )
export class TrapItem extends Component
{
    //陷阱,墙,结束点
    @property( { type: PropType } )
    propType: PropType = PropType.None;

    @property( {
        type: AnimationComponent, visible: function ( this: TrapItem )
        {
            return this.propType == PropType.墙;
        }
    } )
    ani: AnimationComponent = null!;

    private power: number = 0;

    start ()
    {
        this.initPower();

        const collider = this.getComponent( Collider );
        if ( this.propType == PropType.墙 )
            this.ani = this.getComponent( AnimationComponent );

        collider?.on( 'onTriggerEnter', ( event: ITriggerEvent ) => 
        {
            collider.enabled = false;
            if ( this.propType == PropType.墙 )
            {
                AudioMgr.Instance.撞墙.Play();
                this.ani.playOnLoad = true;
                this.ani.play();
            }
            else
                Messager.Broadcast( 'PropItem', null, this.propType, this.power );
        } );
    }

    initPower ()
    {
        if ( GameData.Lv <= 5 && GameData.Lv >= 0 )
            this.power = -100;
        else if ( GameData.Lv <= 10 && GameData.Lv >= 6 )
            this.power = -150;
        else if ( GameData.Lv <= 15 && GameData.Lv >= 11 )
            this.power = -200;
        else
            this.power = -300;
    }
}