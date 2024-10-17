import { _decorator, Component, Node, Vec3 } from 'cc';
import Bezier from '../scripts/Bezier';
const { ccclass, executeInEditMode, property } = _decorator;

@ccclass( 'Demo1' )
@executeInEditMode
export default class Demo1 extends Component
{
    @property( Bezier )
    bezier: Bezier = null;
    @property( Node )
    SpriteStart: Node | null = null;
    @property( Node )
    SpriteEnd: Node | null = null;

    private ori: Vec3 = new Vec3();

    protected onLoad (): void
    {
        this.ori.set( this.SpriteStart.position );
    }

    onBtnFire ()
    {
        this.bezier.startMove( this.SpriteStart, this.SpriteEnd, 1.5, this.onBezierAnimFinish, this );
    }

    onBezierAnimFinish ()
    {
        this.SpriteStart.setPosition( this.ori );
        console.log( '动画完毕' );
    }
}
