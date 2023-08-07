import { _decorator, Button, Component, Label, Sprite, SpriteFrame } from 'cc';
import { AudioMgr } from '../manager/AudioMgr';
import { PlayerPrefs } from '../data/PlayerPrefs';
import { Messager } from '../manager/Messager';
import { UiManager } from '../manager/UiManager';
import { GameManager } from '../manager/GameManager';
import { Utils } from '../tool/Utils';
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
            this.node.active = false;
            AudioMgr.Instance.点击广告按钮.Play();
            Messager.Broadcast( 'ChangeDress', GameManager.Instance.PackageName );//换皮肤
            Messager.Broadcast( 'ChangePart', GameManager.Instance.PackageName );//设置当前目标英雄
            GameManager.Instance.MainHero = GameManager.Instance.PackageName;
            UiManager.Instance.gamePanel.CheckHeroCollect( true );
            UiManager.Instance.mainPanel.autoStart();
        }, this );
        this.cancelBtn.node.on( Button.EventType.CLICK, () =>
        {
            this.node.active = false;
            AudioMgr.Instance.通用按钮.Play();
        }, this );
    }

    ShowPackage ( heroName: string )
    {
        this.node.active = true;
        switch ( heroName )
        {
            case '蜘蛛侠':
                this.heroImage.spriteFrame = this.Icons[ 0 ];
                this.HeroPower.string = '战力:1140';
                break;
            case '雷神':
                this.heroImage.spriteFrame = this.Icons[ 1 ];
                this.HeroPower.string = '战力:2600';
                break;
            case '钢铁侠':
                this.heroImage.spriteFrame = this.Icons[ 2 ];
                this.HeroPower.string = '战力:3450';
                break;
            case '毒液':
                this.heroImage.spriteFrame = this.Icons[ 3 ];
                this.HeroPower.string = '战力:4250';
                break;
            case '浩克':
                this.heroImage.spriteFrame = this.Icons[ 4 ];
                this.HeroPower.string = '战力:5050';
                break;
        }
    }
}