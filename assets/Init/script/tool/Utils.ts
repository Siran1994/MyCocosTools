import { Quat, Texture2D, Tween, UITransform, gfx, sys, v2, v3 } from "cc";
import { Vec3, bezier, tween, Node } from "cc";
let tempVec: Vec3 = v3()
let tempVec2: Vec3 = v3()
let tempVec3: Vec3 = v3()
let up = v3()
export class Utils 
{

    //从第二个数组随机选取最多3个不重复元素添加到第一个数组
    static mergeRandomUnique<T> ( arr: T[], sourceArr: T[] ): T[]
    {
        if ( !sourceArr.length ) return arr;

        const existSet = new Set<T>( arr );
        const candidateSet = new Set<T>();

        // 构建候选集（去重且不在arr中的元素）
        for ( const element of sourceArr )
        {
            if ( !existSet.has( element ) )
            {
                candidateSet.add( element );
            }
        }
        // 随机选择最多3个元素
        const candidates = Array.from( candidateSet );
        const minCount = Math.min( 3, candidates.length );

        // Fisher-Yates 随机算法
        for ( let i = 0; i < minCount; i++ )
        {
            const randomIndex = Math.floor( Math.random() * ( candidates.length - i ) ) + i;
            // 交换元素到数组前部
            [ candidates[ i ], candidates[ randomIndex ] ] = [ candidates[ randomIndex ], candidates[ i ] ];
            // 添加选中的元素
            arr.push( candidates[ i ] );
            existSet.add( candidates[ i ] );
        }

        return arr;
    }

    //将第二个数组的元素合并到第一个数组中，排除重复元素
    static mergeUnique<T> ( arr: T[], elementsToAdd: T[] ): T[]
    {
        // 使用Set快速查找重复元素
        const existSet = new Set<T>( arr );

        // 遍历并添加非重复元素
        const len = elementsToAdd.length;
        for ( let i = 0; i < len; i++ )
        {
            const element = elementsToAdd[ i ];
            if ( !existSet.has( element ) )
            {
                arr.push( element );
                existSet.add( element );
            }
        }

        return arr;
    }

    //获取左右相邻的的元素(5个)
    getSurroundingNumbers ( num, maxNum ): number[]
    {
        // 调整数值到1-12范围的辅助函数
        const adjust = ( x: number ): number => ( ( x - 1 + maxNum ) % maxNum ) + 1;
        // 计算并返回包含左右各两位的数组
        return [
            adjust( num - 2 ), // 左二
            adjust( num - 1 ), // 左一
            adjust( num ),     // 当前
            adjust( num + 1 ), // 右一
            adjust( num + 2 )  // 右二
        ];
    }

    //按照路径点匀速移动
    moveAlongWorldNodes ( target: Node, pathNodes: Node[], totalDuration: number, cb: Function )
    {
        // 参数校验
        if ( !target || !pathNodes || pathNodes.length < 2 )
        {
            console.warn( 'PathMover: 无效参数 - 目标或路径点不足（至少需要2个路径节点）' );
            return;
        }
        // 提前计算出世界坐标路径（避免在动画过程中重复计算）
        const worldPath: Vec3[] = [];
        for ( const node of pathNodes )
        {
            worldPath.push( new Vec3( node.worldPosition ) );
        }
        // 停止可能存在的旧动画
        tween( target ).stop();
        // 计算路径总长度
        let totalDistance = 0;
        for ( let i = 0; i < worldPath.length - 1; i++ )
        {
            totalDistance += Vec3.distance( worldPath[ i ], worldPath[ i + 1 ] );
        }
        // 处理零距离特殊情况
        if ( totalDistance <= 0.001 )
        {
            target.worldPosition = worldPath[ worldPath.length - 1 ].clone();
            return;
        }
        // 转换为目标节点的本地坐标系统使用的路径点
        const localPath: Vec3[] = [];
        for ( const worldPos of worldPath )
        {
            const localPos = target.parent!.inverseTransformPoint( new Vec3(), worldPos );
            localPath.push( localPos );
        }
        // 创建缓动序列
        const tweenSequence = tween( target );
        // 设置起始位置
        tweenSequence.call( () =>
        {
            target.worldPosition = worldPath[ 0 ].clone();
        } );

        // 添加每段路径动画
        for ( let i = 0; i < worldPath.length - 1; i++ )
        {
            const nextPoint = localPath[ i + 1 ];
            const segmentDistance = Vec3.distance( worldPath[ i ], worldPath[ i + 1 ] );
            const segmentDuration = totalDuration * ( segmentDistance / totalDistance );

            // 添加路径段动画
            tweenSequence.to( segmentDuration, {
                position: new Vec3( nextPoint.x, nextPoint.y, nextPoint.z )
            } );
        }
        // 启动动画
        tweenSequence
            .call( () =>
            {
                cb();
            } )
            .start();
    }

    //截取字符串后第一带数字的字符
    static getTrailingNumber ( str: string ): number
    {
        let index = str.length - 1;
        while ( index >= 0 && ( str[ index ] >= '0' && str[ index ] <= '9' ) )
        {
            index--;
        }
        return parseInt( str.substring( index + 1 ), 10 );
    }

    //抛物线飞行
    static flyTo ( item: Node, parent: Node, targetPos: Vec3, t: number = 0.25, ecb?: Function, scb?: Function )
    {
        let oldPos = item.worldPosition.clone();
        let oldRotation = item.worldRotation.clone()

        item.parent = parent;
        scb && scb();
        let newAngle = item.eulerAngles.clone()

        item.worldPosition = oldPos;
        item.worldRotation = oldRotation;

        let startPos = oldPos;
        let controlPos = v3()
        let des = targetPos
        Vec3.add( controlPos, startPos, des )
        Vec3.multiplyScalar( controlPos, controlPos, 0.5 )
        controlPos.add( v3( 0, 5, 0 ) )

        //tween( item ).to( t, { eulerAngles: newAngle } ).start();
        item.scale.multiplyScalar( 0.8 );
        tween( item )
            .sequence
            (
                tween().to( t, { eulerAngles: newAngle } ),
                tween().to( t, { scale: Vec3.ONE }, { easing: "backInOut" } ),
            )
            .start();
        this.bezierTo( item, t, startPos, controlPos, des ).call( () =>
        {
            ecb && ecb();
        } ).start();
    }

    static bezierTo ( target: any, duration: number, p1: Vec3, cp: Vec3, p2: Vec3, opts?: any ): Tween<any>
    {
        opts = opts || Object.create( null );
        let twoBezier = ( t: number, p1: Vec3, cp: Vec3, p2: Vec3 ) =>
        {
            let x = ( 1 - t ) * ( 1 - t ) * p1.x + 2 * t * ( 1 - t ) * cp.x + t * t * p2.x;
            let y = ( 1 - t ) * ( 1 - t ) * p1.y + 2 * t * ( 1 - t ) * cp.y + t * t * p2.y;
            let z = ( 1 - t ) * ( 1 - t ) * p1.z + 2 * t * ( 1 - t ) * cp.z + t * t * p2.z;
            return new Vec3( x, y, z );
        };
        opts.onUpdate = ( _arg: Vec3, ratio: number ) =>
        {
            target.worldPosition = twoBezier( ratio, p1, cp, p2 );
        };
        return tween( target ).to( duration, {}, opts );
    }

    static setRigDir ( target: Node, targetPos )
    {
        let direction = new Vec3( target.worldPosition.x - targetPos.x, 0, target.worldPosition.z - targetPos.z ).normalize();
        let targetDir = new Quat();
        Quat.rotationTo( targetDir, Vec3.FORWARD, direction );
        target.setWorldRotation( targetDir );
    }
    // 随机旋转轴
    static randomRotateAxis (): Vec3
    {
        return new Vec3(
            Math.random() * 0.2 * 360,          // X轴减少旋转
            ( Math.random() + 0.5 ) * 1.2 * 360,  // Y轴强化旋转
            Math.random() * 0.2 * 360           // Z轴减少旋转
        );
    }

    // 生成球形分布点
    static getSpherePoints ( count: number, radius: number ): Vec3[]
    {
        const points: Vec3[] = [];
        const phi = Math.PI * ( 3 - Math.sqrt( 5 ) ); // 黄金角度
        for ( let i = 0; i < count; i++ )
        {
            const y = 1 - ( i / ( count - 1 ) ) * 2; // y的范围从1到-1
            const theta = phi * i;
            const radiusAtY = Math.sqrt( 1 - y * y );
            const x = Math.cos( theta ) * radiusAtY;
            const z = Math.sin( theta ) * radiusAtY;
            const point = new Vec3( x * radius, y * radius, z * radius );
            points.push( point );
        }
        return points;
    }


    //#region 实时抛物线
    static FlyToTarget ( targetNode: Node, targetPos: Vec3, cb?: Function )
    {
        if ( !targetPos ) return;
        let startPosition = targetNode.worldPosition;
        let distance = targetPos.subtract( startPosition );
        let height = Math.max( distance.y + 1, 3 );
        // 计算飞行路径的控制点  
        let controlPoint = v3( startPosition.x + distance.x / 2, startPosition.y + height, startPosition.z + distance.z / 2 );
        // 创建抛物线动画  
        let startTime = Date.now();
        let updateProjectilePosition = () =>
        {
            let elapsedTime = Date.now() - startTime;
            let t = Math.min( elapsedTime / 1, 1 );
            // 计算当前的抛物线位置  
            let currentPosition = Utils.calculateParabolaPosition( startPosition, controlPoint, targetPos, t );
            targetNode.setWorldPosition( currentPosition );

            if ( t < 1 )
            {
                requestAnimationFrame( updateProjectilePosition );
            }
            else
            {
                cb && cb();
            }
        };
        requestAnimationFrame( updateProjectilePosition );
    }

    static calculateParabolaPosition ( start: Vec3, control: Vec3, end: Vec3, t: number ): Vec3
    {
        let x = this.interpolate( start.x, control.x, end.x, t );
        let y = this.interpolate( start.y, control.y, end.y, t );
        let z = this.interpolate( start.z, control.z, end.z, t );
        return v3( x, y, z );
    }

    static interpolate ( p0: number, p1: number, p2: number, t: number ): number
    {
        return ( 1 - t ) * ( 1 - t ) * p0 + 2 * ( 1 - t ) * t * p1 + t * t * p2;
    }
    //#endregion


    static getToday ()
    {
        let lt10 = ( v: number ) =>
        {
            return v < 10 ? "0" + v : "" + v;
        }
        let date = new Date();
        let str = date.getFullYear() + lt10( date.getMonth() + 1 ) + lt10( date.getDate() );
        return parseInt( str );
    }

    static deltaDay ( date1: number, date2: number )
    {
        let str1 = date1.toString();
        let str2 = date2.toString();
        if ( str1.length == 8 && str2.length == 8 )
        {
            let d1 = new Date( str1.substring( 4, 2 ) + "/" + str1.substring( 6, 2 ) + "/" + str1.substring( 0, 4 ) );
            let d2 = new Date( str2.substring( 4, 2 ) + "/" + str2.substring( 6, 2 ) + "/" + str2.substring( 0, 4 ) );
            let days = Math.abs( d1.getTime() - d2.getTime() ) / ( 24 * 60 * 60 * 1000 );
            return Math.floor( days );
        } else
        {
            return -1;
        }
    }

    public static ToMS ( time: number ): string //分:秒
    {
        time = Math.floor( time );
        let minute: number = 0;
        let second: number = 0;

        minute = Math.floor( time / 60 );
        time -= minute * 60;

        second = Math.floor( time );

        let minute_string: string = minute < 10 ? `0${ minute }` : `${ minute }`;
        let second_string: string = second < 10 ? `0${ second }` : `${ second }`;

        return minute_string + ":" + second_string
    }

    public static clock ( time: number ): string //时:分:秒
    {
        time = Math.floor( time );

        let hour: number = 0;
        let minute: number = 0;
        let second: number = 0;

        hour = Math.floor( time / 3600 );
        time -= hour * 3600;

        minute = Math.floor( time / 60 );
        time -= minute * 60;

        second = Math.floor( time );

        let hour_string: string = hour < 10 ? `0${ hour }` : `${ hour }`;
        let minute_string: string = minute < 10 ? `0${ minute }` : `${ minute }`;
        let second_string: string = second < 10 ? `0${ second }` : `${ second }`;

        return hour_string + ":" + minute_string + ":" + second_string
    }

    static formatCountDownMS ( timeMS: number, template: 1 | 2 | 3 | 4, separator = ":" )//时:分:秒
    {
        let str: string;
        let lt10 = v =>
        {
            return v < 10 ? "0" + v : v;
        }
        let date = new Date();
        let offset = date.getTimezoneOffset();//时区差异 minutes
        date.setTime( timeMS + offset * 60 * 1000 );
        let days = date.getDate() - 1;
        let hours = date.getHours() + days * 24;
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        if ( template == 1 )
        {
            str = `${ lt10( hours ) }${ separator }${ lt10( minutes ) }${ separator }${ lt10( seconds ) }`;
        } else if ( template == 2 )
        {
            str = `${ lt10( hours ) }时${ lt10( minutes ) }分${ lt10( seconds ) }秒`;
        } else if ( template == 3 )
        {
            str = hours > 0 ? `${ lt10( hours ) }${ separator }` : "";
            str += `${ lt10( minutes ) }${ separator }${ lt10( seconds ) }`;
        } else if ( template == 4 )
        {
            str = hours > 0 ? `${ lt10( hours ) }时` : "";
            str += `${ lt10( minutes ) }分${ lt10( seconds ) }秒`;
        }
        return str;
    }

    static formatTime ( formatStr: string, date?: Date )//年月日时分秒
    {
        if ( date == undefined )
        {
            date = new Date();
        }
        let lt10 = v =>
        {
            return v < 10 ? "0" + v : v;
        }
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hour = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();
        formatStr = formatStr.replace( "YYYY", year.toString() );
        formatStr = formatStr.replace( "MM", lt10( month ).toString() );
        formatStr = formatStr.replace( "DD", lt10( day ).toString() );
        formatStr = formatStr.replace( "hh", lt10( hour ).toString() );
        formatStr = formatStr.replace( "mm", lt10( minute ).toString() );
        formatStr = formatStr.replace( "ss", lt10( second ).toString() );
        return formatStr;
    }

    static formatTime2 ( times: number )//年月日时分秒
    {
        const date = new Date( times );
        let lt10 = v =>
        {
            return v < 10 ? "0" + v : v;
        }
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hour = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();
        return `${ year }年${ lt10( month ) }月${ lt10( day ) }日${ lt10( hour ) }时${ lt10( minute ) }分${ lt10( second ) }秒`;;
    }

    static formatTime3 ( times: number )
    {
        const date = new Date( times );
        let lt10 = v =>
        {
            return v < 10 ? "0" + v : v;
        }
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        return `${ year }年${ lt10( month ) }月${ lt10( day ) }日`;;
    }

    public static shuffleArrayNums ( array: number[] ): number[]
    {
        for ( let i = array.length - 1; i > 0; i-- )
        {
            const j = Math.floor( Math.random() * ( i + 1 ) );
            [ array[ i ], array[ j ] ] = [ array[ j ], array[ i ] ];
        }
        return array;
    }

    public static generateShuffledArray ( rangeStart: number, rangeEnd: number, exclude: number ): number[]
    {
        const array: number[] = [];
        for ( let i = rangeStart; i <= rangeEnd; i++ )
        {
            if ( i !== exclude )
            {
                array.push( i );
            }
        }

        const shuffledArray = Utils.shuffleArrayNums( array );
        return shuffledArray;
    }

    public static random ( min, max )
    {
        let r = Math.random();
        let rr = r * ( max - min + 1 ) + min;
        return Math.floor( rr );
    }

    public static rand ( arr: any )
    {
        let arrClone = this.clone( arr );

        for ( let i = arrClone.length - 1; i >= 0; i-- )
        {
            const randomIndex = Math.floor( Math.random() * ( i + 1 ) );
            const itemIndex = arrClone[ randomIndex ];
            arrClone[ randomIndex ] = arrClone[ i ];
            arrClone[ i ] = itemIndex;
        }
        return arrClone;
    }

    static randomNum ( min: number, max: number, isInteger = true )
    {
        let delta = max - min;
        let value = Math.random() * delta + min;
        if ( isInteger )
            value = Math.round( value );
        return value;
    }

    public static randomNumber ( section1, section2?: number ): number
    {
        if ( section2 )
            return Math.round( Math.random() * ( section2 - section1 ) ) + section1;
        else
            return Math.round( Math.random() * section1 );
    }

    public static randomNumber_NoRound ( section1, section2?: number ): number
    {
        if ( section2 )
            return Math.random() * ( section2 - section1 ) + section1;
        else
            return Math.random() * section1;
    }

    public static getWeightRandIndex ( weightArr: any, totalWeight: number )
    {
        const randWeight = Math.floor( Math.random() * totalWeight );
        let sum = 0;
        let weightIndex = 0;
        for ( weightIndex; weightIndex < weightArr.length; weightIndex++ )
        {
            sum += weightArr[ weightIndex ];
            if ( randWeight < sum )
            {
                break;
            }
        }
        return weightIndex;
    }

    public static getRandomNFromM ( n: number, m: number )
    {
        const array: number[] = [];
        let intRd = 0;
        let count = 0;

        while ( count < m )
        {
            if ( count >= n + 1 )
            {
                break;
            }

            intRd = this.getRandomInt( 0, n );
            let flag = 0;
            for ( let i = 0; i < count; i++ )
            {
                if ( array[ i ] === intRd )
                {
                    flag = 1;
                    break;
                }
            }

            if ( flag === 0 )
            {
                array[ count ] = intRd;
                count++;
            }
        }

        return array;
    }

    static getRandomInt ( min: number, max: number ): number
    {
        return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
    }
    static getRandomUniqueNumbers ( n: number, x: number ): number[]
    {
        if ( x > n )
        {
            throw new Error( "x cannot be greater than n" );
        }

        const result: number[] = [];
        const availableNumbers: number[] = Array.from( { length: n }, ( _, i ) => i );

        for ( let i = 0; i < x; i++ )
        {
            const randomIndex = Utils.getRandomInt( 0, availableNumbers.length - 1 );
            const randomNumber = availableNumbers.splice( randomIndex, 1 )[ 0 ];
            result.push( randomNumber );
        }
        return result;
    }

    public static getRandomNumbers ( min: number, max: number, count: number ): number[]
    {

        const randomNumbers = new Set<number>();

        while ( randomNumbers.size < count )
        {
            const randomNum = Math.floor( Math.random() * ( max - min + 1 ) ) + min;
            randomNumbers.add( randomNum );
        }

        return Array.from( randomNumbers );
    }

    public static getRandomNumber ( min: number, max: number, exclude: number ): number
    {
        if ( min > max )
        {
            throw new Error( "" );
        }

        if ( exclude < min || exclude > max )
        {
            throw new Error( "" );
        }

        let randomNumber: number;

        do
        {
            randomNumber = Math.floor( Math.random() * ( max - min + 1 ) ) + min;
        } while ( randomNumber === exclude );

        return randomNumber;
    }

    static fixFloat ( value: number, fractionDigits: number, canEndWithZero = false )
    {
        if ( fractionDigits < 0 ) fractionDigits = 0;
        let str = value.toFixed( fractionDigits );
        if ( canEndWithZero )
            return str;
        else
        {
            while ( true )
            {
                if ( str.length > 1 && str.includes( "." ) )
                {
                    if ( str.endsWith( "0" ) || str.endsWith( "." ) )
                        str = str.substring( 0, str.length - 1 );
                    else
                        break;
                }
                else
                    break;
            }
        }
        return str;
    }

    public static randomValueByWeight<T> ( list: T[], num = 1, weight?: ( item: T ) => number, canRepeat = false )
    {
        let result: T[] = [];
        if ( !list || list.length == 0 ) return result;
        if ( list.length < num ) console.warn( "" );
        if ( !weight ) weight = ( item: T ) => 1;

        let count: number = Math.min( list.length, num );
        let totalWeight = 0;

        for ( const item of list )
        {
            totalWeight += weight( item );
        }

        while ( result.length < count )
        {
            let randomV = Math.floor( Math.random() * totalWeight );;
            let tmpWeight = 0;

            for ( const item of list )
            {
                let w = weight( item );
                if ( randomV >= tmpWeight && randomV < tmpWeight + w )
                {
                    if ( !canRepeat ) 
                    {
                        let index = result.indexOf( item );
                        if ( index == -1 ) result.push( item );
                        else break;
                    }
                    else
                    {
                        result.push( item );
                    }
                }
                tmpWeight += w;
            }
        }
        return result;
    }

    static bezierCurve2 ( duration: number, startPos: Vec3, controlPos: Vec3, endPos: Vec3, targetGo: Node, func?: Function )
    {
        const quadraticCurve = ( t: number, p1: Vec3, cp: Vec3, p2: Vec3, out: Vec3 ) =>
        {
            out.x = ( 1 - t ) * ( 1 - t ) * p1.x + 2 * t * ( 1 - t ) * cp.x + t * t * p2.x;
            out.y = ( 1 - t ) * ( 1 - t ) * p1.y + 2 * t * ( 1 - t ) * cp.y + t * t * p2.y;
            out.z = ( 1 - t ) * ( 1 - t ) * p1.z + 2 * t * ( 1 - t ) * cp.z + t * t * p2.z;
        }
        const tempVec3 = new Vec3();
        targetGo.scale = new Vec3( 0.3, 0.3, 0.3 );
        tween( targetGo )
            .sequence
            (
                tween().to( duration,
                    {
                        position: endPos,
                        scale: Vec3.ONE,
                    },
                    {
                        onUpdate: ( target, ratio ) =>
                        {
                            quadraticCurve( ratio, startPos, controlPos, endPos, tempVec3 );
                            targetGo.setPosition( tempVec3 );
                        }
                    } ),
                tween().call( () =>
                {
                    func && func();
                } )
            )
            .start();
    }

    static bezierCurve2World ( duration: number, startPos: Vec3, controlPos: Vec3, endPos: Vec3, targetGo: Node, func?: Function )
    {
        const quadraticCurve = ( t: number, p1: Vec3, cp: Vec3, p2: Vec3, out: Vec3 ) =>
        {
            out.x = ( 1 - t ) * ( 1 - t ) * p1.x + 2 * t * ( 1 - t ) * cp.x + t * t * p2.x;
            out.y = ( 1 - t ) * ( 1 - t ) * p1.y + 2 * t * ( 1 - t ) * cp.y + t * t * p2.y;
            out.z = ( 1 - t ) * ( 1 - t ) * p1.z + 2 * t * ( 1 - t ) * cp.z + t * t * p2.z;
        }
        const tempVec3 = new Vec3();

        tween( targetGo )
            .sequence
            (
                tween().to( duration,
                    { worldPosition: endPos },
                    {
                        onUpdate: ( target, ratio ) =>
                        {
                            quadraticCurve( ratio, startPos, controlPos, endPos, tempVec3 );
                            targetGo.setPosition( tempVec3 );
                        }
                    } ),
                tween().call( () =>
                {
                    func && func();
                } )
            )
            .start();
    }

    static bezierCurve3 ( duration: number, startPos: Vec3, controlPos1: Vec3, controlPos2: Vec3, endPos: Vec3, targetGo: Node )
    {
        const bezierCurve = ( t: number, p1: Vec3, cp1: Vec3, cp2: Vec3, p2: Vec3, out: Vec3 ) =>
        {
            out.x = bezier( p1.x, cp1.x, cp2.x, p2.x, t );
            out.y = bezier( p1.y, cp1.y, cp2.y, p2.y, t );
            out.z = bezier( p1.z, cp1.z, cp2.z, p2.z, t );
        }
        const tempVec3 = new Vec3();

        tween( targetGo ).to( duration,
            { position: endPos },
            {
                onUpdate: ( target, ratio ) =>
                {
                    bezierCurve( ratio, startPos, controlPos1, controlPos2, endPos, tempVec3 );
                    targetGo.setPosition( tempVec3 );
                }
            } )
            .start();
    }
    public static stringToArray ( string: string )
    {
        let rsAstralRange = '\\ud800-\\udfff';
        let rsZWJ = '\\u200d';
        let rsVarRange = '\\ufe0e\\ufe0f';
        let rsComboMarksRange = '\\u0300-\\u036f';
        let reComboHalfMarksRange = '\\ufe20-\\ufe2f';
        let rsComboSymbolsRange = '\\u20d0-\\u20ff';
        let rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange;
        let reHasUnicode = RegExp( '[' + rsZWJ + rsAstralRange + rsComboRange + rsVarRange + ']' );

        let rsFitz = '\\ud83c[\\udffb-\\udfff]';
        let rsOptVar = '[' + rsVarRange + ']?';
        let rsCombo = '[' + rsComboRange + ']';
        let rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')';
        let reOptMod = rsModifier + '?';
        let rsAstral = '[' + rsAstralRange + ']';
        let rsNonAstral = '[^' + rsAstralRange + ']';
        let rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}';
        let rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]';
        let rsOptJoin = '(?:' + rsZWJ + '(?:' + [ rsNonAstral, rsRegional, rsSurrPair ].join( '|' ) + ')' + rsOptVar + reOptMod + ')*';
        let rsSeq = rsOptVar + reOptMod + rsOptJoin;
        let rsSymbol = '(?:' + [ rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral ].join( '|' ) + ')';
        let reUnicode = RegExp( rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g' );

        let hasUnicode = function ( val: string )
        {
            return reHasUnicode.test( val );
        };

        let unicodeToArray = function ( val: string )
        {
            return val.match( reUnicode ) || [];
        };

        let asciiToArray = function ( val: string )
        {
            return val.split( '' );
        };

        return hasUnicode( string ) ? unicodeToArray( string ) : asciiToArray( string );
    }

    static genUUID ()
    {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g, function ( c )
        {
            let r = Math.random() * 16 | 0;
            let v = c == 'x' ? r : ( r & 0x3 | 0x8 );
            return v.toString( 16 );
        } );
    }

    public static simulationUUID ()
    {
        function s4 ()
        {
            return Math.floor( ( 1 + Math.random() ) * 0x10000 )
                .toString( 16 )
                .substring( 1 );
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    static trims ( source: string, ...strs: string[] )
    {
        if ( !source ) return source;
        if ( strs.length == 0 ) return source.trim();
        for ( const str of strs )
        {
            while ( source.startsWith( str ) )
            {
                source = source.substring( str.length );
            }
            while ( source.endsWith( str ) )
            {
                source = source.substring( 0, source.length - str.length );
            }
        }
        return source;
    }

    public static trim ( str: string )
    {
        return str.replace( /(^\s*)|(\s*$)/g, "" );
    }

    public static getStringLength ( render: string )
    {
        const strArr = render;
        let len = 0;
        for ( let i = 0, n = strArr.length; i < n; i++ )
        {
            const val = strArr.charCodeAt( i );
            if ( val <= 255 )
            {
                len = len + 1;
            } else
            {
                len = len + 2;
            }
        }

        return Math.ceil( len / 2 );
    }

    static formatString ( str: string, ...args: any[] )
    {
        args.forEach( ( v, i ) =>
        {
            str = str.replace( `{${ i }}`, v );
        } );
        return str;
    }

    static upperFirst ( source: string )
    {
        if ( !source ) return source;
        if ( source.length < 2 ) return source.toUpperCase();
        return source[ 0 ].toUpperCase() + source.substring( 1 );
    }

    static lowerFirst ( source: string )
    {
        if ( !source ) return source;
        if ( source.length < 2 ) return source.toLowerCase();
        return source[ 0 ].toLowerCase() + source.substring( 1 );
    }
    static delItemFromArray<T> ( arr: T[], ...item: T[] )
    {
        if ( arr.length > 0 && item.length > 0 )
        {
            item.forEach( v =>
            {
                let index = arr.indexOf( v );
                if ( index > -1 )
                {
                    arr.splice( index, 1 );
                }
            } )
        }
    }
    static countValueTimes<T> ( arr: T[], predicate: ( value: T ) => boolean )
    {
        let times = 0;
        arr.forEach( v =>
        {
            if ( predicate( v ) )
            {
                times++;
            }
        } )
        return times;
    }

    public static encrypt ( str: string )
    {
        let b64Data = this.base64encode( str );

        let n = 6;
        if ( b64Data.length % 2 === 0 )
            n = 7;
        let encodeData = '';

        for ( let idx = 0; idx < ( b64Data.length - n + 1 ) / 2; idx++ )
        {
            encodeData += b64Data[ 2 * idx + 1 ];
            encodeData += b64Data[ 2 * idx ];
        }
        encodeData += b64Data.slice( b64Data.length - n + 1 );

        return encodeData;
    }

    public static decrypt ( b64Data: string | string[] )
    {
        let n = 6;
        if ( b64Data.length % 2 === 0 )
        {
            n = 7;
        }

        let decodeData = '';
        for ( let idx = 0; idx < b64Data.length - n; idx += 2 )
        {
            decodeData += b64Data[ idx + 1 ];
            decodeData += b64Data[ idx ];
        }

        decodeData += b64Data.slice( b64Data.length - n + 1 );

        decodeData = this.base64Decode( decodeData );

        return decodeData;
    }

    public static base64encode ( input: string )
    {
        let keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        let output = "", chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0;
        input = this.utf8Encode( input );
        while ( i < input.length )
        {
            chr1 = input.charCodeAt( i++ );
            chr2 = input.charCodeAt( i++ );
            chr3 = input.charCodeAt( i++ );
            enc1 = chr1 >> 2;
            enc2 = ( ( chr1 & 3 ) << 4 ) | ( chr2 >> 4 );
            enc3 = ( ( chr2 & 15 ) << 2 ) | ( chr3 >> 6 );
            enc4 = chr3 & 63;
            if ( isNaN( chr2 ) )
            {
                enc3 = enc4 = 64;
            } else if ( isNaN( chr3 ) )
            {
                enc4 = 64;
            }
            output = output +
                keyStr.charAt( enc1 ) + keyStr.charAt( enc2 ) +
                keyStr.charAt( enc3 ) + keyStr.charAt( enc4 );
        }
        return output;
    }

    public static utf8Encode ( string: string )
    {
        string = string.replace( /\r\n/g, "\n" );
        let utftext = "";
        for ( let n = 0; n < string.length; n++ )
        {
            let c = string.charCodeAt( n );
            if ( c < 128 )
            {
                utftext += String.fromCharCode( c );
            } else if ( ( c > 127 ) && ( c < 2048 ) )
            {
                utftext += String.fromCharCode( ( c >> 6 ) | 192 );
                utftext += String.fromCharCode( ( c & 63 ) | 128 );
            } else
            {
                utftext += String.fromCharCode( ( c >> 12 ) | 224 );
                utftext += String.fromCharCode( ( ( c >> 6 ) & 63 ) | 128 );
                utftext += String.fromCharCode( ( c & 63 ) | 128 );
            }

        }
        return utftext;
    }

    public static base64Decode ( input: string )
    {
        let keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        let output = "";
        let chr1;
        let chr2;
        let chr3;
        let enc1;
        let enc2;
        let enc3;
        let enc4;
        let i = 0;
        input = input.replace( /[^A-Za-z0-9\+\/\=]/g, "" );
        while ( i < input.length )
        {
            enc1 = keyStr.indexOf( input.charAt( i++ ) );
            enc2 = keyStr.indexOf( input.charAt( i++ ) );
            enc3 = keyStr.indexOf( input.charAt( i++ ) );
            enc4 = keyStr.indexOf( input.charAt( i++ ) );
            chr1 = ( enc1 << 2 ) | ( enc2 >> 4 );
            chr2 = ( ( enc2 & 15 ) << 4 ) | ( enc3 >> 2 );
            chr3 = ( ( enc3 & 3 ) << 6 ) | enc4;
            output = output + String.fromCharCode( chr1 );
            if ( enc3 != 64 )
            {
                output = output + String.fromCharCode( chr2 );
            }
            if ( enc4 != 64 )
            {
                output = output + String.fromCharCode( chr3 );
            }
        }
        output = this.utf8Decode( output );
        return output;
    }

    public static utf8Decode ( utftext: string )
    {
        let string = "";
        let i = 0;
        let c = 0;
        let c1 = 0;
        let c2 = 0;
        let c3 = 0;
        while ( i < utftext.length )
        {
            c = utftext.charCodeAt( i );
            if ( c < 128 )
            {
                string += String.fromCharCode( c );
                i++;
            } else if ( ( c > 191 ) && ( c < 224 ) )
            {
                c2 = utftext.charCodeAt( i + 1 );
                string += String.fromCharCode( ( ( c & 31 ) << 6 ) | ( c2 & 63 ) );
                i += 2;
            } else
            {
                c2 = utftext.charCodeAt( i + 1 );
                c3 = utftext.charCodeAt( i + 2 );
                string += String.fromCharCode( ( ( c & 15 ) << 12 ) | ( ( c2 & 63 ) << 6 ) | ( c3 & 63 ) );
                i += 3;
            }
        }
        return string;
    }

    public static shuffleArray<T> ( array: T[] ): T[]
    {
        let shuffledArray = array.slice();
        for ( let i = shuffledArray.length - 1; i > 0; i-- )
        {
            const j = Math.floor( Math.random() * ( i + 1 ) );

            [ shuffledArray[ i ], shuffledArray[ j ] ] = [ shuffledArray[ j ], shuffledArray[ i ] ];
        }
        return shuffledArray;
    }

    public static max ( array )
    {
        if ( array && array.length )
        {
            let result;
            for ( let i = 0; i < array.length; i++ )
            {
                if ( i === 0 )
                {
                    result = array[ 0 ];
                } else if ( result < array[ i ] )
                {
                    result = array[ i ];
                }
            }
            return result;
        }
        return undefined;
    }

    public static clone ( sObj: any )
    {
        if ( sObj === null || typeof sObj !== "object" )
            return sObj;

        let s: any = {};
        if ( sObj.constructor === Array )
            s = [];

        for ( const i in sObj )
        {
            if ( sObj.hasOwnProperty( i ) )
                s[ i ] = this.clone( sObj[ i ] );
        }
        return s;
    }

    public static cloneDeep ( sObj )
    {
        if ( sObj === null || typeof sObj !== "object" )
        {
            return sObj;
        }

        let s = {};
        if ( sObj.constructor === Array )
        {
            s = [];
        }

        for ( let i in sObj )
        {
            if ( sObj.hasOwnProperty( i ) )
            {
                s[ i ] = this.cloneDeep( sObj[ i ] );
            }
        }

        return s;
    }

    public static find ( collection, predicate )
    {
        let result;
        if ( !Array.isArray( collection ) )
        {
            collection = this.toArray( collection );
        }

        result = collection.filter( predicate );
        if ( result.length )
        {
            return result[ 0 ];
        }

        return undefined;
    }

    public static forEach ( collection, iteratee )
    {
        if ( !Array.isArray( collection ) )
        {
            let array = this.toArrayKey( collection );
            array.forEach( function ( value, index, arr )
            {
                let key1 = value[ 'key' ];
                let value1 = value[ 'value' ];
                iteratee( value1, key1, collection );
            } );
        } else
        {
            collection.forEach( iteratee );
        }
    }

    public static map ( collection, iteratee )
    {
        if ( !Array.isArray( collection ) )
        {
            collection = this.toArray( collection );
        }

        let arr = [];
        collection.forEach( function ( value, index, array )
        {
            arr.push( iteratee( value, index, array ) );
        } );

        return arr;
    }

    public static toArrayKey ( srcObj )
    {
        let resultArr = [];
        for ( let key in srcObj )
        {
            if ( !srcObj.hasOwnProperty( key ) )
            {
                continue;
            }

            resultArr.push( { key: key, value: srcObj[ key ] } );
        }
        return resultArr;
    }


    public static toArray ( srcObj )
    {
        let resultArr = [];

        for ( let key in srcObj )
        {
            if ( !srcObj.hasOwnProperty( key ) )
            {
                continue;
            }
            resultArr.push( srcObj[ key ] );
        }
        return resultArr;
    }

    public static filter ( collection, iteratees )
    {
        if ( !Array.isArray( collection ) )
        {
            collection = this.toArray( collection );
        }

        return collection.filter( iteratees );
    }

    public static isEqual ( x, y )
    {
        let in1 = x instanceof Object;
        let in2 = y instanceof Object;
        if ( !in1 || !in2 )
        {
            return x === y;
        }
        if ( Object.keys( x ).length !== Object.keys( y ).length )
        {
            return false;
        }

        for ( let p in x )
        {
            let a = x[ p ] instanceof Object;
            let b = y[ p ] instanceof Object;
            if ( a && b )
            {
                return this.isEqual( x[ p ], y[ p ] );
            } else if ( x[ p ] !== y[ p ] )
            {
                return false;
            }
        }

        return true;
    }

    public static findIndex ( array, predicate, fromIndex )
    {
        array = array.slice( fromIndex );
        let i;
        if ( typeof predicate === "function" )
        {
            for ( i = 0; i < array.length; i++ )
            {
                if ( predicate( array[ i ] ) )
                {
                    return i;
                }
            }
        } else if ( Array.isArray( predicate ) )
        {
            for ( i = 0; i < array.length; i++ )
            {
                let key = predicate[ 0 ];
                let vaule = true;
                if ( predicate.length > 1 )
                {
                    vaule = predicate[ 1 ];
                }

                if ( array[ i ][ key ] === vaule )
                {
                    return i;
                }
            }
        } else
        {
            for ( i = 0; i < array.length; i++ )
            {
                if ( array[ i ] === predicate )
                {
                    return i;
                }
            }
        }

        return -1;
    }

    public static concat ()
    {
        let length = arguments.length;
        if ( !length )
        {
            return [];
        }

        let array = arguments[ 0 ];
        let index = 1;
        while ( index < length )
        {
            array = array.concat( arguments[ index ] );
            index++;
        }

        return array;
    }

    public static pullAllWith ( array, value, comparator )
    {
        value.forEach( function ( item )
        {
            let res = array.filter( function ( n )
            {
                return comparator( n, item );
            } );

            res.forEach( function ( item )
            {
                let index = array.indexOf( item );
                if ( array.indexOf( item ) !== -1 )
                {
                    array.splice( index, 1 );
                }
            } );
        } );

        return array;
    }

    public static pullAll ( array, value )
    {
        value.forEach( function ( item )
        {
            let index = array.indexOf( item );
            if ( array.indexOf( item ) !== -1 )
            {
                array.splice( index, 1 );
            }
        } );

        return array;
    }

    public static forEachRight ( collection, iteratee )
    {
        if ( !Array.isArray( collection ) )
        {
            collection = this.toArray( collection );
        }

        for ( let i = collection.length - 1; i >= 0; i-- )
        {
            let ret = iteratee( collection[ i ] );
            if ( !ret ) break;
        }
    }

    public static startsWith ( str, target, position )
    {
        str = str.substr( position );
        return str.startsWith( target );
    }

    public static endsWith ( str, target, position )
    {
        str = str.substr( position );
        return str.endsWith( target );
    }
    public static objectToArray ( srcObj: any )
    {
        const resultArr = [];
        for ( let key in srcObj )
        {
            if ( !srcObj.hasOwnProperty( key ) )
                continue;
            resultArr.push( srcObj[ key ] );
        }
        return resultArr;
    }

    public static arrayToObject ( srcObj: any, objectKey: any )
    {
        const resultObj: any = {};

        for ( let key in srcObj )
        {
            if ( !srcObj.hasOwnProperty( key ) || !srcObj[ key ][ objectKey ] )
                continue;
            resultObj[ srcObj[ key ][ objectKey ] ] = srcObj[ key ];
        }
        return resultObj;
    }

    public static isEmptyObject ( obj: any )
    {
        let result = true;
        if ( obj && obj.constructor === Object )
        {
            for ( const key in obj )
            {
                if ( obj.hasOwnProperty( key ) )
                {
                    result = false;
                    break;
                }
            }
        } else
        {
            result = false;
        }

        return result;
    }

    public static getPropertyCount ( o: Object )
    {
        let n, count = 0;
        for ( n in o )
        {
            if ( o.hasOwnProperty( n ) )
            {
                count++;
            }
        }
        return count;
    }
    public static indexOf ( array, value, fromIndex )
    {
        array = array.slice( fromIndex );
        return array.indexOf( value );
    }

    public static join ( array, separator )
    {
        if ( array === null ) return '';

        let result = '';
        array.forEach( function ( item )
        {
            result += item + separator;
        } );

        return result.substr( 0, result.length - 1 );
    }

    public static split ( string, separator, limit )
    {
        return string.split( separator, limit );
    }



    public static drop ( array, n )
    {
        let length = array === null ? 0 : array.length;
        if ( !length )
        {
            return [];
        }

        return array.slice( n );
    }

    public static flattenDeep ( arr )
    {
        return arr.reduce( function ( prev, cur )
        {
            return prev.concat( Array.isArray( cur ) ? this.flattenDeep( cur ) : cur );
        }, [] );
    }

    public static uniq ( array )
    {
        let result = [];
        array.forEach( function ( item )
        {
            if ( result.indexOf( item ) === -1 )
            {
                result.push( item );
            }
        } );

        return result;
    }

    public static isNaN ( value )
    {
        return this.isNumber( value ) && value !== +value;
    }

    public static chunk ( array, size )
    {
        let length = array === null ? 0 : array.length;
        if ( !length || size < 1 )
        {
            return [];
        }

        let result = [];
        while ( array.length > size )
        {
            result.push( array.slice( 0, size ) );
            array = array.slice( size );
        }

        result.push( array );
        return result;
    }

    public static toFinite ( value )
    {
        let INFINITY = 1 / 0;
        let MAX_INTEGER = 1.7976931348623157e+308;
        if ( !value )
        {
            return value === 0 ? value : 0;
        }
        value = Number( value );
        if ( value === INFINITY || value === -INFINITY )
        {
            let sign = ( value < 0 ? -1 : 1 );
            return sign * MAX_INTEGER;
        }
        return value === value ? value : 0;
    }

    public static baseRange ( start, end, step, fromRight )
    {
        let nativeMax = Math.max;
        let nativeCeil = Math.ceil;
        let index = -1,
            length = nativeMax( nativeCeil( ( end - start ) / ( step || 1 ) ), 0 ),
            result = Array( length );

        while ( length-- )
        {
            result[ fromRight ? length : ++index ] = start;
            start += step;
        }
        return result;
    }

    public static isObject ( value )
    {
        let type = typeof value;
        return value !== null && ( type === 'object' || type === 'function' );
    }

    public static MAX_SAFE_INTEGER = 9007199254740991;
    public static isLength ( value )
    {
        return typeof value === 'number' &&
            value > -1 && value % 1 === 0 && value <= Utils.MAX_SAFE_INTEGER;
    }

    public static isArrayLike ( value )
    {
        return value !== null && this.isLength( value.length )
    }

    public static eq ( value, other )
    {
        return value === other || ( value !== value && other !== other );
    }

    public static isIndex ( value, length )
    {
        let type = typeof value;
        length = length === null ? Utils.MAX_SAFE_INTEGER : length;
        let reIsUint = /^(?:0|[1-9]\d*)$/;
        return !!length &&
            ( type === 'number' ||
                ( type !== 'symbol' && reIsUint.test( value ) ) ) &&
            ( value > -1 && value % 1 === 0 && value < length );
    }

    public static isIterateeCall ( value, index, object )
    {
        if ( !this.isObject( object ) )
        {
            return false;
        }
        let type = typeof index;
        if ( type === 'number' ?
            ( this.isArrayLike( object ) && this.isIndex( index, object.length ) )
            : ( type === 'string' && index in object )
        )
        {
            return this.eq( object[ index ], value );
        }
        return false;
    }

    public static createRange ( fromRight )
    {
        return function ( start, end, step )
        {
            if ( step && typeof step !== 'number' && this.isIterateeCall( start, end, step ) )
            {
                end = step = undefined;
            }
            start = this.toFinite( start );
            if ( end === undefined )
            {
                end = start;
                start = 0;
            } else
            {
                end = this.toFinite( end );
            }
            step = step === undefined ? ( start < end ? 1 : -1 ) : this.toFinite( step );
            return this.baseRange( start, end, step, fromRight );
        };
    }

    public static maxBy ( array, predicate )
    {
        if ( array && array.length )
        {
            let result;
            let objResult;
            for ( let i = 0; i < array.length; i++ )
            {
                if ( i === 0 )
                {
                    result = predicate( array[ 0 ] );
                    objResult = array[ 0 ];
                } else if ( result < array[ i ] )
                {
                    result = ( array[ i ] );
                    objResult = array[ i ];
                }
            }
            return objResult;
        }
        return undefined;
    }

    public static minBy ( array, predicate )
    {
        if ( array && array.length )
        {
            let result;
            let objResult;
            for ( let i = 0; i < array.length; i++ )
            {
                if ( i === 0 )
                {
                    result = predicate( array[ 0 ] );
                    objResult = array[ 0 ];
                } else if ( result > array[ i ] )
                {
                    result = predicate( array[ i ] );
                    objResult = array[ i ];
                }
            }
            return objResult;
        }
        return undefined;
    }

    public static sumBy ( collection, predicate )
    {
        let sum = 0;
        for ( let key in collection )
            sum += predicate( collection[ key ] );
        return sum;
    }

    public static countBy ( collection, predicate )
    {
        let objRet = {};
        for ( let key in collection )
        {
            let value = collection[ key ];
            if ( objRet.hasOwnProperty( value ) )
                objRet[ value ] += 1;
            else
                objRet[ value ] = 1;
        }
        return objRet;
    }

    public static GetSize ( num: number )
    {
        let unitIndex = 0;
        let result = 0;
        if ( num <= 0 )
            num = 0
        num = Math.round( num );
        while ( num >= 10000 )
        {
            num = Math.floor( num / 10000 );
            unitIndex++;
        }
        switch ( unitIndex )
        {
            case 0:
                result = 1;
                break;
            case 1:
                result = 3;
                break;
            case 2:
                result = 5;
                break;
            case 3:
                result = 7;
                break;
            case 4:
                result = 9;
                break;
            default:
                result = 10;
                break;
        }
        return result;
    }

    public static formatNumberStr ( numStr: string, level: number = 2 ): string
    {
        const unitChars = [ '', '万', '亿', '兆', '京', '垓', '秭', '穰', '钩', '涧', '正', '载' ];
        const unitLength = 4;
        const numLength = numStr.length;
        const numUnits = Math.ceil( numLength / unitLength );
        let currentUnitIndex = numUnits - 1; let formattedStr = '';
        const firstUnitLength = numLength % unitLength;
        if ( firstUnitLength !== 0 )
        {
            formattedStr += numStr.slice( 0, firstUnitLength );
            if ( numUnits > 1 && currentUnitIndex > numUnits - level - 1 )
            {
                formattedStr += unitChars[ currentUnitIndex ];
            }
            currentUnitIndex--;
        }
        let zerosFound = 0;
        for ( let i = firstUnitLength; i < numLength && currentUnitIndex >= numUnits - level; i += unitLength )
        {
            const digits = numStr.slice( i, i + unitLength );
            if ( parseInt( digits ) === 0 )
            {
                zerosFound++;
                currentUnitIndex--;
                continue;
            }
            if ( zerosFound > 0 )
            {
                if ( formattedStr !== '' )
                {
                    formattedStr += '0'.repeat( zerosFound );
                }
                zerosFound = 0;
            }
            formattedStr += digits;
            formattedStr += unitChars[ currentUnitIndex ];
            currentUnitIndex--;
        }
        if ( formattedStr === '' )
        {
            return '0';
        }
        return formattedStr;
    }

    public static formatNumber ( num: number, isMain = false ): string
    {
        let format = '';
        const units = [ '', '万', '亿', '兆', '京', '垓', '秭', '穰', '沟', '涧', '正', '载' ];
        let unitIndex = 0;
        let result = '';
        if ( num <= 0 )
            num = 0
        num = Math.round( num );
        while ( num >= 10000 )
        {
            const remainder = num % 10000;
            if ( remainder !== 0 )
            {
                result = remainder.toString() + units[ unitIndex ] + result;
            }
            num = Math.floor( num / 10000 );
            unitIndex++;
        }

        if ( num > 0 )
        {
            result = num.toString() + units[ unitIndex ] + result;
        }

        if ( isMain )
        {
            switch ( unitIndex )
            {
                case 0:
                case 1:
                case 2:
                    format = '';
                    break;
                case 3:
                    format = '万';
                    break;
                case 4:
                    format = '亿';
                    break;
                case 5:
                    format = '兆';
                    break;
                case 6:
                    format = '京';
                    break;
                case 7:
                    format = '垓';
                    break;
                case 8:
                    format = '秭';
                    break;
                case 9:
                    format = '穰';
                    break;
                case 10:
                    format = '沟';
                    break;
                case 11:
                    format = '涧';
                    break;
            }
        }
        else
        {
            switch ( unitIndex )
            {
                case 0:
                case 1:
                    format = '';
                    break;
                case 2:
                    format = '万';
                    break;
                case 3:
                    format = '亿';
                    break;
                case 4:
                    format = '兆';
                    break;
                case 5:
                    format = '京';
                    break;
                case 6:
                    format = '垓';
                    break;
                case 7:
                    format = '秭';
                    break;
                case 8:
                    format = '穰';
                    break;
                case 9:
                    format = '沟';
                    break;
                case 10:
                    format = '涧';
                    break;
                case 11:
                    format = '正';
                    break;
            }
        }
        const formatIndex = units.indexOf( format );
        if ( formatIndex !== -1 )
        {
            const truncateIndex = result.lastIndexOf( units[ formatIndex ] ) + units[ formatIndex ].length;
            if ( truncateIndex > 0 )
            {
                result = result.slice( 0, truncateIndex );
            }
        }
        return result;
    }

    public static formatMoney ( money: number )
    {
        const arrUnit = [ '', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y', 'B', 'N', 'D' ];

        let strValue = '';
        for ( let idx = 0; idx < arrUnit.length; idx++ )
        {
            if ( money >= 10000 )
            {
                money /= 1000;
            } else
            {
                strValue = Math.floor( money ) + arrUnit[ idx ];
                break;
            }
        }

        if ( strValue === '' )
        {
            strValue = Math.floor( money ) + 'U';
        }

        return strValue;
    }

    public static formatValue ( value: number )
    {
        let arrUnit = []
        let strValue = '';
        for ( let i = 0; i < 26; i++ )
        {
            arrUnit.push( String.fromCharCode( 97 + i ) );
        }

        for ( let idx = 0; idx < arrUnit.length; idx++ )
        {
            if ( value >= 10000 )
            {
                value /= 1000;
            } else
            {
                strValue = Math.floor( value ) + arrUnit[ idx ];
                break;
            }
        }
        return strValue;
    }
    public static formatTwoDigits ( time: number )
    {
        return ( Array( 2 ).join( '0' ) + time ).slice( -2 );
    }

    public static isNumber ( value )
    {
        return typeof value === 'number';
    }

    public static formatNumToFixed ( num: number, idx: number = 0 )
    {
        return Number( num.toFixed( idx ) );
    }

    public static lerp ( targetValue: number, curValue: number, ratio: number = 0.25 )
    {
        let v = curValue;
        if ( targetValue > curValue )
        {
            v = curValue + ( targetValue - curValue ) * ratio;
        } else if ( targetValue < curValue )
        {
            v = curValue - ( curValue - targetValue ) * ratio;
        }
        return v;
    }

    public static getMin ( array: any )
    {
        let result = 0;
        if ( array.constructor === Array )
        {
            const length = array.length;
            for ( let i = 0; i < length; i++ )
            {
                if ( i === 0 )
                {
                    result = Number( array[ 0 ] );
                } else
                {
                    result = result > Number( array[ i ] ) ? Number( array[ i ] ) : result;
                }
            }
        }
        return result;
    }

    public static getMax ( array: any )
    {
        let result = 0;
        if ( array.constructor === Array )
        {
            const length = array.length;
            for ( let i = 0; i < length; i++ )
            {
                if ( i === 0 )
                {
                    result = Number( array[ 0 ] );
                } else
                {
                    result = result < Number( array[ i ] ) ? Number( array[ i ] ) : result;
                }
            }
        }
        return result;
    }

    static disOriginArr ( arr: number[] )
    {
        let len = arr.length;
        while ( len )
        {
            let index = Math.floor( Math.random() * ( len-- ) );
            let temp = arr[ index ];
            arr[ len ] = arr[ index ];
            arr[ index ] = temp;
        }
        return arr;
    }

    public static difference ( array: any, diff: any )
    {
        const result: number[] = [];
        if ( array.constructor !== Array || diff.constructor !== Array )
        {
            return result;
        }

        const length = array.length;
        for ( let i = 0; i < length; i++ )
        {
            if ( diff.indexOf( array[ i ] ) === -1 )
            {
                result.push( array[ i ] );
            }
        }

        return result;
    }

    public static remove ( array: any[], predicate: {
        ( obj: any ): boolean; ( arg0: any ): any;
    } )
    {
        let result: any[] = [];
        let indexes: any[] = [];
        array.forEach( function ( item: any, index: any )
        {
            if ( predicate( item ) )
            {
                result.push( item );
                indexes.push( index );
            }
        } );

        this.basePullAt( array, indexes );
        return result;
    }

    public static basePullAt ( array: any, indexes: string | any[] )
    {
        let length = array ? indexes.length : 0;
        let lastIndex = length - 1;
        let previous;

        while ( length-- )
        {
            let index = indexes[ length ];
            if ( length === lastIndex || index !== previous )
            {
                previous = index;
                Array.prototype.splice.call( array, index, 1 );
            }
        }
        return array;
    }

    static rotateAround ( out: Vec3, v: Vec3, u: Vec3, maxAngleDelta: number )
    {
        //out = v*cos + uxv*sin  + (u*v)*u*(1- cos);
        const cos = Math.cos( maxAngleDelta );
        const sin = Math.sin( maxAngleDelta );

        // v * cos 
        Vec3.multiplyScalar( tempVec, v, cos );

        // u x v 
        Vec3.cross( tempVec2, u, v );

        // v*cos + uxv*sin
        Vec3.scaleAndAdd( tempVec3, tempVec, tempVec2, sin );

        const dot = Vec3.dot( u, v );

        // + (u*v)*u*(1-cos)
        Vec3.scaleAndAdd( out, tempVec3, u, dot * ( 1.0 - cos ) );
    }


    static rotateToward ( out: Vec3, from: Vec3, to: Vec3, maxAngleDelta: number )
    {
        Vec3.cross( up, from, to );
        this.rotateAround( out, from, up, maxAngleDelta );
    }

    //计算从向量 from 指向向量 to 的旋转角度，并根据给定的轴向量 axis 的方向对角度施加正负符号，返回带符号的角度值。
    static signAngle ( from: Vec3, to: Vec3, axis: Vec3 ): number
    {
        const angle = Vec3.angle( from, to );
        Vec3.cross( tempVec, from, to );
        const sign = Math.sign( axis.x * tempVec.x + axis.y * tempVec.y + axis.z * tempVec.z );
        return angle * sign;
    }
    public static DelayCallBack ( time: number, func: Function )
    {
        setTimeout( () =>
        {
            func && func();
        }, time * 1000 );
    }

    public static getMidPos ( pos1: Vec3, pos2: Vec3 )
    {
        return new Vec3( ( pos1.x + pos2.x ) / 2, ( pos1.y + pos2.y ) / 2, ( pos1.z + pos2.z ) / 2 )
    }

    public static cheakCollierPoint ( currentNode: Node, targetNode: Node ): boolean
    {
        let curNodePosition = currentNode.parent.getComponent( UITransform ).convertToWorldSpaceAR( currentNode.position );
        let tarBoundingBox = targetNode.getComponent( UITransform ).getBoundingBoxToWorld();
        if ( tarBoundingBox.contains( v2( curNodePosition.x, curNodePosition.y ) ) )
            return true
        else
            return false
    };

    public static cheakCollierBox ( currentNode: Node, targetNode: Node ): boolean
    {
        let curBoundingBox = currentNode.getComponent( UITransform ).getBoundingBoxToWorld();
        let tarBoundingBox = targetNode.getComponent( UITransform ).getBoundingBoxToWorld();
        if ( curBoundingBox.intersects( tarBoundingBox ) )
            return true
        else
            return false
    };

    public static getStringBeforeUnderscore ( input: string ): string
    {
        const underscoreIndex = input.indexOf( '_' );
        if ( underscoreIndex !== -1 )
        {
            // 返回"_"前的所有字符  
            return input.substring( 0, underscoreIndex );
        }
        // 如果没有找到"_", 返回整个字符串  
        return input;
    }

    public static getTouchName ( str: string ): string
    {
        const index = str.indexOf( '_' );      // 直接查找下划线位置
        return index === -1 ? str : str.substring( 0, index );
    }

    public static getTouchNum ( str: string ): number
    {
        const match = str.match( /_(\d+)$/ );  // 匹配末尾数字（如 "_3"）
        return match ? parseInt( match[ 1 ] ) : NaN;
    }

    public static save ()
    {
        if ( sys.platform === sys.Platform.MOBILE_BROWSER ||
            sys.platform === sys.Platform.DESKTOP_BROWSER )
        {
            const data = {};
            Object
                .keys( localStorage )
                .filter( v => v.substr( 0, 4 ) != 'goog' )
                .forEach( key => data[ key ] = localStorage[ key ] );

            let blob = new Blob( [ JSON.stringify( data ) ], { type: 'application/json' } );
            // @ts-ignore
            const slice = blob.slice || blob.webkitSlice || blob.mozSlice;
            blob = slice.call( blob, 0, blob.size, 'application/octet-stream' );
            const a = document.createElementNS( 'http://www.w3.org/1999/xhtml', 'a' ) as HTMLAnchorElement;

            a.href = URL.createObjectURL( blob );
            a.download = `Remake_save_${ new Date().toISOString().replace( ':', '.' ) }.json`;

            document.body.appendChild( a );
            a.click();
            document.body.removeChild( a );
            URL.revokeObjectURL( a.href );
        }
    }

    public static load ()
    {
        if ( sys.platform === sys.Platform.MOBILE_BROWSER ||
            sys.platform === sys.Platform.DESKTOP_BROWSER )
        {
            const file = document.createElement( 'input' );
            file.type = 'file';
            file.name = 'file';
            file.accept = "application/json";
            // @ts-ignore
            file.style = "display: none;";
            file.append( 'body' );
            file.click();
            file.addEventListener( 'change', ( e ) =>
            {
                // @ts-ignore
                const file = e.target.files[ 0 ];
                if ( !file ) return;
                const reader = new FileReader();
                reader.onload = () =>
                {
                    const data = JSON.parse( reader.result as string );
                    for ( const key in data )
                    {
                        localStorage[ key ] = data[ key ];
                    }
                    console.log( '加载存档成功' );
                }
                reader.readAsText( file );
            } );
        }
    }

    public static createTexture ( imgData: any, width: number, height: number ): Texture2D
    {
        let tex = new Texture2D();
        tex.reset( { width: width, height: height, format: Texture2D.PixelFormat.RGBA8888, mipmapLevel: 0 } );
        tex.uploadData( imgData, 0, 0 );
        tex.updateImage();
        return tex;
    }
    public static expandImage ( imgData: Uint8Array, width: number, height: number, expand: number = 0 ): Uint8Array
    {
        let buffer = new Uint8Array( imgData.length + 4 * ( expand * width * 2 + expand * height * 2 + height * width * 4 ) );
        let row = 0;
        let col = 0;
        let img_index = 0;
        let new_width = width + expand * 2;
        let new_height = height + expand * 2;
        let color_value = 0;

        for ( let index = 0; index < buffer.length; index = index + 4 )
        {
            if ( row < expand )
            {
                buffer[ index ] = color_value;
                buffer[ index + 1 ] = color_value;
                buffer[ index + 2 ] = color_value;
                buffer[ index + 3 ] = color_value;
            }
            else if ( row >= height + expand )
            {
                buffer[ index ] = color_value;
                buffer[ index + 1 ] = color_value;
                buffer[ index + 2 ] = color_value;
                buffer[ index + 3 ] = color_value;
            }
            else
            {
                if ( col < expand )
                {
                    buffer[ index ] = color_value;
                    buffer[ index + 1 ] = color_value;
                    buffer[ index + 2 ] = color_value;
                    buffer[ index + 3 ] = color_value;
                }
                else if ( col >= width + expand )
                {
                    buffer[ index ] = color_value;
                    buffer[ index + 1 ] = color_value;
                    buffer[ index + 2 ] = color_value;
                    buffer[ index + 3 ] = color_value;
                }
                else
                {
                    buffer[ index ] = imgData[ img_index ];
                    buffer[ index + 1 ] = imgData[ img_index + 1 ];
                    buffer[ index + 2 ] = imgData[ img_index + 2 ];
                    buffer[ index + 3 ] = imgData[ img_index + 3 ];
                    img_index = img_index + 4;
                }
            }
            col++;
            if ( col >= new_width )
            {
                col = 0;
                row++;
            }
        }
        return buffer;

    }

    public static readPixels ( tex: any ): Uint8Array
    {
        const gfxTexture = tex.getGFXTexture();
        if ( !gfxTexture )
        {
            return null;
        }
        const needSize = 4 * tex.width * tex.height;
        let buffer = new Uint8Array( needSize );
        const gfxDevice = tex._getGFXDevice();
        const bufferViews: ArrayBufferView[] = [];
        const regions: gfx.BufferTextureCopy[] = [];
        const region0 = new gfx.BufferTextureCopy();

        region0.texOffset.x = 0;
        region0.texOffset.y = 0;
        region0.texExtent.width = tex.width;
        region0.texExtent.height = tex.height;

        regions.push( region0 );
        bufferViews.push( buffer );
        gfxDevice?.copyTextureToBuffers( gfxTexture, bufferViews, regions );
        return buffer;
    }

    public static SetNodeChildActive ( root: Node, isShow: boolean = false, showNodeArr?: number[] | Node[] )
    {
        for ( let index = 0; index < root.children.length; index++ )
        {
            if ( root.children[ index ].active == !isShow )
                root.children[ index ].active = isShow;
        }

        for ( let index = 0; showNodeArr && ( index < showNodeArr.length ); index++ )
        {
            //    console.log("SetNodeChildActive设置的参数类型",typeof showNodeArr[index])
            if ( typeof showNodeArr[ index ] == "number" )
            {
                let nodeIndex = showNodeArr[ index ] as number;
                if ( root.children[ nodeIndex ] ) root.children[ nodeIndex ].active = !isShow;
            }

            if ( typeof showNodeArr[ index ] == "object" )
            {
                let node = showNodeArr[ index ] as Node;
                if ( node ) node.active = !isShow;
            }
        }
    }
}