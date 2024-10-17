import { _decorator, Component, Node, Graphics, Vec3, tween, UITransform, v3, bezier } from 'cc';
import { EDITOR } from 'cc/env';
const { ccclass, executeInEditMode, property } = _decorator;

@ccclass( 'Bezier' )
@executeInEditMode
export default class Bezier extends Component
{
    @property( { type: Node, tooltip: '起始点追踪器' } )
    p1Tracker: Node | null = null;
    @property( { type: Node, tooltip: '终止点追踪器' } )
    p2Tracker: Node | null = null;
    @property( { tooltip: '是否随机' } )
    random = false;
    @property( {
        tooltip: '运行时显示Bezier曲线', visible: function ()
        {
            let line = this.g as Graphics;
            if ( this.debug )
            {
                line.lineWidth = 5;
            } else
            {
                line.lineWidth = 0;
            }
            return true;
        },
    } )
    debug = false;
    p1: Node | null = null;
    c1: Node | null = null;
    c2: Node | null = null;
    p2: Node | null = null;
    g: Graphics | null = null;

    protected onLoad (): void
    {
        this.g = this.getComponent( Graphics );
        this.p1 = this.node.getChildByName( 'p1' );
        this.c1 = this.node.getChildByName( 'c1' );
        this.c2 = this.node.getChildByName( 'c2' );
        this.p2 = this.node.getChildByName( 'p2' );
        if ( !EDITOR )
        {
            this.p1.active = false;
            this.c1.active = false;
            this.c2.active = false;
            this.p2.active = false;
        }
    }

    /**
     * 该方法支持代码传入
     * @param node 起点
     * @param nodeEnd 终点
     * @param time 时间
     * @param callback 回调
     * @param obsv 参数
     */
    startMove ( node: Node, nodeEnd: Node, time: number, callback: Function = null, obsv: any = null )
    {
        this.p1Tracker = node;
        this.p2Tracker = nodeEnd;

        this.updateTracker();

        //起始位置
        let startPos = node.position;

        let points = this.getBezierPoints( node );
        node.setPosition( points[ 0 ] );
        //起始角度
        // let startAngle = node.eulerAngles;

        // let fruitTween = tween(startPos);
        const mixX = points[ 1 ].x;
        const mixY = points[ 1 ].y;

        const maxX = points[ 2 ].x;
        const maxY = points[ 2 ].y;

        let progressX = function ( start: number, end: number, current: number, t: number )
        {
            current = bezier( start, mixX, maxX, end, t );
            return current;
        };
        let progressY = function ( start: number, end: number, current: number, t: number )
        {
            current = bezier( start, mixY, maxY, end, t );
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

    /**
     * 该方法：起点和终点在编辑器Bezier预制设置
     * @param node 运动的节点
     * @param time 时间
     * @param callback 回调
     * @param obsv 参数
     */
    startMove2 ( node: Node, time: number, callback: Function = null, obsv: any = null )
    {
        //刷新P1P2，如果没有，就是用默认的UI编辑器里的坐标
        this.updateTracker();

        //起始位置
        let startPos = node.position;

        let points = this.getBezierPoints( node );
        node.setPosition( points[ 0 ] );
        //起始角度
        // let startAngle = node.eulerAngles;

        // let fruitTween = tween(startPos);
        const mixX = points[ 1 ].x;
        const mixY = points[ 1 ].y;

        const maxX = points[ 2 ].x;
        const maxY = points[ 2 ].y;

        let progressX = function ( start: number, end: number, current: number, t: number )
        {
            current = bezier( start, mixX, maxX, end, t );
            return current;
        };
        let progressY = function ( start: number, end: number, current: number, t: number )
        {
            current = bezier( start, mixY, maxY, end, t );
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

    getBezierPoints ( node: Node )
    {
        let p1 = this.convertToNodeSpace( node, this.p1 );
        let c1 = this.convertToNodeSpace( node, this.c1 );
        let c2 = this.convertToNodeSpace( node, this.c2 );
        let p2 = this.convertToNodeSpace( node, this.p2 );
        if ( this.random )
        {
            let mc1 = this.calcMirrorPoint( p1, p2, c1 );
            c1 = this.getRandomPoint( c1, mc1 );
            let mc2 = this.calcMirrorPoint( p1, p2, c2 );
            c2 = this.getRandomPoint( c2, mc2 );
        }
        return [ v3( p1.x, p1.y, p1.z ), v3( c1.x, c1.y, c1.z ), v3( c2.x, c2.y, c2.z ), v3( p2.x, p2.y, p2.z ) ];
    }


    updateTracker ()
    {
        if ( this.p1Tracker )
        {
            let nodePos = this.convertToNodeSpace( this.p1, this.p1Tracker );
            this.p1.setPosition( nodePos );
        }
        if ( this.p2Tracker )
        {
            let nodePos = this.convertToNodeSpace( this.p2, this.p2Tracker );
            this.p2.setPosition( nodePos );
        }
    }

    update ()
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
        if ( !this.debug && !EDITOR ) return;
        if ( !this.p1 || !this.c1 || !this.c2 || !this.p2 )
        {
            this.g.clear();
            return;
        }
        let p1 = this.p1.position;
        let c1 = this.c1.position;
        let c2 = this.c2.position;
        let p2 = this.p2.position;
        this.g.clear();
        this.g.moveTo( p1.x, p1.y );
        this.g.bezierCurveTo( c1.x, c1.y, c2.x, c2.y, p2.x, p2.y );
        this.g.stroke();
    }
    /**
     * 计算p2在p1坐标系中的坐标     
     */
    private convertToNodeSpace ( p1: Node, p2: Node ): Vec3
    {
        let pos = p2.parent.getComponent( UITransform ).convertToWorldSpaceAR( p2.position );
        return p1.parent.getComponent( UITransform ).convertToNodeSpaceAR( pos );
    }
    /**
     * 已知AB构成一个向量，求C在向量AB上的镜像点D
     */
    private calcMirrorPoint ( A: Vec3, B: Vec3, C: Vec3 ): Vec3
    {
        let AB = new Vec3();
        Vec3.subtract( AB, B, A );
        let AC = new Vec3();
        Vec3.subtract( AC, C, A );

        //数量积
        let SUM = AB.dot( AC );
        //夹角公式：数量积/ (a的模*b的模)
        let radian = SUM / ( AB.length() * AC.length() );
        let tyLen = AC.length() * radian;
        let AE = AB.normalize().multiplyScalar( tyLen );
        let E = new Vec3();
        Vec3.add( E, A, AE );
        let CE = new Vec3();
        Vec3.subtract( CE, E, C );
        let CE2 = CE.multiplyScalar( 2 );
        let D = new Vec3();
        Vec3.add( D, C, CE2 );
        return D;
    }
    /**
     * 从AB两个点构成的一条线段中，随机获取一个点
     */
    private getRandomPoint ( A: Vec3, B: Vec3 ): Vec3
    {
        let AB = new Vec3();
        Vec3.subtract( AB, B, A );
        let RAC = AB.multiplyScalar( Math.random() );
        let RES = new Vec3();
        return Vec3.add( RES, A, RAC );
    }
}