import { _decorator, Button, sys } from 'cc';
import { AudioMgr } from '../manager/AudioMgr';
import { UiManager } from '../manager/UiManager';
import { SignItem } from '../item/SignItem';
import DateUtils from '../tool/DateUtils';
import { GameData } from '../data/GameData';
import { TipManager } from '../manager/TipManager';
import { PlayerPrefs } from '../data/PlayerPrefs';
import { Messager } from '../manager/Messager';
import { BasePanel } from './BasePanel';
import DOTweenAnimation from '../animation/DOTweenAnimation';
import { Label } from 'cc';
import { Config } from '../data/Config';
import { Vec3 } from 'cc';
import { Utils } from '../tool/Utils';
const { ccclass, property } = _decorator;

@ccclass( 'SignPanel' )
export class SignPanel extends BasePanel
{
    @property( Button )
    closeBtn: Button;//关闭按钮

    @property( Button )
    SignBtn: Button;

    @property( Button )
    Get2XBtn: Button;

    @property( Label )
    CoinTxt: Label;//金币信息
    @property( Button )
    AddCoinBtn: Button;//关闭

    @property( SignItem )
    signItems: SignItem[] = [];

    start ()
    {
        this.closeBtn.node.on( Button.EventType.CLICK, () =>
        {
            AudioMgr.Instance.通用按钮.Play();
            UiManager.Instance.mainPanel.node.active = true;
            this.HidePanel();
        }, this );

        this.SignBtn.node.on( Button.EventType.CLICK, () =>
        {
            AudioMgr.Instance.通用按钮.Play();
            this.DoSign( false );
        }, this );

        this.Get2XBtn.node.on( Button.EventType.CLICK, () =>
        {
            AudioMgr.Instance.点击广告按钮.Play();
            this.DoSign( true );
        }, this );

        this.AddCoinBtn.node.on( Button.EventType.CLICK, () =>
        {
            UiManager.Instance.AdGetCoin( this.CoinTxt );
        }, this );

        DOTweenAnimation.ScaleLoop( this.Get2XBtn.node, 1.1, 1, 0.5, 0.5 );
    }

    onEnable ()
    {
        this.CoinTxt.string = GameData.Coin.toString();
    }

    DoSign ( isGet2x = false )
    {
        if ( this.isCanSign() )
        {

            GameData.SignDay += 1;
            if ( GameData.SignDay > 7 )
                GameData.SignDay = 1;

            Messager.Broadcast( 'SignItem', GameData.SignDay );
            PlayerPrefs.SetInt( 'signDate', DateUtils.getDate().day );
            this.GetReward( isGet2x );
        }
        else
            TipManager.Instance.showTips( '今天已签到,请明天继续签到!' );

    }

    isCanSign ()
    {
        if ( PlayerPrefs.GetInt( 'signDate', 0 ) != DateUtils.getDate().day )
            return true;
        else
            return false;
    }

    GetReward ( isGet2x = false )
    {

        let coin = 0;
        switch ( GameData.SignDay )
        {
            case 1:
                coin = 200;
                if ( isGet2x )
                    coin *= 2;
                break;
            case 2:
                PlayerPrefs.SetBool( "美女电视人", true );
                TipManager.Instance.showTips( '恭喜您获得美女电视人!' );
                break;
            case 3:
                coin = 500;
                if ( isGet2x )
                    coin *= 2;
                break;
            case 4:
                coin = 1000;
                if ( isGet2x )
                    coin *= 2;
                break;
            case 5:
                coin = 1500;
                if ( isGet2x )
                    coin *= 2;
                break;
            case 6:
                coin = 2000;
                if ( isGet2x )
                    coin *= 2;
                break;
            case 7:
                PlayerPrefs.SetBool( "黄电视人", true );
                TipManager.Instance.showTips( '恭喜您获得黄电视人!' );
                break;
        }
        if ( GameData.SignDay != 2 && GameData.SignDay != 7 )
            UiManager.Instance.UpdateCoin( coin, this.CoinTxt, Vec3.ZERO, this.CoinTxt.node.worldPosition );
        Utils.DelayCallBack( 1.5, () =>
        {
            UiManager.Instance.mainPanel.node.active = true;
            this.HidePanel();
        } )
    }
}

