import { _decorator } from 'cc';
export class PlayerPrefs 
{
    public static DeleteAll ()
    {
        localStorage.clear();
    }

    //#region  Int类型
    public static GetInt ( key: string, default_Number: number = 0 ): number
    {
        return PlayerPrefs.GetValueNum( key, default_Number );
    }

    public static SetInt ( key: string, default_Number: number )
    {
        PlayerPrefs.SetValueNum( key, default_Number );
    }

    private static GetValueNum ( value_name: string, default_Number: number ): number
    {
        let t = localStorage.getItem( value_name );

        if ( t != null )
        {
            return Number( t );
        }
        return default_Number;
    }

    private static SetValueNum ( key: string, num: number )
    {
        localStorage.setItem( key, num.toString() );
    }
    //#endregion

    //#region Bool类型
    public static GetBool ( key: string, default_Bool: boolean = null ): boolean
    {
        return PlayerPrefs.GetValueBool( key, default_Bool );
    }

    public static SetBool ( key: string, default_Bool: boolean )
    {
        PlayerPrefs.SetValueBool( key, default_Bool );
    }

    private static GetValueBool ( value_name: string, default_Bool: boolean ): boolean
    {
        let t = localStorage.getItem( value_name );
        if ( t != null )
        {
            return Boolean( t );
        }
        return default_Bool;
    }

    private static SetValueBool ( key: string, value: boolean )
    {
        localStorage.setItem( key, Number( value ).toString() );
    }
    //#endregion

    //#region String类型
    public static GetString ( key: string, default_string: string = null ): string
    {
        return PlayerPrefs.GetValueString( key, default_string );
    }

    public static SetString ( key: string, default_string: string )
    {
        PlayerPrefs.SetValueString( key, default_string );
    }

    private static GetValueString ( value_name: string, default_string: string ): string
    {
        let t = localStorage.getItem( value_name );
        if ( t != null )
        {
            return t;
        }
        return default_string;
    }

    private static SetValueString ( key: string, str: string )
    {
        localStorage.setItem( key, str );
    }
    //#endregion
}