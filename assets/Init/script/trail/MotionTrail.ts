//参考水煮肉片饭(27185709@qq.com)
//魔改byjeff 到3.x

class TrailData
{
    x: number = 0;
    y: number = 0;
    dis: number = 0;
    cos: number = 0;
    sin: number = 0;
}

import { CCInteger, CurveRange, Director, dynamicAtlasManager, GradientRange, IAssembler, RenderData, SpriteFrame, UIRenderer, UITransform, Vec2, Vec3, __private, _decorator, director, v2 } from 'cc';
const { ccclass, property, executeInEditMode, menu } = _decorator;
@ccclass
@menu( 'Comp/MotionTrail' )
@executeInEditMode()
export default class MotionTrail extends UIRenderer
{

    @property( { visible: false } )
    public get color ()
    {
        return this._color
    }

    @property( { type: SpriteFrame } )
    spriteFrame: SpriteFrame = null;

    @property
    private _isWorldXY: boolean = true;
    @property( { displayName: '世界坐标', tooltip: '顶点坐标是世界坐标还是本地坐标' } )
    get isWorldXY () { return this._isWorldXY; }
    set isWorldXY ( value: boolean )
    {
        this._isWorldXY = value;
    }

    @property( { displayName: '偏移' } )
    offset: Vec2 = v2( 0, 0 );

    @property
    private _length: number = 20;
    @property( { type: CCInteger, displayName: '拖尾长度' } )
    get length () { return this._length; }

    private set length ( value: number )
    {
        this._length = Math.max( value, 0 );
        this.updateLength();
        this.updateWidth();
        this.resetPos();
        this.freshBuffer()
    }

    trailData: TrailData[] = [];

    @property( { type: CurveRange, displayName: '宽度变化', range: [ 0, 1 ] } )
    _sizeCurveRange: CurveRange = new CurveRange();

    @property( { type: CurveRange, displayName: '宽度变化', range: [ 0, 1 ] } )
    get sizeCurveRange ()
    {
        return this._sizeCurveRange;
    }
    set sizeCurveRange ( value )
    {
        this._sizeCurveRange = value;
        this.updateWidth()
    }


    @property( { type: GradientRange, displayName: '颜色变化' } )
    _colorCurveRange: GradientRange = new GradientRange();

    @property( { type: GradientRange, displayName: '颜色变化' } )
    get colorCurveRange ()
    {
        return this._colorCurveRange;
    }

    set colorCurveRange ( value )
    {
        this._colorCurveRange = value;
        this._updateColor()
    }

    protected _render ( render: __private._cocos_2d_renderer_i_batcher__IBatcher ): void
    {
        render.commitComp( this, this.renderData, this.spriteFrame, this._assembler, null );
    }

    protected _flushAssembler (): void
    {
        this._assembler = simple
        if ( !this._renderData )
        {
            this._renderData = this.requestRenderData();;
            this._renderData.material = this.getRenderMaterial( 0 )
            this.freshBuffer()
            this.markForUpdateRenderData()
            if ( this.spriteFrame )
            {
                this._assembler.updateUVs( this )
            }
            this._updateColor()
        }
    }

    //更新buffer
    protected freshBuffer ()
    {
        let len = this.length;
        let count = 4 + ( len - 2 ) * 2
        this._renderData.dataLength = count;
        this._renderData.resize( count, ( count - 2 ) * 3 );
    }

    private updateLength ()
    {
        let trailLen = this.length;
        let sub = trailLen - this.trailData.length;
        if ( sub > 0 )
        {
            for ( let i = 0; i < sub; ++i )
            {
                this.trailData.push( new TrailData() );
            }
        } else if ( sub < 0 )
        {
            this.trailData.splice( trailLen );
        }
    }

    private updateWidth ()
    {
        let data = this.trailData;
        let trailLen = this.length;
        let width = this.getComponent( UITransform ).width / 20
        for ( let i = 0; i < trailLen; ++i )
        {
            data[ i ].dis = this.sizeCurveRange.evaluate( i / ( trailLen - 1 ), 0 ) * width;
        }
    }

    private resetPos ()
    {
        let data = this.trailData;
        let tx = this.offset.x;
        let ty = this.offset.y;
        if ( this.isWorldXY )
        {
            tx += this.node.worldPosition.x;
            ty += this.node.worldPosition.y;
        } else
        {
            tx += this.node.position.x;
            ty += this.node.position.y;
        }
        for ( let i = 0, len = this.length; i < len; i++ )
        {
            data[ i ].x = tx;
            data[ i ].y = ty;
        }
    }

    onLoad (): void
    {
        this.length = this._length;
    }

    onEnable (): void
    {
        super.onEnable()
        director.once( Director.EVENT_BEFORE_DRAW, this.resetPos, this )
    }

    protected _useVertexOpacity: boolean = true

}

const simple: IAssembler = {

    updateRenderData ( trail: MotionTrail )
    {
        const frame = trail.spriteFrame;

        dynamicAtlasManager.packToDynamicAtlas( trail, frame );
        this.updateUVs( trail );// dirty need
        //this.updateColor(sprite);// dirty need

        const renderData = trail.renderData;
        if ( renderData && frame )
        {
            if ( renderData.vertDirty )
            {
                this.updateVertexData( trail );
            }
            renderData.updateRenderData( trail, frame );
        }
    },
    updateWorldVerts ( trail: MotionTrail )
    {
        const renderData = trail.renderData;
        const vData = renderData.chunk.vb;
        let len = trail.length
        if ( len < 1 ) return
        let tx = 0, ty = 0;
        let data = trail.trailData;
        if ( !trail.isWorldXY )
        {
            tx = trail.node.position.x;
            ty = trail.node.position.y;
        }
        let ax = 0, ay = 0
        let curIdx = 0;

        let tempData: TrailData = null
        let tempNextData: TrailData = null
        //
        for ( let i = 0; i < len; ++i )
        {
            tempData = data[ i ];
            let sameIdx = i
            for ( ; sameIdx < len; ++sameIdx )
            {
                tempNextData = data[ sameIdx ];
                if ( tempNextData.x != tempData.x || tempNextData.y != tempData.y )
                {
                    break
                }
            }
            sameIdx -= 1
            if ( sameIdx == i )
            {
                ax = tempData.x - tx;
                ay = tempData.y - ty;
                vData[ curIdx ] = ax + tempData.dis * tempData.sin;
                vData[ curIdx + 1 ] = ay - tempData.dis * tempData.cos;
                vData[ curIdx + 2 ] = 0;
                curIdx += renderData.floatStride;
                vData[ curIdx ] = ax - tempData.dis * tempData.sin;
                vData[ curIdx + 1 ] = ay + tempData.dis * tempData.cos;
                vData[ curIdx + 2 ] = 0;
                curIdx += renderData.floatStride;
            } else
            {
                tempData = data[ sameIdx ];
                ax = tempData.x - tx;
                ay = tempData.y - ty;
                vData[ curIdx ] = ax + tempData.dis * tempData.sin;
                vData[ curIdx + 1 ] = ay - tempData.dis * tempData.cos;
                vData[ curIdx + 2 ] = 0;
                curIdx += renderData.floatStride;
                vData[ curIdx ] = ax - tempData.dis * tempData.sin;
                vData[ curIdx + 1 ] = ay + tempData.dis * tempData.cos;
                vData[ curIdx + 2 ] = 0;
                curIdx += renderData.floatStride;
                for ( ; i < sameIdx; ++i )
                {
                    vData[ curIdx ] = vData[ curIdx - renderData.floatStride * 2 ];
                    vData[ curIdx + 1 ] = vData[ curIdx - renderData.floatStride * 2 + 1 ];
                    vData[ curIdx + 2 ] = 0;
                    curIdx += renderData.floatStride;
                    vData[ curIdx ] = vData[ curIdx - renderData.floatStride * 2 ];
                    vData[ curIdx + 1 ] = vData[ curIdx - renderData.floatStride * 2 + 1 ];
                    vData[ curIdx + 2 ] = 0;
                    curIdx += renderData.floatStride;
                }
            }
        }

    },
    fillBuffers ( trail: MotionTrail )
    {
        if ( trail.spriteFrame == null ) return
        const renderData = trail.renderData!;
        const chunk = renderData.chunk;
        this.update( trail )
        this.updateWorldVerts( trail, chunk );
        // quick version
        const vidOrigin = chunk.vertexOffset;
        const meshBuffer = chunk.meshBuffer;
        const ib = chunk.meshBuffer.iData;
        let indexOffset = meshBuffer.indexOffset;

        let vid = vidOrigin;
        let len = trail.length - 1
        for ( let i = 0; i < len; i++ )
        {
            ib[ indexOffset++ ] = vid + 0;
            ib[ indexOffset++ ] = vid + 1;
            ib[ indexOffset++ ] = vid + 2;
            ib[ indexOffset++ ] = vid + 1;
            ib[ indexOffset++ ] = vid + 3;
            ib[ indexOffset++ ] = vid + 2;
            vid += 2;
        }
        meshBuffer.indexOffset += len * 6;
    },
    updateVertexData ( trail: MotionTrail )
    {
        const renderData: RenderData | null = trail.renderData;
        renderData.vertDirty = true
    },
    updateUVs ( trail: MotionTrail )
    {
        if ( trail.spriteFrame == null ) return
        const renderData = trail.renderData;
        const vData = renderData.chunk.vb;
        const uv = trail.spriteFrame.uv;
        const length = trail.length - 1;
        const uvStep = length == 0 ? 0 : 1 / length;
        let curIdx = 3;
        let subV = uv[ 7 ] - uv[ 1 ]
        for ( let i = 0; i < length; i++ )
        {
            vData[ curIdx ] = uv[ 0 ];
            vData[ curIdx + 1 ] = uv[ 1 ] + subV * i * uvStep;
            curIdx += renderData.floatStride
            vData[ curIdx ] = uv[ 0 ];
            vData[ curIdx + 1 ] = uv[ 3 ] + subV * i * uvStep;
            curIdx += renderData.floatStride
        }
        vData[ curIdx ] = uv[ 0 ];
        vData[ curIdx + 1 ] = uv[ 7 ];
        curIdx += renderData.floatStride
        vData[ curIdx ] = uv[ 0 ]
        vData[ curIdx + 1 ] = uv[ 5 ];
        curIdx += renderData.floatStride
    },
    updateColor ( trail: MotionTrail )
    {
        const renderData = trail.renderData!;
        const vData = renderData.chunk.vb;
        const total = 4 + ( trail.length - 2 ) * 2;
        const stepTotal = trail.length
        let stepIdx = -1
        let colorOffset = 5;
        let curC, random
        for ( let i = 0; i < total; i++ )
        {
            if ( i % 2 == 0 )
            {
                random = ( trail.colorCurveRange.mode === GradientRange.Mode.TwoGradients || trail.colorCurveRange.mode === GradientRange.Mode.TwoColors ) ? Math.random() : 0;
                curC = trail.colorCurveRange.evaluate( stepIdx / stepTotal, random )
                stepIdx++
            }
            vData[ colorOffset ] = curC.r / 255;
            vData[ colorOffset + 1 ] = curC.g / 255;
            vData[ colorOffset + 2 ] = curC.b / 255;
            vData[ colorOffset + 3 ] = curC.a / 255;
            colorOffset += renderData.floatStride;
        }
    },
    update ( trail: MotionTrail )
    {
        if ( trail.length === 0 ) return;
        let data = trail.trailData;
        for ( let i = trail.length - 1; i > 0; --i )
        {
            let cur = data[ i ], prev = data[ i - 1 ];
            cur.x = prev.x;
            cur.y = prev.y;
            cur.sin = prev.sin;
            cur.cos = prev.cos;
        }
        let pos: Vec3 = null
        if ( trail.isWorldXY )
        {
            pos = trail.node.worldPosition;
        } else
        {
            pos = trail.node.position;
        }
        let fristData = data[ 0 ];
        fristData.x = trail.offset.x + pos.x;
        fristData.y = trail.offset.y + pos.y;
        let secondData = data[ 1 ];
        let radian = Math.atan2( secondData.y - fristData.y, secondData.x - fristData.x );
        fristData.sin = Math.sin( radian )
        fristData.cos = Math.cos( radian )
    },

    updateOpacity ( trail: MotionTrail, alpha: number )
    {
        const renderData = trail.renderData!;
        const vData = renderData.chunk.vb;
        const total = 4 + ( trail.length - 2 ) * 2;
        const stepTotal = trail.length
        let stepIdx = -1
        let colorOffset = 5;
        let curC, random
        for ( let i = 0; i < total; i++ )
        {
            if ( i % 2 == 0 )
            {
                random = ( trail.colorCurveRange.mode === GradientRange.Mode.TwoGradients || trail.colorCurveRange.mode === GradientRange.Mode.TwoColors ) ? Math.random() : 0;
                curC = trail.colorCurveRange.evaluate( stepIdx / stepTotal, random )
                stepIdx++
            }
            vData[ colorOffset + 3 ] = curC.a / 255 * alpha;
            colorOffset += renderData.floatStride;
        }
    }
}