import { _decorator, Component } from 'cc';
import { AudioMgr } from '../manager/AudioMgr';
import { Loading } from './Loading';
import { ResMgr } from '../manager/ResMgr';
import { GameData } from '../data/GameData';
import { GameManager } from '../manager/GameManager';
import { PrefabManager } from '../manager/PrefabManager';
import { PlatformMgr } from '../manager/PlatformMgr';
const { ccclass, property } = _decorator;

@ccclass( 'Init' )
export class Init extends Component
{
    @property( { type: Loading } )
    loader: Loading = null;

    protected onLoad (): void
    {
        this.loadRes();
        GameData.initData();
    }

    async loadRes ()
    {
        await ResMgr.loadBundle( 'bundle', () =>
        {
            PlatformMgr.Instance.getCurrentPlatform();
            PrefabManager.loadPrefab( 'Lv', PrefabManager.Path.Lv );
            AudioMgr.init( this.node.parent, () =>
            {
                AudioMgr.Instance.首页背景乐.playMusic();

            }, this );
            this.loader.showProgress( 'game', () => { GameManager.Instance.init() } );
        } );
    }
}