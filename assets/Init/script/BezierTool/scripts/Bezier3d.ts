import { _decorator, Component, Node, Vec3, tween, bezier, __private, } from 'cc';
import { EDITOR } from 'cc/env';
import { Line3D } from './Line3D';
const { ccclass, executeInEditMode, property } = _decorator;

@ccclass( 'Bezier3d' )
@executeInEditMode( true )
export class Bezier3d extends Component
{
    @property( { type: Node, tooltip: '起始点追踪器' } )
    p1Tracker: Node | null = null;

    @property( { type: Node, tooltip: '终止点追踪器' } )
    p2Tracker: Node | null = null;

    @property( {
        tooltip: '运行时显示Bezier曲线', visible: function ()
        {
            let line = this.line3D as Line3D;
            if ( this.debug )
            {
                line.enabled = true;
            } else
            {
                line.positions = [];
                line.enabled = false;
            }
            return true;
        },
    } )
    debug = false;

    p1: Node | null = null;
    c1: Node | null = null;
    c2: Node | null = null;
    p2: Node | null = null;
    line3D: Line3D | null = null;

    protected onLoad (): void
    {
        this.p1 = this.node.getChildByName( 'p1' );
        this.c1 = this.node.getChildByName( 'c1' );
        this.c2 = this.node.getChildByName( 'c2' );
        this.p2 = this.node.getChildByName( 'p2' );
        this.line3D = this.node.getComponent( Line3D );

        if ( !EDITOR )
        {
            this.p1.active = false;
            this.c1.active = false;
            this.c2.active = false;
            this.p2.active = false;
        }
    }

    startMove ( node: Node, c1: Vec3, c2: Vec3, nodeEnd: Node, time: number, callback: Function = null, obsv: any = null )
    {
        //起始位置
        console.log( "startMove 3d draw" );
        let startPos = node.position;
        let endPos = nodeEnd.position;

        let points = [ startPos, c1, c2, endPos ];//P1,C1 ,C2 P2
        node.setPosition( points[ 0 ] );

        let progressX = function ( start: number, end: number, current: number, t: number )
        {
            current = bezier( start, points[ 1 ].x, points[ 2 ].x, end, t );
            return current;
        };
        let progressY = function ( start: number, end: number, current: number, t: number )
        {
            current = bezier( start, points[ 1 ].y, points[ 2 ].y, end, t );
            return current;
        };

        let progressZ = function ( start: number, end: number, current: number, t: number )
        {
            current = bezier( start, points[ 1 ].z, points[ 2 ].z, end, t );
            return current;
        };

        tween( startPos )
            .parallel(
                tween().to( time, { x: points[ 3 ].x }, {
                    progress: progressX, easing: "smooth", onUpdate: () =>
                    {
                        node.setPosition( startPos );
                    }
                } ),
                tween().to( time, { y: points[ 3 ].y }, {
                    progress: progressY, easing: "smooth", onUpdate: () =>
                    {
                        node.setPosition( startPos );
                    }
                } ),

                tween().to( time, { z: points[ 3 ].z }, {
                    progress: progressZ, easing: "smooth", onUpdate: () =>
                    {
                        node.setPosition( startPos );
                    }
                } ),
            )
            .call( () =>
            {
                if ( callback )
                    callback.call( obsv, node );
            } )
            .start();


        //控制旋转
        //720是旋转角度
        // tween(startAngle).to( this.playTime, {z: 720}, {onUpdate: ()=>{
        //     fruit.eulerAngles = startAngle;
        // }}).start();
    }


    updateTracker ()
    {
        if ( this.p1Tracker )
        {
            this.p1.setPosition( this.p1Tracker.position );
        }
        if ( this.p2Tracker )
        {
            this.p2.setPosition( this.p2Tracker.position );
        }
    }

    update ( dt: number )
    {

        if ( EDITOR )
        {
            // 编辑器下
            this.updateTracker();
            this.draw();
        } else
        {
            // 运行环境
            if ( this.debug )
            {
                this.draw();
            }
        }
    }

    private draw ()
    {
        if ( !this.debug ) return;
        if ( !this.p1 || !this.c1 || !this.c2 || !this.p2 )
        {
            return;
        }
        let p1 = this.p1.position;
        let c1 = this.c1.position;
        let c2 = this.c2.position;
        let p2 = this.p2.position;
        this.line3D.bezierCurveTo( [ p1, c1, c2, p2 ] );
    }

}