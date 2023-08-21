import { _decorator, Component, find, Node, ParticleSystem, Vec3 } from 'cc';
import { PlayerState } from '../data/Enum';
import { AudioMgr } from '../manager/AudioMgr';
import { GameManager } from '../manager/GameManager';
import { Messager } from '../manager/Messager';
import { Utils } from '../tool/Utils';
import { Boss } from './Boss';
import { PlayerCtrl } from './PlayerCtrl';
const { ccclass, property } = _decorator;

@ccclass( 'BattleEffect' )
export class BattleEffect extends Component
{
    @property( { displayName: '左手点', type: Node } ) //玩家站位
    L_Pos: Node = null;

    @property( { displayName: '右手点', type: Node } ) //玩家站位
    R_Pos: Node = null;

    @property( { displayName: '头部', type: Node } ) //Boss
    H_Pos: Node = null;

    @property( { displayName: '打击特效', type: Node } ) //Boss
    HitEffect: Node = null;

    isOver = true;

    onEnable ()
    {
        Messager.AddListener( 'isAtking', this, this.AtkStart );
        Messager.AddListener( 'BossAtkOver', this, this.BossAtkOver );
    }

    onDisable ()
    {
        Messager.RemoveListener( 'isAtking', this, this.AtkStart );
        Messager.RemoveListener( 'BossAtkOver', this, this.BossAtkOver );
    }

    AtkStart ( index: number )
    {
        if ( GameManager.Instance.PlayerPower < GameManager.Instance.BossPower )
            return;
        else
        {
            Boss.Instance.CancelAutoAtk();
            switch ( index )
            {
                case 0://轻击
                    if ( this.isOver )
                    {
                        this.isOver = false;
                        this.addSpeed( 'punch' );
                        PlayerCtrl.Instance.Play( PlayerState.轻击 );
                    }
                    break;
                case 1://重击
                    if ( this.isOver )
                    {
                        this.isOver = false;
                        this.addSpeed( 'thump' );
                        PlayerCtrl.Instance.Play( PlayerState.重击 );
                    }
                    break;
                case 2://终结技               
                    PlayerCtrl.Instance.Play( PlayerState.终结 );
                    break;
            }
        }
    }

    AtkEvent ( index: number )
    {
        switch ( index )
        {
            case 0://轻击
                this.PlayEffect( 0 );
                AudioMgr.Instance.玩家打击.Play();
                Messager.Broadcast( 'PlayerAtkOver', false );
                Messager.Broadcast( 'addProgress', 'player' );
                this.isOver = true;
                break;
            case 1://重击             
                this.PlayEffect( 1 );
                AudioMgr.Instance.玩家打击.Play();
                Messager.Broadcast( 'PlayerAtkOver', false );
                Messager.Broadcast( 'addProgress', 'player' );
                this.isOver = true;
                break;//终结技  
            case 2:
                this.PlayEffect( 2 );
                AudioMgr.Instance.玩家打击.Play();
                Messager.Broadcast( 'PlayerAtkOver', true );
                break;
        }
    }

    AtkOver ()
    {
        PlayerCtrl.Instance.Play( PlayerState.战架 );
    }

    BossAtkOver ( isfinal: boolean )
    {
        if ( isfinal )//Boss处决
        {
            find( 'Canvas/FinishPanel' ).destroy();
            Messager.Broadcast( 'gameOver', true );
            PlayerCtrl.Instance.Play( PlayerState.死亡 );
        }
        else
        {
            PlayerCtrl.Instance.Play( PlayerState.受击 );
            this.isOver = false;
            Utils.DelayCallBack( 0.5, () => { this.isOver = true; PlayerCtrl.Instance.Play( PlayerState.战架 ); } );
        }
    }

    PlayEffect ( index: number )
    {
        this.HitEffect.active = true;
        switch ( index )
        {
            case 0:
                this.HitEffect.parent = this.L_Pos;
                this.HitEffect.position = Vec3.ZERO;
                break;
            case 1:
                this.HitEffect.parent = this.R_Pos;
                this.HitEffect.position = Vec3.ZERO;
                break;
            case 2:
                this.HitEffect.parent = this.H_Pos;
                this.HitEffect.position = Vec3.ZERO;
                break;
        }
        this.HitEffect.scale = new Vec3( 5, 5, 5 );
        var effcets = this.HitEffect.getComponentsInChildren( ParticleSystem );
        for ( let index = 0; index < effcets.length; index++ )
            effcets[ index ].play();
    }

    speedMultiplier: number = 1.5;
    addSpeed ( name: string )
    {
        this.speedMultiplier *= 1.08;
        const animationState = PlayerCtrl.Instance.anmator.getState( name );
        if ( animationState )
            animationState.speed = this.speedMultiplier;
    }
}