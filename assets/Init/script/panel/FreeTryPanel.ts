import { _decorator, Button, Component, Label, Sprite, SpriteFrame } from 'cc';
import { GameManager } from '../manager/GameManager';
import { AudioMgr } from '../manager/AudioMgr';
import { Messager } from '../manager/Messager';
import { PoolManager } from '../manager/PoolManager';
import { UiManager } from '../manager/UiManager';
import { Config } from '../data/Config';
import { MainPanel } from './MainPanel';
import { find } from 'cc';

const { ccclass, property } = _decorator;

@ccclass( 'FreeTryPanel' )
export class FreeTryPanel extends Component
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
            Messager.Broadcast( 'ChangeDress', Config.PackageName );//换皮肤
            Messager.Broadcast( 'ChangePart', Config.PackageName );//设置当前目标英雄           
            Messager.Broadcast( 'CollectAll', true );
            find( 'Canvas/MainPanel' ).getComponent( MainPanel ).autoStart();
            UiManager.hidePage( Config.PanelName.FreeTryPanel );

        }, this );
        this.cancelBtn.node.on( Button.EventType.CLICK, () =>
        {
            AudioMgr.Instance.通用按钮.Play();
            UiManager.hidePage( this.name );
        }, this );
    }

    ShowPackage ( heroName: string )
    {
        switch ( heroName )
        {
            case '城市飞侠':
                this.heroImage.spriteFrame = this.Icons[ 0 ];
                this.HeroPower.string = '战力:1140';
                break;
            case '雷公':
                this.heroImage.spriteFrame = this.Icons[ 1 ];
                this.HeroPower.string = '战力:2600';
                break;
            case '钢铁英雄':
                this.heroImage.spriteFrame = this.Icons[ 2 ];
                this.HeroPower.string = '战力:3450';
                break;
            case '黑液人':
                this.heroImage.spriteFrame = this.Icons[ 3 ];
                this.HeroPower.string = '战力:4250';
                break;
            case '超级巨人':
                this.heroImage.spriteFrame = this.Icons[ 4 ];
                this.HeroPower.string = '战力:5050';
                break;
        }
    }
}