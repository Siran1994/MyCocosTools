import { _decorator, AudioSource, Component, director, instantiate, Node } from 'cc';
import { GameData } from '../data/GameData';
import { PrefabManager } from './PrefabManager';
import { AudioClip } from 'cc';
import { Config } from '../data/Config';
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

@ccclass( 'AudioClipExit' )
export class AudioClipExit 
{
    @property( { type: AudioClip } )
    audioClip: AudioClip;

    minRate = 0.2;//最小播放间隔,限制高频率,优化性能
    preTime = 0;

    public playMusic ( volume: number = Config.Volume.Music )
    {
        if ( !AudioMgr.Instance.misOn ) return;
        if ( AudioMgr.Instance.musicPlayer.clip != null )
        {
            AudioMgr.Instance.musicPlayer.loop = false;
            AudioMgr.Instance.musicPlayer.stop();
        }

        AudioMgr.Instance.musicPlayer.volume = volume;
        AudioMgr.Instance.musicPlayer.clip = this.audioClip;
        AudioMgr.Instance.musicPlayer.loop = true;
        AudioMgr.Instance.musicPlayer.play();
    }

    public StopMusic ()
    {
        if ( !AudioMgr.Instance.misOn ) return;
        AudioMgr.Instance.musicPlayer.stop();
    }

    public Play ( volume: number = Config.Volume.Audio )
    {
        if ( !AudioMgr.Instance.aisOn ) return;
        if ( Time.time - this.preTime < this.minRate ) return;
        this.preTime = Time.time;
        AudioMgr.Instance.audioPlayer.playOneShot( this.audioClip, volume );
    }
}

@ccclass( 'AudioMgr' )
export class AudioMgr extends Component 
{
    static Instance: AudioMgr = null!;

    static AuidoMap: Map<string, AudioClip> = new Map();//基础音效库

    onLoad ()
    {
        AudioMgr.Instance = this;
        this.aisOn = GameData.SoundOn == 1;
        this.misOn = GameData.MusicOn == 1;

        // AudioMgr.loadAudios( Config.BundleName.Base, 'audios', () =>
        // {
        //     console.error( AudioMgr.AuidoMap.size );
        //     console.error( '基础音效加载完成!' );
        //     this.playMusic( 'bgm' );
        // } );
    }

    @property( { type: AudioClipExit } )
    金币收集: AudioClipExit = null;//收集音效 
    @property( { type: AudioClipExit } )
    开箱: AudioClipExit = null;//收集音效 
    @property( { type: AudioClipExit } )
    受击: AudioClipExit = null;//收集音效
    @property( { type: AudioClipExit } )
    撞墙: AudioClipExit = null;//收集音效
    @property( { type: AudioClipExit } )
    玩家打击: AudioClipExit = null;//收集音效
    @property( { type: AudioClipExit } )
    Boss打击: AudioClipExit = null;//收集音效
    @property( { type: AudioClipExit } )
    完美收集: AudioClipExit = null;//收集音效
    @property( { type: AudioClipExit } )
    吃到钻石: AudioClipExit = null;//收集音效
    @property( { type: AudioClipExit } )
    吃到服装: AudioClipExit = null;//收集音效
    @property( { type: AudioClipExit } )
    到达终点: AudioClipExit = null;//收集音效
    @property( { type: AudioClipExit } )
    失败结算: AudioClipExit = null;//收集音效
    @property( { type: AudioClipExit } )
    奖励弹窗: AudioClipExit = null;//收集音效
    @property( { type: AudioClipExit } )
    奖励解锁进度: AudioClipExit = null;//收集音效
    @property( { type: AudioClipExit } )
    武器打人: AudioClipExit = null;//收集音效
    @property( { type: AudioClipExit } )
    玩家受击: AudioClipExit = null;
    @property( { type: AudioClipExit } )
    衣服消失: AudioClipExit = null;
    @property( { type: AudioClipExit } )
    胜利结算: AudioClipExit = null;
    @property( { type: AudioClipExit } )
    点击广告按钮: AudioClipExit = null;
    @property( { type: AudioClipExit } )
    通用按钮: AudioClipExit = null;
    @property( { type: AudioClipExit } )
    游戏背景乐: AudioClipExit = null;
    @property( { type: AudioClipExit } )
    首页背景乐: AudioClipExit = null;

    @property( { displayName: '音效', type: AudioSource } )
    audioPlayer: AudioSource;

    @property( { displayName: '音乐', type: AudioSource } )
    musicPlayer: AudioSource;

    aisOn = false;
    misOn = false;

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

    public static init ( node: Node, cb: Function )
    {
        if ( AudioMgr.Instance == null )
        {
            let Prefab = PrefabManager.get( 'AudioMgr', PrefabManager.UiMap )
            let go = instantiate( Prefab );
            go.parent = node;
            director.addPersistRootNode( go );
            setTimeout( () => { cb && cb(); }, 100 );

        }
        else
            cb && cb();
    }

    // public static loadAudios ( bundleName: string, path: string, cb?: Function )
    // {
    //     ResMgr.loadDir( bundleName, path, AudioClip, ( completedCount, totalCount ) =>
    //     {
    //     }, ( assets: AudioClip[] ) =>
    //     {
    //         assets.forEach( asset =>
    //         {
    //             console.error( asset.name );
    //             this.set( asset.name, asset, this.AuidoMap );
    //         } );
    //         cb && cb();
    //     } );
    // }
}