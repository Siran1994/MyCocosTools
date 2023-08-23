import { _decorator, Component, Prefab, Node } from 'cc';
import { AudioMgr } from './AudioMgr';
import { GamePanel } from '../panel/GamePanel';
import { PlayerState } from '../data/Enum';
import { MainPanel } from '../panel/MainPanel';
import { PlayerCtrl } from '../role/PlayerCtrl';
import { GameManager } from './GameManager';
import { Messager } from './Messager';
import { PoolManager } from './PoolManager';
import { ResMgr } from './ResMgr';
import { GameData } from '../data/GameData';
import { Config } from '../data/Config';
import { find, Vec3 } from 'cc';
import { instantiate } from 'cc';
const { ccclass, property } = _decorator;

@ccclass( 'UiManager' )
export class UiManager extends Component 
{
    public static Instance: UiManager = null;
    onLoad ()
    {
        UiManager.Instance = this;
    }

    @property( MainPanel )
    mainPanel: MainPanel = null;//主界面       

    /**pageMap容器 */
    private static pageMap: Map<string, Node> = new Map();

    /**
        * 加载page界面
        * @param callback 回调函数
        */
    public static loadPanel ()
    {
        ResMgr.loadDir( "panel", 'prefab/panel', Prefab, ( completedCount, totalCount ) =>
        {
            console.log( '完成个数:' + completedCount + '总数:' + totalCount );
        }, ( assets: Prefab[] ) =>
        {
            assets.forEach( asset =>
            {
                console.log( "加载资源界面和弹窗" );
                //if ( asset.name.includes( "panel" ) )
                this.setPage( asset.name, instantiate( asset ) );
            } );
        } );
    }


    /**
       * 展示page界面
       * @param key  page名称
       * @param callback  回调函数
       */
    public static showPage ( key: string, callback?: Function ): void
    {
        console.log( `showPage ${ key }` );

        if ( this.pageMap.has( key ) )
        {
            let node: Node = this.pageMap.get( key );
            if ( node.parent == null )
            {
                node.parent = find( 'Canvas' );
                node.position = Vec3.ZERO;
            }
            callback && callback();
        } else
        {
            console.error( `showPage fail: ${ key } not exsit in the pageMap` );

        }
    }

    /**
    * 隐藏page界面
    * @param key  page名称
    */
    public static hidePage ( key: string ): void
    {
        if ( this.pageMap.has( key ) )
        {
            console.log( `hidePage ${ key }` );
            let node: Node = this.pageMap.get( key );

            if ( node.parent != null )
                node.parent = null;
        } else
        {
            console.warn( `hidePage fail: ${ key } not exsit in the pageMap` );
        }
    }

    /**
        *  添加page界面
        * @param key   page名称
        * @param value page界面
        */
    public static setPage ( key: string, value: Node ): void
    {
        if ( this.pageMap.has( key ) )
        {
            console.warn( `set fail: ${ key } already exsit in the pageMap` );
        } else
        {
            // console.log(`set ${key} in the pageMap`);
            this.pageMap.set( key, value );
        }
    }

    /**
     * 获取page界面
     * @param key  page名称
     */
    public static getPage ( key: string ): Node
    {
        if ( this.pageMap.has( key ) )
        {
            // console.log(`get ${key} in the pageMap`);
            return this.pageMap.get( key );
        } else
        {
            console.warn( `get fail: ${ key } not exsit in the pageMap` );
        }
    }

    /**
        * 删除page界面
        * @param key  page名称
        */
    public static deletePage ( key: string ): void
    {
        if ( this.pageMap.has( key ) )
        {
            console.log( `delete ${ key } in the pageMap` );
            this.pageMap.delete( key );
        } else
        {
            console.warn( `delete fail: ${ key } not exsit in the pageMap` );
        }
    }

    /**清空pageMap */
    public static clearPage (): void
    {
        this.pageMap.clear();
        console.log( "clear pageMap" );
    }

}