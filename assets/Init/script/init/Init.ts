import { _decorator, Component, Node } from 'cc';
import { ResMgr } from '../manager/ResMgr';
import { GameData } from '../data/GameData';
import { AudioMgr } from '../manager/AudioMgr';
import { Prefab } from 'cc';
import { PoolManager } from '../manager/PoolManager';
import { Loading } from './Loading';
import { Config } from '../data/Config';
import { PlatformMgr } from '../manager/PlatformMgr';
const { ccclass } = _decorator;

@ccclass( 'Init' )
export class Init extends Component
{
    protected onLoad (): void
    {
        this.loadRes();
    }

    async loadRes ()
    {
        await ResMgr.loadBundle( 'bundle', () =>
        {
            if ( GameData.Lv == 0 || GameData.Lv == null )
                GameData.Lv = 1;
            ResMgr.loadResource( Config.Path.Loading, ( obj: Prefab ) =>
            {
                let go = PoolManager.getNode( obj, this.node ) as Node;
                go.getComponent( Loading ).showProgress( GameData.Lv.toString(), () =>
                {
                    PoolManager.putNode( go );
                } );
            } );
        } );

        await AudioMgr.init( this.node.parent, () =>
        {
            AudioMgr.Instance.首页背景乐.playMusic();

        }, this );

        await PlatformMgr.Instance.getCurrentPlatform();
    }
}