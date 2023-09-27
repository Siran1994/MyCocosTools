import { Button, Label, Sprite, SpriteFrame } from 'cc';
import { _decorator } from 'cc';
import { AudioMgr } from '../manager/AudioMgr';
import { PoolManager } from '../manager/PoolManager';
import { BasePanel } from '../panel/BasePanel';
const { ccclass, property } = _decorator;

@ccclass( 'tipPanel' )
export class tipPanel extends BasePanel
{
    @property( Sprite )
    Icon: Sprite = null;

    @property( Label )
    num: Label = null;//内容

    @property( Label )
    IconName: Label = null;//内容

    @property( Button )
    ConfirmBtn: Button;//确认    

    callback = null;
    show ( icon: SpriteFrame, count: number, name: string, callback: Function )
    {
        this.Icon.spriteFrame = icon;
        this.num.string = 'x' + count.toString();
        this.IconName.string = name;
        this.callback = callback;
        this.ConfirmBtn.node.on( Button.EventType.CLICK, this.ConfirmClick, this );
        this.ShowPanel();
    }

    ConfirmClick ()
    {
        AudioMgr.Instance.通用按钮.Play();
        this.HidePanel( 0.2, () =>
        {
            this.callback();
            this.ConfirmBtn.node.off( Button.EventType.CLICK, this.ConfirmClick, this );
            PoolManager.putNode( this.node );
        } );
    }
}