import { _decorator, AudioClip } from 'cc';
import { Time } from './Time';
import { AudioMgr } from 'db://assets/Init/script/manager/AudioMgr';

const { ccclass, property } = _decorator;

@ccclass( 'AudioClipExit' )
export class AudioClipExit 
{
    @property( { type: AudioClip } )
    audioClip: AudioClip = null!;

    @property( { type: Number } )
    minRate = 0;//最小播放间隔,限制高频率,优化性能
    preTime = 0;

    public playMusic ( volume: number = 0.5 )
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

    public Play ()
    {
        if ( !AudioMgr.Instance.aisOn ) return;

        if ( Time.time - this.preTime < this.minRate ) return;

        this.preTime = Time.time;

        AudioMgr.Instance.audioPlayer.playOneShot( this.audioClip, 1 );
    }
}