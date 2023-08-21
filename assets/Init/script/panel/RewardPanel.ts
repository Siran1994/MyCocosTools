import { _decorator, Button, Component, Label } from 'cc';
import { AudioMgr } from '../manager/AudioMgr';
import CoinFly from '../animation/CoinFly';
import DOTweenAnimation from '../animation/DOTweenAnimation';
import { GameData } from '../data/GameData';
import { GameManager } from '../manager/GameManager';
import { Messager } from '../manager/Messager';
import { PoolManager } from '../manager/PoolManager';
import { Utils } from '../tool/Utils';

const { ccclass, property } = _decorator;

@ccclass( 'RewardPanel' )
export class RewardPanel extends Component
{
    @property( Button )
    AdGetAllBtn: Button = null;

    @property( Button )
    CancelBtn: Button = null;

    @property( Button )
    NextLvBtn: Button = null;

    @property( Label )
    TipTxt: Label = null;

    @property( Label )
    CoinTxt: Label;//金币信息  

    @property( CoinFly )
    coinfly: CoinFly = null;

    totalCount = 3;
    tmpCoin = 0;

    start ()
    {
        this.totalCount = 3;
        this.TipTxt.string = '免费开启次数:' + this.totalCount;
        this.CoinTxt.string = GameData.Coin.toString();
        this.tmpCoin = GameData.Coin;

        this.AdGetAllBtn.node.on( Button.EventType.CLICK, () =>
        {
            this.AdGetAllBtn.interactable = false;
            AudioMgr.Instance.点击广告按钮.Play();
            Messager.Broadcast( 'OpenAllBox' );
            this.TipTxt.string = '免费开启次数:' + 0;

            this.AdGetAllBtn.node.active = false;
            this.CancelBtn.node.active = false;
            this.NextLvBtn.node.active = true;
        }, this );

        this.CancelBtn.node.on( Button.EventType.CLICK, () =>
        {
            this.CancelBtn.interactable = false;
            AudioMgr.Instance.通用按钮.Play();
            this.GetAllCoin();
        }, this );

        this.NextLvBtn.node.on( Button.EventType.CLICK, () =>
        {
            this.NextLvBtn.interactable = false;
            AudioMgr.Instance.通用按钮.Play();
            this.GetAllCoin();
        }, this );
    }

    onEnable ()
    {
        this.AdGetAllBtn.node.active = true;
        this.AdGetAllBtn.interactable = true;

        this.CancelBtn.node.active = true;
        this.CancelBtn.interactable = true;

        this.NextLvBtn.node.active = false;
        this.NextLvBtn.interactable = true;

        Messager.AddListener( 'addCount', this, this.addCount );
    }

    onDisable ()
    {
        Messager.RemoveListener( 'addCount', this, this.addCount );
    }

    addCount ()
    {
        this.totalCount -= 1;
        if ( this.totalCount < 0 )
            this.totalCount = 0;
        this.TipTxt.string = '免费开启次数:' + this.totalCount;
        if ( this.totalCount == 0 )
            Messager.Broadcast( 'NoCount' );
    }

    GetAllCoin ()
    {
        this.coinfly.playAnim( () =>
        {
            var targetNum = GameData.Coin;
            var ani = DOTweenAnimation.stepNum( this.CoinTxt, this.tmpCoin, 10, targetNum, 0, '', () =>
            {
                ani.stop();
                this.tmpCoin = targetNum;
                this.CoinTxt.string = GameData.Coin.toString();
            } );
        } );

        Utils.DelayCallBack( 2, () =>
        {
            PoolManager.putNode( this.node );
            GameManager.Instance.NextLevel( true, true );
        } );
        Utils.DelayCallBack( 1, () =>
        {
            AudioMgr.Instance.奖励解锁进度.Play();
        } );
    }
}