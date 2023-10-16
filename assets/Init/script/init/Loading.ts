import { Vec3 } from 'cc';
import { _decorator, Component, director, Label, ProgressBar, SceneAsset, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass( 'Loading' )
export class Loading extends Component
{
    @property( { type: ProgressBar } )
    m_progress: ProgressBar = null!;

    @property( { type: Label } )
    m_progresstxt: Label = null!;

    @property( Node )
    tank: Node = null;

    public showProgress ( targetlv: string, cb?: Function )
    {
        // 预加载场景资源
        director.preloadScene( targetlv, ( completedCount: number, totalCount: number, item: any ) =>
        {
            // 进度回调函数
            this.m_progress.progress = completedCount / totalCount;

            this.m_progresstxt.string = '加载中：' + Math.floor( this.m_progress.progress * 100 ) + '%';
            this.tank.position = new Vec3( 540 * this.m_progress.progress - 320, this.tank.position.y );
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
                        cb && cb();
                    } );
                }
            } );
    }
}

