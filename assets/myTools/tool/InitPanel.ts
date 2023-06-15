import { _decorator, assetManager, AssetManager, Component, director, Node, ProgressBar } from 'cc';
import { ResMgr } from '../manager/ResMgr';
import { PlayerPrefs } from './PlayerPrefs';


const { ccclass, property } = _decorator;

@ccclass( 'InitPanel' )
export class InitPanel extends Component
{
    @property( { type: ProgressBar } )
    m_progress: ProgressBar = null!;

    start () 
    {
        let sf = this;
        this.m_progress.progress = 0;
        let op: any = {};
        op.onFileProgress = this.loadPress.bind( this );
        assetManager.loadBundle( 'bundle', op, InitPanel.bundleResult );

        PlayerPrefs.DeleteAll();
    }

    loadPress ( res: any )
    {
        console.log( '下载进度', res.progress )
        console.log( '已经下载的数据长度', res.totalBytesWritten )
        console.log( '预期需要下载的数据总长度', res.totalBytesExpectedToWrite )
        console.log( 'loadPress bind this2', res.progress );
        // 实际长度=2.7
        //  let realSize = 2.7;
        //  this.m_progress.progress = res.progress / realSize;

        //预期数据不太准确,如需要精确进度自行指定下载大小
        let realSize = 605335;
        this.m_progress.progress = res.totalBytesWritten / realSize;
    }

    static bundleResult ( err: Error | null, bundle: AssetManager.Bundle )
    {
        console.log( 'err?', err?.message );
        ResMgr.m_bundle = bundle;
        InitPanel.runScene();
    }

    static runScene ()
    {
        let sf = this;
        director.loadScene( 'game', ( err, scene: any ) =>
        {
            console.log( '加载完成,进入目标场景!' )
            console.log( err );
        } )
    }
}

