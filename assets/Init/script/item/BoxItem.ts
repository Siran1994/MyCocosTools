import { _decorator, AnimationComponent, Button, Component, Label } from 'cc';
import { GameData } from '../data/GameData';
import { Utils } from '../tool/Utils';
import { AudioMgr } from '../manager/AudioMgr';
import { Messager } from '../manager/Messager';
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
            let coin = Utils.random( 40, 100 );
            this.CoinNum.node.active = true;
            GameData.Coin += coin;
            this.CoinNum.string = coin.toString();
            AudioMgr.Instance.通用按钮.Play();
            this.ani.playOnLoad = true;
            this.ani.play();
            this.isOpened = true;
            Messager.Broadcast( 'addCount' );
        }, this );

        this.AdGetBtn.node.on( Button.EventType.CLICK, () =>
        {
            this.AdGetBtn.interactable = false;
            this.FreeGetBtn.interactable = false;
            this.AdGetBtn.node.active = false;
            let coin = Utils.random( 40, 100 );
            this.CoinNum.node.active = true;
            GameData.Coin += coin;
            this.CoinNum.string = coin.toString();
            AudioMgr.Instance.点击广告按钮.Play();
            this.ani.playOnLoad = true;
            this.ani.play();
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
            let coin = Utils.random( 40, 100 );
            this.CoinNum.node.active = true;
            GameData.Coin += coin;
            this.CoinNum.string = coin.toString();
            AudioMgr.Instance.点击广告按钮.Play();
            this.ani.playOnLoad = true;
            this.ani.play();
        }
    }
}