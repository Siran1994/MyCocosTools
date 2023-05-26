import { _decorator, assetManager, AssetManager, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

export type ICallback<T = any> = ( bundle: AssetManager.Bundle ) => void;
export class ResMgr  
{
    static m_bundle: AssetManager.Bundle;

    static loadBundle ( caller: any, onComplete: ICallback )
    {
        if ( ResMgr.m_bundle != null )
        {
            onComplete?.call( caller, ResMgr.m_bundle );
        }
        else
        {
            assetManager.loadBundle( 'bundle', ( err, bundle: AssetManager.Bundle ) =>
            {
                ResMgr.m_bundle = bundle;
                onComplete?.call( caller, bundle );
            } );
        }
    }
}