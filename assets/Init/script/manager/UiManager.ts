import { _decorator, Component, Prefab, Node } from 'cc';
import { AudioMgr } from './AudioMgr';
import { GamePanel } from '../panel/GamePanel';
import { PlayerState } from '../data/Enum';
import { MainPanel } from '../panel/MainPanel';
import { PlayerCtrl } from '../role/PlayerCtrl';
import { GameManager } from './GameManager';
import { Messager } from './Messager';
import { PoolManager } from './PoolManager';
import { ResMgr } from './ResMgr';
import { GameData } from '../data/GameData';
import { Config } from '../data/Config';
const { ccclass, property } = _decorator;

@ccclass( 'UiManager' )
export class UiManager extends Component 
{
    public static Instance: UiManager = null;
    onLoad ()
    {
        UiManager.Instance = this;
    }

    @property( MainPanel )
    mainPanel: MainPanel = null;//主界面

    @property( GamePanel )
    gamePanel: GamePanel = null;//游戏界面

    @property( { displayName: '游戏状态', type: Boolean } )
    IsFailed: boolean = false;//是否失败

    onEnable ()
    {
        Messager.AddListener( 'gameOver', this, this.GameOver );
    }

    onDisable ()
    {
        Messager.RemoveListener( 'gameOver', this, this.GameOver );
    }

    GameOver ( isfailed: boolean )
    {
        this.IsFailed = isfailed;
        if ( isfailed ) //游戏失败
        {
            GameManager.Instance.IsStart = false;
            PlayerCtrl.Instance.Play( PlayerState.死亡 );
            ResMgr.loadPrefab( Config.Path.FailedPanel, ( obj: Prefab ) =>
            {
                PoolManager.getNode( obj, this.node ) as Node;
            } );
            AudioMgr.Instance.失败结算.Play();
        }
        else //游戏通关
        {
            AudioMgr.Instance.胜利结算.Play();
            GameData.Coin += this.gamePanel.coin * Config.Rate;
            ResMgr.loadPrefab( Config.Path.RewardPanel, ( obj: Prefab ) =>
            {
                PoolManager.getNode( obj, this.node ) as Node;
            } );
        }
    }
}