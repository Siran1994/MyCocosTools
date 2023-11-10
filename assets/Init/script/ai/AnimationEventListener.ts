import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 动画监听器
 */
@ccclass( 'AnimationEventListener' )
export class AnimationEventListener extends Component
{
    atk ()
    {
        this.node.parent?.emit( "atk" );
    }

    die ()
    {
        this.node.parent?.emit( "die" );
    }
}

