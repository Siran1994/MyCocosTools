import { _decorator } from 'cc';
const { ccclass } = _decorator;

@ccclass( 'StorageManager' )
export class StorageManager 
{
    private static instance: StorageManager = null;

    public static get Instance ()
    {
        if ( this.instance )
            return this.instance;
        this.instance = new StorageManager();
        return this.instance;
    }

    private userData: any;
    private userId: string = '';

    setUserId ( userId: string )
    {
        if ( userId == null )
            this.userId = `${ Date.now() }${ 0 | ( Math.random() * 1000, 10 ) }`;
        else
            this.userId = userId;
    }
    getUserId ()
    {
        if ( this.userId == null )
            this.userId = `${ Date.now() }${ 0 | ( Math.random() * 1000, 10 ) }`;
        return this.userId;
    }
    /**
     * 获取用户某个键对应的持久化数据
     * @param key 
     */
    getItem ( key: string )
    {
        let reson = this.getAll();
        if ( reson && reson[ key ] )
        {
            return reson[ key ];
        } else
        {
            return null;
        }
    }

    /**
     * 设置用户的持久化数据
     * @param key 
     * @param value 
     */
    setItem ( key: string, value: any )
    {
        if ( !this.userData )
        {
            this.userData = {};
        }
        this.userData[ key ] = value;
        let uuid = this.getUserId(); //自己定义的用户uuid，作为存储的键，因为玩家可能存在多个账号
        localStorage.setItem( uuid + "", JSON.stringify( this.userData ) );
    }

    /**
     * 获取本地存储的所有的持久化数据
     */
    getAll ()
    {
        if ( !this.userData )
        {
            let uuid = this.getUserId();
            let reson = localStorage.getItem( uuid + '' );
            if ( reson )
            {
                this.userData = JSON.parse( reson );
            } else
            {
                this.userData = {};
            }
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
            let uuid = this.getUserId();
            localStorage.setItem( uuid + '', JSON.stringify( reson ) );
        }
    }

    /**
     * 移除这个用户所有的本地持久化数据
     * @param key 
     */
    removeAll ()
    {
        let uuid = this.getUserId();
        localStorage.removeItem( uuid + '' );
    }
}