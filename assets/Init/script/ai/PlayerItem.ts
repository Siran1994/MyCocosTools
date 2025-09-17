import { _decorator, Component, Node, ParticleSystem, Vec3 } from 'cc';
import { ItemType } from '../data/Enum';
import { Messager } from '../manager/Messager';
import { Player } from '../ai/Player';

const { ccclass, property } = _decorator;

@ccclass( 'PlayerItem' )
export class PlayerItem extends Component
{
    @property( { displayName: '水果类型', type: ItemType } )
    fruitType: ItemType = ItemType.None;

    @property( { type: Player } )
    player: Player = null;

    @property( {
        type: Node, visible: function ( this: PlayerItem )
        {
            return this.fruitType <= ItemType.None;
        }
    } )
    arse: Node = null;

    @property( Node )
    Effects: Node[] = [];

    start ()
    {
        this.HideEffect();
    }

    onEnable ()
    {
        Messager.AddListener( 'ToBig', this, this.ToBig );
        Messager.AddListener( 'Select', this, this.Select );
        Messager.AddListener( 'FightStart', this, this.FightStart );
        this.node.on( "atk", this.atk, this );
        this.node.on( "hideEffect", this.HideEffect, this );
        this.node.on( "showEffect", this.ShowEffect, this );
    }
    onDisable ()
    {
        Messager.RemoveListener( 'ToBig', this, this.ToBig );
        Messager.RemoveListener( 'Select', this, this.Select );
        Messager.RemoveListener( 'FightStart', this, this.FightStart );
        this.node.off( "atk", this.atk, this );
        this.node.off( "hideEffect", this.HideEffect, this );
        this.node.off( "showEffect", this.ShowEffect, this );
    }

    ToBig ( num: number )
    {
        this.arse.scale = new Vec3( this.arse.scale.x + num, this.arse.scale.y + num, this.arse.scale.z + num );
        if ( this.arse.scale.x <= 1 )
            this.arse.scale = Vec3.ONE;
    }

    Select ( isSelect: boolean )
    {
        if ( isSelect )
            this.player.aiBase.collider.enabled = false;
        else
            this.player.aiBase.collider.enabled = true;
    }

    FightStart ()
    {
        Messager.Broadcast( 'MoveOver' );
        this.player.init();
        this.HideEffect();
    }

    ShowEffect ( index: number, isHasPar = true )//特效展示
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

    HideEffect ()
    {
        for ( let i = 0; i < this.Effects.length; i++ )
            this.Effects[ i ].active = false;
    }

    atk ()//帧事件
    {
        //AudioMgr.Instance.打击.Play();
        if ( this.fruitType <= ItemType.None )
        {
            this.ShowEffect( 2, true );
        }
    }

    HideAres ()
    {
        if ( this.arse )
            this.arse.active = false;
    }
}