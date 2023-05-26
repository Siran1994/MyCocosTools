import { _decorator, AudioClip, CCFloat, Component, Node } from 'cc';
import { Time } from './Time';
import { AudioMgr } from '../Managers/AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('AudioClipExit')
export class AudioClipExit 
{
    @property( { type: AudioClip } )
    audioClip: AudioClip = null!;

    @property( { type: CCFloat } )
    minRate = 0;//最小播放间隔,限制高频率,优化性能
    preTime = 0;

    public playMusic ()
    {
        if ( !AudioMgr.isOn ) return;
        
        AudioMgr.Instance.audioSource.clip = this.audioClip;
        AudioMgr.Instance.audioSource.play();
    }

    public StopMusic ()
    {
        if ( !AudioMgr.isOn ) return;
        AudioMgr.Instance.audioSource.stop();
    }

    public Play ()
    {
        if ( !AudioMgr.isOn ) return;

        if ( Time.time - this.preTime < this.minRate ) return;

        this.preTime = Time.time;

        AudioMgr.Instance.audioSource.playOneShot( this.audioClip, 1 );
    }
}

