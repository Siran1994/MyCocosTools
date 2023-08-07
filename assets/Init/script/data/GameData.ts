import { _decorator } from 'cc';
import { PlayerPrefs } from './PlayerPrefs';
import { PhysicsSystem, Vec3, game, profiler } from 'cc';
import { Scene } from 'cc';


export class GameData 
{
    public static GameFrame = 60;

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

    static GameSetting ( scene: Scene )
    {
        scene.autoReleaseAssets = false;
        PhysicsSystem.instance.gravity = new Vec3( 0, -50, 0 ); // 设置重力向量为向下的 1000 米/秒²//设置重力
        game.frameRate = GameData.GameFrame;//帧率设置
        PhysicsSystem.instance.fixedTimeStep = 1 / game.frameRate;//优化物理引擎计算次数
        profiler.showStats();
        profiler.hideStats();
    }
}

