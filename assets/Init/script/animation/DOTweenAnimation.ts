import { Label, ProgressBar, Sprite, tween, Vec3, Node, UIOpacity } from "cc";

export default class DOTweenAnimation
{

    /**
     * 永久摇动
     * @param {any} target          目标对象
     * @param {Number} duration     持续时间
     * @param {Number} range        晃动幅度
     * @param {Number} delayTime    停顿时间
     */
    public static shakeRepeat ( target: Node, duration: number, range: number, delayTime: number ): void
    {
        tween( target )
            .sequence(
                tween().by( duration, { angle: range } ),
                tween().by( duration, { angle: -range } ),
                tween().by( duration, { angle: -range } ),
                tween().by( duration, { angle: range } ),
                tween().delay( delayTime )
            )
            .repeatForever()
            .start()
    };

    /**
     * 永久转动
     * @param {any} target          目标对象
     * @param {Number} duration     旋转一圈所需时间
     */
    public static rotateRepeat ( target: Node, duration: number ): void
    {
        tween( target )
            .sequence(
                tween().by( duration, { angle: 360 } ),
            )
            .repeatForever()
            .start()
    };

    /**
     * 永久缩放
     * @param {any} target          目标对象
     * @param {Number} duration     持续时间
     * @param {Number} range        缩放幅度
     * @param {Number} delayTime    停顿时间
     */
    public static scaleRepeat ( target: Node, duration: number, range: number, delayTime: number ): void
    {
        tween( target )
            .sequence(
                tween().to( duration, { scale: new Vec3( 1 + range, 1 + range, 1 + range ) } ),
                tween().to( duration, { scale: Vec3.ONE } ),
                tween().delay( delayTime )
            )
            .repeatForever()
            .start()
    };

    /**
     * 永久缩放
     * @param {any} target          目标对象
     * @param {Number} duration     持续时间
     * @param {Number} range        缩放幅度
     * @param {Number} delayTime    停顿时间
     */
    public static scaleRepeat_1 ( target: Node, duration: number, startScale: number, endScale: number, delayTime: number ): void
    {
        target.setScale( startScale, startScale, startScale );
        tween( target )
            .sequence(
                tween().to( duration, { scale: new Vec3( endScale, endScale, endScale ) } ),
                tween().to( duration, { scale: new Vec3( startScale, startScale, startScale ) } ),
                tween().delay( delayTime )
            )
            .repeatForever()
            .start()
    };

    /**
     * 回弹缩放
     * @param target                目标对象
     * @param duration              持续时间
     * @param range                 回弹幅度
     * @param delayTime             停顿时间
     */
    public static scale_Breathe ( target: Node, duration: number, startScale: number, maxScale: number, delayTime: number, fun?: Function ): void
    {
        tween( target )
            .sequence
            (
                tween().delay( delayTime ),
                tween().to( duration, { scale: new Vec3( maxScale, maxScale, maxScale ) } ),
                tween().to( duration, { scale: new Vec3( startScale, startScale, startScale ) }, { easing: "backOut" } ),
                tween().call( () =>
                {
                    if ( fun )
                    {
                        fun();
                    }
                } )
            )

            .start()
    }


    /**
     * 缩放节点Y值
     * @param target                目标对象
     * @param duration              持续时间
     * @param range                 回弹幅度
     * @param delayTime             停顿时间
     */
    public static scaleX_Simple ( target: Node, startValX: number, firstScaX: number, secondScaX: number, duration_1: number, duration_2: number, delayTime: number, fun?: Function ): void
    {
        target.scale = new Vec3( startValX, target.scale.y, target.scale.z );
        tween( target )
            .sequence
            (
                tween().delay( delayTime ),
                tween().to( duration_1, { scale: new Vec3( firstScaX, target.scale.y, target.scale.z ) }, { easing: "backOut" } ),
                tween().to( duration_2, { scale: new Vec3( secondScaX, target.scale.y, target.scale.z ) }, { easing: "backOut" } ),
                tween().call( () =>
                {
                    target.scale = new Vec3( 1, target.scale.y, target.scale.z );
                    if ( fun )
                    {
                        fun();
                    }
                } )
            )
            .start()
    }

    /**
     * 回弹缩放
     * @param target                目标对象   
     * @param duration              持续时间
     * @param range                 回弹幅度
     * @param delayTime             停顿时间
     */
    public static scaleBackOut ( target: Node, duration: number, range: number, delayTime: number ): void
    {
        tween( target )
            .sequence
            (
                tween().delay( delayTime ),
                tween().to( duration, { scale: new Vec3( range, range, range ) } ),
                tween().to( duration * 5, { scale: Vec3.ONE }, { easing: "backOut" } )
            )
            .start()
    }


    /**
     * 缩放节点
     * @param target                目标对象
     * @param duration              持续时间
     * @param range                 回弹幅度
     * @param delayTime             停顿时间
     */
    public static scale_Simple ( target: Node, duration: number, startVal: number, endVal: number, delayTime: number, fun?: Function ): void
    {
        target.scale = new Vec3( startVal, startVal, startVal );
        tween( target )
            .sequence
            (
                tween().delay( delayTime ),
                tween().to( duration, { scale: new Vec3( endVal, endVal, endVal ) }, { easing: "backOut" } ),
                tween().call( () =>
                {
                    if ( fun )
                    {
                        fun();
                    }
                } )
            )
            .start()
    }

    /**
     * 往返运动
     * @param target                目标对象   
     * @param duration              持续时间
     * @param range                 回弹幅度
     * @param delayTime             停顿时间
     */
    public static move_Left_Right ( target, duration: number, startVal: Vec3, posXC_Left: number, posXC_right: number, delayTime: number )
    {
        return tween( target )
            .sequence(
                tween().to( duration, { position: new Vec3( posXC_Left, startVal.y ) } ),
                tween().to( duration, { position: new Vec3( posXC_right, startVal.y ) } ),
                tween().delay( delayTime )
            )
            .repeatForever()
            .start()
    }

    /**
     * 简单伸缩
     * @param target 伸缩的目标
     * @param duration 执行时间
     * @param startX 初始X
     * @param startY 初始Y
     * @param endX 目的X
     * @param endY 目的Y
     * @param delayTime 延时
     * @param fun 回调
     */
    public static scale_Simple2 ( target: Node, duration: number, startX: number, startY: number, endX: number, endY: number, delayTime: number, fun?: Function ): void
    {
        target.scale = new Vec3( startX, startY, target.scale.z );
        tween( target )
            .sequence
            (
                tween().delay( delayTime ),
                tween().to( duration, { scale: new Vec3( endX, endY ) }, { easing: "backOut" } ),
                tween().call( () =>
                {
                    if ( fun )
                    {
                        fun();
                    }
                } )
            )
            .start()
    }

    /**
     * 缩放节点Y值
     * @param target                目标对象   
     * @param duration              持续时间
     * @param range                 回弹幅度
     * @param delayTime             停顿时间
     */
    public static scaleY ( target: Node, duration: number, startVal: number, endVal: number, delayTime: number, fun?: Function ): void
    {
        target.scale = new Vec3( target.scale.x, startVal, target.scale.z );
        tween( target )
            .delay( delayTime )
            .sequence(
                tween().to( duration, { scale: new Vec3( endVal, endVal, endVal ) }, { easing: "backOut" } )
                    .call( () =>
                    {
                        if ( fun )
                        {
                            fun();
                        }
                    } )
            )
            .start()
    }

    /**
     * 简单往下（或者向上）移动
     * @param target 
     * @param duration 
     * @param startVal 
     * @param range 
     * @param delayTime 
     */
    public static simple_MoveY ( target: Node, duration: number, startVal: Vec3, range: number, delayTime: number, fun?: Function ): void
    {
        console.log( "位移" );
        tween( target )
            .sequence
            (
                tween().delay( delayTime ),
                tween().to( duration, { position: new Vec3( startVal.x, startVal.y + range ) } ),
                tween().call( () =>
                {
                    if ( fun )
                        fun();
                } )

            )
            .start()
    }

    /**
    * 简单往上（或者向下）移动到目标点
    * @param target
    * @param duration
    * @param startVal
    * @param targetX
    * @param delayTime
    */
    public static simple_MoveToY ( target: Node, duration: number, startVal: Vec3, targetY: number, delayTime: number, fun?: Function ): void
    {
        tween( target )
            .sequence
            (
                tween().delay( delayTime ),
                tween().to( duration, { position: new Vec3( startVal.x, targetY ) } ),
                tween().call( () =>
                {
                    if ( fun )
                        fun();
                } )
            )
            .start()
    }


    /**
    * 简单往左（或者向右）移动到目标点
    * @param target
    * @param duration
    * @param startVal
    * @param targetX
    * @param delayTime
    */
    public static simple_MoveToX ( target: Node, duration: number, startVal: Vec3, targetX: number, delayTime: number, fun?: Function ): void
    {
        tween( target )
            .sequence
            (
                tween().delay( delayTime ),
                tween().to( duration, { position: new Vec3( targetX, startVal.y ) } ),
                tween().call( () =>
                {
                    if ( fun )
                        fun();
                } )
            )
            .start()
    }

    /**
     * 左右移动或者上下移动 然后返回原位置
     * @param target
     * @param duration
     * @param preX  初始X
     * @param preY  初始Y
     * @param changeX 要改变的X范围值
     * @param changeY 要改变的y范围值
     * @param delayTime
     * @param fun
     */
    public static moveFAndB ( target: Node, duration_1: number, duration_2, preX: number, preY: number, changeX: number, changeY: number, delayTime: number, fun?: Function ): void
    {
        tween( target )
            .sequence
            (
                tween().delay( delayTime ),
                tween().to( duration_1, { position: new Vec3( preX + changeX, preY + changeY ) }, { easing: 'linear' } ),
                tween().delay( delayTime ),
                tween().to( duration_2, { position: new Vec3( preX, preY ) }, { easing: 'linear' } ),
                tween().call( () =>
                {
                    if ( fun )
                        fun();
                } )
            )
            .start()
    }

    /**
   * 过场
   * @param target
   * @param duration
   * @param preX  初始X
   * @param preY  初始Y
   * @param changeX 要改变的X范围值
   * @param changeY 要改变的y范围值
   * @param delayTime
   * @param fun
   */
    public static moveInter ( target: Node, duration_1: number, duration_2, preX: number, preY: number, changeX: number, changeY: number, delayTime: number, fun?: Function ): void
    {
        tween( target )
            .sequence
            (
                tween().to( duration_1, { position: new Vec3( preX + changeX, preY + changeY ) }, { easing: 'linear' } ),
                tween().delay( delayTime ),
                tween().to( duration_1, { position: new Vec3( preX + changeX + changeX, preY + changeY ) }, { easing: 'linear' } ),
                tween().call( () =>
                {
                    if ( fun )
                        fun();
                    target.setPosition( preX, preY );
                } )
            )

            .start()
    }

    /**
     *  渐隐渐出
     * @param target
     * @param duration
     * @param startOpa
     * @param enmOpa
     * @param delayTime
     * @param fun
     */
    public static fadeOut ( target: Node, duration: number, startOpa: number, enmOpa: number, delayTime: number, fun?: Function ): void
    {
        let Opa = target.getComponent( UIOpacity );
        Opa.opacity = startOpa;
        tween( Opa )
            .sequence
            (
                tween().delay( delayTime ),
                tween().to( duration, { opacity: enmOpa } ),
                tween().call( () =>
                {
                    if ( fun ) fun();
                } )
            )
            .start()
    }

    public static ChangColor ( isToGray = false, Opa: UIOpacity, time: number, cb?: Function )
    {
        if ( isToGray )
            tween( Opa ).to( time, { opacity: 0 } ).call( () => { cb && cb() } ).start();//变暗
        else
            tween( Opa ).to( time, { opacity: 255 } ).call( () => { cb && cb() } ).start();//变明 
    }

    /**
   * 简单旋转到某个角度
   * @param {any} target          目标对象
   * @param {Number} duration     旋转所需时间
   */
    public static rotate_Simple ( target: Node, duration: number, angleVal: number, delayTime: number, fun?: Function ): void
    {
        tween( target )
            .sequence
            (
                tween().to( duration, { angle: angleVal } ),
                tween().call( () =>
                {
                    if ( fun ) fun();
                } )
            )
            .start()
    };

    /**
     * 简单旋转到某个角度并移动移动一定距离
     * @param {any} target          目标对象
     * @param {Number} duration     旋转所需时间
     * @param {}
    */
    public static rotate_Move ( target: Node, duration: number, angleVal: number, startPosVal: Vec3, endPosVal: Vec3, delayTime: number, fun?: Function ): void
    {
        tween( target )
            .sequence
            (
                tween().delay( delayTime ),
                tween().parallel(
                    tween().to( duration, { angle: angleVal } ),
                    tween().to( duration, { position: new Vec3( endPosVal.x, endPosVal.y ) } )
                ),
                tween().call( () =>
                {
                    if ( fun ) fun();
                } )
            )
            .start()
    };


    /**
     * 简单移动移动一定距离
     * @param target             目标对象
     * @param duration           移动所需时间
     * @param startPosVal
     * @param endPosVal
     * @param delayTime
     * @param fun
     */
    public static move_Simper ( target: Node, duration: number, startPosVal: Vec3, endPosVal: Vec3, delayTime: number, fun?: Function ): void
    {
        tween( target )
            .sequence
            (
                tween().delay( delayTime ),
                tween().to( duration, { position: new Vec3( endPosVal.x, endPosVal.y ) } ),
                tween().call( () =>
                {
                    if ( fun ) fun();
                } )
            )

            .start()
    };

    /**
     * 渐隐或者渐显并移动移动一定距离
     * @param {any} target          目标对象
     * @param {Number} duration     旋转所需时间
     * @param {}
    */
    public static fadeOut_Move ( target: Node, duration: number, opaVal: number, startPosVal: Vec3, endPosVal: Vec3, delayTime: number, fun?: Function ): void
    {
        tween( target )
            .sequence
            (
                tween().delay( delayTime ),
                tween().parallel(
                    tween().to( duration, { opacity: opaVal } ),
                    tween().to( duration, { position: new Vec3( endPosVal.x, endPosVal.y ) } )
                ),
                tween().call( () =>
                {
                    if ( fun ) fun();
                } )
            )
            .start()
    };

    /**
     * 放大或者缩小并移动移动一定距离
     * @param {any} target          目标对象
     * @param {Number} duration     旋转所需时间
     * @param {}
    */
    public static Scale_Move ( target: Node, duration: number, scaleVal: number, startPosVal: Vec3, endPosVal: Vec3, delayTime: number, fun?: Function ): void
    {
        tween( target )
            .sequence
            (
                tween().delay( delayTime ),
                tween().parallel(
                    tween().to( duration, { scaleX: scaleVal, scaleY: scaleVal } ),
                    tween().to( duration, { position: new Vec3( endPosVal.x, endPosVal.y ) } )
                ),
                tween().call( () =>
                {
                    if ( fun ) fun();
                } )

            )

            .start()
    };

    /**
     * 逐字增加
     * 
     * @param num 总数字
     * @param textLab 文本框
     * @param extraDec_F 文本框数字前面额外文字
     * @param extraDec_B 文本框数字后面额外文字
     */
    public static stepNum ( textLab: Label, startNum: number, interNum: number, endNum: number, delayTime?: number, extraDec_B?: string, fun?: Function )
    {
        return tween( textLab )
            .sequence(
                tween().call( () =>
                {
                    startNum += interNum;
                    if ( startNum >= endNum )
                    {
                        startNum = endNum;
                        fun && fun();
                    }
                    textLab.string = startNum + extraDec_B;
                } ),
                tween().delay( delayTime )
            )
            .repeatForever()
            .start()
    }
    /**
     * 逐字增加
     * 
     * @param num 总数字
     * @param textLab 文本框
     * @param extraDec_F 文本框数字前面额外文字
     * @param extraDec_B 文本框数字后面额外文字
     */
    public static stepNumProgress ( progress: Sprite, startNum: number, interNum: number, endNum: number, delayTime?: number, extraDec_B?: string, fun?: Function )
    {
        return tween( progress )
            .sequence(
                tween().call( () =>
                {
                    startNum += interNum;
                    if ( startNum >= endNum )
                    {
                        startNum = endNum;
                        fun && fun();
                    }
                    progress.fillStart = startNum;
                } ),
                tween().delay( delayTime )
            )
            .repeatForever()
            .start()
    }

    /**
     * 逐字增加
     * 
     * @param num 总数字
     * @param textLab 文本框
     * @param extraDec_F 文本框数字前面额外文字
     * @param extraDec_B 文本框数字后面额外文字
     */
    public static stepNumProgressFly ( progress: ProgressBar, startNum: number, interNum: number, endNum: number, delayTime?: number, fun?: Function )
    {
        return tween( progress )
            .sequence(
                tween().call( () =>
                {
                    startNum += interNum;
                    if ( startNum >= endNum )
                    {
                        startNum = endNum;
                        fun && fun();
                    }
                    progress.progress = startNum;
                } ),
                tween().delay( delayTime )
            )
            .repeatForever()
            .start()
    }

    /**
    * 逐字增加
    * 
    * @param num 总数字
    * @param textLab 文本框
    * @param extraDec_F 文本框数字前面额外文字
    * @param extraDec_B 文本框数字后面额外文字
    */
    public static stepNumFly ( target: number, startNum: number, interNum: number, endNum: number, delayTime?: number, fun?: Function )
    {
        return tween( target )
            .sequence(
                tween().call( () =>
                {
                    startNum += interNum;
                    if ( startNum >= endNum )
                    {
                        startNum = endNum;
                        fun && fun();
                    }
                    target = startNum;
                } ),
                tween().delay( delayTime )
            )
            .repeatForever()
            .start()
    }

    //上下浮动
    public static FloatLoop ( target: Node, Value: number, toTime: number = 0.12, backTime: number = 0.1 )
    {
        tween( target )
            .sequence
            (
                tween().to( toTime, { position: new Vec3( target.position.x, target.position.y + Value, target.position.z ) }, { easing: "linear" } ),
                tween().to( backTime, { position: new Vec3( target.position.x, target.position.y - Value, target.position.z ) }, { easing: "linear" } ),
            )
            .repeatForever()
            .start();
    }

    //放大缩小
    public static ScaleLoop ( target: Node, toScale: number, bcakScale: number, toTime: number = 0.12, backTime: number = 0.1 )
    {
        tween( target )
            .sequence
            (
                tween().to( toTime, { scale: new Vec3( toScale, toScale, toScale ) }, { easing: "linear" } ),
                tween().to( backTime, { scale: new Vec3( bcakScale, bcakScale, bcakScale ) }, { easing: "linear" } ),
            )
            .repeatForever()
            .start();
    }

    //放大缩小
    public static ScaleLoopOnce ( target: Node, toScale: number, bcakScale: number, toTime: number = 0.12, backTime: number = 0.1 )
    {
        tween( target )
            .sequence
            (
                tween().to( toTime, { scale: new Vec3( toScale, toScale, toScale ) }, { easing: "linear" } ),
                tween().to( backTime, { scale: new Vec3( bcakScale, bcakScale, bcakScale ) }, { easing: "linear" } ),
            )
            .start();
    }

    //放大缩小和变色
    public static ScaleAndColorChangeOnce ( target: Node, cb1?: Function, cb2?: Function )
    {
        cb1 && cb1();
        tween( target )
            .sequence
            (
                tween().to( 0.15, { scale: new Vec3( 1.1, 1.1, 1.1 ) }, { easing: "linear" } ),
                tween().to( 0.15, { scale: Vec3.ONE }, { easing: "linear" } ),
            )
            .call( () =>
            {
                cb2 && cb2();
            } )
            .start();
    }

    /**
    *  渐变FillRange
    * @param aniNode 需要变化的目标对象
    * @param startFillRange 变化前的 FillRange
    * @param endFillRange 目标 FillRange
    * @param duration 变化时间
    * @param callBack 回调函数
    * @returns
    */
    public static ChangeFillRange ( aniNode: Node, startFillRange: number = 0, endFillRange = 1, duration: number = 0.3, callBack?: Function )
    {
        if ( aniNode == null )
        {
            callBack && callBack();
            return;
        }
        if ( duration < 0 )
        {
            duration = 0;
        }
        let sprite = aniNode.getComponent( Sprite );
        if ( sprite )
        {
            sprite.fillRange = startFillRange;
            tween( sprite )
                .to( duration, { fillRange: endFillRange } )
                .call(
                    () =>
                    {
                        callBack && callBack()
                    }
                )
                .start()
        }
        else
        {
            callBack && callBack();
            console.error( aniNode.name, "未找到 sprite 组件" );
        }
    }

    public static MoveTo ( target: Node, duration: number, endVal: Vec3, fun?: Function )
    {
        tween( target ).to( duration, { position: endVal }, { easing: "linear" } )
            .call( () =>
            {
                if ( fun )
                    fun();
            } )
            .start()
    }

    public static ScaleLoopTimes ( target: Node, toScale: number, bcakScale: number, toTime: number = 0.12, backTime: number = 0.1, cb?: Function )
    {
        tween( target )
            .sequence
            (
                tween().to( toTime, { scale: new Vec3( toScale, toScale, toScale ) }, { easing: "linear" } ),
                tween().to( backTime, { scale: new Vec3( bcakScale, bcakScale, bcakScale ) }, { easing: "linear" } ),
            )
            .repeat( 3 )
            .call( () =>
            {
                cb && cb();
            } )
            .start();
    }

    public static MoveY ( target: Node, tomoveY: number, toTime: number = 0.12, cb?: Function )
    {
        tween( target )
            .to( toTime, { position: new Vec3( target.position.x, tomoveY, target.position.z ) }, { easing: "linear" } )
            .call( () =>
            {
                cb && cb();
            } )
            .start();
    }

    public static MoveZ ( target: Node, tomoveZ: number, toTime: number = 0.12, cb?: Function )
    {
        tween( target )
            .to( toTime, { position: new Vec3( target.position.x, target.position.y, tomoveZ ) }, { easing: "linear" } )
            .call( () =>
            {
                cb && cb();
            } )
            .start();
    }

    public static ScaleTo ( target: Node, dur: number = 0.3, toScale: number, cb?: Function )
    {
        tween( target )
            .to( dur, { scale: new Vec3( toScale, toScale, toScale ) }, { easing: "linear" } )
            .call( () =>
            {
                cb && cb();
            } )
            .start();
    }
	
	 public static TweenLerp ( self: Vec3, dur: number, target: Vec3, cb?: Function )//线性插值
    {
        tween( self )
            .to( dur, {
                x: target.x,
                y: target.y,
                z: target.z
            }, {
                // 线性插值更新函数
                onUpdate: ( target: Vec3, ratio: number ) =>
                {
                    // 计算当前插值进度
                    const progress = ratio / 2.0;
                    Vec3.lerp( self, self, target, progress );
                }
            } )
            .call( () =>
            {
                cb && cb();
            } )
            .start();
    }
}