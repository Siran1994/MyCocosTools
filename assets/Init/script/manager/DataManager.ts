import { _decorator } from 'cc';
import { Config } from '../data/Config';

const { ccclass } = _decorator;

@ccclass( 'DataManager' )
export class DataManager 
{
    private static instance: DataManager = null;

    public static get Instance ()
    {
        if ( this.instance )
            return this.instance;
        this.instance = new DataManager();
        return this.instance;
    }

    private userData: any;
    /**
     * 获取用户某个键对应的持久化数据
     * @param key 
     */
    getItem ( key: string )
    {
        let reson = this.getAll();
        if ( reson && reson[ key ] )
            return reson[ key ];
        else
            return null;
    }

    /**
     * 设置用户的持久化数据
     * @param key 
     * @param value 
     */
    setItem ( key: string, value: any )
    {
        if ( !this.userData )
            this.userData = {};
        this.userData[ key ] = value;
        localStorage.setItem( Config.GameId, JSON.stringify( this.userData ) );
    }

    /**
     * 获取本地存储的所有的持久化数据
     */
    getAll ()
    {
        if ( !this.userData )
        {
            let reson = localStorage.getItem( Config.GameId );
            if ( reson )
                this.userData = JSON.parse( reson );
            else
                this.userData = {};
        }
        return this.userData;
    }

    /**
     * 移除键对应的持久化数据
     * @param key 
     */
    removeItem ( key: string )
    {
        let reson = this.getAll();
        if ( reson )
        {
            delete reson[ key ];
            localStorage.setItem( Config.GameId, JSON.stringify( reson ) );
        }
    }

    /**
     * 移除这个用户所有的本地持久化数据
     * @param key 
     */
    removeAll ()
    {
        localStorage.removeItem( Config.GameId );
    }
}