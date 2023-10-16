import { Vec3 } from "cc"

/**
 * 位置缩放信息类
 */
export class TF
{
    pos: Vec3
    scale: Vec3
    constructor ( x: number, y: number, scale: number )
    {
        this.pos = new Vec3( x, y, 0 )
        this.scale = new Vec3( scale, scale, 1 )
    }
}