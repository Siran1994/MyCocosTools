import { _decorator, Component, Label, Node, tween, Quat, Vec3 } from 'cc';
import { Messager } from '../manager/Messager';
import { GameData } from '../data/GameData';
import DOTweenAnimation from '../animation/DOTweenAnimation';
import { Utils } from '../tool/Utils';
import { GameManager } from '../manager/GameManager';
import { PoolManager } from '../manager/PoolManager';
import { Button } from 'cc';
import { AudioMgr } from '../manager/AudioMgr';
import { PrefabManager } from '../manager/PrefabManager';
import { Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass( 'GamePanel' )
export class GamePanel extends Component 
{
    @property( Button )
    AddCoinBtn: Button;//获取金币

    @property( Label )
    LvTxt: Label;//关卡信息

    @property( Label )
    CoinTxt: Label;//金币信息  

    @property( Node )
    target: Node = null;

    init () 
    {
        this.LvTxt.string = '关卡' + GameData.Lv.toString();
        this.CoinTxt.string = GameManager.Instance.Coin.toString();
    }

    start ()
    {
        this.AddCoinBtn.node.on( Button.EventType.CLICK, () =>
        {
            AudioMgr.Instance.点击广告按钮.Play();
            var tmpNum = GameData.Coin;
            var targetNum = tmpNum + 100;
            var ani = DOTweenAnimation.stepNum( this.CoinTxt, tmpNum, 20, targetNum, 0.001, '', () =>
            {
                ani.stop();
                GameData.Coin = targetNum;
                this.CoinTxt.string = GameData.Coin.toString();
            } );
        }, this );
    }

    onEnable ()
    {
        this.init();
        Messager.AddListener( 'updateCoin', this, this.UpdateCoin );
        Messager.AddListener( 'coinDoFly', this, this.CoinDoFly );
    }

    onDisable ()
    {
        Messager.RemoveListener( 'updateCoin', this, this.UpdateCoin );
        Messager.RemoveListener( 'coinDoFly', this, this.CoinDoFly );
    }

    UpdateCoin ( num: number )
    {
        this.showCoin( num );
    }

    CoinDoFly ( num: number, pos: Vec2 )
    {
        let coinPrefab = PrefabManager.get( 'Coin', PrefabManager.UiMap )
        let go = PoolManager.getNode( coinPrefab, this.target.parent );
        go.scale = Vec3.ONE;
        go.worldPosition = new Vec3( pos.x, pos.y, 0 );
        tween( go )
            .sequence
            (
                tween().to( 0.3,
                    {
                        position: new Vec3( go.position.x - 50, go.position.y - 80, go.position.z ),               // 位置缓动
                    },
                    { easing: "linear" } ),
                tween().delay( 0.2 ),
                tween().to( 0.5,
                    {
                        position: this.target.position,               // 位置缓动
                        scale: new Vec3( 0.5, 0.5, 0.5 ),                     // 缩放缓动
                        eulerAngles: Quat.IDENTITY                       // 旋转缓动
                    },
                    { easing: "sineIn" } ),

                tween().call( () =>
                {
                    this.UpdateCoin( num );
                    PoolManager.putNode( go );
                } ),
            )
            .start();
    }

    showCoin ( addnum: number )
    {
        var tmpNum = GameManager.Instance.Coin;
        var targetNum = tmpNum + addnum;
        if ( targetNum < 0 )
        {
            GameManager.Instance.Coin = 0;
            this.CoinTxt.string = '0';
            Messager.Broadcast( 'gameOver', true );
            return;
        }
        var ani = DOTweenAnimation.stepNum( this.CoinTxt, tmpNum, 1, targetNum, 0, '', () =>
        {
            ani.stop();
            GameManager.Instance.Coin = targetNum;
            Utils.DelayCallBack( 1, () =>
            {
                this.CoinTxt.string = GameManager.Instance.Coin.toString();
            } );
        } );
    }
}