import { _decorator, Component, Prefab, Node } from 'cc';
import { AudioMgr } from './AudioMgr';
import { GamePanel } from '../panel/GamePanel';
import { PlayerState } from '../data/Enum';
import { MainPanel } from '../panel/MainPanel';
import { PlayerCtrl } from '../role/PlayerCtrl';
import { Utils } from '../tool/Utils';
import { GameManager } from './GameManager';
import { Messager } from './Messager';
import { PoolManager } from './PoolManager';
import { ResMgr } from './ResMgr';

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
    mainPanel: MainPanel;//主界面

    @property( GamePanel )
    gamePanel: GamePanel = null;

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
            Utils.DelayCallBack( 1, () =>
            {
                PoolManager.putNodeByName( 'Canvas/GamePanel' );
                ResMgr.loadPrefab( 'prefab/panel/FailedPanel', ( obj: Prefab ) =>
                {
                    PoolManager.getNode( obj, this.node ) as Node;
                } );
                AudioMgr.Instance.失败结算.Play();
            } );
        }
        else //游戏通关
        {
            Utils.DelayCallBack( 2, () =>
            {
                ResMgr.loadPrefab( 'prefab/panel/RewardPanel', ( obj: Prefab ) =>
                {
                    PoolManager.getNode( obj, this.node ) as Node;
                } );
                AudioMgr.Instance.胜利结算.Play();
            } );
        }
    }
}