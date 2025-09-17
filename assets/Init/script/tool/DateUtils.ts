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
    /**获取1970年1月1日至今的秒数 */
    public static getSecond (): number
    {
        return Math.floor( new Date().getTime() / 1000 );
    }

    //检测日期的年月日是否匹配
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

    //根据秒数换算时钟单位
    public static clock ( time: number )//时:分:秒
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

    //根据秒数换算时钟单位
    public static clockHMS ( time: number )//x小时:x分:x秒
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

        return hour_string + "时" + minute_string + "分" + second_string + '秒';
    }

    public static getRemainingSecondsToMidnight ()//获取每日到当日0:00的剩余秒数
    {
        const now = new Date(); // 当前时间
        const nextMidnight = new Date( now );
        // 重置为当日 00:00 后加上 24 小时得到次日 00:00
        nextMidnight.setHours( 24, 0, 0, 0 );
        // 计算时间差（毫秒数）并转换为秒数
        const delta = nextMidnight.getTime() - now.getTime();
        return Math.floor( delta / 1000 );
    }

    public static getWeeklyResetRemaining ()//获取当日到当每周日0:00的剩余秒数
    {
        const now = new Date();
        // 复制当前时间用于计算
        const nextSunday = new Date( now );
        // 获取最近的周日（若当前是周日已过期则+7天）
        const dayDelta = ( 7 - now.getDay() ) % 7;
        nextSunday.setDate( now.getDate() + dayDelta );
        nextSunday.setHours( 0, 0, 0, 0 );
        // 处理当前已过目标周日的情况
        if ( nextSunday <= now )
        {
            nextSunday.setDate( nextSunday.getDate() + 7 );
        }
        // 计算差值并向上取整
        return Math.ceil( ( nextSunday.getTime() - now.getTime() ) / 1000 );
    }

    //从开始时间到结束时剩余秒数
    public static getRemainingSeconds ( firstTime, giftTime, cb?: Function ): number
    {
        const startTime = firstTime;
        const currentTime = Date.now();

        // 未记录开始时间时返回0
        if ( !startTime ) return 0;
        // 计算剩余时间（精确算法）
        const endTime = startTime + giftTime * 1000;
        const remainingMs = endTime - currentTime;

        // 处理超时情况
        if ( remainingMs <= 0 )
        {
            cb && cb();
            return 0;
        }
        return Math.floor( remainingMs / 1000 );
    }
}