import { _decorator, AudioSource, Component, director, instantiate, Node, Prefab } from 'cc';
import { PlayerPrefs } from '../data/PlayerPrefs';
import { AudioClipExit } from '../tool/AudioClipExit';
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

    public static init ( node: Node, callback: Function, caller: any )
    {
        if ( AudioMgr.Instance == null )
        {
            ResMgr.loadPrefab( 'prefab/audiomgr/AudioMgr', ( obj: Prefab ) =>
            {
                let go = instantiate( obj );
                go.parent = node;
                director.addPersistRootNode( go );
                callback.call( caller );
            } );
        }
        else
            callback.call( caller );
    }
}