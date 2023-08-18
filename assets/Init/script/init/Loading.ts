import { _decorator, Component, director, Label, ProgressBar, SceneAsset } from 'cc';
const { ccclass, property } = _decorator;

@ccclass( 'Loading' )
export class Loading extends Component
{
    @property( { type: ProgressBar } )
    m_progress: ProgressBar = null!;

    @property( { type: Label } )
    m_progresstxt: Label = null!;

    public showProgress ( targetlv: string, callback: Function )
    {
        // 预加载场景资源
        director.preloadScene( targetlv, ( completedCount: number, totalCount: number, item: any ) =>
        {
            // 进度回调函数
            this.m_progress.progress = completedCount / totalCount;

            this.m_progresstxt.string = '加载中：' + Math.floor( this.m_progress.progress * 100 ) + '%';
        },
            ( error: Error, sceneAsset: SceneAsset ) =>
            {
                // 加载完成的回调函数
                if ( error )
                    console.error( '场景加载失败:', error );
                else
                {
                    director.loadScene( targetlv, ( err, scene: any ) =>
                    {
                        callback();
                    } );
                }
            } );
    }
}

