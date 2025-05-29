import { _decorator, Component, Node, sp } from 'cc';
const { ccclass, property } = _decorator;

@ccclass( 'SpineTool' )
export class SpineTool extends Component
{
    @property( sp.Skeleton )
    animator: sp.Skeleton = null;

    onLoad ()
    {
        if ( this.animator == null )
            this.animator = this.getComponent( sp.Skeleton );
        this.animator.setCompleteListener( ( event ) =>
        {
            if ( event.animation.name == 'donhua' )
            {
                this.Play( this.animator, 'idle', true );
            }
        } );
    }

    onEnable ()
    {
        this.Play( this.animator, 'donhua' );
    }

    Play ( anmator: sp.Skeleton, state: string, isLoop = false )//播放动作
    {
        anmator.clearTracks();
        anmator.timeScale = 1.5;
        anmator.setAnimation( 0, state, isLoop );
    }
}

