import { _decorator } from 'cc';
import BigNumber from '../libs/bignumber.js';
export class PlayerPrefs 
{
    public static DeleteAll ()
    {
        localStorage.clear();
    }

    public static DeleteOne ( key: string )
    {
        localStorage.removeItem( key );
    }

    //#region  BigNum类型
    public static GetBigNum ( value_name: string, default_Number: BigNumber = BigNumber( 0 ) ): BigNumber
    {
        let t = localStorage.getItem( value_name );

        if ( t != null )
        {
            return BigNumber( t );
        }
        return default_Number;
    }

    public static SetBigNum ( key: string, num: BigNumber )
    {
        localStorage.setItem( key, num.toFixed( 0 ) );
    }
    //#endregion

    //#region  Int类型
    public static GetInt ( value_name: string, default_Number: number = 0 ): number
    {
        let t = localStorage.getItem( value_name );
        if ( t != null )
            return Number( t );
        return default_Number;
    }

    public static SetInt ( key: string, num: number )
    {
        localStorage.setItem( key, num.toString() );
    }
    //#endregion

    //#region  Float类型
    public static GetFloat ( value_name: string, default_Number: number = 0 ): number
    {
        let t = localStorage.getItem( value_name );

        if ( t != null )
        {
            return Number.parseFloat( t );
        }
        return default_Number;
    }

    public static SetFloat ( key: string, num: number )
    {
        localStorage.setItem( key, num.toString() );
    }
    //#endregion

    //#region Bool类型    

    public static GetBool ( value_name: string, default_Bool: boolean ): boolean
    {
        let t = localStorage.getItem( value_name );
        if ( t != null )
        {
            return Boolean( t );
        }
        return default_Bool;
    }

    public static SetBool ( key: string, value: boolean )
    {
        localStorage.setItem( key, Boolean( value ).toString() );
    }
    //#endregion

    //#region String类型   

    public static GetString ( value_name: string, default_string: string ): string
    {
        let t = localStorage.getItem( value_name );
        if ( t != null )
        {
            return t;
        }
        return default_string;
    }

    public static SetString ( key: string, str: string )
    {
        localStorage.setItem( key, str );
    }
    //#endregion
}