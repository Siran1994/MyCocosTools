import { _decorator, Component, Sprite, Label } from "cc";
import CoinFly from "../animation/CoinFly";
import DOTweenAnimation from "../animation/DOTweenAnimation";
import { GameData } from "../data/GameData";
import { UiManager } from "../manager/UiManager";
import { Config } from "../data/Config";
import { TipManager } from "../manager/TipManager";
import { AudioMgr } from "../manager/AudioMgr";
import { Messager } from "../manager/Messager";
import { MainPanel } from "../panel/MainPanel";
import { find } from "cc";
const { ccclass, property } = _decorator;

@ccclass( "online" )
export class online extends Component
{
    @property( Sprite )
    spTimeProgress: Sprite = null;     //累积时间进度

    @property( Sprite )
    perTimeProgress: Sprite = null;    //每次的时间进度，使用sprite的FillRange来修改

    @property( Label )
    lbGold: Label = null;

    @property( CoinFly )
    coinfly: CoinFly = null;

    private currentCount = 0;
    private _timer = 0;

    onLoad ()
    {
        this._timer = 0;
        this.spTimeProgress.fillStart = 0;
        this.perTimeProgress.fillRange = 0;
    }

    onBtnOnlineClick ()
    {
        if ( this.currentCount <= 0 )
        {
            AudioMgr.Instance.通用按钮.Play();
            TipManager.Instance.showTips( '在线时间不足,请稍后!' );
            return;
        }
        else
        {
            AudioMgr.Instance.点击广告按钮.Play();
            TipManager.Instance.showTips( '恭喜您获得' + this.currentCount + '钻石!' );
            this.coinfly.playAnim( () =>
            {
                var tmpNum = GameData.Coin;
                var targetNum = tmpNum + this.currentCount;

                let targetTxt = find( 'Canvas/MainPanel' ).getComponent( MainPanel ).CoinTxt;
                var ani = DOTweenAnimation.stepNum( targetTxt, tmpNum, 10, targetNum, 0, '', () =>
                {
                    ani.stop();
                    GameData.Coin = targetNum;
                    targetTxt.string = GameData.Coin.toString();
                    this.clear();
                } );
            } );
        }
    }

    update ( dt: number )
    {
        if ( this.currentCount > Config.OnLine.Total )
        {
            this.currentCount = Config.OnLine.Total;
            return;
        }
        let ratio = this._timer / Config.OnLine.Time;
        this.spTimeProgress.fillStart = ratio;
        this.perTimeProgress.fillRange = ratio;

        this.lbGold.string = this.currentCount.toString();
        this._timer += dt;
        if ( this._timer >= Config.OnLine.Time )
        {
            this._timer = 0;
            this.currentCount += Config.OnLine.Per;
        }
    }

    clear ()
    {
        this._timer = 0;
        this.spTimeProgress.fillStart = 0;
        this.perTimeProgress.fillRange = 0;
        this.currentCount = 0;
    }
}