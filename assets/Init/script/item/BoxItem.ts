import { _decorator, AnimationComponent, Button, Component, Label } from 'cc';
import { Utils } from '../tool/Utils';
import { AudioMgr } from '../manager/AudioMgr';
import { Messager } from '../manager/Messager';
import { UiManager } from '../manager/UiManager';
import { Config } from '../data/Config';
import { Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass( 'BoxItem' )
export class BoxItem extends Component
{
    @property( { type: AnimationComponent } )
    ani: AnimationComponent = null!;

    @property( Button )
    FreeGetBtn: Button = null;

    @property( Button )
    AdGetBtn: Button = null;

    @property( Label )
    CoinNum: Label = null;

    isOpened = false;

    start ()
    {
        if ( this.ani == null )
            this.ani = this.getComponent( AnimationComponent );
        this.CoinNum.string = '0';

        this.FreeGetBtn.node.on( Button.EventType.CLICK, () =>
        {
            this.FreeGetBtn.interactable = false;
            let coin = Utils.random( Config.BoxReward.Min, Config.BoxReward.Max );
            this.CoinNum.node.active = true;
            this.CoinNum.string = coin.toString();
            AudioMgr.Instance.通用按钮.Play();
            this.ani.playOnLoad = true;
            this.ani.play();
            this.isOpened = true;
            Messager.Broadcast( 'addCount' );
            UiManager.Instance.UpdateCoin( coin, UiManager.Instance.rewardPanel.CoinTxt, Vec3.ZERO, UiManager.Instance.rewardPanel.CoinTxt.node.worldPosition );
        }, this );

        this.AdGetBtn.node.on( Button.EventType.CLICK, () =>
        {
            this.AdGetBtn.interactable = false;
            this.FreeGetBtn.interactable = false;
            this.AdGetBtn.node.active = false;
            let coin = Utils.random( Config.BoxReward.Min, Config.BoxReward.Max );
            this.CoinNum.node.active = true;
            this.CoinNum.string = coin.toString();
            AudioMgr.Instance.点击广告按钮.Play();
            this.ani.playOnLoad = true;
            this.ani.play();
            UiManager.Instance.UpdateCoin( coin, UiManager.Instance.rewardPanel.CoinTxt, Vec3.ZERO, UiManager.Instance.rewardPanel.CoinTxt.node.worldPosition );
        }, this );
    }

    onEnable ()
    {
        Messager.AddListener( 'NoCount', this, this.NoCount );
        Messager.AddListener( 'OpenAllBox', this, this.OpenAllBox );
    }

    onDisable ()
    {

        Messager.RemoveListener( 'NoCount', this, this.NoCount );
        Messager.RemoveListener( 'OpenAllBox', this, this.OpenAllBox );
    }
    NoCount ()
    {
        if ( this.isOpened == false )
        {
            this.AdGetBtn.node.active = true;
        }
    }

    OpenAllBox ()
    {
        if ( this.isOpened == false )
        {
            this.AdGetBtn.interactable = false;
            this.FreeGetBtn.interactable = false;
            this.AdGetBtn.node.active = false;
            let coin = Utils.random( Config.BoxReward.Min, Config.BoxReward.Max );
            this.CoinNum.node.active = true;
            this.CoinNum.string = coin.toString();
            AudioMgr.Instance.点击广告按钮.Play();
            this.ani.playOnLoad = true;
            this.ani.play();
            UiManager.Instance.UpdateCoin( coin, UiManager.Instance.rewardPanel.CoinTxt, Vec3.ZERO, UiManager.Instance.rewardPanel.CoinTxt.node.worldPosition );
        }
    }
}