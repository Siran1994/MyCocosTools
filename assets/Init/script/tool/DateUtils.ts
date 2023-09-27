import { Utils } from "./Utils";

/**日期对象 */
interface NewDate
{
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    second: number,
    milliSecond: number
};

export default class DateUtils
{
    /**获取当日日期对象 */
    public static getDate (): NewDate
    {
        let curDate: Date = new Date();
        let newDate: NewDate = { year: 0, month: 0, day: 0, hour: 0, minute: 0, second: 0, milliSecond: 0 };
        newDate.year = curDate.getFullYear();
        newDate.month = curDate.getMonth() + 1;
        newDate.day = curDate.getDate();
        newDate.hour = curDate.getHours();
        newDate.minute = curDate.getMinutes();
        newDate.second = curDate.getSeconds();
        newDate.milliSecond = curDate.getMilliseconds();
        return newDate;
    }

    /**获取1970年1月1日至今的毫秒数 */
    public static getTime (): number
    {
        return new Date().getTime();
    }
    public static now ()
    {
        return Date.now();
    }
    /**
     * 检测日期的年月日是否匹配
     * @param curDate   日期1
     * @param tarDate   日期2
     */
    public static checkDate ( curDate: NewDate, tarDate: NewDate ): boolean
    {
        if ( curDate.year == tarDate.year
            && curDate.month == tarDate.month
            && curDate.day == tarDate.day )
        {
            return true
        }
        return false
    }

    /**
     * 根据秒数换算时钟单位
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
    //计算两个日期之间的天数差
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

    //格式化日期
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
        var nameArray = Utils.stringToArray( name );
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
}