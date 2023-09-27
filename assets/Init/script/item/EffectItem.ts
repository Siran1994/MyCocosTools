import { _decorator, Component } from 'cc';
import { Utils } from 'db://assets/Init/script/tool/Utils';
import { PoolManager } from '../manager/PoolManager';
const { ccclass, property } = _decorator;

@ccclass( 'EffectItem' )
export class EffectItem extends Component
{
    @property( Boolean )
    isDisOrDes: boolean = true;

    @property( { type: Number } )
    lastTime: number = 0.5;

    onEnable ()
    {
        if ( this.isDisOrDes == true )
        {
            Utils.DelayCallBack( this.lastTime, () =>
            {
                this.node.active = false;
            } );
        }
        else
        {
            Utils.DelayCallBack( this.lastTime, () =>
            {
                PoolManager.putNode( this.node );
            } );
        }
    }
}