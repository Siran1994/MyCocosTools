import { _decorator, Component, Prefab, Vec2, v3, Node, Vec3, tween } from "cc";
import { PoolManager } from "../manager/PoolManager";

const { ccclass, property } = _decorator;

@ccclass
export default class CoinFly extends Component
{
    @property( Node )
    startPoint: Node = null;
    @property( Node )
    endPoint: Node = null;
    @property( Prefab )
    coinPrefab: Prefab = null;

    onLoad ()
    {
        PoolManager.prePool( this.coinPrefab, 20 )
    }

    playAnim ( callback: Function )
    {
        let randomCount = Math.random() * 15 + 10;
        let stPos = this.startPoint.getPosition();
        let edPos = this.endPoint.getPosition();
        this.playCoinFlyAnim( randomCount, stPos, edPos, 150, callback );
    }

    playCoinFlyAnim ( count: number, stPos: Vec3, edPos: Vec3, r: number = 150, callback: Function )
    {
        // 生成圆，并且对圆上的点进行排序
        let points = this.getCirclePoints( r, stPos, count );
        let coinNodeList = points.map( pos =>
        {
            let coin = PoolManager.getNode( this.coinPrefab, this.node );
            coin.setPosition( stPos );
            return {
                node: coin,
                stPos: stPos,
                mdPos: pos,
                edPos: edPos,
                dis: Vec3.distance( stPos, edPos )
            };
        } );
        coinNodeList = coinNodeList.sort( ( a, b ) =>
        {
            if ( a.dis - b.dis > 0 ) return 1;
            if ( a.dis - b.dis < 0 ) return -1;
            return 0;
        } );

        // 执行金币落袋的动画
        coinNodeList.forEach( ( item, idx ) =>
        {
            tween( item.node ).sequence
                (
                    tween().to( 0.3, { position: item.mdPos } ),
                    tween().delay( idx * 0.01 ),
                    tween().to( 0.5, { position: item.edPos } ),
                    tween().call( () =>
                    {
                        callback();
                        PoolManager.putNode( item.node );
                    } )
                )
                .start();
        } );
    }

    /**
     * 以某点为圆心，生成圆周上等分点的坐标
     *
     * @param {number} r 半径
     * @param {Vec2} pos 圆心坐标
     * @param {number} count 等分点数量
     * @param {number} [randomScope=80] 等分点的随机波动范围
     * @returns {Vec2[]} 返回等分点坐标
     */
    getCirclePoints ( r: number, pos: Vec3, count: number, randomScope: number = 60 ): Vec2[]
    {
        let points = [];
        let radians = ( Math.PI / 180 ) * Math.round( 360 / count );
        for ( let i = 0; i < count; i++ )
        {
            let x = pos.x + r * Math.sin( radians * i );
            let y = pos.y + r * Math.cos( radians * i );
            points.unshift( v3( x + Math.random() * randomScope, y + Math.random() * randomScope, 0 ) );
        }
        return points;
    }
}