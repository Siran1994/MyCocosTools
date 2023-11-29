import { _decorator, Label, Button, Toggle, Sprite, tween, Vec3, Node } from "cc";
import { ItemInfo } from "../shop/ItemInfo";
import { ItemList } from "../shop/ItemList";
import { AudioMgr } from "../manager/AudioMgr";
import { SpriteManager } from "../manager/SpriteManager";
import { TipManager } from "../manager/TipManager";
import { UiManager } from "../manager/UiManager";
import DOTweenAnimation from "../animation/DOTweenAnimation";
import { Config } from "../data/Config";
import { ItemPoolType, ItemType } from "../data/Enum";
import { GameData } from "../data/GameData";
import { PlayerPrefs } from "../data/PlayerPrefs";
import { Messager } from "../manager/Messager";
import { BasePanel } from "./BasePanel";

const { ccclass, property } = _decorator;

@ccclass( 'ShopPanel' )
export class ShopPanel extends BasePanel 
{
    @property( Label )
    CoinTxt: Label;//金币信息

    @property( Button )
    CloseBtn: Button;//关闭

    @property( Button )
    AddCoinBtn: Button;//关闭

    @property( Toggle )
    KnifeBtn: Toggle;//刀
    @property( { type: ItemList } )
    KnifePool: ItemList;

    @property( Toggle )
    HandBtn: Toggle;//手套
    @property( { type: ItemList } )
    HandPool: ItemList;

    @property( Button )
    AdGetBtn: Button;//广告获取
    @property( Label )
    AdCount: Label;//广告次数

    @property( Button )
    BuyBtn: Button;//金币购买
    @property( Label )
    Price: Label;//金币价格

    @property( Button )
    EquipBtn: Button;//关闭
    @property( Node )
    EquipedBtn: Node;//关闭  

    @property( Node )
    PlayerRoot: Node = null;//关闭
    @property( Sprite )
    Tower: Sprite = null;

    tmpInfo: ItemInfo = null;
    tmppooltype: ItemPoolType;

    init ()
    {
        this.CoinTxt.string = GameData.Coin.toString();
        this.KnifePool.initItem();
        this.tmppooltype = ItemPoolType.武器;
        tween( this.PlayerRoot )
            .by( 1, { eulerAngles: new Vec3( 0, -30, 0 ) } )
            .repeatForever()
            .start();
    }

    start () 
    {
        this.CloseBtn.node.on( Button.EventType.CLICK, () =>
        {
            AudioMgr.Instance.通用按钮.Play();
            UiManager.Instance.mainPanel.node.active = true;
            this.HidePanel();
        }, this );

        this.AddCoinBtn.node.on( Button.EventType.CLICK, () =>
        {
            AudioMgr.Instance.点击广告按钮.Play();
            var tmpNum = GameData.Coin;
            var targetNum = tmpNum + Config.BoxReward.AdGet;
            var ani = DOTweenAnimation.stepNum( this.CoinTxt, tmpNum, 10, targetNum, 0.001, '', () =>
            {
                ani.stop();
                GameData.Coin = targetNum;
                this.CoinTxt.string = GameData.Coin.toString();
            } );
        }, this );

        this.KnifeBtn.node.on( Toggle.EventType.TOGGLE, ( event: Toggle ) =>//皮肤
        {
            if ( event.isChecked ) 
            {
                this.KnifePool.initItem();
                this.tmppooltype = ItemPoolType.武器;
                AudioMgr.Instance.通用按钮.Play();
            }
        }, this );

        this.HandBtn.node.on( Toggle.EventType.TOGGLE, ( event: Toggle ) =>//子弹
        {
            if ( event.isChecked ) 
            {
                this.HandPool.initItem();
                this.tmppooltype = ItemPoolType.手套;
                AudioMgr.Instance.通用按钮.Play();
            }
        }, this );

        this.AdGetBtn.node.on( Button.EventType.CLICK, () => //广告购买
        {
            PlayerPrefs.SetBool( ItemType[ this.tmpInfo.itemtype ].toString(), true );
            this.EquipItem();
        }, this );

        this.BuyBtn.node.on( Button.EventType.CLICK, () =>  //购买
        {
            if ( GameData.Coin >= this.tmpInfo.price )
            {
                AudioMgr.Instance.通用按钮.Play();
                GameData.Coin -= this.tmpInfo.price;
                this.CoinTxt.string = GameData.Coin.toString();
                PlayerPrefs.SetBool( ItemType[ this.tmpInfo.itemtype ].toString(), true );

                this.EquipItem();
            }
            else
            {
                AudioMgr.Instance.通用按钮.Play();
                TipManager.Instance.showTips( '当前金币不足!' );
            }

        }, this );

        this.EquipBtn.node.on( Button.EventType.CLICK, () =>//装备
        {
            this.EquipItem();
        }, this );

        DOTweenAnimation.ScaleLoop( this.AdGetBtn.node, 1.1, 1, 0.5, 0.5 );
    }

    onEnable ()
    {
        this.init();
    }

    EquipItem ()
    {
        this.BtnState( '解锁' );

        switch ( this.tmppooltype )
        {
            case ItemPoolType.武器:
                GameData.KnifeType = this.tmpInfo.itemtype;
                Messager.Broadcast( 'ChangeBody', GameData.KnifeType );
                Messager.Broadcast( 'UpdateState', this.tmpInfo.itemtype );
                break;
            case ItemPoolType.手套:
                GameData.HandType = this.tmpInfo.itemtype;
                Messager.Broadcast( 'ChangeBody', GameData.HandType );
                Messager.Broadcast( 'UpdateState', this.tmpInfo.itemtype );
                break;
        }
        this.HidePanel();
        UiManager.Instance.mainPanel.node.active = true;
        AudioMgr.Instance.通用按钮.Play();
    }

    BtnState ( state: string )
    {
        switch ( state )
        {
            case '未解锁':
                this.AdGetBtn.node.active = true;
                this.BuyBtn.node.active = true;
                this.EquipBtn.node.active = false;
                this.EquipedBtn.active = false;
                break;
            case '解锁':
                this.AdGetBtn.node.active = false;
                this.BuyBtn.node.active = false;
                this.EquipBtn.node.active = true;
                this.EquipedBtn.active = false;
                break;
            case '已装备':
                this.AdGetBtn.node.active = false;
                this.BuyBtn.node.active = false;
                this.EquipBtn.node.active = false;
                this.EquipedBtn.active = true;
                break;
        }
    }

    ShowModel ( name: string )//展示模型
    {
        this.Tower.spriteFrame = SpriteManager.get( name, SpriteManager.showMap );
    }
}