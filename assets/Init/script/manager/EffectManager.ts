import { Prefab } from 'cc';
import { _decorator } from 'cc';
import { ResMgr } from './ResMgr';
import { assetManager } from 'cc';
const { ccclass, property } = _decorator;

@ccclass( 'EffectManager' )
export class EffectManager 
{
    static EffectMap: Map<string, Prefab> = new Map();

    static Path = 'prefab/effect';

    public static loadEffect ( path: string = EffectManager.Path, cb?: Function )
    {
        ResMgr.loadDir( path, Prefab, ( completedCount, totalCount ) =>
        {
            //console.log( '完成个数:' + completedCount + '总数:' + totalCount );
            if ( completedCount == totalCount )
                cb && cb();
        }, ( assets: Prefab[] ) =>
        {
            assets.forEach( asset =>
            {
                this.set( asset.name, asset, this.EffectMap );
            } );
        } );
    }

    public static set ( key: string, value: Prefab, targetMap: Map<string, Prefab> )
    {
        if ( targetMap.has( key ) )
            console.error( `set fail: ${ key } already exsit in the prefabMap` );
        else
            targetMap.set( key, value );
    }

    public static get ( key: string, targetMap: Map<string, Prefab> )
    {
        if ( targetMap.has( key ) )
            return targetMap.get( key );
        else
            console.error( `get fail: ${ key } not exsit in the prefabMap` );
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
        this.EffectMap.clear();
    };
}

