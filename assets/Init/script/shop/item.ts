import { _decorator, Component, Sprite, Toggle, Node } from 'cc';
import { ItemInfo } from './ItemInfo';
import { ItemPoolType, ItemType } from 'db://assets/Init/script/data/Enum';
import { GameData } from 'db://assets/Init/script/data/GameData';
import { PlayerPrefs } from 'db://assets/Init/script/data/PlayerPrefs';
import { AudioMgr } from 'db://assets/Init/script/manager/AudioMgr';
import { UiManager } from 'db://assets/Init/script/manager/UiManager';
import { Messager } from 'db://assets/Init/script/manager/Messager';

const { ccclass, property } = _decorator;

@ccclass( 'item' )
export class item extends Component 
{
    @property( { type: Toggle } )
    itemBtn: Toggle = null;

    @property( { type: Sprite } )//当前Icon
    itemIcon: Sprite = null;

    @property( { type: Node } )//当前Icon
    Locked: Node = null;

    itemInfo: ItemInfo = null;

    itemPooltype: ItemPoolType;


    initItem ( itemInfo: ItemInfo, index: number, pooltype: ItemPoolType )
    {
        if ( !itemInfo.isNull )//非空
        {
            this.node.active = true;
            this.itemInfo = itemInfo;
            this.itemInfo.index = index;
            this.node.name = ItemType[ itemInfo.itemtype ].toString();
            this.itemIcon.spriteFrame = itemInfo.itemIcon;
            this.itemPooltype = pooltype;
            this.CheckState();

        }
        else//空节点
            this.node.active = false;
    }

    start ()
    {
        this.itemBtn.node.on( Toggle.EventType.TOGGLE, ( event: Toggle ) =>//点击
        {
            AudioMgr.Instance.通用按钮.Play();
            if ( event.isChecked ) 
            {
                this.BtnClick();
            }
        }, this );
    }

    onEnable ()
    {
        Messager.AddListener( 'UpdateState', this, this.UpdateState );
    }

    onDisable ()
    {
        Messager.RemoveListener( 'UpdateState', this, this.UpdateState );
    }

    UpdateState ( index: number )
    {
        if ( this.itemInfo.index == index )
        {
            this.BtnClick();
        }
    }

    BtnClick ()
    {
        UiManager.Instance.shopPanel.tmpInfo = this.itemInfo;
        this.CheckState();
        UiManager.Instance.shopPanel.ShowModel( this.node.name );//展示模型            
    }

    CheckState ()
    {
        if ( PlayerPrefs.GetBool( this.node.name, this.itemInfo.isUnlocked ) )//解锁
        {
            UiManager.Instance.shopPanel.BtnState( '解锁' );
            if ( this.itemBtn.isChecked )
            {
                UiManager.Instance.shopPanel.BtnState( '装备' );

                console.log( this.itemInfo.index );
                switch ( this.itemPooltype )
                {
                    case ItemPoolType.武器:
                        if ( this.itemInfo.index == GameData.KnifeType )
                            UiManager.Instance.shopPanel.BtnState( '已装备' );
                        break;
                    case ItemPoolType.手套:
                        if ( this.itemInfo.index == GameData.HandType )
                            UiManager.Instance.shopPanel.BtnState( '已装备' );
                        break;
                }
            }
            this.Locked.active = false;
        }
        else
        {
            UiManager.Instance.shopPanel.BtnState( '未解锁' );
            UiManager.Instance.shopPanel.Price.string = this.itemInfo.price.toString();
            UiManager.Instance.shopPanel.AdCount.string = '获得:(' + PlayerPrefs.GetInt( this.node.name + 'AdCount', 0 ) + '/' + this.itemInfo.count + ')';
            this.Locked.active = true;
        }
    }
}