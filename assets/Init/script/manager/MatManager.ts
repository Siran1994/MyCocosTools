import { _decorator, assetManager, Material } from 'cc';
import { ResMgr } from './ResMgr';

const { ccclass } = _decorator;

@ccclass( 'MatManager' )
export class MatManager 
{
    private static cardSkinMap: Map<string, Material> = new Map();

    static Path = 'prefab/cardskin';

    public static loadMat ( bundleName: string, path: string )
    {
        ResMgr.loadDir( bundleName, path, Material, ( completedCount, totalCount ) =>
        {
            //console.log( '完成个数:' + completedCount + '总数:' + totalCount );
        }, ( assets: Material[] ) =>
        {
            assets.forEach( asset =>
            {
                this.set( asset.name, asset );
                //console.log( "加载图片资源: " + asset.name );
            } );
        } );
    }
    //添加纹理资源
    public static set ( key: string, value: Material ): void
    {
        if ( this.cardSkinMap.has( key ) )
        {
            console.warn( `set fail: ${ key } already exsit in the textureMap` );
        } else
        {
            this.cardSkinMap.set( key, value );
        }
    }

    //获取纹理资源
    public static get ( key: string ): Material
    {
        if ( this.cardSkinMap.has( key ) )
        {
            return this.cardSkinMap.get( key );
        } else
        {
            console.warn( `get fail: ${ key } not exsit in the textureMap` );
        }
    };

    //释放单个纹理资源
    public static releaseAsset ( key ): void
    {
        if ( this.cardSkinMap.has( key ) )
        {
            var asset: Material = this.cardSkinMap.get( key );

            this.cardSkinMap.delete( key );
            assetManager.releaseAsset( asset );
            console.log( "release asset with " + key );
        }
    };

    //释放所有纹理资源
    public static releaseAllAsset (): void
    {
        this.cardSkinMap.clear();
        console.log( "prefabMap release all" );
    };
}

