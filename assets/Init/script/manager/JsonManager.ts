import { _decorator, assetManager, Component, JsonAsset } from 'cc';
import { ResMgr } from './ResMgr';
const { ccclass, property } = _decorator;

@ccclass( 'JsonManager' )
export class JsonManager extends Component
{
    private static jsonMap: Map<string, JsonAsset> = new Map();

    static Path = 'prefab/json';

    public static loadTextAsset ( bundleName: string, path: string )
    {
        ResMgr.loadDir( bundleName, path, JsonAsset, ( completedCount, totalCount ) =>
        {
            //console.log( '完成个数:' + completedCount + '总数:' + totalCount );
        }, ( assets: JsonAsset[] ) =>
        {
            assets.forEach( asset =>
            {
                this.set( asset.name, asset );
                console.log( "文本资源: " + asset.name );
            } );
        } );
    }
    //添加纹理资源
    public static set ( key: string, value: JsonAsset ): void
    {
        if ( this.jsonMap.has( key ) )
        {
            console.warn( `set fail: ${ key } already exsit in the textureMap` );
        } else
        {
            this.jsonMap.set( key, value );
        }
    }

    //获取纹理资源
    public static get ( key: string ): JsonAsset
    {
        if ( this.jsonMap.has( key ) )
        {
            return this.jsonMap.get( key );
        } else
        {
            console.warn( `get fail: ${ key } not exsit in the textureMap` );
        }
    };

    //释放单个纹理资源
    public static releaseAsset ( key ): void
    {
        if ( this.jsonMap.has( key ) )
        {
            var asset: JsonAsset = this.jsonMap.get( key );

            this.jsonMap.delete( key );
            assetManager.releaseAsset( asset );
            console.log( "release asset with " + key );
        }
    };

    //释放所有纹理资源
    public static releaseAllAsset (): void
    {
        this.jsonMap.clear();
        console.log( "prefabMap release all" );
    };
}

