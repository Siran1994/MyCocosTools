import { _decorator, Button, Label, Sprite, SpriteFrame } from 'cc';
import { AudioMgr } from '../manager/AudioMgr';
import { BasePanel } from './BasePanel';
const { ccclass, property } = _decorator;

@ccclass( 'FreeTryPanel' )
export class FreeTryPanel extends BasePanel
{
    @property( Button )
    adGetBtn: Button;//广告获取

    @property( Button )
    cancelBtn: Button;//取消选择

    @property( Label )
    heroPower: Label = null;

    @property( Sprite )
    heroImage: Sprite = null;

    @property( SpriteFrame )
    Icons: SpriteFrame[] = [];

    @property( Label )
    HeroPower: Label = null;

    start ()
    {
        AudioMgr.Instance.奖励弹窗.Play();

        this.adGetBtn.node.on( Button.EventType.CLICK, () =>
        {
            AudioMgr.Instance.点击广告按钮.Play();
            this.HidePanel();
        }, this );
        this.cancelBtn.node.on( Button.EventType.CLICK, () =>
        {
            AudioMgr.Instance.通用按钮.Play();
            this.HidePanel();
        }, this );
    }

    ShowPackage ( heroName: string )
    {
        switch ( heroName )
        {
            case '美女电视人':
                this.heroImage.spriteFrame = this.Icons[ 0 ];
                this.HeroPower.string = '战力:1140';
                break;
            case '蓝电视人':
                this.heroImage.spriteFrame = this.Icons[ 1 ];
                this.HeroPower.string = '战力:2600';
                break;
            case '花屏电视人':
                this.heroImage.spriteFrame = this.Icons[ 2 ];
                this.HeroPower.string = '战力:3450';
                break;
            case '黄电视人':
                this.heroImage.spriteFrame = this.Icons[ 3 ];
                this.HeroPower.string = '战力:4250';
                break;
        }
    }
}