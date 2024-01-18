import { _decorator, Component } from 'cc';
import { Loading } from './Loading';
import { ResMgr } from '../manager/ResMgr';
import { GameData } from '../data/GameData';
import { GameManager } from '../manager/GameManager';
import { PrefabManager } from '../manager/PrefabManager';
import { PlatformMgr } from '../manager/PlatformMgr';
import { SpriteManager } from '../manager/SpriteManager';
import { PlayerPrefs } from '../data/PlayerPrefs';
const { ccclass, property } = _decorator;

@ccclass( 'Init' )
export class Init extends Component
{
    @property( { type: Loading } )
    loader: Loading = null;

    protected onLoad (): void
    {
        PlayerPrefs.DeleteAll();
        this.loadRes();
    }

    async loadRes ()
    {
        await ResMgr.loadBundle( 'bundle', () =>
        {
            GameData.initData();
            PrefabManager.loadPrefab( 'Ui', PrefabManager.Path.Ui );
            PrefabManager.loadPrefab( 'Lv', PrefabManager.Path.Lv );
            PrefabManager.loadPrefab( 'Player', PrefabManager.Path.Player );
            SpriteManager.loadSprite( 'Shop', SpriteManager.Path.shopIcon );
            SpriteManager.loadSprite( 'Show', SpriteManager.Path.showPath );
            this.loader.showProgress( 'game', () =>
            {
                GameManager.Instance.init();
                PlatformMgr.Instance.getCurrentPlatform();
            } );
        } );
    }
}