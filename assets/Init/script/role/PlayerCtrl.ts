import { _decorator, Component, SkeletalAnimation, Node, ParticleSystem, Vec3 } from 'cc';
import DOTweenAnimation from '../animation/DOTweenAnimation';
import { AniType, HeroType, PropType } from '../data/Enum';
import { AudioMgr } from '../manager/AudioMgr';
import { GameManager } from '../manager/GameManager';
import { Messager } from '../manager/Messager';
import { Utils } from '../tool/Utils';



const { ccclass, property } = _decorator;
@ccclass( 'PlayerCtrl' )
export class PlayerCtrl extends Component 
{
    public static Instance: PlayerCtrl = null!;
    onLoad ()
    {
        PlayerCtrl.Instance = this;
    }

    @property( { type: AniType } )
    state: AniType = AniType.待机;

    @property( { type: SkeletalAnimation } )
    anmator: SkeletalAnimation;

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

    PropItemCheck ( heroType: HeroType, propType: PropType, power: number )
    {
        switch ( propType )
        {
            case PropType.宝石:
                Messager.Broadcast( 'coinDoFly' );
                Messager.Broadcast( 'updateCoin', 2 );
                this.ShowEffect( 0 );
                AudioMgr.Instance.吃到钻石.Play();
                break;
            case PropType.陷阱:
                this.Play( AniType.受击 );
                this.ShowEffect( 1 );
                AudioMgr.Instance.玩家受击.Play();
                break;
            case PropType.头:
                DOTweenAnimation.ScaleLoop( this.node, 1.2, 1 );
                break;
            case PropType.结束:
                Messager.Broadcast( 'battleStart' );
                AudioMgr.Instance.到达终点.Play();
                break;
        }
    }


    Play ( state: AniType )
    {
        switch ( state )
        {
            case AniType.待机:
                this.anmator.crossFade( 'idle', 0.3 );
                break;
            case AniType.行走:
                this.anmator.crossFade( 'walk', 0.3 );
                break;
            case AniType.奔跑:
                this.anmator.crossFade( 'run', 0.3 );
                break;
            case AniType.起跳:
                this.anmator.crossFade( 'jump', 0.3 );
                break;
            case AniType.受击:
                this.anmator.crossFade( 'hit', 0.3 );
                this.PlayNextAni( 0.5 );
                break;
            case AniType.死亡:
                this.anmator.crossFade( 'die', 0.3 );
                break;
            case AniType.胜利:
                this.anmator.crossFade( 'win', 0.3 );
                break;
        }
    }

    PlayNextAni ( delay: number )
    {
        GameManager.Instance.Speed -= 2;
        Utils.DelayCallBack( delay, () =>
        {
            GameManager.Instance.Speed += 2;
            if ( GameManager.Instance.IsStart )
                this.Play( AniType.奔跑 );
            else
                this.Play( AniType.待机 );
        } );
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
}