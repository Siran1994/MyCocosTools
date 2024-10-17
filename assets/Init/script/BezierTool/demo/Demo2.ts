import { _decorator, Component, Node, v3, Vec3 } from 'cc';
import { Bezier3d } from '../scripts/Bezier3d';
const { ccclass, executeInEditMode, property } = _decorator;

@ccclass( 'Demo2' )
@executeInEditMode
export default class Demo2 extends Component
{
    @property( Node )
    SpriteStart: Node | null = null;
    @property( Node )
    SpriteEnd: Node | null = null;
    @property( Bezier3d )
    bezier: Bezier3d = null;

    private ori: Vec3 = new Vec3();

    protected onLoad (): void
    {
        this.ori.set( this.SpriteStart.position );
        this.scheduleOnce( this.onBtnFire, 1 );
    }

    onBtnFire ()
    {
        this.bezier.startMove( this.SpriteStart, v3( -7.5, 0, -7.5 ), v3( -7.5, 0, 7.5 ), this.SpriteEnd, 3, this.onBezierAnimFinish, this );
    }

    onBezierAnimFinish ()
    {
        console.log( '动画完毕' );
        this.SpriteStart.setPosition( this.ori );
        this.scheduleOnce( this.onBtnFire, 1 );
    }
}
