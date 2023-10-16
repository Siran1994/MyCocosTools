import { _decorator, assetManager, Prefab } from 'cc';
import { ResMgr } from './ResMgr';
const { ccclass } = _decorator;

@ccclass( 'PrefabManager' )
export class PrefabManager 
{
    static EnemyMap: Map<string, Prefab> = new Map();
    static BulletMap: Map<string, Prefab> = new Map();
    static LvMap: Map<string, Prefab> = new Map();

    static Path =
        {
            Enemy: 'prefab/enemy',
            Bullet: 'prefab/bullet',
            Lv: 'prefab/lv',
        }

    public static loadPrefab ( name: string, path: string, cb?: Function )
    {
        ResMgr.loadDir( path, Prefab, ( completedCount, totalCount ) =>
        {
            // console.log( '完成个数:' + completedCount + '总数:' + totalCount );
            if ( completedCount == totalCount )
                cb && cb();
        }, ( assets: Prefab[] ) =>
        {
            assets.forEach( asset =>
            {
                switch ( name )
                {
                    case 'Enemy':
                        this.set( asset.name, asset, this.EnemyMap );
                        break;
                    case 'Bullet':
                        this.set( asset.name, asset, this.BulletMap );
                        break;
                    case 'Lv':
                        this.set( asset.name, asset, this.LvMap );
                        break;
                }
            } );
        } );
    }

    public static set ( key: string, value: Prefab, targetMap: Map<string, Prefab> )
    {
        if ( targetMap.has( key ) )
            console.warn( `set fail: ${ key } already exsit in the prefabMap` );
        else
            targetMap.set( key, value );
    }

    public static get ( key: string, targetMap: Map<string, Prefab> )
    {
        if ( targetMap.has( key ) )
            return targetMap.get( key );
        else
            console.warn( `get fail: ${ key } not exsit in the prefabMap` );
    };

    public static releaseAsset ( key, targetMap: Map<string, Prefab> )
    {
        if ( targetMap.has( key ) )
        {
            var asset: Prefab = targetMap.get( key );
            targetMap.delete( key );
            assetManager.releaseAsset( asset );
            console.log( "release asset with " + key );
        }
    };

    public static releaseAllAsset ()
    {
        this.EnemyMap.clear();
        this.BulletMap.clear();
        this.LvMap.clear();
    };
}