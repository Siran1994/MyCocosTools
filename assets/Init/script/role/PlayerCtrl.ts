import { _decorator, Component, SkeletalAnimation, Node, ParticleSystem } from 'cc';
import DOTweenAnimation from '../animation/DOTweenAnimation';
import { AniState, HeroType, PropType } from '../data/Enum';
import { AudioMgr } from '../manager/AudioMgr';
import { GameManager } from '../manager/GameManager';
import { Messager } from '../manager/Messager';
import { Utils } from '../tool/Utils';
import { AnimationComponent } from 'cc';

const { ccclass, property } = _decorator;
@ccclass( 'PlayerCtrl' )
export class PlayerCtrl extends Component 
{
    public static Instance: PlayerCtrl = null!;
    onLoad ()
    {
        PlayerCtrl.Instance = this;
    }

    @property( { type: AniState } )
    state: AniState = AniState.待机;

    @property( { type: AnimationComponent } )
    anmator: AnimationComponent = null;

    @property( Node )
    Effects: Node[] = [];

    start ()
    {
        for ( let i = 0; i < this.Effects.length; i++ )
            this.Effects[ i ].active = false;
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
                GameManager.Instance.Play( this.anmator, AniState.受击 );
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

    PlayNextAni ( delay: number )
    {
        GameManager.Instance.Speed -= 2;
        Utils.DelayCallBack( delay, () =>
        {
            GameManager.Instance.Speed += 2;
            if ( GameManager.Instance.IsStart )
                GameManager.Instance.Play( this.anmator, AniState.奔跑 );
            else
                GameManager.Instance.Play( this.anmator, AniState.待机 );
        } );
    }

    ShowEffect ( index: number, isHasPar = false )//特效展示
    {
        if ( isHasPar )
        {
            this.Effects[ index ].active = true;
            var effcets = this.Effects[ index ].getComponentsInChildren( ParticleSystem );
            for ( let index = 0; index < effcets.length; index++ )
                effcets[ index ].play();
        }
        else
        {
            this.Effects[ index ].active = true;
            this.Effects[ index ].getComponent( ParticleSystem ).play();
        }
    }
}