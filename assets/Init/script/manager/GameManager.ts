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

        // CsvManager.Instance.getData( 'talk' );//Excel表格使用示例

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
            AudioMgr.Instance.Play( '失败结算' );
        }
        else //游戏通关
        {
            GameData.Coin += GameManager.Instance.Coin;
            UiManager.Instance.rewardPanel.node.active = true;
            AudioMgr.Instance.Play( '胜利结算' );
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

    static showAd ( succFun, failFun = null )
    {
        //TipManager.Instance.showTips( '请接入SDK!' );
        succFun();
        //failFun();
        // Platforms_QuickGame.getInstance().showVideo(
        //     () =>
        //     {
        //GameData.AdCount += 1;//记录玩家每天广告总次数
        //GameManager.reportEvent( 'player_ad_times', { player_ad_times: GameData.AdCount } );
        //         succFun();
        //     },
        //     () =>
        //     {
        //         failFun();
        //     } );
    }

    static reportEvent ( eventName, data )//埋点事件
    {
        // this.tt = window[ "tt" ]
        // if ( this.tt )
        // {
        //     console.log( "埋点响应成功" + eventName, data );
        //     this.tt.reportAnalytics( eventName, data );
        // }
        // else
        {
            console.log( "埋点测试" + eventName, data );
        }
    }

    static AddDesk ( click: Function, succ: Function, fail: Function )//添加桌面
    {
        click = () =>
        {
            GameManager.reportEvent( 'DY_giftPack_id', { DY_giftPack_id: '1.添加桌面', status: '点击' } )
        }
        succ = () =>
        {
            GameManager.reportEvent( 'DY_giftPack_id', { DY_giftPack_id: '1.添加桌面', status: '成功' } )
        }
        fail = () =>
        {
            GameManager.reportEvent( 'DY_giftPack_id', { DY_giftPack_id: '1.添加桌面', status: '失败' } )
        }
    }

    static SideBar ( click: Function, succ: Function, fail: Function )//侧边栏
    {
        click = () =>
        {
            GameManager.reportEvent( 'DY_giftPack_id', { DY_giftPack_id: '2.侧边栏', status: '点击' } );
        }
        succ = () =>
        {
            GameManager.reportEvent( 'DY_giftPack_id', { DY_giftPack_id: '2.侧边栏', status: '成功' } );
        }
        fail = () =>
        {
            GameManager.reportEvent( 'DY_giftPack_id', { DY_giftPack_id: '2.侧边栏', status: '失败' } );
        }
    }
    static Collect ( click: Function, succ: Function, fail: Function )//收藏
    {
        click = () =>
        {
            GameManager.reportEvent( 'DY_giftPack_id', { DY_giftPack_id: '3.收藏', status: '点击' } );
        }
        succ = () =>
        {
            GameManager.reportEvent( 'DY_giftPack_id', { DY_giftPack_id: '3.收藏', status: '成功' } );
        }
        fail = () =>
        {
            GameManager.reportEvent( 'DY_giftPack_id', { DY_giftPack_id: '3.收藏', status: '失败' } );
        }
    }
    static Share ( click: Function, succ: Function, fail: Function )//分享
    {
        click = () =>
        {
            GameManager.reportEvent( 'DY_giftPack_id', { DY_giftPack_id: '4.分享', status: '点击' } );
        }
        succ = () =>
        {
            GameManager.reportEvent( 'DY_giftPack_id', { DY_giftPack_id: '4.分享', status: '成功' } );
        }
        fail = () =>
        {
            GameManager.reportEvent( 'DY_giftPack_id', { DY_giftPack_id: '4.分享', status: '失败' } );
        }
    }
}