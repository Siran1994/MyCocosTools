import { _decorator, Component, Node, ParticleSystem } from 'cc';
const { ccclass, property } = _decorator;

@ccclass( 'roleBase' )
export class roleBase extends Component
{
    @property( Node )
    Effects: Node[] = [];

    Init ()
    {
        for ( let i = 0; i < this.Effects.length; i++ )
            this.Effects[ i ].active = false;
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

    HideEffect ( index: number )
    {
        this.Effects[ index ].active = false;
    }
}

