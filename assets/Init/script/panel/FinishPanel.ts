import { _decorator, Button, Label, Sprite, SpriteFrame } from 'cc';
import { BasePanel } from './BasePanel';
import { AudioMgr } from '../manager/AudioMgr';
import { GameManager } from '../manager/GameManager';
import { UiManager } from '../manager/UiManager';
import { GameData } from '../data/GameData';
import { Utils } from '../tool/Utils';
import { PlayerPrefs } from '../data/PlayerPrefs';
import { ItemType } from '../data/Enum';
import DOTweenAnimation from '../animation/DOTweenAnimation';
import { Vec3 } from 'cc';
const { ccclass, property } = _decorator;
@ccclass( "ClipItem" )
export class ClipItem 
{
    @property( { displayName: '碎片ID', type: ItemType } )
    clipType: ItemType = ItemType.None;

    @property( { displayName: '剪影', type: SpriteFrame } )
    cardIcon: SpriteFrame = null;

    @property( { displayName: '实影', type: SpriteFrame } )
    cardFace: SpriteFrame = null;

    @property( { displayName: '碎片数量', type: Number } )
    clipCount: number = 0;
}

@ccclass( 'FinishPanel' )
export class FinishPanel extends BasePanel
{
    @property( Label )
    MyCoinTxt: Label = null;//重新挑战

    @property( Label )
    CoinTxt: Label = null;//重新挑战

    @property( Button )
    AddCoinBtn: Button;//关闭

    @property( Button )
    RestartBtn: Button;//重新挑战

    @property( Button )
    Reward3x: Button;//重新挑战  

    @property( Sprite )
    Bg: Sprite = null;
    @property( Sprite )
    Progress: Sprite = null;
    @property( Label )
    ProgressTxt: Label = null;
    @property( { displayName: '碎片池', type: ClipItem } )
    clipItems: ClipItem[] = [];

    init ()
    {
        this.MyCoinTxt.string = GameData.Coin.toString();
        this.CoinTxt.string = GameManager.Instance.Coin.toString();
        this.ShowProgress();
        this.RestartBtn.interactable = true;
        this.Reward3x.interactable = true;
    }

    start ()
    {
        this.RestartBtn.node.on( Button.EventType.CLICK, () =>
        {
            AudioMgr.Instance.通用按钮.Play();
            this.RestartBtn.interactable = false;
            UiManager.Instance.UpdateCoin( GameManager.Instance.Coin, this.MyCoinTxt, Vec3.ZERO, this.CoinTxt.node.worldPosition );
            Utils.DelayCallBack( 2, () =>
            {
                GameManager.Instance.NextLevel( true, true, () =>
                {
                    GameManager.Instance.init();
                } );
            } );
        }, this );

        this.Reward3x.node.on( Button.EventType.CLICK, () =>
        {
            AudioMgr.Instance.点击广告按钮.Play();
            this.Reward3x.interactable = false;
            UiManager.Instance.UpdateCoin( GameManager.Instance.Coin * 2, this.MyCoinTxt, Vec3.ZERO, this.CoinTxt.node.worldPosition );
            Utils.DelayCallBack( 2, () =>
            {
                GameManager.Instance.NextLevel( true, true, () =>
                {
                    GameManager.Instance.init();
                } );
            } );
        }, this );

        this.AddCoinBtn.node.on( Button.EventType.CLICK, () =>
        {
            UiManager.Instance.AdGetCoin( this.CoinTxt );
        }, this );

        DOTweenAnimation.ScaleLoop( this.Reward3x.node, 1.1, 1 );
    }

    onEnable ()
    {
        this.init();
    }

    GetClipItem ( curLv: number ): ClipItem
    {
        if ( curLv >= 10 )
            curLv = Utils.randomNum( 1, 9 );
        return this.clipItems[ curLv ];
    }

    public ShowProgress ()
    {
        AudioMgr.Instance.奖励解锁进度.Play();
        let info = this.GetClipItem( GameData.Lv - 1 );
        this.Bg.spriteFrame = info.cardIcon;
        let cardName = GameManager.Instance.GetItemName( info.clipType );
        this.Progress.spriteFrame = info.cardFace;

        var addProgress = info.clipCount;//40-50 之间随机    
        var originvalua = PlayerPrefs.GetInt( cardName + 'Count', 0 );//已完成进度
        var targetvalue = originvalua + addProgress;//当局进度
        if ( targetvalue >= 100 )
            targetvalue = 100;
        var ani = DOTweenAnimation.stepNumProgress( this.Progress, originvalua * 0.01, 0.01, targetvalue * 0.01, 0.02, null, () =>
        {
            ani.stop();
        } );
        var ani1 = DOTweenAnimation.stepNum( this.ProgressTxt, originvalua, 1, targetvalue, 0.02, '%', () =>
        {
            ani1.stop();

            if ( targetvalue == 100 )
                PlayerPrefs.SetBool( cardName, true );
            else
                PlayerPrefs.SetInt( cardName + 'Count', PlayerPrefs.GetInt( cardName + 'Count', 0 ) + info.clipCount );
        } );
    }
}