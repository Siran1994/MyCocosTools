
import { find } from "cc";
import { Prefab, instantiate, Vec3, Node } from "cc";
import { Messager } from "../manager/Messager";
import AssetManager from "./AssetManager";
import { resources } from "cc";



export default class PageManager
{
    /**ui界面名称 */
    public static pageName = {
        /**游戏界面*/
        GAMEPAGE: "GamePage",
        /**开始界面*/
        STARTPAGE: "StartPage",
        /**原生弹窗 */
        // NATIVE_DIALOG: "NativeAdDialog",
        /**默认 */
        DEFAULT: "default",
        /** 设置界面 */
        SETTING_DIALOG: "SettingDialog",
        /** 结算界面 */
        RESULT_DIALOG: "ResultDialog",
        /** 结算界面 */
        HIT_DIALOG: "HitDialog",
        /** 引导界面 */
        GUDIE_DIALOG: "GuideDialog",
    }

    /**pageMap容器 */
    private static pageMap: Map<string, Node> = new Map();


    /**初始化 */
    public static onInit (): void
    {
        AssetManager.loadDir( AssetManager.BundleName.PREFABS, "", Prefab, ( completedCount: number, totalCount: number ) =>
        {
            Messager.Broadcast( 'progress', completedCount, totalCount );
        }, ( assets: Prefab[] ) =>
        {
            assets.forEach( asset =>
            {
                console.log( "加载资源界面和弹窗" );
                if ( asset.name.includes( "Page" ) )
                    this.setPage( asset.name, instantiate( asset ) )
            } )
            Messager.Broadcast( 'complete!' );
        } )
    }

    /**
     * 加载page界面
     * @param callback 回调函数
     */
    public static loadPage ( callback: Function ): void
    {
        resources.loadDir( "Page", Prefab, ( completedCount, totalCount ) =>
        {
            callback( completedCount, totalCount );
        }, ( error, assets ) =>
        {
            if ( error )
            {
                console.log( error );
                return
            }

            assets.forEach( asset =>
            {
                console.log( `load ${ asset.name } complete` );
                //实例化
                let node: Node = instantiate( asset );
                this.setPage( asset.name, node );
            } )
        } )
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

    /**
     * 展示page界面
     * @param key  page名称
     * @param callback  回调函数
     */
    public static showPage ( key: string, callback?: Function ): void
    {
        console.log( `showPage ${ key }` );
        // find("page").getComponent("page").pageTo(Canvas.instance.node);

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
            console.warn( `showPage fail: ${ key } not exsit in the pageMap` );

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

    /**清空pageMap */
    public static clearPage (): void
    {
        this.pageMap.clear();
        console.log( "clear pageMap" );
    }
}