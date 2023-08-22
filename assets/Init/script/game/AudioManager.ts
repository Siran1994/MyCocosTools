
import { AudioClip } from "cc";
import AssetManager from "./AssetManager";
import { AudioSource } from "cc";
import { assetManager } from "cc";
export default class AudioManager
{
    /**音频名 */
    public static audioName = {
        /**首页背景音乐 */
        STARTMUSIC: "startMusic",
        /**被发现 */
        BEFIND: "beFind",
        /**按钮 */
        BTN: "btn",
        /**切换姿势通用 */
        CHANGESTYLE: "changeStyle",
        /**失败 */
        FAI: "fai",
        /**游戏音乐 */
        GAMEMUSIC: "gameMusic",
        /**成功 */
        SUC: "suc",
        /**八戒切换姿势 */
        C_B: "c_B",
        /**沙僧切换姿势 */
        C_S: "c_S",
        /**猴子切换姿势 */
        C_H: "c_H",
        /** 妖姬出现 */
        YAOJI: "yaoji",
        /** 倒计时 */
        COUNT: "count"
    };

    /**音频map容器 */
    private static audioMap: Map<string, AudioClip> = new Map();

    ;
    musicPlayer: AudioSource;

    /**初始化 */
    public static onInit ()
    {
        AssetManager.loadDir( AssetManager.BundleName.AUDIO, "", AudioClip, ( completedCount: number, totalCount: number ) =>
        {
        }, ( assets: AudioClip[] ) =>
        {
            assets.forEach( asset =>
            {
                this.set( asset.name, asset );
            } )
        } )
    }

    /**添加音频资源 */
    public static set ( key: string, value: AudioClip ): void
    {
        if ( this.audioMap.has( key ) )
            console.warn( `set fail: ${ key } already exsit the audioMap` );
        else
            this.audioMap.set( key, value );
    }

    /**获取音频资源 */
    public static get ( key: string ): AudioClip
    {
        if ( this.audioMap.has( key ) )
        {
            console.log( `get ${ key } in the audioMap` );
            return this.audioMap.get( key );
        }
        else
            console.warn( `get fail: ${ key } not exsit in the audioMap` );
    };

    /**播放背景音乐  */
    public static playMusic ( key: string, audioPlayer: AudioSource, volume?: number, _callBack?: Function ): void
    {

        this.stopMusic();
        var clip: AudioClip = this.audioMap.get( key );
        var m_volume: number = volume ? volume : 1;
        if ( clip != null )
        {

            audioPlayer.clip = clip;
            audioPlayer.volume = m_volume;
            audioPlayer.node.on( AudioSource.EventType.ENDED, _callBack, this );

        }
        else
        {
            AssetManager.load( AssetManager.BundleName.AUDIO, key, AudioClip, () =>
            {
            }, ( clip: AudioClip ) =>
            {

                audioPlayer.clip = clip;
                audioPlayer.volume = m_volume;
                audioPlayer.node.on( AudioSource.EventType.ENDED, _callBack, this );

            } )
            console.warn( `play music fail: ${ key } not exsit in the audioMap` );
        }
    };

    /**停止播放背景音乐 */
    public static stopMusic ( audioPlayer: AudioSource = null ): void
    {
        audioPlayer.stop();
        console.log( "stop music" );
    };

    /**暂停播放背景音乐 */
    public static pauseMusic ( audioPlayer: AudioSource ): void
    {
        audioPlayer.stop();
        console.log( "pause music" );
    };

    /**设置背景音乐音量（0.0 ~1.0） */
    public static setMusicVolume ( volume: number, audioPlayer: AudioSource ): void
    {
        audioPlayer.volume = volume;
        console.log( "set music volume of " + volume );
    };



    /**播放音效 */
    public static playEffect ( key: string, audioPlayer: AudioSource ): void
    {

        var clip: AudioClip = this.audioMap.get( key );

        if ( clip != null )
        {
            console.log( `play effect ${ key }` );
            audioPlayer.playOneShot( clip, 1 );

        }
        else
        {
            AssetManager.load( AssetManager.BundleName.AUDIO, key, AudioClip, () =>
            {
            }, ( clip: AudioClip ) =>
            {
                console.log( `play effect ${ key }` );
                audioPlayer.playOneShot( clip, 1 );
            } )
        }
    };


    /**释放单个音频资源 */
    public static releaseAsset ( key: string ): void
    {
        var asset: AudioClip = this.audioMap.get( key );
        if ( asset )
        {
            this.audioMap.delete( key );
            assetManager.releaseAsset( asset );
            console.log( "release asset with " + key );
        }
    };

    /**释放所有音频资源 */
    public static releaseAllAsset (): void
    {
        this.audioMap.clear();
        console.log( "prefabMap release all" );
    };
}