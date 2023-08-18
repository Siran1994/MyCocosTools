import { resources } from 'cc';
import { _decorator, assetManager, AssetManager, Prefab, SpriteAtlas, AudioClip, SpriteFrame } from 'cc';
export type ICallback<T = any> = ( bundle: AssetManager.Bundle ) => void;
export type IcallBack = ( go: Prefab ) => void;
export class ResMgr  
{



    static m_bundle: AssetManager.Bundle;

    demo ()//示例用法
    {
        assetManager.loadBundle( 'bundle', ( err, ab: AssetManager.Bundle ) =>
        {
            //加载资源 ,路径是资源包路径 
            ab.load( 'path', Prefab, ( err, prefab ) =>  //加载预制体
            {
                if ( err )
                {
                    console.log( err ); return;
                }
                console.log( prefab );

                ab.release( 'path' );//基于ab包释放单个资源
                assetManager.getBundle( 'bundle' )?.release( 'path' );//使用asmger来释放单个资源
                assetManager.releaseAsset( prefab );
                assetManager.releaseAll();
            } );



            ab.load( 'path', SpriteAtlas, ( err, atlas ) => //加载图集
            {
                if ( err )
                {
                    console.log( err ); return;
                }
                console.log( atlas );
                var sp: SpriteFrame = atlas.getSpriteFrame( 'name' );
                sp.addRef();//添加引用计数,针对ab?.releaseUnusedAssets();
                sp.decRef();//ab?.releaseUnusedAssets();的执行由引用计数来判断
            } );

            ab.load( 'path', AudioClip, ( err, clip ) => //加载音频
            {
                if ( err )
                {
                    console.log( err ); return;
                }
                console.log( clip );
            } );

            //一.卸载资源
            //释放单个资源 释放不用资源 释放所有资源(没有)
            //二.使用assetManager 来卸载资源
            //释放单个资源 释放不用资源 释放所有资源(没有)
            //示例

            //加载完成 ,释放ab包,不会释放从ab包里面加载的资源
            assetManager.removeBundle( ab );
        } );
        //定时释放资源
        // this.scheduleOnce( () =>
        {
            var ab = assetManager.getBundle( 'bundle' );
            ab?.release( 'path' );//使用asmger来释放单个资源
            ab?.releaseAll();//释放所有资源            
            assetManager.removeBundle( ab as AssetManager.Bundle );

        }//, 10 );
    }

    public static async loadBundle ( caller: any, onComplete: ICallback )
    {
        if ( ResMgr.m_bundle != null )
        {
            onComplete?.call( caller, ResMgr.m_bundle );
        }
        else
        {    //异步加载,加载好会调用你的函数
            assetManager.loadBundle( 'bundle', ( err, bundle: AssetManager.Bundle ) =>
            {
                ResMgr.m_bundle = bundle;
                onComplete?.call( caller, bundle );
            } );
        }
    }

    public static async loadPrefab ( path: string, onComplete: IcallBack, isDontDes: boolean = false )
    {
        ResMgr.loadBundle( this, ( bundle: AssetManager.Bundle ) =>
        {
            //加载预制体                
            bundle.load( path, Prefab, function ( err, prefab )
            {
                onComplete( prefab );
            } );
        } );
    }

    public static async loadResource ( path: string, onComplete: IcallBack )
    {
        // 例如加载一个图片资源
        await resources.load( path, ( err: any, res: any ) =>
        {
            if ( err )
            {
                onComplete( res );
                return;
            }
            onComplete( res );
        } )
    }
}