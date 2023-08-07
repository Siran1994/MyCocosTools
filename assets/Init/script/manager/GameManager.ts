import { _decorator, Component, director, find, Node, Prefab } from 'cc';
import { PoolManager } from './PoolManager';
import { GameData } from '../data/GameData';
import { ResMgr } from './ResMgr';
import { Loading } from '../init/Loading';
import { Messager } from './Messager';
import { Utils } from '../tool/Utils';
import { HeroType } from '../data/Enum';
import { UiManager } from './UiManager';
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

    PackageName = '蜘蛛侠';
    BossPower = 0;

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
                ResMgr.loadPrefab( 'prefab/ui/Loading', ( obj: Prefab ) =>
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
                ResMgr.loadPrefab( 'prefab/ui/Loading', ( obj: Prefab ) =>
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
            if ( Lv % 5 == 0 )
            {
                this.PackageName = '蜘蛛侠';
                UiManager.Instance.freetryPanel.ShowPackage( this.PackageName );
            }
            if ( Lv % 7 == 0 )
            {
                this.PackageName = '雷神';
                UiManager.Instance.freetryPanel.ShowPackage( this.PackageName );
            }
            if ( Lv % 9 == 0 )
            {
                this.PackageName = '钢铁侠';
                UiManager.Instance.freetryPanel.ShowPackage( this.PackageName );
            }
            if ( Lv % 11 == 0 )
            {
                this.PackageName = '毒液';
                UiManager.Instance.freetryPanel.ShowPackage( this.PackageName );
            }
            if ( Lv % 13 == 0 )
            {
                this.PackageName = '浩克';
                UiManager.Instance.freetryPanel.ShowPackage( this.PackageName );
            }
        }
    }

    SetCurrentHero ()
    {
        let heros = [ '美国队长', '蜘蛛侠', '钢铁侠', '毒液', '绿巨人', '雷神' ];
        let heroName = heros[ Utils.random( 0, 5 ) ];
        this.MainHero = heroName;
        Messager.Broadcast( 'ChangePart', heroName );
    }

    GetBossPower ()
    {
        switch ( this.GetHeroType() )
        {
            case HeroType.美国队长:
                return 500;
            case HeroType.蜘蛛侠:
                return 500;
            case HeroType.钢铁侠:
                return 500;
            case HeroType.毒液:
                return 500;
            case HeroType.绿巨人:
                return 500;
            case HeroType.雷神:
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
            case '美国队长':
                heroType = HeroType.美国队长;
                break;
            case '蜘蛛侠':
                heroType = HeroType.蜘蛛侠;
                break;
            case '钢铁侠':
                heroType = HeroType.钢铁侠;
                break;
            case '毒液':
                heroType = HeroType.毒液;
                break;
            case '绿巨人':
                heroType = HeroType.绿巨人;
                break;
            case '雷神':
                heroType = HeroType.雷神;
                break;
        }
        return heroType;
    }
}