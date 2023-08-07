import { AssetManager } from "cc";
import { assetManager, Asset } from "cc";

/**
 * 资源管理
 */
export default class ResManager
{
    /**自定义资源包名 */
    public static BundleName = {
        /**UI界面 */
        UI: "ui",
        /**音频 */
        AUDIO: "audio",
        /**配置包 */
        CONFIG: "config",

        PREFABS: "prefabs",

        /**内置internal(优先级11) */
        INTERNAL: "internal",
        /**内置start-scene(优先级9) */
        START_SCENE: "start-scene",
        /**内置resource(优先级8) */
        RESOURCES: "resources",
        /**内置main(优先级7) */
        MAIN: "main",
    }

    /**
     * 加载资源包
     * @param name 资源包名
     * @param options  可选配置参数
     * @param completeCallback 成功回调
     */
    public static async loadBundle ( name: string, options?: Object ): Promise<AssetManager.Bundle>
    {
        return new Promise( resolve =>
        {
            assetManager.loadBundle( name, options, ( error: Error, bundle: AssetManager.Bundle ) =>
            {
                if ( error )
                {
                    resolve( null );
                    return console.log( error.message );
                }
                console.log( "加载prefabs" + name );
                resolve( bundle );
            } );
        } )
    }

    public static async preLoadBundle ( name: string, options?: Object ): Promise<AssetManager.Bundle>
    {
        return new Promise( resolve =>
        {
            assetManager.loadBundle( name, options, ( error: Error, bundle: AssetManager.Bundle ) =>
            {
                if ( error )
                {
                    resolve( null );
                    return console.log( error.message );
                }
                resolve( bundle );
            } );
        } )
    }

    /**
     * 获取已加载的分包
     * @param name 资源包名
     */
    public static getBundle ( name: string ): AssetManager.Bundle
    {
        return assetManager.getBundle( name );
    }

    /**
     * 移除此资源包，注意：这个包内的资源不会自动释放, 如果需要的话你可以在摧毁之前手动调用 releaseAll 进行释放
     * @param name 资源包名
     */
    public static removeBundle ( name: string ): void
    {
        let bundle: AssetManager.Bundle = this.getBundle( name );
        if ( bundle )
        {
            assetManager.removeBundle( bundle );
        } else
        {
            console.warn( `load ${ name } bundle first` );
        }
    }

    /**
     * 加载指定资源包内资源
     * @param name  资源包名
     * @param paths 相对分包文件夹路径的相对路径
     * @param type  资源类型
     * @param progressCallback  加载回调
     * @param completedCallback 完成回调
     */
    public static load ( name: string, paths: string, type: typeof Asset, progressCallback?: ( completedCount: number, totalCount: number ) => void, completedCallback?: ( asset: any ) => void ): void
    {
        let bundle: AssetManager.Bundle = this.getBundle( name );
        if ( bundle )
        {
            bundle.load( paths, type, ( completedCount: number, totalCount: number ) =>
            {
                progressCallback && progressCallback( completedCount, totalCount );
            }, ( error: Error, asset: Asset ) =>
            {
                if ( error )
                {
                    return console.log( error.message );
                }

                console.log( `load ${ asset.name } completed` );
                completedCallback && completedCallback( asset );
            } )
        } else
        {
            console.warn( `load ${ name } bundle first` );
        }
    }

    /**
     * 加载目标文件夹中的所有资源, 注意：路径中只能使用斜杠，反斜杠将停止工作
     * @param name  资源包名
     * @param paths 相对分包文件夹路径的相对路径
     * @param type  资源类型
     * @param progressCallback  加载回调
     * @param completedCallback 完成回调
     */
    public static loadDir ( name: string, paths: string, type: typeof Asset, progressCallback?: Function, completedCallback?: Function ): void
    {
        let bundle: AssetManager.Bundle = this.getBundle( name );
        if ( bundle )
        {
            bundle.loadDir( paths, type, ( completedCount: number, totalCount: number ) =>
            {
                progressCallback && progressCallback( completedCount, totalCount );
            }, ( error: Error, assets: Asset[] ) =>
            {
                if ( error )
                {
                    return console.log( error.message );
                }

                if ( assets.length == 0 )
                {
                    return console.log( `Bundle ${ bundle.name } doesn't contain ${ paths }` );
                }

                assets.forEach( asset =>
                {
                    console.log( `load ${ asset.name } completed` );
                } )
                completedCallback && completedCallback( assets );
            } )
        } else
        {
            console.warn( `load ${ name } bundle first` );
        }
    }

    /**
     * 释放指定资源包内的资源
     * @param name 资源包名
     * @param path 资源包内资源的相对路径
     * @param type 资源类型
     */
    public static releaseBundleAsset ( name: string, path: string, type: typeof Asset ): void
    {
        let bundle: AssetManager.Bundle = this.getBundle( name );
        if ( bundle )
        {
            bundle.release( path, type );
        } else
        {
            console.warn( `load ${ name } bundle first` );
        }
    }

    /**
     * 释放指定资源包内的所有资源
     * @param name 资源包名
     */
    public static releaseAllBundleAsset ( name: string ): void
    {
        let bundle: AssetManager.Bundle = this.getBundle( name );
        if ( bundle )
        {
            bundle.releaseAll();
        } else
        {
            console.warn( `load ${ name } bundle first` );
        }
    }

    /**
     * 释放资源以及其依赖资源, 这个方法不仅会从 assetManager 中删除资源的缓存引用，还会清理它的资源内容。 比如说，当你释放一个texture资源，这个texture和它的gl贴图数据都会被释放。
     * 注意：这个函数可能会导致资源贴图或资源所依赖的贴图不可用，如果场景中存在节点仍然依赖同样的贴图，它们可能会变黑并报 GL 错误。
     * @param asset 资源
     */
    public static releaseAsset ( asset: Asset ): void
    {
        assetManager.releaseAsset( asset );
    }

    /**
     * 释放所有资源
     */
    public static releaseAllAsset (): void
    {
        assetManager.releaseAll();
    }
}
