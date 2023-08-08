import { director, resources } from "cc";

export class Utils 
{

    /**
    * 返回今天的日期,格式20200101
    */
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

    /**
     * 计算两个日期的天数差 日期格式20200101
     */
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
            console.error( "日期格式不正确" );
            return -1;
        }
    }

    /**
    * 将事件戳转化为日期格式,适用于显示倒计时
    * @param timeMS 倒计时的时间戳(MS)
    * @param template 模板 1(HH:MM:SS) 2(HH时MM分SS秒) 3(HH?:MM:SS) 4(HH?时MM分SS秒)
    * @param separator 分隔符 默认(:)
    */
    static formatCountDownMS ( timeMS: number, template: 1 | 2 | 3 | 4, separator = ":" )
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

    /**
     * 返回一个格式化的时间字符串
     * 占位符 YYYY:年 MM:月 DD:日 hh:时 mm:分 ss:秒
     * @param formatStr 格式化的字符串 例 YYYY-MM-DD hh:mm:ss 返回 2022-01-01 12:30:30
     */
    static formatTime ( formatStr: string, date?: Date )
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

    /**
     * 格式化时间戳，返回：XXXX年XX月XX日XX时XX分XX秒
     */
    static formatTime2 ( times: number )
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

    /**
     * 格式化时间戳，返回：XXXX年XX月XX日
     */
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

    /**
     * 获取一个随机数，区间[min,max]
     * @param min 最小值
     * @param max 最大值
     * @param isInteger 是否是整数 默认true
     */
    static randomNum ( min: number, max: number, isInteger = true )
    {
        let delta = max - min;
        let value = Math.random() * delta + min;
        if ( isInteger )
        {
            value = Math.round( value );
        }
        return value;
    }

    /**
    *  修正小数位数
    * @param fractionDigits 保留小数位数
    * @param canEndWithZero 是否需要用0填补小数位数 默认为false
    */
    static fixFloat ( value: number, fractionDigits: number, canEndWithZero = false )
    {
        if ( fractionDigits < 0 ) fractionDigits = 0;
        let str = value.toFixed( fractionDigits );
        if ( canEndWithZero )
        {
            return str;
        } else
        {
            while ( true )
            {
                if ( str.length > 1 && str.includes( "." ) )
                {
                    if ( str.endsWith( "0" ) || str.endsWith( "." ) )
                    {
                        str = str.substring( 0, str.length - 1 );
                    } else
                    {
                        break;
                    }
                } else
                {
                    break;
                }
            }
        }
        return str;
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="list">集合</param>
    /// <param name="weight">获取item权重</param>
    /// <param name="num">返回item数量委托</param>
    /// <param name="compare">若需要不重复item,则传入比较两个元素的委托</param>
    /**
     * 从带权重的集合中随机获取指定数量的元素
     * @param list 集合
     * @param weight 获取item权重的方法
     * @param num 返回item数量
     * @param canRepeat item是否可以重复
     * @returns 
     */
    public static randomValueByWeight<T> ( list: T[], num = 1, weight?: ( item: T ) => number, canRepeat = false )
    {
        let result: T[] = [];
        if ( !list || list.length == 0 ) return result;
        if ( list.length < num ) console.warn( "需要返回的item数量大于集合长度" );
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
                    if ( !canRepeat ) //检查是否重复元素
                    {
                        var index = result.indexOf( item );
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
    /**
     * 格式化字符串,用args的内容替换str中的{i},i从0开始
     */
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

    /** 统计元素在数组中出现次数 */
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

    /** 生成UUID */
    static genUUID ()
    {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g, function ( c )
        {
            let r = Math.random() * 16 | 0;
            let v = c == 'x' ? r : ( r & 0x3 | 0x8 );
            return v.toString( 16 );
        } );
    }

    /**
     * 随机打乱数组
     * @param arr 
     * @returns 
     */
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
    /**
     * 根据秒数换算时钟单位(时：分：秒)
     * @param time 
     */
    public static clock ( time: number ): string
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


    /** 加载本地资源 */
    public static loadRes ( url: string, callBack: Function ): void
    {
        resources.load( url, function ( err, resources )
        {
            if ( err )
            {
                console.log( "加载失败" + err );
            }
            callBack( resources )
        } );
    }

    /**
   * 在某个区间内取一个整数
   * @param section1 区间1
   * @param section2 区间2，不输入则是0~section1
   */
    public static randomNumber ( section1, section2?: number ): number
    {
        if ( section2 )
        {
            return Math.round( Math.random() * ( section2 - section1 ) ) + section1;
        } else
        {
            return Math.round( Math.random() * section1 );
        }
    }

    /**
    * 在某个区间内取一个数
    * @param section1 区间1
    * @param section2 区间2，不输入则是0~section1
    */
    public static randomNumber_NoRound ( section1, section2?: number ): number
    {
        if ( section2 )
        {
            return Math.random() * ( section2 - section1 ) + section1;
        } else
        {
            return Math.random() * section1;
        }
    }
    /**
     * !#zh 拷贝object。
     */
    public static clone ( sObj: any )
    {
        if ( sObj === null || typeof sObj !== "object" )
        {
            return sObj;
        }

        let s: any = {};
        if ( sObj.constructor === Array )
        {
            s = [];
        }

        for ( const i in sObj )
        {
            if ( sObj.hasOwnProperty( i ) )
            {
                s[ i ] = this.clone( sObj[ i ] );
            }
        }

        return s;
    }

    /**
     * 将object转化为数组。
     */
    public static objectToArray ( srcObj: any )
    {

        const resultArr = [];

        // to array
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

    /**
     * !#zh 将数组转化为object。
     */
    public static arrayToObject ( srcObj: any, objectKey: any )
    {

        const resultObj: any = {};

        // to object
        for ( let key in srcObj )
        {
            if ( !srcObj.hasOwnProperty( key ) || !srcObj[ key ][ objectKey ] )
            {
                continue;
            }

            resultObj[ srcObj[ key ][ objectKey ] ] = srcObj[ key ];
        }

        return resultObj;
    }

    // 根据权重,计算随机内容
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

    /**
     * 从n个数中获取m个随机数
     * @param {Number} n   总数
     * @param {Number} m    获取数
     * @returns {Array} array   获取数列
     */
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
    //随机数
    public static getRandomInt ( min: number, max: number )
    {
        const r = Math.random();
        const rr = r * ( max - min + 1 ) + min;
        return Math.floor( rr );
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

    /**
     * 判断传入的参数是否为空的Object。数组或undefined会返回false
     * @param obj
     */
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

    public static formatNum ( num: number )
    {
        // 0 和负数均返回 NaN。特殊处理。
        if ( num <= 0 )
        {
            return '0';
        }

        const k = 1000;
        const sizes = [ '', '', 'K', 'M', 'B' ];
        const i = Math.round( Math.log( num ) / Math.log( k ) );
        return parseInt( ( num / ( Math.pow( k, i - 1 < 0 ? 0 : i - 1 ) ) ).toString(), 10 ) + sizes[ i ];
    }

    /**
     * 判断是否是新的一天
     * @param {Object|Number} dateValue 时间对象 todo MessageCenter 与 pve 相关的时间存储建议改为 Date 类型
     * @returns {boolean}
     */
    public static isNewDay ( dateValue: any )
    {
        // todo：是否需要判断时区？
        const oldDate = new Date( dateValue );
        const curDate = new Date();

        const oldYear = oldDate.getFullYear();
        const oldMonth = oldDate.getMonth();
        const oldDay = oldDate.getDate();
        const curYear = curDate.getFullYear();
        const curMonth = curDate.getMonth();
        const curDay = curDate.getDate();

        if ( curYear > oldYear )
        {
            return true;
        } else
        {
            if ( curMonth > oldMonth )
            {
                return true;
            } else
            {
                if ( curDay > oldDay )
                {
                    return true;
                }
            }
        }

        return false;
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

    /**
     * 返回一个差异化数组（将array中diff里的值去掉）
     * @param array
     * @param diff
     */
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

    //public method for encoding
    public static base64encode ( input: string )
    {
        var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var output = "", chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0;
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

    // private method for UTF-8 encoding
    public static utf8Encode ( string: string )
    {
        string = string.replace( /\r\n/g, "\n" );
        var utftext = "";
        for ( var n = 0; n < string.length; n++ )
        {
            var c = string.charCodeAt( n );
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
        var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var output = "";
        var chr1;
        var chr2;
        var chr3;
        var enc1;
        var enc2;
        var enc3;
        var enc4;
        var i = 0;
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
        var string = "";
        var i = 0;
        var c = 0;
        var c1 = 0;
        var c2 = 0;
        var c3 = 0;
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

    public static remove ( array: any[], predicate: {
        ( obj: any ): boolean; ( arg0: any ): any;
    } )
    {
        var result: any[] = [];
        var indexes: any[] = [];
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
        var length = array ? indexes.length : 0;
        var lastIndex = length - 1;
        var previous;

        while ( length-- )
        {
            var index = indexes[ length ];
            if ( length === lastIndex || index !== previous )
            {
                previous = index;
                Array.prototype.splice.call( array, index, 1 );
            }
        }

        return array;
    }

    public static stringToArray ( string: string )
    {
        // 用于判断emoji的正则们
        var rsAstralRange = '\\ud800-\\udfff';
        var rsZWJ = '\\u200d';
        var rsVarRange = '\\ufe0e\\ufe0f';
        var rsComboMarksRange = '\\u0300-\\u036f';
        var reComboHalfMarksRange = '\\ufe20-\\ufe2f';
        var rsComboSymbolsRange = '\\u20d0-\\u20ff';
        var rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange;
        var reHasUnicode = RegExp( '[' + rsZWJ + rsAstralRange + rsComboRange + rsVarRange + ']' );

        var rsFitz = '\\ud83c[\\udffb-\\udfff]';
        var rsOptVar = '[' + rsVarRange + ']?';
        var rsCombo = '[' + rsComboRange + ']';
        var rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')';
        var reOptMod = rsModifier + '?';
        var rsAstral = '[' + rsAstralRange + ']';
        var rsNonAstral = '[^' + rsAstralRange + ']';
        var rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}';
        var rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]';
        var rsOptJoin = '(?:' + rsZWJ + '(?:' + [ rsNonAstral, rsRegional, rsSurrPair ].join( '|' ) + ')' + rsOptVar + reOptMod + ')*';
        var rsSeq = rsOptVar + reOptMod + rsOptJoin;
        var rsSymbol = '(?:' + [ rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral ].join( '|' ) + ')';
        var reUnicode = RegExp( rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g' );

        var hasUnicode = function ( val: string )
        {
            return reHasUnicode.test( val );
        };

        var unicodeToArray = function ( val: string )
        {
            return val.match( reUnicode ) || [];
        };

        var asciiToArray = function ( val: string )
        {
            return val.split( '' );
        };

        return hasUnicode( string ) ? unicodeToArray( string ) : asciiToArray( string );
    }

    // 模拟传msg的uuid
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

    /**
        * 裁剪前后指定的字符
        */
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

    /**
     * 判断当前时间是否在有效时间内
     * @param {String|Number} start 起始时间。带有时区信息
     * @param {String|Number} end 结束时间。带有时区信息
     */
    public static isNowValid ( start: string | number, end: string | number )
    {
        const startTime = new Date( start );
        const endTime = new Date( end );
        let result = false;

        if ( startTime.getDate() + '' !== 'NaN' && endTime.getDate() + '' !== 'NaN' )
        {
            const curDate = new Date();
            result = curDate < endTime && curDate > startTime;
        }

        return result;
    }

    public static getDeltaDays ( start: string | number, end: string | number )
    {
        const startData = new Date( start );
        const endData = new Date( end );

        const startYear = startData.getFullYear();
        const startMonth = startData.getMonth() + 1;
        const startDate = startData.getDate();
        const endYear = endData.getFullYear();
        const endMonth = endData.getMonth() + 1;
        const endDate = endData.getDate();

        start = new Date( startYear + '/' + startMonth + '/' + startDate + ' GMT+0800' ).getTime();
        end = new Date( endYear + '/' + endMonth + '/' + endDate + ' GMT+0800' ).getTime();

        const deltaTime = end - start;
        return Math.floor( deltaTime / ( 24 * 60 * 60 * 1000 ) );
    }

    public static getMin ( array: any )//取得最小值
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
    public static getMax ( array: any )//取得最大值
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

    public static formatTwoDigits ( time: number )
    {
        return ( Array( 2 ).join( '0' ) + time ).slice( -2 );
    }

    public static formatDate ( date: Date, fmt: string )
    {
        const o: { [ name: string ]: number } = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor( ( date.getMonth() + 3 ) / 3 ), //季度
            "S": date.getMilliseconds() //毫秒
        };

        if ( /(y+)/.test( fmt ) ) fmt = fmt.replace( RegExp.$1, ( date.getFullYear() + "" ).substr( 4 - RegExp.$1.length ) );
        for ( const k in o )
            if ( new RegExp( "(" + k + ")" ).test( fmt ) ) fmt = fmt.replace( RegExp.$1, ( RegExp.$1.length === 1 ) ? ( `${ o[ k ] }` ) : ( ( `00${ o[ k ] }` ).substr( ( "" + o[ k ] ).length ) ) );
        return fmt;
    }

    /**
     * 获取格式化后的日期（不含小时分秒）
     */
    public static getDay ()
    {
        const date = new Date();

        return date.getFullYear() + '-' + ( date.getMonth() + 1 ) + '-' + date.getDate();
    }

    public static formatName ( name: string, limit: number )
    {
        limit = limit || 6;
        var nameArray = this.stringToArray( name );
        var str = '';
        var length = nameArray.length;
        if ( length > limit )
        {
            for ( var i = 0; i < limit; i++ )
            {
                str += nameArray[ i ];
            }

            str += '...';
        } else
        {
            str = name;
        }

        return str;
    }

    /**
     * 格式化钱数，超过10000 转换位 10K   10000K 转换为 10M
     */
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
            strValue = Math.floor( money ) + 'U'; //超过最大值就加个U
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

    /**
     * 根据剩余秒数格式化剩余时间 返回 HH:MM:SS
     * @param {Number} leftSec
     */
    public static formatTimeForSecond ( leftSec: number )
    {
        let timeStr = '';
        const sec = leftSec % 60;

        let leftMin = Math.floor( leftSec / 60 );
        leftMin = leftMin < 0 ? 0 : leftMin;

        const hour = Math.floor( leftMin / 60 );
        const min = leftMin % 60;

        if ( hour > 0 )
        {
            timeStr += hour > 9 ? hour.toString() : '0' + hour;
            timeStr += ':';
        }

        timeStr += min > 9 ? min.toString() : '0' + min;
        timeStr += ':';
        timeStr += sec > 9 ? sec.toString() : '0' + sec;
        return timeStr;
    }

    /**
     *  根据剩余毫秒数格式化剩余时间 返回 HH:MM:SS
     *
     * @param {Number} ms
     */
    public static formatTimeForMillisecond ( ms: number )
    {
        let second = Math.floor( ms / 1000 % 60 );
        let minute = Math.floor( ms / 1000 / 60 % 60 );
        let hour = Math.floor( ms / 1000 / 60 / 60 );
        let strSecond = second < 10 ? '0' + second : second;
        let strMinute = minute < 10 ? '0' + minute : minute;
        let strHour = hour < 10 ? '0' + hour : hour;
        return `${ strSecond }:${ strMinute }:${ strHour }`;
    }

    /**
     * TODO 需要将pako进行引入，目前已经去除了压缩算法的需要，如需要使用需引入库文件
     * 将字符串进行压缩
     * @param {String} str
     */
    public static zip ( str: string )
    {
        // const binaryString = pako.gzip( encodeURIComponent( str ), { to: 'string' } );
        // @ts-ignore
        //return this.base64encode( binaryString );
    }

    /**
    * todo 目前已经去除了压缩算法的需要，如需要使用需引入库文件
    * 将数据进行解压
    * @param {String} b64Data 
    */
    public static unZip ( b64Data: string )
    {
        // var strData = this.base64Decode( b64Data );
        // // Convert binary string to character-number array
        // var charData = strData.split( '' ).map( function ( x ) { return x.charCodeAt( 0 ); } );
        // // Turn number array into byte-array
        // var binData = new Uint8Array( charData );
        // // // unzip
        // //  var data = pako.inflate( binData );
        // // Convert gunzipped byteArray back to ascii string:
        // strData = String.fromCharCode.apply( null, new Uint16Array( data ) );
        // return decodeURIComponent( strData );
    }

    /**
     * 数据加密
     * @param {String} str 
     */
    public static encrypt ( str: string )
    {
        let b64Data = this.base64encode( str );

        let n = 6;
        if ( b64Data.length % 2 === 0 )
        {
            n = 7;
        }

        let encodeData = '';

        for ( let idx = 0; idx < ( b64Data.length - n + 1 ) / 2; idx++ )
        {
            encodeData += b64Data[ 2 * idx + 1 ];
            encodeData += b64Data[ 2 * idx ];
        }

        encodeData += b64Data.slice( b64Data.length - n + 1 );

        return encodeData;
    }

    /**
     * 数据解密
     * @param {String} b64Data 
     */
    public static decrypt ( b64Data: string | string[] )
    {
        let n = 6;
        if ( b64Data.length % 2 === 0 )
        {
            n = 7;
        }

        let decodeData = '';
        for ( var idx = 0; idx < b64Data.length - n; idx += 2 )
        {
            decodeData += b64Data[ idx + 1 ];
            decodeData += b64Data[ idx ];
        }

        decodeData += b64Data.slice( b64Data.length - n + 1 );

        decodeData = this.base64Decode( decodeData );

        return decodeData;
    }

    public static rand ( arr: any )
    {
        let arrClone = this.clone( arr );
        // 首先从最大的数开始遍历，之后递减
        for ( let i = arrClone.length - 1; i >= 0; i-- )
        {
            // 随机索引值randomIndex是从0-arrClone.length中随机抽取的
            const randomIndex = Math.floor( Math.random() * ( i + 1 ) );
            // 下面三句相当于把从数组中随机抽取到的值与当前遍历的值互换位置
            const itemIndex = arrClone[ randomIndex ];
            arrClone[ randomIndex ] = arrClone[ i ];
            arrClone[ i ] = itemIndex;
        }
        // 每一次的遍历都相当于把从数组中随机抽取（不重复）的一个元素放到数组的最后面（索引顺序为：len-1,len-2,len-3......0）
        return arrClone;
    }

    /**
    * 获得开始和结束两者之间相隔分钟数
    *
    * @static
    * @param {number} start
    * @param {number} end
    * @memberof Util
    */
    public static getOffsetMimutes ( start: number, end: number )
    {
        let offSetTime = end - start;
        let minute = Math.floor( ( offSetTime % ( 1000 * 60 * 60 ) ) / ( 1000 * 60 ) );
        return minute;
    }

    /**
    * 返回指定小数位的数值
    * @param num 
    * @param idx 
    */
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

    //延时调用
    public static DelayCallBack ( time: number, func: Function )
    {
        setTimeout( () =>
        {
            func && func();//回调
        }, time * 1000 );
    }
    //计时器
    public static Timer ( interval: number, count: number = 1, delay: number = 0, isPause: boolean = false, func: Function = null )
    {
        director.getScheduler().schedule( () =>
        {
            func && func();//回调
        },
            null,
            interval,//每秒执行一次
            count,//macro.REPEAT_FOREVER(最大值) 无限重复
            delay,// 延迟时间
            isPause// 是否暂停
        );
    }

    public static find ( collection, predicate )
    {
        var result;
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
            var array = this.toArrayKey( collection );
            array.forEach( function ( value, index, arr )
            {
                var key1 = value[ 'key' ];
                var value1 = value[ 'value' ];
                iteratee( value1, key1, collection );
            } );
        } else
        {
            collection.forEach( iteratee );
        }
    }

    public static cloneDeep ( sObj )
    {
        if ( sObj === null || typeof sObj !== "object" )
        {
            return sObj;
        }

        var s = {};
        if ( sObj.constructor === Array )
        {
            s = [];
        }

        for ( var i in sObj )
        {
            if ( sObj.hasOwnProperty( i ) )
            {
                s[ i ] = this.cloneDeep( sObj[ i ] );
            }
        }

        return s;
    }

    public static map ( collection, iteratee )
    {
        if ( !Array.isArray( collection ) )
        {
            collection = this.toArray( collection );
        }

        var arr = [];
        collection.forEach( function ( value, index, array )
        {
            arr.push( iteratee( value, index, array ) );
        } );

        return arr;
    }

    public static random ( min, max )
    {
        var r = Math.random();
        var rr = r * ( max - min + 1 ) + min;
        return Math.floor( rr );
    }

    public static toArrayKey ( srcObj )
    {
        var resultArr = [];

        // to array
        for ( var key in srcObj )
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
        var resultArr = [];

        // to array
        for ( var key in srcObj )
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
        var in1 = x instanceof Object;
        var in2 = y instanceof Object;
        if ( !in1 || !in2 )
        {
            return x === y;
        }

        if ( Object.keys( x ).length !== Object.keys( y ).length )
        {
            return false;
        }

        for ( var p in x )
        {
            var a = x[ p ] instanceof Object;
            var b = y[ p ] instanceof Object;
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

    public static pullAllWith ( array, value, comparator )
    {
        value.forEach( function ( item )
        {
            var res = array.filter( function ( n )
            {
                return comparator( n, item );
            } );

            res.forEach( function ( item )
            {
                var index = array.indexOf( item );
                if ( array.indexOf( item ) !== -1 )
                {
                    array.splice( index, 1 );
                }
            } );
        } );

        return array;
    }

    public static now ()
    {
        return Date.now();
    }

    public static pullAll ( array, value )
    {
        value.forEach( function ( item )
        {
            var index = array.indexOf( item );
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

        for ( var i = collection.length - 1; i >= 0; i-- )
        {
            var ret = iteratee( collection[ i ] );
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

    public static findIndex ( array, predicate, fromIndex )
    {
        array = array.slice( fromIndex );
        var i;
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
                var key = predicate[ 0 ];
                var vaule = true;
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
        var length = arguments.length;
        if ( !length )
        {
            return [];
        }

        var array = arguments[ 0 ];
        var index = 1;
        while ( index < length )
        {
            array = array.concat( arguments[ index ] );
            index++;
        }

        return array;
    }

    public static isNumber ( value )
    {
        return typeof value === 'number';
    }

    public static indexOf ( array, value, fromIndex )
    {
        array = array.slice( fromIndex );
        return array.indexOf( value );
    }

    public static join ( array, separator )
    {
        if ( array === null ) return '';

        var result = '';
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

    public static max ( array )
    {
        if ( array && array.length )
        {
            var result;
            for ( var i = 0; i < array.length; i++ )
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

    public static drop ( array, n )
    {
        var length = array === null ? 0 : array.length;
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
        var result = [];
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
        // An `NaN` primitive is the only value that is not equal to itself.
        // Perform the `toStringTag` check first to avoid errors with some
        // ActiveX objects in IE.
        return this.isNumber( value ) && value !== +value;
    }

    public static chunk ( array, size )
    {
        var length = array === null ? 0 : array.length;
        if ( !length || size < 1 )
        {
            return [];
        }

        var result = [];
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
        var INFINITY = 1 / 0;
        var MAX_INTEGER = 1.7976931348623157e+308;
        if ( !value )
        {
            return value === 0 ? value : 0;
        }
        value = Number( value );
        if ( value === INFINITY || value === -INFINITY )
        {
            var sign = ( value < 0 ? -1 : 1 );
            return sign * MAX_INTEGER;
        }
        return value === value ? value : 0;
    }

    public static baseRange ( start, end, step, fromRight )
    {
        var nativeMax = Math.max;
        var nativeCeil = Math.ceil;
        var index = -1,
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
        var type = typeof value;
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
        return value !== null && this.isLength( value.length ) /*&& !isFunction(value)*/;
    }

    public static eq ( value, other )
    {
        return value === other || ( value !== value && other !== other );
    }

    public static isIndex ( value, length )
    {
        var type = typeof value;
        length = length === null ? Utils.MAX_SAFE_INTEGER : length;
        var reIsUint = /^(?:0|[1-9]\d*)$/;
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
        var type = typeof index;
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
            // Ensure the sign of `-0` is preserved.
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
            var result;
            var objResult;
            for ( var i = 0; i < array.length; i++ )
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
            var result;
            var objResult;
            for ( var i = 0; i < array.length; i++ )
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
        var sum = 0;
        for ( var key in collection )
        {
            sum += predicate( collection[ key ] );
        }

        return sum;
    }

    public static countBy ( collection, predicate )
    {
        var objRet = {};
        for ( var key in collection )
        {
            var value = collection[ key ];
            if ( objRet.hasOwnProperty( value ) )
            {
                objRet[ value ] += 1;
            } else
            {
                objRet[ value ] = 1;
            }
        }

        return objRet;
    }
}