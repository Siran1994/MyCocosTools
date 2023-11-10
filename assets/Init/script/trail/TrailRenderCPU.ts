import { CCBoolean, CCFloat, CCInteger, Color, game, Vec3, warn } from 'cc';
import { v3 } from 'cc';
import { Mat4 } from 'cc';
import { Material } from 'cc';
import { _decorator, Component } from 'cc';
import { TrailManager } from './TrailManager';
import { Messager } from '../manager/Messager';
const { ccclass, property } = _decorator;

const _temp_v3_1 = new Vec3();
const _temp_v3_2 = new Vec3();
const _temp_mat4 = new Mat4();

@ccclass( 'TrailRenderCPU' )
export class TrailRenderCPU extends Component
{
    /**拖尾材质 */
    @property( Material )
    material: Material = null;

    /**拖尾初始顶点 */
    @property( [ Vec3 ] )
    private vertexs: Vec3[] = [ v3( -0.1, 0, 0 ), v3( 0.1, 0, 0 ) ];

    /**拖尾长度 */
    @property( CCInteger )
    private length: number = 10;

    /**拖尾速度 */
    @property( CCFloat )
    private lerpSpeed = 10;

    /**最大拖尾数量 */
    @property( CCInteger )
    maxTrailCount = 100;

    /**顶点buffer */
    private _vbF32: Float32Array = null;

    /**索引buffer */
    private _iBuffer: Uint16Array = null;

    /**当前拖尾数据索引 */
    private _trailIndex: number = 0;

    /**当前拖尾的顶点在buffer的起始位置 */
    private _vertexIndex: number = 0;

    @property( CCBoolean )
    private isUpdate = true;

    start ()
    {
        this.rebuild();
    }

    onDestroy ()
    {
        this._vbF32 = null;
        this._iBuffer = null;
    }

    /**重置顶点坐标 */
    private rest ()
    {
        const shapeLenth = this.vertexs.length;
        this.node.getWorldMatrix( _temp_mat4 );
        for ( let len = 0; len < this.length; len++ )
        {
            for ( let i = 0; i < shapeLenth; i++ )
            {
                _temp_v3_1.set( this.vertexs[ i ] );
                _temp_v3_1.transformMat4( _temp_mat4 );
                let index = ( len * shapeLenth + i ) * 5 + this._vertexIndex;
                this._vbF32[ index ] = _temp_v3_1.x;
                this._vbF32[ index + 1 ] = _temp_v3_1.y;
                this._vbF32[ index + 2 ] = _temp_v3_1.z;
            }
        }
    }

    private rebuild ()
    {
        if ( !this.material )
        {
            warn( "material is null" );
            this.isUpdate = false;
            return;
        }

        //获取当前拖尾模型总数据
        let data = TrailManager.instance.createModel( this.length, this.vertexs.length, this.material, this.maxTrailCount );
        this._trailIndex = TrailManager.instance.getBufferIndex( this.material.name );
        this._vbF32 = data.vertxBuffer;
        this._iBuffer = data.indexBuffer;

        const shapeLenth = this.vertexs.length;
        const vertexCount = this.length * shapeLenth * this._trailIndex;
        this._vertexIndex = this.length * shapeLenth * this._trailIndex * 5;
        const faceIndex = ( ( this.length - 1 ) * ( shapeLenth - 1 ) * 2 * this._trailIndex ) * 3;

        //初始化顶点数据
        this.node.getWorldMatrix( _temp_mat4 );
        for ( let len = 0; len < this.length; len++ )
        {
            let uv_x = len / ( this.length - 1 );
            for ( let i = 0; i < shapeLenth; i++ )
            {
                // let vertex = this.vertexs[i];
                _temp_v3_1.set( this.vertexs[ i ] );
                _temp_v3_1.transformMat4( _temp_mat4 );
                let index = ( len * shapeLenth + i ) * 5 + this._vertexIndex;
                this._vbF32[ index ] = _temp_v3_1.x;
                this._vbF32[ index + 1 ] = _temp_v3_1.y;
                this._vbF32[ index + 2 ] = _temp_v3_1.z;

                let uv_y = i / ( shapeLenth - 1 );
                this._vbF32[ index + 3 ] = uv_x;
                this._vbF32[ index + 4 ] = uv_y;
            }
        }

        //初始化顶点索引
        const facePreNode = ( shapeLenth - 1 ) * 2;
        for ( let next = 0; next < this.length - 1; next++ )
        {
            let srcNodeIndex = next;
            let destNodeIndex = next + 1;
            for ( let i = 0; i < shapeLenth - 1; i++ )
            {
                let srcVertexIndex = shapeLenth * srcNodeIndex + i + vertexCount;
                let destVertexIndex = shapeLenth * destNodeIndex + i + vertexCount;
                let index = ( srcNodeIndex * facePreNode + i * 2 ) * 3 + faceIndex;
                this._iBuffer[ index ] = srcVertexIndex;
                this._iBuffer[ index + 1 ] = destVertexIndex;
                this._iBuffer[ index + 2 ] = srcVertexIndex + 1;
                this._iBuffer[ index + 3 ] = destVertexIndex;
                this._iBuffer[ index + 4 ] = destVertexIndex + 1;
                this._iBuffer[ index + 5 ] = srcVertexIndex + 1;
            }
        }
    }

    private updateRenderData ()
    {
        this.node.getWorldMatrix( _temp_mat4 );
        const shapeLenth = this.vertexs.length;

        //更新头部顶点
        for ( let i = 0; i < shapeLenth; i++ )
        {
            _temp_v3_1.set( this.vertexs[ i ] );
            _temp_v3_1.transformMat4( _temp_mat4 );

            let index = i * 5 + this._vertexIndex;
            this._vbF32![ index ] = _temp_v3_1.x;
            this._vbF32![ index + 1 ] = _temp_v3_1.y;
            this._vbF32![ index + 2 ] = _temp_v3_1.z;
        }

        //更新剩余顶点
        for ( let segment = 1; segment < this.length; segment++ )
        {
            for ( let i = 0; i < shapeLenth; i++ )
            {
                let last = ( shapeLenth * ( segment - 1 ) + i ) * 5 + this._vertexIndex;
                let index = ( shapeLenth * segment + i ) * 5 + this._vertexIndex;
                //上一个点位置
                _temp_v3_1.x = this._vbF32![ last ];
                _temp_v3_1.y = this._vbF32![ last + 1 ];
                _temp_v3_1.z = this._vbF32![ last + 2 ];

                //当前点位置
                _temp_v3_2.x = this._vbF32![ index ];
                _temp_v3_2.y = this._vbF32![ index + 1 ];
                _temp_v3_2.z = this._vbF32![ index + 2 ];

                Vec3.lerp( _temp_v3_2, _temp_v3_2, _temp_v3_1, game.deltaTime * this.lerpSpeed );

                this._vbF32![ index ] = _temp_v3_2.x;
                this._vbF32![ index + 1 ] = _temp_v3_2.y;
                this._vbF32![ index + 2 ] = _temp_v3_2.z;
            }
        }
    }

    public update ( dt: number )
    {
        if ( !this.isUpdate )
            return;
        this.updateRenderData();
    }

    public play ()
    {
        this.isUpdate = true;
        this.rest();
    }

    public stop ()
    {
        this.isUpdate = false;
        this.rest();
    }

    onEnable ()
    {
        Messager.AddListener( 'changeColor', this, this.changeColor );
    }

    onDisable ()
    {
        Messager.RemoveListener( 'changeColor', this, this.changeColor );
    }

    changeColor ( color: string )
    {
        this.material.setProperty( 'maincolor', new Color( color ) );
    }
}