import { _decorator, assetManager, SpriteFrame } from 'cc';
import { ResMgr } from './ResMgr';
const { ccclass } = _decorator;

@ccclass( 'SpriteManager' )
export class SpriteManager
{
    static shopIconMap: Map<string, SpriteFrame> = new Map();//商店图标   
    static showMap: Map<string, SpriteFrame> = new Map();//卡面图标

    static Path =
        {
            shopIcon: 'prefab/shopicon',
            showPath: 'prefab/showicon'
        }

    public static loadSprite ( name: string, path: string, cb?: Function )
    {
        ResMgr.loadDir( path, SpriteFrame, ( completedCount, totalCount ) =>
        {
            if ( completedCount == totalCount )
                cb && cb();
        }, ( assets: SpriteFrame[] ) =>
        {
            assets.forEach( asset =>
            {
                switch ( name )
                {
                    case 'Shop':
                        this.set( asset.name, asset, this.shopIconMap );
                        break;
                    case 'Show':
                        this.set( asset.name, asset, this.showMap );
                        break;
                }
            } );
        } );
    }
    //添加纹理资源
    public static set ( key: string, value: SpriteFrame, targetMap: Map<string, SpriteFrame> ): void
    {
        if ( targetMap.has( key ) )
        {
            console.warn( `set fail: ${ key } already exsit in the textureMap` );
        } else
        {
            targetMap.set( key, value );
        }
    }

    //获取纹理资源
    public static get ( key: string, targetMap: Map<string, SpriteFrame> ): SpriteFrame
    {
        if ( targetMap.has( key ) )
        {
            return targetMap.get( key );
        } else
        {
            console.warn( `get fail: ${ key } not exsit in the textureMap` );
        }
    };

    //释放单个纹理资源
    public static releaseAsset ( key, targetMap: Map<string, SpriteFrame> ): void
    {
        if ( targetMap.has( key ) )
        {
            var asset: SpriteFrame = targetMap.get( key );
            targetMap.delete( key );
            assetManager.releaseAsset( asset );
            console.log( "release asset with " + key );
        }
    };

    //释放所有纹理资源
    public static releaseAllAsset (): void
    {

        this.shopIconMap.clear();
        this.showMap.clear();
    };
}