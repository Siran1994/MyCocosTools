import { _decorator, Component, Node, Prefab, Quat, tween, Vec3 } from 'cc';
import { AudioMgr } from '../manager/AudioMgr';
import { PoolManager } from '../manager/PoolManager';
import { Utils } from './Utils';
import { PrefabManager } from '../manager/PrefabManager';
import { Global } from '../data/Global';
const { ccclass, property } = _decorator;

@ccclass( 'StarFly' )
export class StarFly extends Component
{
    @property( Node )
    startPoint: Node = null;
    @property( Node )
    endPoint: Node = null;
    star: Prefab = null;//金币

    start ()
    {
        this.star = PrefabManager.get( 'Star', PrefabManager.UiMap );
        PoolManager.prePool( this.star, 10 );
    }

    StarFlyAni ( count: number, cb?: Function )
    {
        AudioMgr.Instance.Play( 'starfly' );
        let coinList1 = [];
        for ( let i = 0; i < count; i++ )
        {
            setTimeout( () =>
            {
                let go = PoolManager.getNode( this.star, Global.uiMgr.mainPanel.HpBarPar );
                go.scale = Vec3.ONE;
                go.worldPosition = new Vec3( this.startPoint.worldPosition.x, this.startPoint.worldPosition.y, 0 );
                coinList1.push( go );
                tween( go ).to( 0.5,
                    {
                        position: new Vec3( go.position.x + Utils.randomNum( -120, 120 ), go.position.y + Utils.randomNum( -100, 100 ) ),               // 位置缓动
                    },
                    { easing: "linear" } )
                    .start();
            }, i * 100 );
        }
        Utils.DelayCallBack( 0.5, () =>
        {
            for ( let i = 0; i < count; i++ )
            {
                setTimeout( () =>
                {
                    tween( coinList1[ i ] )
                        .sequence
                        (
                            tween().to( 0.3,
                                {
                                    worldPosition: this.endPoint.worldPosition,               // 位置缓动
                                    scale: new Vec3( 0.5, 0.5, 0.5 ),                     // 缩放缓动
                                    eulerAngles: Quat.IDENTITY                       // 旋转缓动
                                },
                                { easing: "sineIn" } ),

                            tween().call( () =>
                            {
                                //  AudioMgr.Instance.Play( 'star' );
                                PoolManager.putNode( coinList1[ i ] );
                            } ),
                        )
                        .start();
                }, i * 100 );
            }
            cb && cb();
        } )
    }
}

