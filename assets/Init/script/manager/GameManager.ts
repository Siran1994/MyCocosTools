import { _decorator, Component, director, find, instantiate, Node } from 'cc';
import { GameData } from '../data/GameData';
import { Loading } from '../init/Loading';
import { Utils } from '../tool/Utils';
import { UiManager } from './UiManager';
import { PrefabManager } from './PrefabManager';
import { PoolManager } from './PoolManager';
import { Config } from '../data/Config';
import { AniState, ItemType } from '../data/Enum';
import { PlayerCtrl } from '../role/PlayerCtrl';
import { AudioMgr } from './AudioMgr';
import { Messager } from './Messager';
import { SkeletalAnimation, AnimationComponent } from 'cc';
import { CsvManager } from '../other/CsvManager';

const { ccclass, property } = _decorator;

@ccclass( 'GameManager' )
export class GameManager extends Component
{
    public static Instance: GameManager = null;
    onLoad () 
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
        AudioMgr.init( this.node.parent, () =>
        {
            AudioMgr.Instance.游戏背景乐.playMusic();
        } );

        CsvManager.Instance.getData( 'talk' );//Excel表格使用示例

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
            GameManager.Instance.Play( PlayerCtrl.Instance.anmator, AniState.死亡 );
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
            let Prefab = PrefabManager.get( 'Loading', PrefabManager.UiMap );
            let go = PoolManager.getNode( Prefab, find( 'Canvas' ) ) as Node;
            var loader = go.getComponent( Loading );
            loader.showProgress( 'game', () =>
            {
                cb && cb();
                PoolManager.putNode( go );
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

    Play ( anmator: SkeletalAnimation | AnimationComponent, state: AniState, cb?: Function )
    {
        switch ( state )
        {
            case AniState.待机:
                anmator.crossFade( 'idle', 0.3 );
                break;
            case AniState.行走:
                anmator.crossFade( 'walk', 0.3 );
                if ( cb )
                    Utils.DelayCallBack( anmator.getState( 'walk' ).length, () => { cb && cb(); } );
                break;
            case AniState.奔跑:
                anmator.crossFade( 'run', 0.3 );
                if ( cb )
                    Utils.DelayCallBack( anmator.getState( 'run' ).length, () => { cb && cb(); } );
                break;
            case AniState.起跳:
                anmator.crossFade( 'jump', 0.3 );
                if ( cb )
                    Utils.DelayCallBack( anmator.getState( 'jump' ).length, () => { cb && cb(); } );
                break;
            case AniState.攻击:
                anmator.crossFade( 'fly', 0.3 );
                if ( cb )
                    Utils.DelayCallBack( anmator.getState( 'fly' ).length, () => { cb && cb(); } );
                break;
            case AniState.受击:
                anmator.crossFade( 'flying', 0.3 );
                if ( cb )
                    Utils.DelayCallBack( anmator.getState( 'flying' ).length, () => { cb && cb(); } );
                break;
            case AniState.死亡:
                anmator.crossFade( 'die', 0.3 );
                if ( cb )
                    Utils.DelayCallBack( anmator.getState( 'die' ).length, () => { cb && cb(); } );
                break;
            case AniState.胜利:
                anmator.crossFade( 'win', 0.3 );
                if ( cb )
                    Utils.DelayCallBack( anmator.getState( 'win' ).length, () => { cb && cb(); } );
                break;
        }
    }

    onDestroy ()
    {
        PoolManager.clear();
    }

    GameVibrate ()
    {
        console.log( '游戏震动' );
    }

    GetItemName ( itemType: ItemType )
    {
        return ItemType[ itemType ].toString();
    }
}