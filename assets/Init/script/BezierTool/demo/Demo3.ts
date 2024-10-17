import { _decorator, Component, Node, Vec3, instantiate } from 'cc';
import Bezier from '../scripts/Bezier';
const { ccclass, executeInEditMode, property } = _decorator;
@ccclass( 'Demo3' )
@executeInEditMode
export default class Demo3 extends Component
{
    @property( Bezier )
    bezier: Bezier = null;
    @property( Node )
    node1: Node | null = null;

    position1: Vec3 | null = null;
    isFire = false;
    delta = 0;

    protected onLoad (): void
    {
        // let A = new Vec3(-100,0,0);
        // let B = new Vec3(100,0,0);
        // let C = new Vec3(-10,-100,0);
        // let pos = this.bezier.calcMirrorD(A,B,C);
        // console.log("POS:",pos);
        this.position1 = this.node1.position;
    }

    onBtnFire ()
    {
        this.isFire = !this.isFire;
    }

    emit ()
    {
        for ( let i = 0; i < 10; i++ )
        {
            let newNode = instantiate( this.node1 );
            newNode.parent = this.node;
            this.bezier.startMove2( newNode, 1, this.onBezierAnimFinish, this );
        }
    }

    update ( dt )
    {
        if ( this.isFire )
        {
            this.delta -= dt;
            if ( this.delta <= 0 )
            {
                this.delta = 0.03;
                this.emit();
            }
        }
    }

    onBezierAnimFinish ( node: Node )
    {
        node.destroy();
    }
}