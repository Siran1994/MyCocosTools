import { _decorator, assetManager, Component, TextAsset } from 'cc';
import { ResMgr } from './ResMgr';

const { ccclass, property } = _decorator;

@ccclass( 'TextAssetManager' )
export class TextAssetManager extends Component
{
    private static textAssetMap: Map<string, TextAsset> = new Map();

    static Path = 'prefab/lv';

    public static loadTextAsset ( bundle, path: string )
    {
        ResMgr.loadDir( bundle, path, TextAsset, ( completedCount, totalCount ) =>
        {
            //console.log( '完成个数:' + completedCount + '总数:' + totalCount );
        }, ( assets: TextAsset[] ) =>
        {
            assets.forEach( asset =>
            {
                this.set( asset.name, asset );
                console.log( "文本资源: " + asset.name );
            } );
        } );
    }
    //添加纹理资源
    public static set ( key: string, value: TextAsset ): void
    {
        if ( this.textAssetMap.has( key ) )
        {
            console.warn( `set fail: ${ key } already exsit in the textureMap` );
        } else
        {
            this.textAssetMap.set( key, value );
        }
    }

    //获取纹理资源
    public static get ( key: string ): TextAsset
    {
        if ( this.textAssetMap.has( key ) )
        {
            return this.textAssetMap.get( key );
        } else
        {
            console.warn( `get fail: ${ key } not exsit in the textureMap` );
        }
    };

    //释放单个纹理资源
    public static releaseAsset ( key ): void
    {
        if ( this.textAssetMap.has( key ) )
        {
            var asset: TextAsset = this.textAssetMap.get( key );

            this.textAssetMap.delete( key );
            assetManager.releaseAsset( asset );
            console.log( "release asset with " + key );
        }
    };

    //释放所有纹理资源
    public static releaseAllAsset (): void
    {
        this.textAssetMap.clear();
        console.log( "prefabMap release all" );
    };
}

