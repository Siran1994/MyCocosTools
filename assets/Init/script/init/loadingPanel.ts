
import { _decorator, Component, tween, UIOpacityComponent } from 'cc';
import { PoolManager } from '../manager/PoolManager';

const { ccclass, property } = _decorator;

@ccclass( 'LoadingPanel' )
export class LoadingPanel extends Component
{
    @property( UIOpacityComponent )
    public opacityCom: UIOpacityComponent = null!

    onLoad ()
    {
        this.opacityCom.opacity = 255;
        this._hideLoadingPanel()
    }

    private _hideLoadingPanel ()
    {
        tween( this.opacityCom )
            .to( 2, { opacity: 200 }, { easing: 'smooth' } )
            .to( 1, { opacity: 50 }, { easing: 'smooth' } )
            .call( () =>
            {
                PoolManager.putNode( this.node );
            } )
            .start();
    }
}