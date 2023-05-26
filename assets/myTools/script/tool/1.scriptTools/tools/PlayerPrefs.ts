import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerPrefs')
export class PlayerPrefs 
{
    public static GetInt ( key: string, default_Number: number ): number
    {
        return PlayerPrefs.GetValueNum( key, default_Number );
    }

    public static SetInt ( key: string, default_Number: number )
    {
        PlayerPrefs.SetValueNum( key, default_Number );
    }

    public static DeleteAll ()
    {
        localStorage.clear();
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
}

