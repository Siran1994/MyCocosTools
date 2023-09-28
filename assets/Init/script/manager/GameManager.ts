import { _decorator, Component, director, find, instantiate, Node, Prefab } from 'cc';
import { GameData } from '../data/GameData';
import { Loading } from '../init/Loading';
import { Utils } from '../tool/Utils';
import { UiManager } from './UiManager';
import { PrefabManager } from './PrefabManager';
import { PoolManager } from './PoolManager';
import { ResMgr } from './ResMgr';
import { Config } from '../data/Config';
import { AniType } from '../data/Enum';
import { PlayerCtrl } from '../role/PlayerCtrl';
import { AudioMgr } from './AudioMgr';
import { Messager } from './Messager';
const { ccclass, property } = _decorator;

@ccclass( 'GameManager' )
export class GameManager extends Component
{
    public static Instance: GameManager = null;
    protected onLoad (): void 
    {
        GameManager.Instance = this;
    }

    @property( { displayName: '游戏状态', type: Boolean } )
    IsStart: boolean = false;//是否开始游戏 

    @property( { displayName: '移动速度', type: Number } )
    Speed: number = 6;

    @property( { displayName: '金币', type: Number } )
    Coin = 0;

    currentlv = null;
    targetLv = 1;

    init ()
    {
        if ( this.node.children.length > 0 )
        {
            for ( let i = 0; i < this.node.children.length; i++ )
                this.node.children[ i ].destroy();
        }
        if ( GameData.Lv > Config.MaxLv )
            this.targetLv = Utils.randomNum( Config.MaxLv - 5, Config.MaxLv );
        else
            this.targetLv = GameData.Lv;
        this.currentlv = instantiate( PrefabManager.get( this.targetLv.toString(), PrefabManager.LvMap ) );
        this.currentlv.parent = this.node;
    }

    start ()
    {
        this.node.scene.autoReleaseAssets = false;
        this.ShowFreeTryPanel( GameData.Lv );
    }

    onEnable ()
    {
        Messager.AddListener( 'gameOver', this, this.GameOver );
    }

    onDisable ()
    {
        Messager.RemoveListener( 'gameOver', this, this.GameOver );
    }

    GameOver ( isfailed: boolean )
    {
        if ( isfailed ) //游戏失败
        {
            GameManager.Instance.IsStart = false;
            PlayerCtrl.Instance.Play( AniType.死亡 );
            UiManager.Instance.faildPanel.node.active = true;
            AudioMgr.Instance.失败结算.Play();
        }
        else //游戏通关
        {
            GameData.Coin += GameManager.Instance.Coin;
            UiManager.Instance.rewardPanel.node.active = true;
            AudioMgr.Instance.胜利结算.Play();
        }
    }

    NextLevel ( isNextLv = false, isShowProgress = false, cb?: Function )
    {
        if ( isNextLv )
            GameData.Lv += 1;
        if ( isShowProgress )
        {
            ResMgr.loadPrefab( Config.Path.Loading, ( obj: Prefab ) =>
            {
                let go = PoolManager.getNode( obj, find( 'Canvas' ) ) as Node;
                var loader = go.getComponent( Loading );
                loader.showProgress( 'game', () =>
                {
                    cb && cb();
                    PoolManager.putNode( go );
                } );
            } );
        }
        else
            director.loadScene( 'game', ( err, scene: any ) =>
            {
                cb && cb();
            } );

    }

    ShowFreeTryPanel ( Lv: number )
    {
        if ( Lv > 2 )
        {
            if ( Lv % 3 == 0 )
            {
                UiManager.Instance.freeTryPanel.node.active = true;
                UiManager.Instance.freeTryPanel.ShowPackage( 'xxxxx' );
            }
        }
    }

    protected onDestroy (): void
    {
        // PoolManager.clear();
    }
}