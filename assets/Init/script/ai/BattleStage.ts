import { _decorator, BoxCollider, Component, instantiate, Node, tween, Vec3 } from 'cc';
import { Messager } from '../manager/Messager';
import { PrefabManager } from '../manager/PrefabManager';
import { GameManager } from '../manager/GameManager';
import { ItemType } from '../data/Enum';
import { UiManager } from '../manager/UiManager';
import { PlayerItem } from './PlayerItem';
import { Utils } from '../tool/Utils';
import { PlayerPrefs } from '../data/PlayerPrefs';
import { AudioMgr } from '../manager/AudioMgr';
import { PlayerCtrl } from '../role/PlayerCtrl';
const { ccclass, property } = _decorator;

@ccclass( 'EnemyInfo' )
class EnemyInfo
{
    @property( { type: ItemType } )
    enemyType: ItemType = ItemType.None;

    @property( { type: Number } )
    enemyCount: number = 1;
}

@ccclass( 'BattleStage' )
export class BattleStage extends Component
{
    public static Instance: BattleStage = null!;
    onLoad ()
    {
        BattleStage.Instance = this;
    }

    @property( { displayName: '胜利特效', type: Node } )
    finishEffect: Node = null;//胜利特效

    @property( { displayName: '玩家排列', type: Node } )
    PlayerPos: Node = null;

    @property( { displayName: '指示框', type: Node } )
    PosTip: Node = null;

    @property( { displayName: '玩家排列', type: Node } )
    PlayerPosList: Node[] = [];

    @property( { displayName: '敌人排列', type: Node } )
    EnemyPos: Node[] = [];

    @property( EnemyInfo )
    enemyInfo: EnemyInfo[] = [];

    start ()
    {
        this.finishEffect.active = false;
        this.initPlayerItem();
    }

    initPlayerItem ()
    {
        for ( let i = 0; i < this.enemyInfo.length; i++ )//初始化敌人
        {
            setTimeout( () =>
            {
                let go = instantiate( PrefabManager.get( ItemType[ this.enemyInfo[ i ].enemyType ].toString(), PrefabManager.PlayerMap ) );
                let info = go.getComponent( PlayerItem );
                info.HideAres();
                info.player.aiBase.isEnemy = true;
                go.parent = this.EnemyPos[ i ];
                go.eulerAngles = new Vec3( 0, 90, 0 );

            }, i * 300 );
        }

        Utils.DelayCallBack( 0.5, () =>
        {
            for ( let i = 0; i < this.PlayerPosList.length; i++ )//初始化玩家
            {
                setTimeout( () =>
                {

                    if ( PlayerPrefs.GetString( i.toString(), '' ) != '' )
                    {
                        let go = instantiate( PrefabManager.get( PlayerPrefs.GetString( i.toString(), '' ), PrefabManager.PlayerMap ) );
                        let info = go.getComponent( PlayerItem );
                        info.HideAres();
                        go.parent = this.node;
                        go.worldPosition = new Vec3( 0, BattleStage.Instance.PlayerPos.worldPosition.y, BattleStage.Instance.PlayerPos.worldPosition.z );
                        info.player.aiBase.isEnemy = false;
                        tween( go ).to( 0.1, { worldPosition: this.PlayerPosList[ i ].worldPosition, }, { easing: "linear" } ).call( () =>
                        {
                            go.parent = this.PlayerPosList[ i ];
                            this.PlayerPosList[ i ].name = go.name;
                            go.position = new Vec3( 0, -0.5, 0 );
                            go.eulerAngles = new Vec3( 0, -90, 0 );
                            Messager.Broadcast( 'CheckPlayerItem', go.name );
                        } )
                            .start();
                    }

                }, i * 400 );
            }
        } )
    }

    onEnable ()
    {
        Messager.AddListener( 'FightReady', this, this.FightReady );
        Messager.AddListener( 'CheckPlayerItem', this, this.CheckPlayerItem );
    }
    onDisable ()
    {
        Messager.RemoveListener( 'FightReady', this, this.FightReady );
        Messager.RemoveListener( 'CheckPlayerItem', this, this.CheckPlayerItem );
    }

    FightReady ()
    {
        // PlayerCtrl.Instance.CreateBody( this.PlayerPosList, () =>
        // {
        //     UiManager.Instance.gamePanel.node.active = false;
        //     UiManager.Instance.fightPanel.ShowPanel();
        //     this.CheckPlayerItem( '梨子' );
        // } );
    }

    FightStart ()
    {
        Messager.Broadcast( 'FightStart' );//开始战斗      
        //AudioMgr.Instance.战斗背景乐.playMusic();
    }


    SaveData ()
    {
        for ( let i = 0; i < this.PlayerPosList.length; i++ )
        {
            if ( this.PlayerPosList[ i ].children.length > 0 )
            {
                PlayerPrefs.SetString( i.toString(), this.PlayerPosList[ i ].name );
            }
            else
            {
                PlayerPrefs.SetString( i.toString(), '' );
            }
        }
    }

    GetPosCount ()
    {
        let count = 0;
        for ( let i = 0; i < this.PlayerPosList.length; i++ )
        {
            if ( this.PlayerPosList[ i ].children.length == 0 )
                count += 1;
        }
        return count;
    }

    CheckPlayerItem ( target: string )//检测可以合成的提示特效
    {
        Utils.DelayCallBack( 1, () =>
        {
            let count = 0;
            let nums = [];
            for ( let i = 0; i < this.PlayerPosList.length; i++ )
            {
                if ( this.PlayerPosList[ i ].name == target )
                {
                    count += 1;
                    nums.push( i );
                    this.PlayerPosList[ i ].children[ 0 ]?.emit( "hideEffect" );
                }
            }
            Utils.DelayCallBack( 0.5, () =>
            {
                if ( count > 1 )
                {
                    for ( let j = 0; j < nums.length; j++ )
                        this.PlayerPosList[ nums[ j ] ].children[ 0 ]?.emit( "showEffect", 0, true );
                }
                // else
                // {
                //     if ( this.PlayerPosList[ nums[ 0 ] ].children.length > 0 )
                //         this.PlayerPosList[ nums[ 0 ] ].children[ 0 ]?.emit( "hideEffect" );
                // }
            } );
        } );
    }

    getPlayerTarget ()
    {
        let nodes = [];
        for ( let i = 0; i < this.PlayerPosList.length; i++ )
        {
            if ( this.PlayerPosList[ i ].children.length > 0 )
            {
                nodes.push( this.PlayerPosList[ i ].children[ 0 ] );
            }
        }
        if ( nodes.length == 0 )
        {
            Messager.Broadcast( 'gameOver', true );
            return;
        }
        return nodes;
    }

    getEnemyTarget ()
    {
        let nodes = [];
        for ( let i = 0; i < this.EnemyPos.length; i++ )
        {
            if ( this.EnemyPos[ i ].children.length > 0 )
            {
                nodes.push( this.EnemyPos[ i ].children[ 0 ] );
            }
        }
        if ( nodes.length == 0 )
        {
            Messager.Broadcast( 'gameOver', false );
            BattleStage.Instance.SaveData();
            BattleStage.Instance.finishEffect.active = true;
            //AudioMgr.Instance.胜利欢呼.Play();
            return;
        }
        return nodes;
    }
}