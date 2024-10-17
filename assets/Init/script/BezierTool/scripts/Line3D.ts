import { _decorator, Vec3, Line, __private } from 'cc';
const { ccclass, executeInEditMode } = _decorator;
@ccclass( 'Line3D' )
@executeInEditMode
export class Line3D extends Line
{
    arr = [];

    bezierCurveTo ( points: Vec3[] ): void
    {
        let self = this;

        const numPoints = 80; // 调整需要的点数
        const points2 = [];
        for ( let t = 0; t <= 1; t += 1 / numPoints )
        {
            const point = this.calculateBezierPoint( points, t );
            points2.push( point );
        }
        // console.log("point:",points2);
        this.positions = points2 as never;
    }

    calculateBezierPoint ( controlPoints: Vec3[], t: number )
    {
        // 根据3D贝塞尔曲线的数学公式计算点的位置
        const p0 = controlPoints[ 0 ]
        const p1 = controlPoints[ 1 ]
        const p2 = controlPoints[ 2 ]
        const p3 = controlPoints[ 3 ]

        const x = ( 1 - t ) * ( 1 - t ) * ( 1 - t ) * p0.x +
            3 * ( 1 - t ) * ( 1 - t ) * t * p1.x +
            3 * ( 1 - t ) * t * t * p2.x +
            t * t * t * p3.x;

        const y = ( 1 - t ) * ( 1 - t ) * ( 1 - t ) * p0.y +
            3 * ( 1 - t ) * ( 1 - t ) * t * p1.y +
            3 * ( 1 - t ) * t * t * p2.y +
            t * t * t * p3.y;

        const z = ( 1 - t ) * ( 1 - t ) * ( 1 - t ) * p0.z +
            3 * ( 1 - t ) * ( 1 - t ) * t * p1.z +
            3 * ( 1 - t ) * t * t * p2.z +
            t * t * t * p3.z;

        return new Vec3( x, y, z );
    }
}