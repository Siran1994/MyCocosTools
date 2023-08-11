import { _decorator, Button, Component } from 'cc';
import { GameData } from '../data/GameData';
import { PlayerPrefs } from '../data/PlayerPrefs';
import { AudioMgr } from '../manager/AudioMgr';
import { Messager } from '../manager/Messager';
import { PoolManager } from '../manager/PoolManager';
import { TipManager } from '../manager/TipManager';
import { UiManager } from '../manager/UiManager';
import DateUtils from '../tool/DateUtils';
import { SignItem } from './SignItem';
const { ccclass, property } = _decorator;

@ccclass( 'SignPanel' )
export class SignPanel extends Component
{

    @property( Button )
    closeBtn: Button;//关闭按钮

    @property( Button )
    SignBtn: Button;

    @property( Button )
    Get2XBtn: Button;

    @property( SignItem )
    signItems: SignItem[] = [];

    start ()
    {
        this.closeBtn.node.on( Button.EventType.CLICK, () =>
        {
            AudioMgr.Instance.通用按钮.Play();
            UiManager.Instance.mainPanel.node.active = true;
            PoolManager.putNode( this.node );
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

        PlayerPrefs.SetInt( 'signDate', DateUtils.getDate().day + 1 );
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
        var str = this.signItems[ PlayerPrefs.GetInt( 'signDay', 1 ) - 2 ].rewardtxt.string;
        let coin = 0;
        switch ( str )
        {
            case '200':
                coin = 200;
                if ( isGet2x )
                    coin *= 2;
                GameData.Coin += coin;
                TipManager.Instance.showTips( '恭喜获得' + coin + '钻石!' );
                break;
            case '城市飞侠':
                PlayerPrefs.SetBool( "城市飞侠" + 'UnLocked', true );
                TipManager.Instance.showTips( '恭喜您获得城市飞侠!' );
                break;
            case '500':
                coin = 500;
                if ( isGet2x )
                    coin *= 2;
                GameData.Coin += coin;
                TipManager.Instance.showTips( '恭喜您获得' + coin + '钻石!' );
                break;
            case '1000':
                coin = 1000;
                if ( isGet2x )
                    coin *= 2;
                GameData.Coin += coin;
                TipManager.Instance.showTips( '恭喜您获得' + coin + '钻石!' );
                break;
            case '1500':
                coin = 1500;
                if ( isGet2x )
                    coin *= 2;
                GameData.Coin += coin;
                TipManager.Instance.showTips( '恭喜您获得' + coin + '钻石!' );
                break;
            case '2000':
                coin = 2000;
                if ( isGet2x )
                    coin *= 2;
                GameData.Coin += coin;
                TipManager.Instance.showTips( '恭喜您获得' + coin + '钻石!' );
                break;
            case '黑液人':
                PlayerPrefs.SetBool( "黑液人" + 'UnLocked', true );
                TipManager.Instance.showTips( '恭喜您获得黑液人!' );
                break;
        }
    }
}

