import { _decorator, Button, Label, Node, Sprite } from 'cc';
import { BasePanel } from './BasePanel';
import { AudioMgr } from '../manager/AudioMgr';
import { GameManager } from '../manager/GameManager';
import { ItemType } from '../data/Enum';
import { Utils } from '../tool/Utils';
import { SpriteManager } from '../manager/SpriteManager';
import { Messager } from '../manager/Messager';
import { UiManager } from '../manager/UiManager';
import { PlayerCtrl } from '../role/PlayerCtrl';
const { ccclass, property } = _decorator;
@ccclass( "TryData" )
export class TryData 
{
    @property( { displayName: '关卡Id', type: Number } )
    index: number = 1;

    @property( { displayName: '物品类型', type: ItemType } )
    itemtype: ItemType.None;
}

@ccclass( 'TryPanel' )
export class TryPanel extends BasePanel
{
    @property( Button )
    AdTryBtn: Button = null;

    @property( Button )
    CancelBtn: Button = null;

    @property( Label )
    ItemName: Label = null;

    @property( Sprite )
    ItemIcon: Sprite = null;

    // @property( TryData )
    // tryDatas: TryData[];

    targetId = 0;

    start ()
    {
        this.AdTryBtn.node.on( Button.EventType.CLICK, () =>
        {
            AudioMgr.Instance.Play( '通用按钮' );
            GameManager.showAd( () =>
            {
                Messager.Broadcast( 'ChangeHand', this.targetId );
                UiManager.Instance.mainPanel.StartGame();
                this.HidePanel();
            } );

        }, this );

        this.CancelBtn.node.on( Button.EventType.CLICK, () =>
        {
            AudioMgr.Instance.Play( '通用按钮' );
            UiManager.Instance.mainPanel.StartGame();
            this.HidePanel();
        }, this );
    }

    ShowTryItem ()
    {
        this.targetId = Utils.getRandomNumber( 0, 8, PlayerCtrl.Instance.playerId );
        this.ItemName.string = GameManager.Instance.GetBallType( this.targetId );
        this.ItemIcon.spriteFrame = SpriteManager.get( GameManager.Instance.GetBallType( this.targetId ), SpriteManager.showMap );
        this.ShowPanel();
    }
}