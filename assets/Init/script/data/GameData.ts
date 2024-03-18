import { _decorator } from 'cc';
import { PlayerPrefs } from './PlayerPrefs';
export class GameData 
{
    static initData ()
    {
        if ( GameData.Lv == 0 || GameData.Lv == null )
            GameData.Lv = 1;
        if ( GameData.Star == 0 || GameData.Star == null )
            GameData.Star = 0;
        if ( GameData.Coin == 0 || GameData.Coin == null )
            GameData.Coin = 0;
        if ( GameData.PackPlan == 0 || GameData.PackPlan == null )
            GameData.PackPlan = 0;
        if ( GameData.SoundOn == 0 || GameData.SoundOn == null )
            GameData.SoundOn = 1;
        if ( GameData.MusicOn == 0 || GameData.MusicOn == null )
            GameData.MusicOn = 1;
        if ( GameData.FreeNum == 0 || GameData.FreeNum == null )
            GameData.FreeNum = 1;
        if ( GameData.BulletType == 0 || GameData.BulletType == null )
            GameData.BulletType = 0;
        if ( GameData.PlayerType == '' || GameData.PlayerType == null )
            GameData.PlayerType = '普通马桶';
        if ( GameData.KnifeType == 0 || GameData.KnifeType == null )
            GameData.KnifeType = 0;
        if ( GameData.HandType == 0 || GameData.HandType == null )
            GameData.HandType = 0;
        if ( GameData.SignDay == 0 || GameData.SignDay == null )
            GameData.SignDay = 0;
    }

    static get Star ()
    {
        return PlayerPrefs.GetInt( 'star', 0 );
    }
    static set Star ( value: number )
    {
        PlayerPrefs.SetInt( 'star', value );
    }

    static get Coin ()
    {
        return PlayerPrefs.GetInt( 'coin', 0 );
    }
    static set Coin ( value: number )
    {
        PlayerPrefs.SetInt( 'coin', value );
    }

    static get Lv ()
    {
        return PlayerPrefs.GetInt( 'level', 1 );
    }
    static set Lv ( value: number )
    {
        PlayerPrefs.SetInt( 'level', value );
    }

    static get SoundOn ()
    {
        return PlayerPrefs.GetInt( 'soundOn', 1 );
    }
    static set SoundOn ( value: number )
    {
        PlayerPrefs.SetInt( 'soundOn', value );
    }

    static get MusicOn ()
    {
        return PlayerPrefs.GetInt( 'musicOn', 1 );
    }
    static set MusicOn ( value: number )
    {
        PlayerPrefs.SetInt( 'musicOn', value );
    }

    static get PackPlan ()
    {
        return PlayerPrefs.GetInt( 'packplan', 0 );
    }
    static set PackPlan ( value: number )
    {
        PlayerPrefs.SetInt( 'packplan', value );
    }

    static get FreeNum ()
    {
        return PlayerPrefs.GetInt( 'freenum', 1 );
    }
    static set FreeNum ( value: number )
    {
        PlayerPrefs.SetInt( 'freenum', value );
    }

    static get BulletType ()
    {
        return PlayerPrefs.GetInt( 'bulletType', 0 );//默认小黄弹
    }
    static set BulletType ( value: number )
    {
        PlayerPrefs.SetInt( 'bulletType', value );
    }

    static get PlayerType ()
    {
        return PlayerPrefs.GetString( 'playerType', '普通马桶' );//默认普通马桶
    }
    static set PlayerType ( value: string )
    {
        PlayerPrefs.SetString( 'playerType', value );
    }

    static get KnifeType ()
    {
        return PlayerPrefs.GetInt( 'KnifeType', 0 );//刀的类型
    }
    static set KnifeType ( value: number )
    {
        PlayerPrefs.SetInt( 'KnifeType', value );
    }

    static get HandType ()
    {
        return PlayerPrefs.GetInt( 'HandType', 0 );//手的类型
    }
    static set HandType ( value: number )
    {
        PlayerPrefs.SetInt( 'HandType', value );
    }

    static get SignDay ()//签到日期
    {
        return PlayerPrefs.GetInt( 'SignDay', 0 );
    }
    static set SignDay ( value: number )
    {
        PlayerPrefs.SetInt( 'SignDay', value );
    }
}