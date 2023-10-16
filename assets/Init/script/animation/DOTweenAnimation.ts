import { Label, ProgressBar, Sprite, tween, Vec3, Node } from "cc";

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
                tween().to( duration, { scale: 1 + range } ),
                tween().to( duration, { scale: 1 } ),
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
    public static scaleBackOut ( target: Node, duration: number, range: number, delayTime: number ): void
    {
        tween( target )
            .delay( delayTime )
            .sequence(
                tween().to( duration, { scale: range } ),
                tween().to( duration * 5, { scale: 1 }, { easing: "backOut" } )
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
    public static move_Left_Right ( target, duration: number, startVal: Vec3, posXC_Left: number, posXC_right: number, delayTime: number, fun?: Function )
    {
        return tween( target )
            .sequence(
                tween().to( duration, { position: new Vec3( posXC_Left, startVal.y ) } ),
                tween().to( duration, { position: new Vec3( posXC_right, startVal.y ) } ),
                tween().delay( delayTime ),
                tween().call( () =>
                {
                    fun();
                } )
            )
            .repeatForever()
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

        // target.scaleY=startVal;  
        tween( target )
            .delay( delayTime )
            .sequence(
                tween().to( duration, { scale: endVal }, { easing: "backOut" } )
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
            .delay( delayTime )
            .sequence(
                tween().to( duration, { position: new Vec3( startVal.x, startVal.y + range ) } )
                    .call( () =>
                    {
                        if ( fun )
                            fun();
                    } ) )
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
    public static stepNumProgress ( textLab: Sprite, startNum: number, interNum: number, endNum: number, delayTime?: number, extraDec_B?: string, fun?: Function )
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
                    textLab.fillStart = startNum;
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
    public static stepNumProgressFly ( textLab: ProgressBar, startNum: number, interNum: number, endNum: number, delayTime?: number, fun?: Function )
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
                    textLab.progress = startNum;
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
}