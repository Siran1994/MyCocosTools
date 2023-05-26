import { _decorator, AssetManager, AudioClip, AudioSource, Component, director, game, instantiate, Node, Prefab, Scene } from 'cc';
import { AudioClipExit } from '../Utils/AudioClipExit';
import { PlayerPrefs } from '../Utils/PlayerPrefs';
import { ResMgr } from '../Utils/ResMgr';
const { ccclass, property } = _decorator;

@ccclass('AudioMgr')
export class AudioMgr extends Component 
{
    static Instance: AudioMgr = null!;

    // AudioClipExt 是对AudioClip 的一个加强拓展，其目的是为了限制最小播放间隔,降低性能消耗
    @property( { type: AudioClipExit } )
    fishCollection: AudioClipExit = null!;//收集音效

    @property( { type: AudioClipExit } )
    catDeath: AudioClipExit = null!;//收集音效

    @property( { type: AudioClipExit } )
    bgmRunning: AudioClipExit = null!;

    @property( { type: AudioClipExit } )
    bgmHome: AudioClipExit = null!;

    @property( { type: AudioSource } )
    audioSource: AudioSource = null!;

    static misOn = false;
    static get isOn (): boolean
    {
        return AudioMgr.misOn;
    }

    static set isOn ( value: boolean )
    {
        AudioMgr.misOn = value;
        if ( AudioMgr.Instance && AudioMgr )
        {
            if ( AudioMgr.misOn )
                AudioMgr.Instance.audioSource.play();
            else
                AudioMgr.Instance.audioSource.stop();
        }
    }

    protected onLoad (): void
    {
        AudioMgr.isOn = PlayerPrefs.GetInt( 'soundOn', 1 ) == 1;
    }
    // start ()
    // {
    //     AudioMgr.Instance = this;
    //     AudioMgr.isOn = true;
    //     this.bgmHome.playMusic();
    // }

    public static init ( p_Scene: Scene, callback: Function, caller: any )
    {
        console.log( 'needInit' );
        if ( AudioMgr.Instance == null )
        {
            let loadPrefabFuc = ( bundle: AssetManager.Bundle ) =>
            {
                //加载预制体
                console.log( '加载预制体 audioMgr' );
                bundle.load( 'prefab/AudioMgr', Prefab, function ( err, prefab )
                {
                    console.log( err );
                    let node: Node = instantiate( prefab );//克隆预制体
                    //let canvas = cc.find("Canvas");//取得场景根节点
                    //node.parent = canvas;//添加预制体到根节点
                    // node.active = true;//激活预制体节点
                    p_Scene.addChild( node );

                    director.addPersistRootNode( node );
                    node && ( AudioMgr.Instance = node.getComponent( AudioMgr ) as AudioMgr );

                    callback.call( caller );
                } );
            }
            ResMgr.loadBundle( this, ( bundle: AssetManager.Bundle ) =>
            {
                loadPrefabFuc( ResMgr.m_bundle );
            } );

        } 
        else
        {
            callback.call( caller );
        }
    }

    ResumeBgm ()
    {
        if ( AudioMgr.isOn )
            this.audioSource.play();
    }
}