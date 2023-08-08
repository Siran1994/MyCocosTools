import { _decorator, Component, director, ProgressBar, Node } from 'cc';
import { ResMgr } from '../manager/ResMgr';
import { GameData } from '../data/GameData';
import { AudioMgr } from '../manager/AudioMgr';
import { PlayerPrefs } from '../data/PlayerPrefs';
import { SceneAsset } from 'cc';
import { resources } from 'cc';
import { Prefab } from 'cc';
import { find } from 'cc';
import { PoolManager } from '../manager/PoolManager';
import { Loading } from './Loading';
const { ccclass } = _decorator;

@ccclass( 'Init' )
export class Init extends Component
{
    protected onLoad (): void
    {
        PlayerPrefs.DeleteAll();
        this.loadRes();
    }

    async loadRes ()
    {
        await ResMgr.loadBundle( 'bundle', () =>
        {
            if ( GameData.Lv == 0 || GameData.Lv == null )
                GameData.Lv = 1;
            ResMgr.loadResource( 'prefab/Loading', ( obj: Prefab ) =>
            {
                let go = PoolManager.getNode( obj, this.node ) as Node;
                var loader = go.getComponent( Loading );
                loader.showProgress( GameData.Lv.toString(), () =>
                {
                    PoolManager.putNode( go );
                } );
            } );
        } );

        await AudioMgr.init( this.node.parent, () =>
        {
            AudioMgr.Instance.首页背景乐.playMusic();
        }, this );
    }
}