import { _decorator, Component, Prefab, Quat, tween, Vec3, Node, UITransformComponent, find } from 'cc';
import { FinishPanel } from '../panel/FinishPanel';
import { GamePanel } from '../panel/GamePanel';
import { MainPanel } from '../panel/MainPanel';
import { SettingPanel } from '../panel/SettingPanel';
import { ShopPanel } from '../panel/ShopPanel';
import { Messager } from './Messager';
import { FailedPanel } from '../panel/FailedPanel';
import { PlayerCtrl } from '../role/PlayerCtrl';
import { PlayerState } from '../data/Enum';
import { GameManager } from './GameManager';
import { Utils } from '../tool/Utils';
import { ResMgr } from './ResMgr';
import { PoolManager } from './PoolManager';
import { AudioMgr } from './AudioMgr';
import { FreeTryPanel } from '../panel/FreeTryPanel';
import { tips } from '../tip/tips';
import { FightTip } from '../tip/fightTip';
import { view, UITransform } from 'cc';

const { ccclass, property } = _decorator;
const SHOW_STR_INTERVAL_TIME = 800;
@ccclass( 'UiManager' )
export class UiManager extends Component 
{
    public static Instance: UiManager = null;
    onLoad ()
    {
        UiManager.Instance = this;
    }

    @property( MainPanel )
    mainPanel: MainPanel;//主界面

    @property( GamePanel )
    gamePanel: GamePanel;//游戏界面     

    @property( SettingPanel )
    settingPanel: SettingPanel;//设置界面

    @property( ShopPanel )
    shopPanel: ShopPanel;//商店界面

    @property( FinishPanel )
    finishPanel: FinishPanel;//结算界面

    @property( FailedPanel )
    failedPanel: FailedPanel;//失败界面

    @property( FreeTryPanel )//试用界面
    freetryPanel: FreeTryPanel;

    @property( { displayName: '游戏状态', type: Boolean } )
    IsFailed: boolean = false;//是否失败

    onEnable ()
    {
        Messager.AddListener( 'updateCoin', this, this.UpdateCoin );
        Messager.AddListener( 'updatePower', this, this.UpdatePower );
        Messager.AddListener( 'gameOver', this, this.GameOver );
        Messager.AddListener( 'coinDoFly', this, this.CoinDoFly );
    }

    onDisable ()
    {
        Messager.RemoveListener( 'updateCoin', this, this.UpdateCoin );
        Messager.RemoveListener( 'updatePower', this, this.UpdatePower );
        Messager.RemoveListener( 'gameOver', this, this.GameOver );
        Messager.RemoveListener( 'coinDoFly', this, this.CoinDoFly );
    }

    UpdateCoin ( num: number )
    {
        this.gamePanel.showCoin( num );
    }
    UpdatePower ( num: number )
    {
        this.gamePanel.showPower( num );
    }
    GameOver ( isfailed: boolean )
    {
        this.IsFailed = isfailed;
        if ( isfailed ) //游戏失败
        {
            GameManager.Instance.IsStart = false;
            PlayerCtrl.Instance.Play( PlayerState.死亡 );
            Utils.DelayCallBack( 1, () =>
            {
                this.gamePanel.node.active = false;
                this.finishPanel.node.active = false;
                this.failedPanel.node.active = true;
                AudioMgr.Instance.失败结算.Play();
            } );
        }
        else //游戏通关
        {
            Utils.DelayCallBack( 2, () =>
            {
                this.finishPanel.rewardPanel.active = true;
                AudioMgr.Instance.胜利结算.Play();
            } );
        }
    }

    CoinDoFly ()
    {
        ResMgr.loadPrefab( 'prefab/ui/Coin', ( obj: Prefab ) =>
        {
            let go = PoolManager.getNode( obj, this.gamePanel.target.parent ) as Node;
            go.scale = Vec3.ONE;
            go.setPosition( new Vec3( -286, -750, 0 ) );
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
                            position: this.gamePanel.target.position,               // 位置缓动
                            scale: new Vec3( 0.5, 0.5, 0.5 ),                     // 缩放缓动
                            eulerAngles: Quat.IDENTITY                       // 旋转缓动
                        },
                        { easing: "sineIn" } ),

                    tween().call( () =>
                    {
                        PoolManager.putNode( go );
                    } ),
                )
                .start();
        } );
    }


    showTipsTime: number = 0

    /**
     * 显示提示
     * @param {String} content 
     * @param {Function} cb 
     */
    showTips ( content: string | number, targetPos: Vec3 = new Vec3(), scale: number = 1, callback: Function = () => { } )
    {
        let str = String( content );
        let next = () =>
        {
            this._showTipsAni( str, targetPos, scale, callback );
        }

        var now = Date.now();
        if ( now - this.showTipsTime < SHOW_STR_INTERVAL_TIME )
        {
            var spareTime = SHOW_STR_INTERVAL_TIME - ( now - this.showTipsTime );
            setTimeout( () =>
            {
                next();
            }, spareTime );

            this.showTipsTime = now + spareTime;
        } else
        {
            next();
            this.showTipsTime = now;
        }
    }

    /**
     * 内部函数
     * @param {String} content 
     * @param {Function} cb 
     */
    _showTipsAni ( content: string, targetPos: Vec3, scale: number, callback?: Function )
    {
        ResMgr.loadPrefab( 'prefab/common/tips', ( obj: Prefab ) =>
        {
            let tipsNode = PoolManager.getNode( obj, find( "Canvas" ) as Node );

            tipsNode.getComponent( UITransformComponent ).priority = 900;

            let tipScript = tipsNode.getComponent( tips ) as tips;
            tipScript.show( content, targetPos, scale, callback );
        } );
    }

    showFightTips ( type: number, txt: string, pos: Vec3, callback?: Function )
    {
        ResMgr.loadPrefab( 'prefab/common/fightTip', ( obj: Prefab ) =>
        {
            let ndTip = <Node> PoolManager.getNode( obj, <Node> find( "Canvas" ) );
            ndTip.setPosition( pos );

            let UICom = ndTip.getComponent( UITransformComponent ) as UITransformComponent;

            if ( type === 0 )
                UICom.priority = 999;
            else if ( type === 1 )
                UICom.priority = 1000;
            let scriptTip = <FightTip> ndTip.getComponent( FightTip );
            scriptTip.show( type, txt, callback );
        } );
    }

   
}