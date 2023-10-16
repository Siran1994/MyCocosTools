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
            Messager.Broadcast( 'SignItem', PlayerPrefs.GetInt( 'signDay', 1 ) );
            PlayerPrefs.SetInt( 'signDay', PlayerPrefs.GetInt( 'signDay', 1 ) + 1 );
            PlayerPrefs.SetInt( 'signDate', DateUtils.getDate().day );
            if ( PlayerPrefs.GetInt( 'signDay', 1 ) > 7 )
                PlayerPrefs.SetInt( 'signDay', 1 );
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
        let str = '';
        if ( sys.platform == sys.Platform.VIVO_MINI_GAME )
            str = this.signItems[ PlayerPrefs.GetInt( 'signDay', 1 ) - 1 ].rewardtxt.string;
        else
            str = this.signItems[ PlayerPrefs.GetInt( 'signDay', 1 ) - 2 ].rewardtxt.string;
        let coin = 0;
        switch ( str )
        {
            case '200':
                coin = 200;
                if ( isGet2x )
                    coin *= 2;
                break;
            case '美女电视人':
                PlayerPrefs.SetBool( "美女电视人" + 'UnLocked', true );
                TipManager.Instance.showTips( '恭喜您获得美女电视人!' );
                break;
            case '500':
                coin = 500;
                if ( isGet2x )
                    coin *= 2;
                break;
            case '1000':
                coin = 1000;
                if ( isGet2x )
                    coin *= 2;
                break;
            case '1500':
                coin = 1500;
                if ( isGet2x )
                    coin *= 2;
                break;
            case '2000':
                coin = 2000;
                if ( isGet2x )
                    coin *= 2;
                break;
            case '黄电视人':
                PlayerPrefs.SetBool( "黄电视人" + 'UnLocked', true );
                TipManager.Instance.showTips( '恭喜您获得黄电视人!' );
                break;
        }
        if ( str != '美女电视人' && str != '黄电视人' )
            UiManager.Instance.UpdateCoin( coin, this.CoinTxt );
    }
}

