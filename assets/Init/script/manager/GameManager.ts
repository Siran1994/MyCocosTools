import { _decorator, Component, director, find, Node, Prefab } from 'cc';
import { HeroType } from '../data/Enum';
import { GameData } from '../data/GameData';
import { Loading } from '../init/Loading';
import { FreeTryPanel } from '../panel/FreeTryPanel';
import { Utils } from '../tool/Utils';
import { Messager } from './Messager';
import { PoolManager } from './PoolManager';
import { ResMgr } from './ResMgr';

const { ccclass, property } = _decorator;

@ccclass( 'GameManager' )
export class GameManager extends Component
{
    public static Instance: GameManager = null;
    protected onLoad (): void 
    {
        GameManager.Instance = this;
    }

    @property( { displayName: '玩家', type: Node } )
    target: Node = null;

    @property( { displayName: '主相机', type: Node } )
    MainCamera: Node = null;

    @property( { displayName: '游戏状态', type: Boolean } )
    IsStart: boolean = false;//是否开始游戏      

    @property( { displayName: '当前目标英雄', type: String } )
    MainHero: string = '';

    @property( { displayName: '是否收集齐', type: Boolean } )
    isCollected: boolean = false;

    @property( { displayName: '通关钻石奖励', type: Number } )
    RewardCoin: number = 30;

    @property( { displayName: '移动速度', type: Number } )
    Speed: number = 6;

    @property( { displayName: '集齐套装增加速度', type: Number } )
    AddSpeed: number = 6;

    PackageName = '城市飞侠';
    BossPower = 0;
    PlayerPower = 500;

    protected onDestroy (): void
    {
        PoolManager.clearPool( 'Coin' );
        PoolManager.clearPool( 'Loading' );
        PoolManager.clearPool( 'fightTip' );
        PoolManager.clearPool( 'tips' );
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
        if ( GameData.Lv > 15 )
        {
            var targetlv = ( Utils.random( 5, 15 ) ).toString();
            if ( isShowProgress )
            {
                ResMgr.loadResource( 'prefab/Loading', ( obj: Prefab ) =>
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
                ResMgr.loadResource( 'prefab/Loading', ( obj: Prefab ) =>
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
            let goinfo = null;
            ResMgr.loadPrefab( 'prefab/panel/FreeTryPanel', ( obj: Prefab ) =>
            {
                let go = PoolManager.getNode( obj, find( 'Canvas' ) ) as Node;
                goinfo = go.getComponent( FreeTryPanel );
            } );
            if ( Lv % 5 == 0 )
            {
                this.PackageName = '城市飞侠';
                goinfo.ShowPackage( this.PackageName );
            }
            if ( Lv % 7 == 0 )
            {
                this.PackageName = '雷公';
                goinfo.ShowPackage( this.PackageName );
            }
            if ( Lv % 9 == 0 )
            {
                this.PackageName = '钢铁英雄';
                goinfo.ShowPackage( this.PackageName );
            }
            if ( Lv % 11 == 0 )
            {
                this.PackageName = '黑液人';
                goinfo.ShowPackage( this.PackageName );
            }
            if ( Lv % 13 == 0 )
            {
                this.PackageName = '超级巨人';
                goinfo.ShowPackage( this.PackageName );
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
}