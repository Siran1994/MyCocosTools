import { _decorator, Component, director, find, Node, Prefab } from 'cc';
import { HeroType } from '../data/Enum';
import { GameData } from '../data/GameData';
import { Loading } from '../init/Loading';
import { FreeTryPanel } from '../panel/FreeTryPanel';
import { Utils } from '../tool/Utils';
import { Messager } from './Messager';
import { PoolManager } from './PoolManager';
import { ResMgr } from './ResMgr';
import { Config } from '../data/Config';
import { DeviceManager } from '../game/DeviceManager';

const { ccclass, property } = _decorator;

@ccclass( 'GameManager' )
export class GameManager extends Component
{
    public static Instance: GameManager = null;
    protected onLoad (): void 
    {
        GameManager.Instance = this;
        this.init();
    }

    @property( { displayName: '玩家', type: Node } )
    target: Node = null;

    @property( { displayName: '主相机', type: Node } )
    MainCamera: Node = null;

    @property( { displayName: '游戏状态', type: Boolean } )
    IsStart: boolean = false;//是否开始游戏      

    @property( { displayName: '当前目标英雄', type: String } )
    MainHero: string = '';


    BossPower = 0;
    PlayerPower = 500;

    init ()
    {
        DeviceManager.Instance.setTargetFPS();
        DeviceManager.Instance.showFPS( true );
        console.log( DeviceManager.Instance.getGpuInfo() );
    }


    start ()
    {
        this.node.scene.autoReleaseAssets = false;
        if ( this.target == null )
            this.target = find( 'Player' );
        if ( this.MainCamera == null )
            this.MainCamera = find( 'Player/Main Camera' );

        this.SetCurrentHero();//设置当局收集英雄   
        this.ShowFreeTryPanel( GameData.Lv );
    }

    NextLevel ( isNextLv = false, isShowProgress = false )
    {
        if ( isNextLv )
            GameData.Lv += 1;
        if ( GameData.Lv > Config.MaxLv )
        {
            var targetlv = ( Utils.random( 5, Config.MaxLv ) ).toString();
            if ( isShowProgress )
            {
                ResMgr.loadResource( Config.Path.Loading, ( obj: Prefab ) =>
                {
                    let go = PoolManager.getNode( obj, find( 'Canvas' ) ) as Node;

                    var loader = go.getComponent( Loading );
                    loader.showProgress( targetlv, () =>
                    {
                        PoolManager.putNode( go );
                    } );
                } );
            }
            else
                director.loadScene( targetlv );
        }
        else
        {
            if ( isShowProgress )
            {
                ResMgr.loadResource( Config.Path.Loading, ( obj: Prefab ) =>
                {
                    let go = PoolManager.getNode( obj, find( 'Canvas' ) ) as Node;

                    var loader = go.getComponent( Loading );
                    loader.showProgress( GameData.Lv.toString(), () =>
                    {
                        PoolManager.putNode( go );
                    } );
                } );
            }
            else
                director.loadScene( GameData.Lv.toString() );
        }
    }

    ShowFreeTryPanel ( Lv: number )
    {
        if ( Lv > 4 )
        {
            if ( Lv % 2 == 0 )
            {
                let goinfo = null;
                ResMgr.loadPrefab( Config.Path.FreeTryPanel, ( obj: Prefab ) =>
                {
                    let go = PoolManager.getNode( obj, find( 'Canvas' ) ) as Node;
                    goinfo = go.getComponent( FreeTryPanel );
                    Config.PackageName = '城市飞侠';
                    goinfo.ShowPackage( Config.PackageName );
                } );
            }
        }
    }

    SetCurrentHero ()
    {
        let heros = [ '城市队长', '城市飞侠', '钢铁英雄', '黑液人', '超级巨人', '雷公' ];
        let heroName = heros[ Utils.random( 0, 5 ) ];
        this.MainHero = heroName;
        Messager.Broadcast( 'ChangePart', heroName );
    }

    GetBossPower ()
    {
        switch ( this.GetHeroType() )
        {
            case HeroType.城市队长:
                return 500;
            case HeroType.城市飞侠:
                return 500;
            case HeroType.钢铁英雄:
                return 500;
            case HeroType.黑液人:
                return 500;
            case HeroType.超级巨人:
                return 500;
            case HeroType.雷公:
                return 500;
        }
    }

    GetHeroType ( heroName: string = null )
    {
        if ( heroName == null && this.MainHero != '' )
            heroName = this.MainHero;
        let heroType = HeroType.None;
        switch ( heroName )
        {
            case '城市队长':
                heroType = HeroType.城市队长;
                break;
            case '城市飞侠':
                heroType = HeroType.城市飞侠;
                break;
            case '钢铁英雄':
                heroType = HeroType.钢铁英雄;
                break;
            case '黑液人':
                heroType = HeroType.黑液人;
                break;
            case '超级巨人':
                heroType = HeroType.超级巨人;
                break;
            case '雷公':
                heroType = HeroType.雷公;
                break;
        }
        return heroType;
    }

    protected onDestroy (): void
    {
        PoolManager.clear();
    }
}