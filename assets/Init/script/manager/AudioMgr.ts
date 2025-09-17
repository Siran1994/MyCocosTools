import { _decorator, assetManager, AudioClip, AudioSource, Component, director } from 'cc';
import { GameData } from '../data/GameData';
import { Utils } from '../tool/Utils';
import { ResMgr } from './ResMgr';
const { ccclass, property } = _decorator;

@ccclass( 'Time' )
export class Time 
{
    static first: number | null = null;//单位秒
    public static get time (): number
    {
        if ( Time.first == null )
            Time.first = performance.now();
        return ( performance.now() - Time.first ) * 0.001;
    }
}

@ccclass( 'AudioMgr' )
export class AudioMgr extends Component 
{
    static Instance: AudioMgr = null!;
    static AuidoMap: Map<string, AudioClip> = new Map();//基础音效库
    aisOn = false;
    misOn = false;

    onLoad ()
    {
        director.addPersistRootNode( this.node );
        AudioMgr.Instance = this;
        this.aisOn = GameData.SoundOn == 1;
        this.misOn = GameData.MusicOn == 1;
        // AudioMgr.loadAudios( Config.BundleName.Base, 'audios', () =>
        // {
        //     AudioMgr.Instance.playMusic( 'gamebg' );
        // } );
    }

    @property( { displayName: '音效', type: AudioSource } )
    audioPlayer: AudioSource;

    @property( { displayName: '音乐', type: AudioSource } )
    musicPlayer: AudioSource;

    UpdateState ()
    {
        this.aisOn = GameData.SoundOn == 1;
        this.misOn = GameData.MusicOn == 1;

        if ( this.aisOn )
            AudioMgr.Instance.audioPlayer.play();
        else
            AudioMgr.Instance.audioPlayer.stop();

        if ( this.misOn )
            AudioMgr.Instance.musicPlayer.play();
        else
            AudioMgr.Instance.musicPlayer.stop();
    }


    playMusic ( clip: string | AudioClip ) //播放背景音乐
    {
        if ( AudioMgr.Instance.misOn == false )
            return;
        if ( typeof clip === 'string' )
        {
            AudioMgr.Instance.musicPlayer.stop();
            AudioMgr.Instance.musicPlayer.clip = this.GetClip( clip );
            AudioMgr.Instance.musicPlayer.play();
        }
        else
        {
            AudioMgr.Instance.musicPlayer.stop();
            AudioMgr.Instance.musicPlayer.clip = clip;
            AudioMgr.Instance.musicPlayer.play();
        }
    }

    stopMusic ( audioName: string ) //停止背景音乐
    {
        if ( !AudioMgr.Instance.misOn ) return;

        if ( AudioMgr.Instance.musicPlayer.clip.name == audioName )
        {
            AudioMgr.Instance.musicPlayer.stop();
        }
    }

    Play ( clip: string | AudioClip, isBreak = true, cb?: Function )
    {
        if ( AudioMgr.Instance.aisOn == false )
            return;
        AudioMgr.Instance.audioPlayer.stop();
        if ( typeof clip === 'string' )
        {
            if ( isBreak )
            {
                AudioMgr.Instance.audioPlayer.clip = this.GetClip( clip );
                AudioMgr.Instance.audioPlayer.play();
            }
            else
            {
                AudioMgr.Instance.audioPlayer.playOneShot( this.GetClip( clip ) );
            }
        }
        else
        {
            if ( isBreak )
            {
                AudioMgr.Instance.audioPlayer.clip = clip;
                AudioMgr.Instance.audioPlayer.play();
            }
            else
            {
                AudioMgr.Instance.audioPlayer.playOneShot( clip );
            }
            Utils.DelayCallBack( clip.getDuration(), () =>
            {
                cb && cb();
            } );
        }
    }

    GetClip ( clip: string )
    {
        if ( AudioMgr.get( clip, AudioMgr.AuidoMap ) != null )
            return AudioMgr.get( clip, AudioMgr.AuidoMap );
    }

    public static loadAudios ( bundleName: string, path: string, cb?: Function )
    {
        ResMgr.loadDir( bundleName, path, AudioClip, ( completedCount, totalCount ) =>
        {
        }, ( assets: AudioClip[] ) =>
        {
            assets.forEach( asset =>
            {
                this.set( asset.name, asset, this.AuidoMap );
            } );
            cb && cb();
        } );
    }

    //添加纹理资源
    public static set ( key: string, value: AudioClip, targetMap: Map<string, AudioClip> ): void
    {
        if ( targetMap.has( key ) )
        {
            console.warn( `set fail: ${ key } already exsit in the textureMap` );
        } else
        {
            targetMap.set( key, value );
        }
    }

    //获取纹理资源
    public static get ( key: string, targetMap: Map<string, AudioClip> ): AudioClip
    {
        if ( targetMap.has( key ) )
        {
            return targetMap.get( key );
        } else
        {
            console.warn( `get fail: ${ key } not exsit in the textureMap` );
        }
    };

    //释放单个纹理资源
    public static releaseAsset ( key, targetMap: Map<string, AudioClip> ): void
    {
        if ( targetMap.has( key ) )
        {
            var asset: AudioClip = targetMap.get( key );
            targetMap.delete( key );
            assetManager.releaseAsset( asset );
            console.log( "release asset with " + key );
        }
    };

    //释放所有纹理资源
    public static releaseAllAsset (): void
    {
        this.AuidoMap.clear();
    };
}