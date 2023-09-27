import { _decorator, assetManager, SpriteFrame } from 'cc';
import { ResMgr } from './ResMgr';
const { ccclass } = _decorator;

@ccclass( 'SpriteManager' )
export class SpriteManager
{
    private static spriteFrameMap: Map<string, SpriteFrame> = new Map();

    static Path = 'prefab/icon';

    public static loadTexture ( path: string = SpriteManager.Path )
    {
        ResMgr.loadDir( path, SpriteFrame, ( completedCount, totalCount ) =>
        {
            //console.log( '完成个数:' + completedCount + '总数:' + totalCount );
        }, ( assets: SpriteFrame[] ) =>
        {
            assets.forEach( asset =>
            {
                this.set( asset.name, asset );
            } );
        } );
    }
    //添加纹理资源
    public static set ( key: string, value: SpriteFrame ): void
    {
        if ( this.spriteFrameMap.has( key ) )
            console.error( `set fail: ${ key } already exsit in the textureMap` );
        else
            this.spriteFrameMap.set( key, value );
    }

    //获取纹理资源
    public static get ( key: string ): SpriteFrame
    {
        if ( this.spriteFrameMap.has( key ) )
            return this.spriteFrameMap.get( key );
        else
            console.error( `get fail: ${ key } not exsit in the textureMap` );
    };

    //释放单个纹理资源
    public static releaseAsset ( key ): void
    {
        if ( this.spriteFrameMap.has( key ) )
        {
            var asset: SpriteFrame = this.spriteFrameMap.get( key );
            this.spriteFrameMap.delete( key );
            assetManager.releaseAsset( asset );
            console.log( "release asset with " + key );
        }
    };

    //释放所有纹理资源
    public static releaseAllAsset (): void
    {
        this.spriteFrameMap.clear();
        console.log( "prefabMap release all" );
    };
}