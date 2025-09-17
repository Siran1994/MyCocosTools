import { Asset, resources } from 'cc';
import { _decorator, assetManager, AssetManager, Prefab } from 'cc';
import { Config } from '../data/Config';
export type ICallback<T = any> = ( bundle: AssetManager.Bundle ) => void;
export type IcallBack = ( go: Prefab ) => void;
export class ResMgr  
{
    public static async loadBundle ( bundleName: string, onComplete: ICallback )
    {
        //异步加载,加载好会调用你的函数
        assetManager.loadBundle( bundleName, ( err, bundle: AssetManager.Bundle ) =>
        {
            onComplete?.call( bundleName, bundle );
        } );
    }

    public static async loadDir ( bundleName: string, path: string, type: any, progressCallback?: Function, completedCallback?: Function )
    {
        assetManager.loadBundle( bundleName, ( err, bundle: AssetManager.Bundle ) =>
        {
            bundle.loadDir( path, type, ( completedCount: number, totalCount: number ) =>
            {
                progressCallback && progressCallback( completedCount, totalCount );
            }, ( error: Error, assets: Asset[] ) =>
            {
                if ( error )
                {
                    console.error( '当前错误是：' + error.message );
                    return;
                }
                completedCallback && completedCallback( assets );
            } );
        } );
    }

    public static ResloadDir ( path: string, completedCallback: Function )
    {
        resources.loadDir( path, ( error: Error, assets: Asset[] ) =>
        {
            if ( error )
            {
                console.error( '当前错误是：' + error.message );
                return;
            }
            completedCallback && completedCallback( assets );
        } );
    }

    public static loadPrefab ( path: string, onComplete: IcallBack, isDontDes: boolean = false )
    {
        ResMgr.loadBundle( Config.BundleName.Base, ( bundle: AssetManager.Bundle ) =>
        {
            //加载预制体                
            bundle.load( path, Prefab, function ( err, prefab )
            {
                onComplete( prefab );
            } );
        } );
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
                    return console.log( error.message );
                console.log( `load ${ asset.name } completed` );
                completedCallback && completedCallback( asset );
            } )
        }
        else
            console.warn( `load ${ name } bundle first` );
    }

    /**
     * 获取已加载的分包
     * @param name 资源包名
     */
    public static getBundle ( name: string ): AssetManager.Bundle
    {
        return assetManager.getBundle( name );
    }
}