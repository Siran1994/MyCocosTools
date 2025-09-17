import { _decorator, Component } from 'cc';
import { Loading } from './Loading';
import { ResMgr } from '../manager/ResMgr';
import { GameData } from '../data/GameData';
import { GameManager } from '../manager/GameManager';
import { PrefabManager } from '../manager/PrefabManager';
import { PlatformMgr } from '../manager/PlatformMgr';
import { SpriteManager } from '../manager/SpriteManager';
import { PlayerPrefs } from '../data/PlayerPrefs';
import { Config } from '../data/Config';
const { ccclass, property } = _decorator;

@ccclass( 'Init' )
export class Init extends Component
{
    @property( { type: Loading } )
    loader: Loading = null;

    onLoad ()
    {
        //PlayerPrefs.DeleteAll();
        this.loadRes();
        GameData.initData();
    }

    async loadRes ()
    {
        await ResMgr.loadBundle( Config.BundleName.Base, () =>
        {
            PrefabManager.loadPrefab( Config.BundleName.Base, 'Lv', PrefabManager.Path.Lv, () =>
            {
                PrefabManager.loadPrefab( Config.BundleName.Base, 'Ui', PrefabManager.Path.Ui, () =>
                {
                    ResMgr.loadBundle( Config.BundleName.Monster, () =>
                    {
                        PrefabManager.loadPrefab( Config.BundleName.Monster, 'Player', PrefabManager.Path.Player, () =>
                        {
                            this.loader.showProgress( 'base', () =>
                            {
                                GameManager.Instance.init();
                                PlatformMgr.Instance.getCurrentPlatform();
                            } );
                        } );
                    } )
                } );
            } );
        } );
    }
}