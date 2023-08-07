import { SpriteFrame, loader } from "cc";

export default class SpriteFrameManager
{
    //纹理map容器
    private static spriteFrameMap: Map<string, SpriteFrame> = new Map();

    //添加纹理资源
    public static set ( key: string, value: SpriteFrame ): void
    {
        if ( this.spriteFrameMap.has( key ) )
        {
            console.warn( `set fail: ${ key } already exsit in the textureMap` );
        } else
        {
            // console.log(`set ${key} in the spriteFrameMap`);
            this.spriteFrameMap.set( key, value );
        }
    }

    //获取纹理资源
    public static get ( key: string ): SpriteFrame
    {
        if ( this.spriteFrameMap.has( key ) )
        {
            // console.log(`get ${key} in the textureMap`);
            return this.spriteFrameMap.get( key );
        } else
        {
            console.warn( `get fail: ${ key } not exsit in the textureMap` );
        }
    };

    //释放单个纹理资源
    public static releaseAsset ( key ): void
    {
        if ( this.spriteFrameMap.has( key ) )
        {
            var asset: SpriteFrame = this.spriteFrameMap.get( key );

            this.spriteFrameMap.delete( key );
            loader.release( asset );
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