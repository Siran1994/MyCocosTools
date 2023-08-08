import { _decorator, Component, director, ProgressBar } from 'cc';
import { ResMgr } from '../manager/ResMgr';
import { GameData } from '../data/GameData';
import DOTweenAnimation from '../animation/DOTweenAnimation';
import { AudioMgr } from '../manager/AudioMgr';
import { PlayerPrefs } from '../data/PlayerPrefs';
const { ccclass, property } = _decorator;

@ccclass( 'Init' )
export class Init extends Component
{
    @property( { type: ProgressBar } )
    m_progress: ProgressBar = null!;

    protected onLoad (): void
    {
        PlayerPrefs.DeleteAll();
        ResMgr.loadBundle( 'bundle', () =>
        {
            if ( GameData.Lv == 0 || GameData.Lv == null )
                GameData.Lv = 1;

            director.preloadScene( GameData.Lv.toString(), () =>
            {
                director.loadScene( GameData.Lv.toString() );
            } );

            AudioMgr.init( this.node.parent, () =>
            {
                AudioMgr.Instance.首页背景乐.playMusic();
            }, this );
        } );
    }

    start () 
    {
        this.m_progress.progress = 0;
        var ani = DOTweenAnimation.stepNumProgressFly( this.m_progress, 0, 0.001, 1, 0, () =>
        {
            ani.stop();
            this.m_progress.progress = 1;
        } );
    }
}