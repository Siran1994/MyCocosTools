import { _decorator } from 'cc';
import { PlayerPrefs } from '../tool/PlayerPrefs';



export class GameData 
{
    private static coin: number = 0;

    static get Coin ()
    {
        return PlayerPrefs.GetInt( 'coin', 0 );
    }
    static set Coin ( value: number )
    {
        this.coin = value;
        PlayerPrefs.SetInt( 'coin', value );
    }

    private static level: number = 1;

    static get Lv ()
    {
        return PlayerPrefs.GetInt( 'level', 1 );
    }
    static set Lv ( value: number )
    {
        this.level = value;
        PlayerPrefs.SetInt( 'level', value );
    }

    private static packplan: number = 0;

    static get PackPlan ()
    {
        return PlayerPrefs.GetInt( 'packplan', 0 );
    }
    static set PackPlan ( value: number )
    {
        this.level = value;
        PlayerPrefs.SetInt( 'packplan', value );
    }
}

