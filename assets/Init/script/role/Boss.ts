import { _decorator, Component, Node, ParticleSystem, SkeletalAnimation, Vec3 } from 'cc';
import { GameManager } from '../manager/GameManager';
import { Utils } from '../tool/Utils';
import { AudioMgr } from '../manager/AudioMgr';
import { BossState } from '../data/Enum';
import { Messager } from '../manager/Messager';
const { ccclass, property } = _decorator;

@ccclass( 'Boss' )
export class Boss extends Component
{
    public static Instance: Boss = null!;
    onLoad ()
    {
        Boss.Instance = this;
    }

    @property( { type: BossState } )
    state: BossState = BossState.战架;

    @property( { type: SkeletalAnimation } )
    anmator: SkeletalAnimation;

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
        Messager.AddListener( 'atkStart', this, this.atkStart );
        Messager.AddListener( 'PlayerAtkOver', this, this.PlayerAtkOver );
    }
    onDisable ()
    {
        Messager.RemoveListener( 'atkStart', this, this.atkStart );
        Messager.RemoveListener( 'PlayerAtkOver', this, this.PlayerAtkOver );
    }

    atkStart ()
    {
        if ( GameManager.Instance.PlayerPower < GameManager.Instance.BossPower )
            this.PlayNextAni( 0, 2 );
        else//交战
        {
            let index = Math.floor( Math.random() * 2 );
            this.PlayNextAni( 0, index );
            this.schedule( this.AutoAtk, 1 );
        }
    }
    onDestroy ()
    {
        this.unschedule( this.AutoAtk );
    }
    AutoAtk ()
    {
        let index = Math.floor( Math.random() * 2 );
        this.PlayNextAni( 0, index );
    }
    CancelAutoAtk ( isfinal = false )
    {
        this.unschedule( this.AutoAtk );
        if ( isfinal )
        {
            Utils.DelayCallBack( 1.2, () =>
            {
                this.isOver = true;
                this.Play( BossState.战架 );
                this.PlayNextAni( 0, 2 );
            } );
        }
    }
    PlayerAtkOver ( isfinal: boolean )
    {
        if ( isfinal )//释放处决
        {
            this.unschedule( this.AutoAtk );
            Messager.Broadcast( 'bossFlyAni' );
        }
        else//普通攻击
        {
            this.Play( BossState.受击 );
            this.isOver = false;
            Utils.DelayCallBack( 0.5, () => { this.isOver = true; this.Play( BossState.战架 ); } );
        }
    }

    BossFlyAni ( lastTime: number )//Boss飞行动画
    {
        this.Play( BossState.开始飞 );
        Utils.DelayCallBack( 0.5, () =>
        {
            this.Play( BossState.飞行中 );
        } );
        Utils.DelayCallBack( lastTime, () =>
        {
            this.Play( BossState.死亡 );
        } );
    }
    Play ( state: BossState )
    {
        switch ( state )
        {
            case BossState.战架:
                this.anmator.crossFade( 'read', 0.3 );
                break;
            case BossState.轻击:
                this.anmator.crossFade( 'punch', 0.3 );
                break;
            case BossState.重击:
                this.anmator.crossFade( 'thump', 0.3 );
                break;
            case BossState.终结:
                this.anmator.crossFade( 'final', 0.3 );
                break;
            case BossState.受击:
                this.anmator.crossFade( 'hit', 0.3 );
                this.schedule( this.AutoAtk, 2 );
                break;
            case BossState.开始飞:
                this.anmator.crossFade( 'fly', 0.3 );
                break;
            case BossState.飞行中:
                this.anmator.crossFade( 'flying', 0.3 );
                break;
            case BossState.死亡:
                this.anmator.crossFade( 'die', 0.3 );
                break;
        }
    }

    PlayNextAni ( delay: number, index: number )
    {
        if ( this.isOver == false )
            return;
        Utils.DelayCallBack( delay, () =>
        {
            switch ( index )
            {
                case 0:
                    if ( this.isOver )
                    {
                        this.isOver = false;
                        this.Play( BossState.轻击 );
                        AudioMgr.Instance.Boss打击.Play();
                        Utils.DelayCallBack( 0.35, () => { this.PlayEffect( 0 ); Messager.Broadcast( 'addProgress', 'boss' ); } );
                        Utils.DelayCallBack( 0.6, () => { Messager.Broadcast( 'BossAtkOver', false ); } );
                        Utils.DelayCallBack( 0.7, () => { this.isOver = true; this.Play( BossState.战架 ); } );
                    }
                    break;
                case 1:
                    if ( this.isOver )
                    {
                        this.isOver = false;
                        this.Play( BossState.重击 );
                        AudioMgr.Instance.Boss打击.Play();
                        Utils.DelayCallBack( 0.7, () => { this.PlayEffect( 1 ); Messager.Broadcast( 'addProgress', 'boss' ); } );
                        Utils.DelayCallBack( 0.9, () => { Messager.Broadcast( 'BossAtkOver', false ); } );
                        Utils.DelayCallBack( 1, () => { this.isOver = true; this.Play( BossState.战架 ); } );
                    }
                    break;
                case 2:
                    this.Play( BossState.终结 );
                    AudioMgr.Instance.Boss打击.Play();
                    Utils.DelayCallBack( 1, () => { this.PlayEffect( 2 ); } );
                    Utils.DelayCallBack( 1.5, () => { Messager.Broadcast( 'BossAtkOver', true ); } );
                    Utils.DelayCallBack( 1.5, () => { this.Play( BossState.战架 ); } );
                    break;
            }
        } );
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
}