import { game } from "cc";

export class Singleton //单例工厂,通过单例工厂实例化的单例对象被存起来,可以在引擎重启的时候销毁所有实例
{
    private static clazz: Set<any> = new Set();

    /** 创建一个单例,并保存到列表中,在重启游戏时销毁 */
    public static Instance<T> ( clazz: { new(): T }, onInst?: ( t: T ) => void ): T
    {
        if ( !clazz[ "_instance" ] )
        {
            clazz[ "_instance" ] = new clazz();
            if ( !Singleton.clazz.has( clazz ) )
            {
                Singleton.clazz.add( clazz );
            }
            onInst && onInst( clazz[ "_instance" ] );
        }
        return clazz[ "_instance" ];
    }

    /** 清空所有单例 */
    public static clear ()
    {
        Singleton.clazz.forEach( v =>
        {
            v[ "_instance" ] = undefined;
        } );
        Singleton.clazz.clear();
    }
}

game.onStart = Singleton.clear;
