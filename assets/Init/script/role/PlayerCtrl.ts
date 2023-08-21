import { _decorator, Component, SkeletalAnimation, Node, ParticleSystem, Vec3, tween } from 'cc';
import { Utils } from '../tool/Utils';
import { GameManager } from '../manager/GameManager';
import { UiManager } from '../manager/UiManager';
import { AudioMgr } from '../manager/AudioMgr';
import { DecorateCtrl } from './DecorateCtrl';
import { PlayerState, HeroType, PropType } from '../data/Enum';
import { Messager } from '../manager/Messager';
import { Config } from '../data/Config';

const { ccclass, property } = _decorator;
@ccclass( 'PlayerCtrl' )
export class PlayerCtrl extends Component 
{
    public static Instance: PlayerCtrl = null!;
    onLoad ()
    {
        PlayerCtrl.Instance = this;
    }

    @property( { type: PlayerState } )
    state: PlayerState = PlayerState.待机;

    @property( { type: SkeletalAnimation } )
    anmator: SkeletalAnimation;

    @property( { type: DecorateCtrl } )
    decorateCtrl: DecorateCtrl;

    @property( Node )
    ChangeGreen: Node = null;//变装特效

    @property( Node )
    ChangeRed: Node = null;//变装特效

    @property( Node )
    HitEffect: Node = null;//吃钻石特效

    @property( Node )
    LoseCoin: Node = null;//丢失特效

    @property( Node )
    Smoke: Node = null;//烟雾特效

    start ()
    {
        this.Play( this.state );
        this.ChangeGreen.active = false;
        this.ChangeRed.active = false;
        this.HitEffect.active = false;
        this.LoseCoin.active = false;
    }
    onEnable ()
    {
        Messager.AddListener( 'PropItem', this, this.PropItemCheck );
    }
    onDisable ()
    {
        Messager.RemoveListener( 'PropItem', this, this.PropItemCheck );
    }

    Play ( state: PlayerState )
    {
        switch ( state )
        {
            case PlayerState.待机:
                this.anmator.crossFade( 'idle', 0.3 );
                break;
            case PlayerState.慢跑:
                this.anmator.crossFade( 'walk', 0.3 );
                break;
            case PlayerState.快跑:
                this.anmator.crossFade( 'run', 0.3 );
                break;
            case PlayerState.战架:
                this.anmator.crossFade( 'read', 0.3 );
                break;
            case PlayerState.轻击:
                this.anmator.crossFade( 'punch', 0.3 );
                break;
            case PlayerState.重击:
                this.anmator.crossFade( 'thump', 0.3 );
                break;
            case PlayerState.受击:
                this.anmator.crossFade( 'hit', 0.3 );
                this.PlayNextAni( 0.5 );
                break;
            case PlayerState.终结:
                this.anmator.crossFade( 'final', 0.3 );
                break;
            case PlayerState.死亡:
                this.anmator.crossFade( 'die', 0.3 );
                break;
            case PlayerState.胜利:
                this.anmator.crossFade( 'win', 0.3 );
                break;
        }
    }

    PlayNextAni ( delay: number )
    {
        Config.Speed -= 2;
        Utils.DelayCallBack( delay, () =>
        {
            Config.Speed += 2;
            if ( GameManager.Instance.IsStart )
            {

                if ( UiManager.Instance.gamePanel.isCollected )
                    this.Play( PlayerState.快跑 );
                else
                    this.Play( PlayerState.慢跑 );
            }
            else
            {
                if ( UiManager.Instance.IsFailed )
                    this.Play( PlayerState.受击 );
                else
                    this.Play( PlayerState.待机 );
            }
        } );
    }

    PropItemCheck ( heroType: HeroType, propType: PropType, power: number )
    {
        switch ( propType )
        {
            case PropType.钻石:
                Messager.Broadcast( 'updateCoin', 1 );
                this.ShowEffect( 0 );
                AudioMgr.Instance.吃到钻石.Play();
                Messager.Broadcast( 'coinDoFly' );
                break;
            case PropType.宝石:
                Messager.Broadcast( 'updatePower', power );
                this.ShowEffect( 0 );
                AudioMgr.Instance.吃到钻石.Play();
                break;
            case PropType.手套:
                Messager.Broadcast( 'updatePower', power );
                this.ShowEffect( 0 );
                AudioMgr.Instance.吃到钻石.Play();
                break;
            case PropType.陷阱:
                Messager.Broadcast( 'updatePower', power );
                this.Play( PlayerState.受击 );
                this.ShowEffect( 1 );
                AudioMgr.Instance.玩家受击.Play();
                break;
            case PropType.跳板:
                this.Play( PlayerState.受击 );
                this.ShowEffect( 1 );
                AudioMgr.Instance.玩家受击.Play();
                break;
            case PropType.头:
            case PropType.右手:
            case PropType.左手:
            case PropType.身体:
            case PropType.右腿:
            case PropType.左腿:
                this.decorateCtrl.ChangeSkin( heroType, propType );
                this.CheckIsTarget( heroType, propType, power );
                this.PlayAni();
                break;
            case PropType.结束:
                Messager.Broadcast( 'battleStart' );
                AudioMgr.Instance.到达终点.Play();
                break;
        }
    }

    ShowEffect ( index: number, isActive = false )//特效展示
    {
        switch ( index )
        {
            case 0://吃钻石
                this.HitEffect.active = true;
                this.HitEffect.getComponent( ParticleSystem ).play();
                break;
            case 1://掉金币
                this.LoseCoin.active = true;
                this.LoseCoin.getComponent( ParticleSystem ).play();
                break;
            case 2://变装
                this.ChangeGreen.active = true;
                var effcets = this.ChangeGreen.getComponentsInChildren( ParticleSystem );
                for ( let index = 0; index < effcets.length; index++ )
                    effcets[ index ].play();
                break;
            case 3://烟雾
                this.Smoke.active = true;
                this.Smoke.getComponent( ParticleSystem ).play();
                break;
            case 4://变装
                this.ChangeRed.active = true;
                var effcets = this.ChangeRed.getComponentsInChildren( ParticleSystem );
                for ( let index = 0; index < effcets.length; index++ )
                    effcets[ index ].play();
                break;
        }
        if ( isActive )
            this.Smoke.active = false;
    }

    CheckIsTarget ( heroType: HeroType, propType: PropType, power: number )//检查是否是目标收集物
    {
        let cur_heroType = GameManager.Instance.GetHeroType();
        if ( cur_heroType == heroType )//匹配
        {
            this.ShowEffect( 2 );
            AudioMgr.Instance.吃到服装.Play();
            Messager.Broadcast( 'updatePower', power );
            Messager.Broadcast( 'showPartUi', heroType, propType, true );
        }
        else
        {
            this.ShowEffect( 4 );
            AudioMgr.Instance.玩家受击.Play();
            Messager.Broadcast( 'updatePower', -power );
            Messager.Broadcast( 'showPartUi', heroType, propType, false );
            UiManager.Instance.gamePanel.isCollected = false;
            PlayerCtrl.Instance.ShowEffect( 3, true );
        }
    }

    PlayAni ()
    {
        tween( this.node )
            .sequence
            (
                tween().to( 0.12, { scale: new Vec3( 1.35, 1.35, 1.35 ), }, { easing: "linear" } ),
                tween().to( 0.1, { scale: new Vec3( 1, 1, 1 ), }, { easing: "linear" } ),
            )
            .start();
    }
}