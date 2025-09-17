import { Button, Label } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { AudioMgr } from '../manager/AudioMgr';
import { PoolManager } from '../manager/PoolManager';
const { ccclass, property } = _decorator;

@ccclass( 'tipPanel' )
export class tipPanel extends Component
{
    @property( Label )
    Title: Label;//标题

    @property( Label )
    Content: Label;//内容  

    @property( Button )
    CloseBtn: Button;//关闭

    @property( Button )
    ConfirmBtn: Button;//确认

    @property( Node )
    Ad: Node = null;//广告标识

    start ()
    {
        this.CloseBtn.node.on( Button.EventType.CLICK, () =>
        {
            AudioMgr.Instance.Play( '通用按钮' );
            PoolManager.putNode( this.node );
        }, this );
    }
    onEnable ()
    {
        this.Ad.active = false;
    }
    callback = null;
    show ( title: string, content: string, callback: Function, isAd = false )
    {
        this.Title.string = title;
        this.Content.string = content;
        this.Ad.active = isAd;
        this.callback = callback;
        this.ConfirmBtn.node.on( Button.EventType.CLICK, this.ConfirmClick, this );
    }

    ConfirmClick ()
    {
        if ( this.Ad.active )
            AudioMgr.Instance.Play( '通用按钮' );
        else
            AudioMgr.Instance.Play( '通用按钮' );

        this.callback();

        this.ConfirmBtn.node.off( Button.EventType.CLICK, this.ConfirmClick, this );
        PoolManager.putNode( this.node );
    }
}