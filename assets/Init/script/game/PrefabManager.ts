import { loader } from "cc";
import { Prefab } from "cc";

export default class PrefabManager
{
    /**预制体名 */
    public static audioName = {
        /**默认 */
        DEFAULT: "default"
    };

    /** 预制体map容器 */
    private static prefabMap: Map<string, Prefab> = new Map();

    /**添加预制体资源 */
    public static set ( key: string, value: Prefab ): void
    {
        if ( this.prefabMap.has( key ) )
        {
            console.warn( `set fail: ${ key } already exsit in the prefabMap` );
        } else
        {
            // console.log(`set ${key} in the prefabMap`);
            this.prefabMap.set( key, value );
        }
    }

    /**获取预制体资源 */
    public static get ( key: string ): Prefab
    {
        if ( this.prefabMap.has( key ) )
        {
            console.log( `get ${ key } in the prefabMap` );
            return this.prefabMap.get( key );
        } else
        {
            console.warn( `get fail: ${ key } not exsit in the prefabMap` );
        }
    };

    /**释放单个预制体资源 */
    public static releaseAsset ( key ): void
    {
        if ( this.prefabMap.has( key ) )
        {
            var asset: Prefab = this.prefabMap.get( key );

            this.prefabMap.delete( key );
            loader.release( asset );
            console.log( "release asset with " + key );
        }
    };

    /**释放所有预制体资源 */
    public static releaseAllAsset (): void
    {
        this.prefabMap.clear();
        console.log( "prefabMap release all" );
    };
}