import { _decorator, AudioClip, AudioSource, Component, director, Node, Prefab, Scene } from 'cc';
import { AudioClipExit } from '../common/AudioClipExit';
import { PlayerPrefs } from '../tool/PlayerPrefs';
import { PoolManager } from './PoolManager';
import { ResMgr } from './ResMgr';
const { ccclass, property } = _decorator;

@ccclass( 'AudioMgr' )
export class AudioMgr extends Component 
{
    static Instance: AudioMgr = null!;

    onLoad ()
    {
        AudioMgr.Instance = this;
        this.aisOn = PlayerPrefs.GetInt( 'soundOn', 1 ) == 1;
        this.misOn = PlayerPrefs.GetInt( 'musicOn', 1 ) == 1;
    }

    @property( { type: AudioClipExit } )
    coinCollection: AudioClipExit = null;//收集音效

    @property( { type: AudioClipExit } )
    hit: AudioClipExit = null;

    @property( { type: AudioClipExit } )
    bgmGame: AudioClipExit = null;

    @property( { type: AudioClipExit } )
    bgmHome: AudioClipExit = null;

    @property( { displayName: '音效', type: AudioSource } )
    audioPlayer: AudioSource;

    @property( { displayName: '音乐', type: AudioSource } )
    musicPlayer: AudioSource;

    aisOn = false;
    misOn = false;

    UpdateState ()
    {
        this.aisOn = PlayerPrefs.GetInt( 'soundOn', 1 ) == 1;
        this.misOn = PlayerPrefs.GetInt( 'musicOn', 1 ) == 1;

        if ( this.aisOn )
            AudioMgr.Instance.audioPlayer.play();
        else
            AudioMgr.Instance.audioPlayer.stop();

        if ( this.misOn )
            AudioMgr.Instance.musicPlayer.play();
        else
            AudioMgr.Instance.musicPlayer.stop();
    }

    public static init ( p_Scene: Scene, callback: Function, caller: any )
    {
        if ( AudioMgr.Instance == null )
        {
            ResMgr.loadPrefab( 'prefab/audioMgr/AudioMgr', ( obj: Prefab ) =>
            {
                let go = PoolManager.getNode( obj, p_Scene ) as Node;
                //let go = instantiate( obj );
                // p_Scene.addChild( go );
                director.addPersistRootNode( go );
                callback.call( caller );
            } );
        }
        else
            callback.call( caller );
    }

    // public playAudio ( clip: AudioClip, volume: number = 0.7 )
    // {
    //     if ( !AudioMgr.Instance.aisOn ) return;

    //     AudioMgr.Instance.audioPlayer.playOneShot( clip, volume );
    // }

    // public playMusic ( clip: AudioClip, volume: number = 0.5 )
    // {
    //     AudioMgr.Instance.musicPlayer.clip = clip;
    //     AudioMgr.Instance.musicPlayer.volume = volume;

    //     if ( AudioMgr.Instance.aisOn )
    //         AudioMgr.Instance.musicPlayer.play();
    //     else
    //         AudioMgr.Instance.musicPlayer.stop();
    // }
}