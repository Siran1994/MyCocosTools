import { _decorator, AnimationComponent, Button, Component, Label, Node } from 'cc';
import { AudioMgr } from '../manager/AudioMgr';
import { GameManager } from '../manager/GameManager';
import { GameData } from '../data/GameData';
import { Messager } from '../manager/Messager';
import { UiManager } from '../manager/UiManager';
const { ccclass, property } = _decorator;

@ccclass( 'SelectPanel' )
export class SelectPanel extends Component
{
    @property( Button )
    AddRoleBtn: Button;//增加数量 
    @property( AnimationComponent )
    addAni1: Animation = null;
    @property( Label )
    countLv: Label;
    @property( Label )
    countlvCoin: Label;
    @property( Node )
    adRole: Node = null;

    @property( Button )
    AddTimeBtn: Button;//增加时间
    @property( AnimationComponent )
    addAni2: Animation = null;
    @property( Label )
    timeLv: Label;
    @property( Label )
    timelvCoin: Label;
    @property( Node )
    adTime: Node = null;

    init ()
    {
        this.countLv.string = GameData.SpiderLv.toString();
        this.countlvCoin.string = ( GameData.SpiderLv * 50 ).toString();

        this.timeLv.string = GameData.SpeedLv.toString();
        this.timelvCoin.string = ( GameData.SpeedLv * 100 ).toString();
        UiManager.Instance.mainPanel.CoinTxt.string = GameData.Coin.toString();

        if ( GameData.Coin >= GameData.SpiderLv * 50 )
        {
            this.countlvCoin.node.parent.active = true;
            this.adRole.active = false;
        }
        else
        {
            this.countlvCoin.node.parent.active = false;
            this.adRole.active = true;
        }

        if ( GameData.Coin >= GameData.SpeedLv * 100 )
        {
            this.timelvCoin.node.parent.active = true;
            this.adTime.active = false;
        }
        else
        {
            this.timelvCoin.node.parent.active = false;
            this.adTime.active = true;
        }
    }

    start ()
    {
        this.AddRoleBtn.node.on( Button.EventType.CLICK, () =>
        {
            AudioMgr.Instance.通用按钮.Play();
            if ( GameData.Coin >= GameData.SpiderLv * 50 )
            {
                GameData.Coin -= GameData.SpiderLv * 50;
                GameData.SpiderLv += 1;
                Messager.Broadcast( 'UpGrade' );
                this.init();
                this.addAni1.play();
            }
            else
            {
                GameManager.showAd( () =>
                {
                    GameData.SpiderLv += 1;
                    Messager.Broadcast( 'UpGrade' );
                    this.init();
                    this.addAni1.play();
                } );
            }

        }, this );

        this.AddTimeBtn.node.on( Button.EventType.CLICK, () =>
        {
            AudioMgr.Instance.通用按钮.Play();
            if ( GameData.Coin >= GameData.SpeedLv * 100 )
            {
                GameData.Coin -= GameData.SpeedLv * 100;
                Messager.Broadcast( 'UpGrade' );
                GameData.SpeedLv += 1;
                this.init();
                this.addAni2.play();
            }
            else
            {
                GameManager.showAd( () =>
                {
                    GameData.SpeedLv += 1;
                    this.init();
                    this.addAni2.play();
                    Messager.Broadcast( 'UpGrade' );
                } );
            }

        }, this );

        this.init();
    }

    onEnable ()
    {
        Messager.AddListener( 'CheckCoin', this, this.init );
    }

    onDisable ()
    {
        Messager.RemoveListener( 'CheckCoin', this, this.init );
    }
}