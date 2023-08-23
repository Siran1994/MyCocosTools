import { _decorator, Button, Component, Label, Node, tween, Vec3 } from 'cc';
import { AudioMgr } from '../manager/AudioMgr';
import { Utils } from '../tool/Utils';
import { UiManager } from '../manager/UiManager';
import { TipManager } from '../manager/TipManager';
import { GameData } from '../data/GameData';
import { PlayerPrefs } from '../data/PlayerPrefs';
import { Config } from '../data/Config';
const { ccclass, property } = _decorator;

@ccclass( 'DrawPanel' )
export class DrawPanel extends Component
{

    @property( { type: Node } )
    Pointer: Node = null;

    @property( Button )
    closeBtn: Button;//关闭按钮

    @property( Button )
    FreeGetBtn: Button;

    @property( Button )
    AdGetBtn: Button;

    @property( Label )
    TipTxt: Label = null;


    init ()
    {
        this.TipTxt.string = '剩余免费次数:' + PlayerPrefs.GetInt( 'freeCount', Config.FreeDrawCount );
        if ( PlayerPrefs.GetInt( 'freeCount', Config.FreeDrawCount ) > 0 )
        {
            this.FreeGetBtn.node.active = true;
            this.AdGetBtn.node.active = false;
        }
        else
        {
            this.TipTxt.node.active = false;
            this.FreeGetBtn.node.active = false;
            this.AdGetBtn.node.active = true;
        }
    }

    start ()
    {
        this.init();
        this.closeBtn.node.on( Button.EventType.CLICK, () =>
        {
            AudioMgr.Instance.通用按钮.Play();
            UiManager.showPage( Config.PanelName.MainPanel );
            UiManager.hidePage( Config.PanelName.DrawPanel );
        }, this );

        this.FreeGetBtn.node.on( Button.EventType.CLICK, () =>
        {
            AudioMgr.Instance.通用按钮.Play();
            this.updateCount();
        }, this );

        this.AdGetBtn.node.on( Button.EventType.CLICK, () =>
        {
            AudioMgr.Instance.点击广告按钮.Play();
            this.updateCount( true );
        }, this );
    }

    updateCount ( isAd = false )
    {
        if ( isAd )
        {
            this.draw();
        }
        else
        {
            let count = PlayerPrefs.GetInt( 'freeCount', Config.FreeDrawCount );
            count -= 1;
            PlayerPrefs.SetInt( 'freeCount', count );
            if ( count <= 0 )
            {
                count == 0;
                this.FreeGetBtn.node.active = false;
                this.AdGetBtn.node.active = true;
            }
            else
            {
                this.FreeGetBtn.node.active = true;
                this.AdGetBtn.node.active = false;
            }
            this.TipTxt.string = '剩余免费次数:' + PlayerPrefs.GetInt( 'freeCount', Config.FreeDrawCount );
            this.draw();
        }
    }

    draw ()
    {
        this.Pointer.eulerAngles = Vec3.ZERO;
        let index = this.getAngle();
        tween( this.Pointer )
            .sequence
            (
                tween().to( 3,
                    {
                        eulerAngles: new Vec3( 0, 0, index * 45 - 7 * 360 )    // 旋转缓动
                    },
                    { easing: "circOut" } ),

                tween().call( () =>
                {
                    this.getReward( index );
                } ),
            )
            .start();
    }

    getAngle ()
    {
        let rang = Utils.random( 1, 100 );
        let angle = 0;
        if ( rang >= 1 && rang <= 30 ) //30% 100
        {
            angle = 0;
        }
        else if ( rang >= 31 && rang <= 55 )//25% 200
        {
            angle = 1;
        }
        else if ( rang >= 56 && rang <= 75 )//20% 300
        {
            angle = 2;
        }
        else if ( rang >= 76 && rang <= 80 )//15% 500
        {
            angle = 3;
        }
        else if ( rang >= 81 && rang <= 90 )//10% 1000
        {
            angle = 4;
        }
        else if ( rang >= 91 && rang <= 95 )//5% 3000
        {
            angle = 5;
        }
        else if ( rang >= 96 && rang <= 98 )//3% 5000
        {
            angle = 6;
        }
        else //2% 绿巨人
        {
            angle = 7;
        }
        return angle;
    }

    getReward ( index: number )
    {
        let coin = 0;
        switch ( index )
        {
            case 0:
                coin = 100;
                GameData.Coin += coin;
                AudioMgr.Instance.点击广告按钮.Play();
                TipManager.Instance.showTips( '恭喜您获得' + coin + '钻石!' );
                break;
            case 1:
                coin = 200;
                GameData.Coin += coin;
                AudioMgr.Instance.点击广告按钮.Play();
                TipManager.Instance.showTips( '恭喜您获得' + coin + '钻石!' );
                break;
            case 2:
                coin = 300;
                GameData.Coin += coin;
                AudioMgr.Instance.点击广告按钮.Play();
                TipManager.Instance.showTips( '恭喜您获得' + coin + '钻石!' );
                break;
            case 3:
                coin = 500;
                GameData.Coin += coin;
                AudioMgr.Instance.点击广告按钮.Play();
                TipManager.Instance.showTips( '恭喜您获得' + coin + '钻石!' );
                break;
            case 4:
                coin = 1000;
                GameData.Coin += coin;
                AudioMgr.Instance.点击广告按钮.Play();
                TipManager.Instance.showTips( '恭喜您获得' + coin + '钻石!' );
                break;
            case 5:
                coin = 3000;
                GameData.Coin += coin;
                AudioMgr.Instance.点击广告按钮.Play();
                TipManager.Instance.showTips( '恭喜您获得' + coin + '钻石!' );
                break;
            case 6:
                coin = 5000;
                GameData.Coin += coin;
                AudioMgr.Instance.点击广告按钮.Play();
                TipManager.Instance.showTips( '恭喜您获得' + coin + '钻石!' );
                break;
            case 7:
                PlayerPrefs.SetBool( "超级巨人" + 'UnLocked', true );
                TipManager.Instance.showTips( '恭喜您获得超级巨人!' );
                break;
        }
    }
}